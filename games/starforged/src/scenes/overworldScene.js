import { MOVE_DURATION_MS, DIRECTIONS } from '../engine/constants.js'
import { input } from '../engine/input.js'
import { Dialogue } from '../engine/dialogue.js'
import {
  drawMap,
  computeCamera,
  isWalkable,
  getNpcAt,
  getWarpAt,
  getTriggerAt,
  getEnemySpawnAt,
  getSecretAt,
} from '../engine/tilemap.js'
import { drawSprite } from '../engine/sprite.js'
import { heroSprite } from '../assets/sprites/hero.js'
import { getSprite } from '../assets/sprites/registry.js'
import { getWorld } from '../worlds/registry.js'
import { TILE_SIZE } from '../engine/constants.js'
import { sceneManager } from '../engine/sceneManager.js'
import { BattleScene } from '../battle/battleScene.js'
import { saveGame } from '../engine/save.js'
import { ShipScene } from './shipScene.js'
import { drawHud } from '../ui/hud.js'
import { t } from '../engine/i18n.js'

const BUMP_COOLDOWN_MS = 90

export class OverworldScene {
  constructor() {
    this.dialogue = new Dialogue()
  }

  enter({ state }) {
    this.state = state
    this.moveCooldown = 0
    this._refreshMap()
  }

  resume() {
    // Returning from a battle: nothing to re-sync, state is shared by reference.
    this._refreshMap()
  }

  exit() {}

  _refreshMap() {
    this.world = getWorld(this.state.worldId)
    this.mapDef = this.world.maps[this.state.mapId]
    this._reapplyFoundSecretTileChanges()
  }

  // Map tile grids are plain arrays created once at module load time, so a
  // secret's opensTiles mutation (applied live in _tryRevealSecret) only
  // persists for the rest of this browser session — a page reload
  // re-evaluates the world module from scratch and rebuilds an unmutated
  // grid. The found-flag itself DOES persist (it's part of saved state), so
  // on every map (re)entry we re-derive the tile mutations from any secret
  // that's already flagged as found, keeping a previously-opened passage
  // open across reloads without re-granting its reward or replaying its
  // dialogue (both stay gated behind the found-flag check in
  // _tryRevealSecret).
  _reapplyFoundSecretTileChanges() {
    for (const secret of this.mapDef.secrets || []) {
      if (!secret.opensTiles) continue
      if (!this.state.flags.has(this._secretFoundKey(secret))) continue
      for (const { x, y, tileId } of secret.opensTiles) {
        this.mapDef.tiles[y][x] = tileId
      }
    }
  }

  _triggerKey(x, y) {
    return `_trig_${this.state.worldId}_${this.state.mapId}_${x}_${y}`
  }

