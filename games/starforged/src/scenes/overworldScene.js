import { MOVE_DURATION_MS, DIRECTIONS } from '../engine/constants.js'
import { input } from '../engine/input.js'
import { Dialogue } from '../engine/dialogue.js'
import { drawMap, computeCamera, isWalkable, getNpcAt, getWarpAt, getTriggerAt } from '../engine/tilemap.js'
import { drawSprite } from '../engine/sprite.js'
import { heroSprite } from '../assets/sprites/hero.js'
import { getSprite } from '../assets/sprites/registry.js'
import { getWorld } from '../worlds/registry.js'
import { TILE_SIZE } from '../engine/constants.js'
import { sceneManager } from '../engine/sceneManager.js'
import { BattleScene } from '../battle/battleScene.js'
import { saveGame } from '../engine/save.js'

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
  }

  _triggerKey(x, y) {
    return `_trig_${this.state.worldId}_${this.state.mapId}_${x}_${y}`
  }

  update(dt) {
    this.dialogue.update(dt, input)
    if (this.dialogue.active) return

    if (this.moveCooldown > 0) {
      this.moveCooldown -= dt
    }

    if (input.wasPressed('a')) {
      this._tryInteract()
    }

    if (this.moveCooldown > 0) return

    const dir = ['up', 'down', 'left', 'right'].find((d) => input.isDown(d))
    if (!dir) return

    this.state.facing = dir
    const { dx, dy } = DIRECTIONS[dir]
    const nx = this.state.x + dx
    const ny = this.state.y + dy

    if (isWalkable(this.mapDef, nx, ny) && !getNpcAt(this.mapDef, nx, ny)) {
      this.state.x = nx
      this.state.y = ny
      this.moveCooldown = MOVE_DURATION_MS
      this._onArrive(nx, ny)
    } else {
      this.moveCooldown = BUMP_COOLDOWN_MS
    }
  }

  _tryInteract() {
    const { dx, dy } = DIRECTIONS[this.state.facing]
    const npc = getNpcAt(this.mapDef, this.state.x + dx, this.state.y + dy)
    if (!npc) return
    if (npc.requiresFlag && !this.state.flags.has(npc.requiresFlag)) return
    const lines = typeof npc.dialogue === 'function' ? npc.dialogue(this.state) : npc.dialogue
    this.dialogue.start(lines)
  }

  _onArrive(x, y) {
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
          startBattle: (enemyIds) => this.startBattle(enemyIds),
          showDialogue: (lines, cb) => this.dialogue.start(lines, cb),
          warpTo: (w) => this._applyWarp(w),
        })
        if (trigger.once) this.state.flags.add(key)
        if (trigger.setsFlag) this.state.flags.add(trigger.setsFlag)
      }
    }

    this._maybeEncounter(x, y)
  }

  _maybeEncounter(x, y) {
    for (const zone of this.mapDef.encounterZones || []) {
      if (x < zone.x || x >= zone.x + zone.w || y < zone.y || y >= zone.y + zone.h) continue
      if (Math.random() < zone.chance) {
        const enemyId = zone.enemyIds[Math.floor(Math.random() * zone.enemyIds.length)]
        this.startBattle([enemyId])
        return
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

  startBattle(enemyIds) {
    sceneManager.push(new BattleScene(), {
      state: this.state,
      enemyIds,
      onEnd: (result) => {
        sceneManager.pop()
        if (!result.victory) {
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

    for (const npc of this.mapDef.npcs || []) {
      if (npc.requiresFlag && !this.state.flags.has(npc.requiresFlag)) continue
      const sprite = getSprite(npc.spriteId) || getSprite('npc')
      const sx = (npc.x - camera.camX) * TILE_SIZE
      const sy = (npc.y - camera.camY) * TILE_SIZE
      drawSprite(ctx, sprite, 0, sx, sy, { scale: 1 })
    }

    const px = (this.state.x - camera.camX) * TILE_SIZE
    const py = (this.state.y - camera.camY) * TILE_SIZE
    drawSprite(ctx, heroSprite, 0, px, py, { scale: 1, flip: this.state.facing === 'left' })

    ctx.font = '7px monospace'
    ctx.fillStyle = '#e8e8e8'
    ctx.fillText(this.world.name, 4, 10)

    this.dialogue.draw(ctx)
  }
}