  update(dt) {
    const dialogueWasActive = this.dialogue.active
    this.dialogue.update(dt, input)
    // If dialogue was open at the start of this frame, this frame's input
    // (even the very press that just closed it) belongs to the dialogue,
    // not to movement/interact/ship-menu — otherwise the same A/B press
    // that closes a textbox immediately re-triggers _tryInteract() on the
    // NPC still in front of you, reopening the same dialogue forever.
    if (dialogueWasActive) return

    if (this.moveCooldown > 0) {
      this.moveCooldown -= dt
    }

    if (input.wasPressed('a')) {
      this._tryInteract()
    }

    if (input.wasPressed('b')) {
      this._openShip()
      return
    }

    if (this.moveCooldown > 0) return

    const dir = ['up', 'down', 'left', 'right'].find((d) => input.isDown(d))
    if (!dir) return

    this.state.facing = dir
    const { dx, dy } = DIRECTIONS[dir]
    const nx = this.state.x + dx
    const ny = this.state.y + dy

    // Walking into a living NPC's tile starts their dialogue immediately,
    // the same way walking into an enemy starts a fight — no need to also
    // press the "a" action. The NPC's own gating (requiresFlag) is handled
    // inside _talkToNpc, so an invisible/gated NPC just blocks the tile
    // (bump cooldown) without opening anything, same as before.
    const npc = getNpcAt(this.mapDef, nx, ny)
    if (npc) {
      this.moveCooldown = BUMP_COOLDOWN_MS
      this._talkToNpc(npc)
      return
    }

    // Walking straight into a secret's fake-wall tile reveals it
    // immediately, same as walking into an NPC or enemy — no A-press
    // needed. _tryInteract's A-press path is kept as a fallback for a
    // secret the player is already standing adjacent to and facing
    // without having just stepped toward it this frame.
    //
    // Only take this branch while the secret is still unfound: getSecretAt
    // is a plain coordinate lookup that doesn't know about found-state, so
    // once a secret with opensTiles has turned its own tile walkable, this
    // check must stop intercepting movement there — otherwise the player
    // could never actually walk through a passage they already opened,
    // since this branch never advances this.state.x/y itself (it only
    // reveals). Falling through lets the normal isWalkable move happen.
    const secret = getSecretAt(this.mapDef, nx, ny)
    if (secret && !this.state.flags.has(this._secretFoundKey(secret))) {
      this.moveCooldown = BUMP_COOLDOWN_MS
      this._tryRevealSecret(secret)
      return
    }

    if (isWalkable(this.mapDef, nx, ny)) {
      this.state.x = nx
      this.state.y = ny
      this.moveCooldown = MOVE_DURATION_MS
      this._onArrive(nx, ny)
    } else {
      this.moveCooldown = BUMP_COOLDOWN_MS
    }
  }

  _enemyDefeatedKey(enemySpawn) {
    return `_enemy_defeated_${this.state.worldId}_${this.state.mapId}_${enemySpawn.id}`
  }

  // Enemies are visible on the map (no random encounter rolls) and attack
  // eagerly: as soon as the player's move leaves them adjacent (one tile
  // away, 4-directionally) to a living enemy spawn, the fight starts right
  // away instead of waiting for the player to step onto the enemy's exact
  // tile. This subsumes the old "step onto the enemy's tile" contact check:
  // under 4-directional grid movement you always pass through the adjacent
  // tile first, and the battle (which blocks further input) fires there —
  // so the player never actually reaches the enemy's own tile while it's
  // still alive.
  //
  // Deliberately NOT called from enter()/resume(): after a lost battle the
  // enemy is healed-but-not-flagged-defeated and the player's (x,y) hasn't
  // moved, so checking adjacency there would instantly re-engage the same
  // fight the moment control returns to the overworld. Only a move that
  // actually changes the player's position may trigger this.
  _adjacentLiveEnemySpawn(x, y) {
    for (const { dx, dy } of Object.values(DIRECTIONS)) {
      const enemySpawn = getEnemySpawnAt(this.mapDef, x + dx, y + dy)
      if (enemySpawn && !this.state.flags.has(this._enemyDefeatedKey(enemySpawn))) {
        return enemySpawn
      }
    }
    return null
  }

  _engageEnemySpawn(enemySpawn) {
    const key = this._enemyDefeatedKey(enemySpawn)
    this.startBattle([enemySpawn.enemyId], {
      onVictory: (state) => {
        state.flags.add(key)
      },
    })
  }

  _talkToNpc(npc) {
    if (npc.requiresFlag && !this.state.flags.has(npc.requiresFlag)) return
    const lines = typeof npc.dialogue === 'function' ? npc.dialogue(this.state) : npc.dialogue
    this.dialogue.start(lines)
    // Compute the "seen" signature AFTER calling dialogue(), since some
    // NPCs' dialogue functions advance quest state as a side effect of
    // being read — the signature should reflect what the player just
    // learned, not what was true a moment before.
    this._markNpcSeen(npc)
  }

  _tryInteract() {
    const { dx, dy } = DIRECTIONS[this.state.facing]
    const fx = this.state.x + dx
    const fy = this.state.y + dy

    // Kept as an explicit A-press path even though approach now auto-talks:
    // it lets the player reopen dialogue with an NPC they're already
    // standing next to without stepping back and re-approaching.
    const npc = getNpcAt(this.mapDef, fx, fy)
    if (npc) {
      this._talkToNpc(npc)
      return
    }

    // Kept as a fallback alongside update()'s bump-to-reveal: it lets the
    // player reveal a secret they're already standing adjacent to and
    // facing, without needing to step back and walk into it again.
    const secret = getSecretAt(this.mapDef, fx, fy)
    if (secret) this._tryRevealSecret(secret)
  }

  // --- NPC "new content" marker -------------------------------------------
  // A lightweight "!" over an NPC's head: shown the first time the player
  // meets them, cleared after talking, and shown again only if that NPC
  // actually has something new to say (one of the quests it declares via
  // `watchesQuests` has changed stage/completion since the last time the
  // player talked to them) — not on every unrelated state change.

  _npcTalkedKey(npc) {
    return `_npc_talked_${this.state.worldId}_${this.state.mapId}_${npc.id}`
  }

  _npcSignatureKey(npc) {
    return `${this.state.worldId}_${npc.id}`
  }

  _npcContentSignature(npc) {
    if (!npc.watchesQuests && !npc.watchesFlags) return 'static'
    const questPart = (npc.watchesQuests || [])
      .map((qid) => {
        const q = this.state.quests[qid]
        return q ? `${q.stage}:${q.complete}` : 'none'
      })
      .join('|')
    const flagPart = (npc.watchesFlags || []).map((f) => this.state.flags.has(f)).join('|')
    return `${questPart}#${flagPart}`
  }

  _npcHasNewContent(npc) {
    if (!this.state.flags.has(this._npcTalkedKey(npc))) return true
    const sig = this._npcContentSignature(npc)
    return this.state.npcSeenSignatures[this._npcSignatureKey(npc)] !== sig
  }

  _markNpcSeen(npc) {
    this.state.flags.add(this._npcTalkedKey(npc))
    this.state.npcSeenSignatures[this._npcSignatureKey(npc)] = this._npcContentSignature(npc)
  }

  // --- Secret walls / hidden stashes --------------------------------------

  _secretFoundKey(secret) {
    return `_secret_found_${this.state.worldId}_${this.state.mapId}_${secret.id}`
  }

  _tryRevealSecret(secret) {
    const key = this._secretFoundKey(secret)
    if (this.state.flags.has(key)) return
    this.state.flags.add(key)
    if (secret.reward) {
      for (const [item, amount] of Object.entries(secret.reward)) {
        this.state.inventory[item] = (this.state.inventory[item] || 0) + amount
      }
    }
    if (secret.opensTiles) {
      for (const { x, y, tileId } of secret.opensTiles) {
        this.mapDef.tiles[y][x] = tileId
      }
    }
    this.dialogue.start(secret.dialogue && secret.dialogue.length ? secret.dialogue : ['You found a hidden stash!'])
    saveGame(this.state)
  }

  _onArrive(x, y) {
    // Eager aggro: a move that just left the player adjacent to a living
    // enemy starts the fight immediately, before any warp/trigger on this
    // tile resolves.
    const enemySpawn = this._adjacentLiveEnemySpawn(x, y)
    if (enemySpawn) {
      this._engageEnemySpawn(enemySpawn)
      return
    }

    const warp = getWarpAt(this.mapDef, x, y)
    if (warp) {
      this._applyWarp(warp)
      return
    }

    const trigger = getTriggerAt(this.mapDef, x, y)
    if (trigger) {
      const key = this._triggerKey(x, y)
      const gated = trigger.requiresFlag && !this.state.flags.has(trigger.requiresFlag)
      const spent = trigger.once && this.state.flags.has(key)
      if (!gated && !spent) {
        trigger.onEnter({
          state: this.state,
          startBattle: (enemyIds, callbacks) => this.startBattle(enemyIds, callbacks),
          showDialogue: (lines, cb) => this.dialogue.start(lines, cb),
          warpTo: (w) => this._applyWarp(w),
          // So a boss's victory dialogue can smoothly hand the player
          // straight back to the ship instead of leaving them to remember
          // to press B themselves. Pass the id unlockNextWorld() returned
          // so the Travel list opens with the newly-unlocked world already
          // highlighted, not whatever was first in the list.
          openShip: (opts) => this._openShip(opts),
        })
        if (trigger.once) this.state.flags.add(key)
        if (trigger.setsFlag) this.state.flags.add(trigger.setsFlag)
      }
    }

  }

  _applyWarp(warp) {
    if (warp.toWorld) this.state.worldId = warp.toWorld
    this.state.mapId = warp.toMap
    this.state.x = warp.toX
    this.state.y = warp.toY
    this._refreshMap()
    saveGame(this.state)
  }

  _openShip(opts = {}) {
    sceneManager.push(new ShipScene(), {
      state: this.state,
      preselectWorldId: opts.preselectWorldId,
      onClose: () => {
        sceneManager.pop()
        this._refreshMap()
      },
    })
  }

  // `callbacks` is optional: { onVictory(state), onDefeat(state) }. Used by
  // boss triggers to unlock the next world / advance quests on a win,
  // without the battle engine itself needing to know about story state.
  startBattle(enemyIds, callbacks = {}) {
    sceneManager.push(new BattleScene(), {
      state: this.state,
      enemyIds,
      onEnd: (result) => {
        sceneManager.pop()
        if (result.victory) {
          if (callbacks.onVictory) callbacks.onVictory(this.state)
        } else {
          if (callbacks.onDefeat) callbacks.onDefeat(this.state)
          for (const member of Object.values(this.state.party)) {
            member.hp = member.maxHp
            member.focus = member.maxFocus
          }
        }
        saveGame(this.state)
      },
    })
  }

  draw(ctx) {
    const camera = computeCamera(this.mapDef, this.state.x, this.state.y)
    drawMap(ctx, this.mapDef, camera)

    // NPC "!" markers are collected here and drawn in a final overlay pass
    // (after every sprite, including the hero) so a sprite standing on an
    // adjacent tile — e.g. the player lined up to talk — never paints over
    // a marker on the row below/above it.
    const markers = []
    for (const npc of this.mapDef.npcs || []) {
      if (npc.requiresFlag && !this.state.flags.has(npc.requiresFlag)) continue
      const sprite = getSprite(npc.spriteId) || getSprite('npc')
      const sx = (npc.x - camera.camX) * TILE_SIZE
      const sy = (npc.y - camera.camY) * TILE_SIZE
      drawSprite(ctx, sprite, 0, sx, sy, { scale: 1 })
      if (this._npcHasNewContent(npc)) markers.push({ sx, sy })
    }

    for (const enemySpawn of this.mapDef.enemySpawns || []) {
      if (this.state.flags.has(this._enemyDefeatedKey(enemySpawn))) continue
      const sprite = getSprite(enemySpawn.spriteId)
      if (!sprite) continue
      const sx = (enemySpawn.x - camera.camX) * TILE_SIZE
      const sy = (enemySpawn.y - camera.camY) * TILE_SIZE
      drawSprite(ctx, sprite, 0, sx, sy, { scale: 1 })
    }

    const px = (this.state.x - camera.camX) * TILE_SIZE
    const py = (this.state.y - camera.camY) * TILE_SIZE
    drawSprite(ctx, heroSprite, 0, px, py, { scale: 1, flip: this.state.facing === 'left' })

    for (const { sx, sy } of markers) {
      ctx.font = 'bold 9px Consolas, Menlo, monospace'
      // Dark outline first so the marker stays legible even when it lands
      // over a light sprite (e.g. the hero standing on the adjacent tile).
      ctx.strokeStyle = '#1a1208'
      ctx.lineWidth = 2
      ctx.strokeText('!', sx + 6, sy - 3)
      ctx.fillStyle = '#f4d35b'
      ctx.fillText('!', sx + 6, sy - 3)
    }

    ctx.font = '7px Consolas, Menlo, monospace'
    ctx.fillStyle = '#e8e8e8'
    ctx.fillText(t(this.world.name), 4, 10)

    drawHud(ctx, this.state)

    this.dialogue.draw(ctx)
  }
}
