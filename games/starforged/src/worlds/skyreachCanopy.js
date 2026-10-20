import { registerWorld, unlockNextWorld } from './registry.js'
import { registerTileTypes } from '../assets/tiles.js'
import { registerSprites } from '../assets/sprites/registry.js'
import { registerEnemies } from '../battle/enemies.js'
import { registerMoves } from '../battle/moves.js'
import {
  HUMANOID_TEMPLATE,
  CHILD_TEMPLATE,
  CREATURE_TEMPLATE,
  ARMORED_TEMPLATE,
  LAMP_TEMPLATE,
  buildSprite,
} from '../assets/spriteTemplates.js'
import { startQuest, setQuestStage, completeQuest } from '../data/gameState.js'

// --- Small grid-building helpers (local to this file) ---------------------
// Used to construct the larger maps below without hand-writing every row.
function makeGrid(width, height, fillId) {
  return Array.from({ length: height }, () => Array(width).fill(fillId))
}

function setTile(grid, x, y, id) {
  grid[y][x] = id
}

function setRect(grid, x, y, w, h, id) {
  for (let yy = y; yy < y + h; yy++) {
    for (let xx = x; xx < x + w; xx++) {
      grid[yy][xx] = id
    }
  }
}

function setBorder(grid, id) {
  const h = grid.length
  const w = grid[0].length
  for (let x = 0; x < w; x++) {
    grid[0][x] = id
    grid[h - 1][x] = id
  }
  for (let y = 0; y < h; y++) {
    grid[y][0] = id
    grid[y][w - 1] = id
  }
}

/**
 * World 4 — Skyreach Canopy: a hidden refuge of Current-sensitive "Skykin"
 * strung between glowing treetop platforms high above the Drift's cloud
 * layer. The Hollow Syndicate has tracked them here; an elite enforcer is
 * already climbing toward the refuge. Four connected maps: the windswept
 * Canopy Approach, the Skykin Refuge hub, the maze-like High Reaches (gated
 * behind a Windward Charm), and the Enforcer's Arena — a one-tile
 * chokepoint boss gate, right before the finale (The Hollow).
 *
 * Random encounters are disabled engine-wide: enemies are visible sprites
 * placed directly on each map (`enemySpawns`), and walking into one starts
 * the fight immediately. Only the boss stays a forced `Trigger` at the
 * arena's single chokepoint tile, so it can never be walked around.
 */

// --- Tile types (namespaced 'skyreach_' to avoid colliding with other
// worlds being built in parallel) ---------------------------------------
registerTileTypes({
  skyreach_walkway: { color: '#3c6b74', dither: '#2a4e55', walkable: true },
  skyreach_canopy: { color: '#4a2f6e', dither: '#381f57', walkable: true },
  skyreach_railing: { color: '#1f2d33', walkable: false },
  skyreach_door: { color: '#39c6b0', walkable: true },
  skyreach_refugeFloor: { color: '#2f4a52', dither: '#22363c', walkable: true },
  skyreach_rootPath: { color: '#3a2f52', dither: '#2a2240', walkable: true },
  skyreach_vinewall: { color: '#241a38', walkable: false },
  skyreach_depthCanopy: { color: '#5c2f7a', dither: '#431f5c', walkable: true },
  skyreach_vineGate: { color: '#2f6b57', dither: '#1f4d3d', walkable: true },
  skyreach_arenaFloor: { color: '#3d3450', dither: '#2a2440', walkable: true },
  skyreach_arenaWall: { color: '#17121f', walkable: false },
  // --- new decorative tile types (floating-forest / treetop theme) --------
  skyreach_giantTrunk: { color: '#2e1f14', dither: '#1c1209', walkable: false },
  skyreach_ropeRail: { color: '#6b4a2f', dither: '#4a3220', walkable: false },
  skyreach_glowFungus: { color: '#5ce3a8', dither: '#2f9e73', walkable: false },
  skyreach_brokenEdge: { color: '#14181c', dither: '#0a0c0e', walkable: false },
  skyreach_mistPatch: { color: '#aee6e0', dither: '#7fc9c2', walkable: true },
})

// --- Sprites -------------------------------------------------------------
const sennaSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#2a4e55',
  V: '#0b0d12',
  T: '#39c6b0',
  A: '#3c6b74',
  L: '#1a1d26',
})

const orinSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#5a3f7a',
  V: '#1a1d26',
  T: '#9d7fd1',
  A: '#4a2f6e',
  L: '#2a1f3a',
})

const tamsinSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#52586a',
  V: '#0b0d12',
  T: '#9d7fd1',
  A: '#3c6b74',
  L: '#1a1d26',
})

const haleSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#2a4e55',
  V: '#101820',
  T: '#e3b23c',
  A: '#1f2d33',
  L: '#101820',
})

const fennSprite = buildSprite(CHILD_TEMPLATE, {
  H: '#6fe3d0',
  E: '#1a1d26',
  R: '#39c6b0',
  B: '#dff5f0',
})

const wrenSprite = buildSprite(CHILD_TEMPLATE, {
  H: '#9d7fd1',
  E: '#1a1d26',
  R: '#5a3f7a',
  B: '#dfe3ea',
})

const galeStalkerSprite = buildSprite(CREATURE_TEMPLATE, {
  H: '#1f2d33',
  E: '#39c6b0',
  B: '#2a4e55',
  T: '#6fe3d0',
  L: '#101820',
})

const windReaverSprite = buildSprite(CREATURE_TEMPLATE, {
  H: '#214047',
  E: '#dfffe8',
  B: '#2f6b74',
  T: '#6fe3d0',
  L: '#12282c',
})

const rootLurkerSprite = buildSprite(CREATURE_TEMPLATE, {
  H: '#2a2038',
  E: '#120c1a',
  B: '#3a2a52',
  T: '#5c3f7a',
  L: '#160f24',
})

// Elite Syndicate enforcer boss — a human combatant, not wildlife, so she
// gets the bulkier armored-trooper silhouette instead of the creature one.
const enforcerVaneSprite = buildSprite(ARMORED_TEMPLATE, {
  H: '#2e2440',
  F: '#dfe3ea',
  S: '#17121f',
  T: '#8a6fd1',
  A: '#3d3450',
  L: '#17121f',
})

// Current-well beacon (highReaches, 8,15): the plot quest's objective,
// literally described in its own flavor text as "a dim lantern-well." Same
// LAMP_TEMPLATE shape as Mossfen's cozy kinlight, but re-skinned eerie
// purple/teal to read as "ominous Syndicate-tracked tech," not a rescue.
const currentWellBeaconSprite = buildSprite(LAMP_TEMPLATE, {
  F: '#241c08',
  G: '#39c6b0',
  P: '#17121f',
})

registerSprites({
  skyreach_senna: sennaSprite,
  skyreach_orin: orinSprite,
  skyreach_tamsin: tamsinSprite,
  skyreach_hale: haleSprite,
  skyreach_fenn: fennSprite,
  skyreach_wren: wrenSprite,
  skyreach_galeStalker: galeStalkerSprite,
  skyreach_windReaver: windReaverSprite,
  skyreach_rootLurker: rootLurkerSprite,
  skyreach_enforcerVane: enforcerVaneSprite,
  skyreach_currentWellBeacon: currentWellBeaconSprite,
})

// --- Moves -----------------------------------------------------------------
registerMoves({
  skyreach_windSlash: { name: 'Wind Slash', kind: 'attack', power: 9, focusCost: 0, accuracy: 0.88 },
  skyreach_talonRake: { name: 'Talon Rake', kind: 'attack', power: 10, focusCost: 0, accuracy: 0.85 },
  skyreach_rootCoil: { name: 'Root Coil', kind: 'debuff', power: 5, focusCost: 0, accuracy: 0.85 },
  skyreach_cycloneCleave: { name: 'Cyclone Cleave', kind: 'attack', power: 15, focusCost: 0, accuracy: 0.85 },
  skyreach_downdraftSlam: { name: 'Downdraft Slam', kind: 'attack', power: 12, focusCost: 2, accuracy: 0.9 },
  skyreach_stormshear: { name: 'Stormshear', kind: 'debuff', power: 6, focusCost: 0, accuracy: 0.9 },
})

// --- Enemies -----------------------------------------------------------------
registerEnemies({
  skyreach_galeStalker: {
    name: 'Gale Stalker',
    spriteId: 'skyreach_galeStalker',
    maxHp: 48,
    atk: 12,
    def: 6,
    spd: 8,
    moves: ['skyreach_windSlash', 'strike'],
    xpReward: 36,
  },
  skyreach_windReaver: {
    name: 'Wind Reaver',
    spriteId: 'skyreach_windReaver',
    maxHp: 52,
    atk: 13,
    def: 6,
    spd: 9,
    moves: ['skyreach_talonRake', 'skyreach_windSlash'],
    xpReward: 40,
  },
  skyreach_rootLurker: {
    name: 'Root Lurker',
    spriteId: 'skyreach_rootLurker',
    maxHp: 57,
    atk: 11,
    def: 9,
    spd: 5,
    moves: ['skyreach_rootCoil', 'strike'],
    xpReward: 42,
  },
  // Elite Syndicate enforcer — the chapter's boss. Aerial/wind-themed to
  // match the setting; drops from a glider-rig to force the fight at the
  // arena's one-tile chokepoint.
  skyreach_enforcerVane: {
    name: 'Enforcer Vane',
    spriteId: 'skyreach_enforcerVane',
    maxHp: 152,
    atk: 19,
    def: 10,
    spd: 9,
    moves: ['skyreach_cycloneCleave', 'skyreach_downdraftSlam', 'skyreach_stormshear'],
    xpReward: 160,
    isBoss: true,
  },
})

// --- Quest ids / names ----------------------------------------------------
const ROOST_QUEST = 'skyreach_roostRescue'
const ROOST_QUEST_KEY = 'T8'
const WATCH_QUEST = 'skyreach_hollowWatch'
const WATCH_QUEST_KEY = 'T7'

// --- Maps --------------------------------------------------------------

// Map 1 — Canopy Approach (26x20, outdoor). Railings line the outer edge;
// a wide canopy grove fills the middle with scattered visible enemies and
// decoration; rope-rail walkways run the flanks; a door on the north wall
// leads into the Skykin Refuge.
const CANOPY_W = 26
const CANOPY_H = 20
const canopyApproachTiles = makeGrid(CANOPY_W, CANOPY_H, 'skyreach_walkway')
setBorder(canopyApproachTiles, 'skyreach_railing')
setTile(canopyApproachTiles, 13, 1, 'skyreach_door')
setRect(canopyApproachTiles, 4, 4, 18, 10, 'skyreach_canopy')
for (let y = 2; y <= 17; y++) {
  setTile(canopyApproachTiles, 1, y, 'skyreach_ropeRail')
  setTile(canopyApproachTiles, 24, y, 'skyreach_ropeRail')
}
setTile(canopyApproachTiles, 12, 4, 'skyreach_giantTrunk')
setTile(canopyApproachTiles, 12, 13, 'skyreach_giantTrunk')
setTile(canopyApproachTiles, 5, 9, 'skyreach_giantTrunk')
setTile(canopyApproachTiles, 20, 9, 'skyreach_giantTrunk')
setTile(canopyApproachTiles, 10, 8, 'skyreach_glowFungus')
setTile(canopyApproachTiles, 15, 8, 'skyreach_glowFungus')
setTile(canopyApproachTiles, 7, 7, 'skyreach_mistPatch')
setTile(canopyApproachTiles, 16, 7, 'skyreach_mistPatch')
setTile(canopyApproachTiles, 2, 16, 'skyreach_brokenEdge')
setTile(canopyApproachTiles, 23, 16, 'skyreach_brokenEdge')

// Map 2 — Skykin Refuge (20x18 hub). A single clearing of root-plank floor;
// a south door back to the Approach, a north door up into the High Reaches.
const REFUGE_W = 20
const REFUGE_H = 18
const skykinRefugeTiles = makeGrid(REFUGE_W, REFUGE_H, 'skyreach_refugeFloor')
setBorder(skykinRefugeTiles, 'skyreach_railing')
setTile(skykinRefugeTiles, 10, 1, 'skyreach_door')
setTile(skykinRefugeTiles, 10, 16, 'skyreach_door')
setTile(skykinRefugeTiles, 4, 9, 'skyreach_giantTrunk')
setTile(skykinRefugeTiles, 15, 9, 'skyreach_giantTrunk')
setTile(skykinRefugeTiles, 7, 7, 'skyreach_glowFungus')
setTile(skykinRefugeTiles, 12, 7, 'skyreach_glowFungus')
setTile(skykinRefugeTiles, 7, 12, 'skyreach_mistPatch')
setTile(skykinRefugeTiles, 12, 12, 'skyreach_mistPatch')

// Map 3 — High Reaches (24x24, maze-like dungeon). The Roost (rows 1-6) is
// sealed off from the rest of the maze by a vine-lock gate (row 7) that
// only opens for someone carrying the Windward Charm
// (state.flags.has('skyreach_hasCharm')) — Wren and the way down into the
// boss arena both sit beyond it, reached via a single-tile corridor
// (col 11) so the gate cannot be routed around.
const REACHES_W = 24
const REACHES_H = 24
const highReachesTiles = makeGrid(REACHES_W, REACHES_H, 'skyreach_vinewall')
setRect(highReachesTiles, 6, 1, 12, 6, 'skyreach_rootPath')
setTile(highReachesTiles, 11, 7, 'skyreach_vineGate')
for (let y = 8; y <= 11; y++) setTile(highReachesTiles, 11, y, 'skyreach_rootPath')
setRect(highReachesTiles, 4, 12, 16, 8, 'skyreach_depthCanopy')
for (let y = 20; y <= 21; y++) setTile(highReachesTiles, 11, y, 'skyreach_rootPath')
setTile(highReachesTiles, 11, 22, 'skyreach_door')
setTile(highReachesTiles, 15, 4, 'skyreach_door')
setTile(highReachesTiles, 7, 2, 'skyreach_giantTrunk')
setTile(highReachesTiles, 16, 2, 'skyreach_giantTrunk')
setTile(highReachesTiles, 9, 5, 'skyreach_glowFungus')
setTile(highReachesTiles, 13, 5, 'skyreach_glowFungus')
setTile(highReachesTiles, 5, 14, 'skyreach_giantTrunk')
setTile(highReachesTiles, 18, 14, 'skyreach_giantTrunk')
setTile(highReachesTiles, 5, 17, 'skyreach_giantTrunk')
setTile(highReachesTiles, 18, 17, 'skyreach_giantTrunk')
setTile(highReachesTiles, 10, 16, 'skyreach_glowFungus')
setTile(highReachesTiles, 12, 16, 'skyreach_glowFungus')
setTile(highReachesTiles, 9, 14, 'skyreach_mistPatch')
setTile(highReachesTiles, 13, 14, 'skyreach_mistPatch')
setTile(highReachesTiles, 6, 19, 'skyreach_brokenEdge')
setTile(highReachesTiles, 17, 19, 'skyreach_brokenEdge')

// Map 4 — Enforcer's Arena (15x15). A single-tile-wide corridor funnels
// straight into the arena room (same chokepoint pattern as theHollow.js),
// so the boss fight cannot be walked around.
const ARENA_W = 15
const ARENA_H = 15
const enforcerArenaTiles = makeGrid(ARENA_W, ARENA_H, 'skyreach_arenaWall')
setRect(enforcerArenaTiles, 3, 1, 9, 5, 'skyreach_arenaFloor')
for (let y = 6; y <= 9; y++) setTile(enforcerArenaTiles, 7, y, 'skyreach_arenaFloor')
setTile(enforcerArenaTiles, 6, 10, 'skyreach_arenaFloor')
setTile(enforcerArenaTiles, 7, 10, 'skyreach_arenaFloor')
setTile(enforcerArenaTiles, 7, 11, 'skyreach_door')
setTile(enforcerArenaTiles, 4, 2, 'skyreach_glowFungus')
setTile(enforcerArenaTiles, 10, 2, 'skyreach_glowFungus')
setTile(enforcerArenaTiles, 5, 4, 'skyreach_mistPatch')
setTile(enforcerArenaTiles, 9, 4, 'skyreach_mistPatch')

export const ENTRY = { x: 9, y: 18 }

export const skyreachCanopyWorld = {
  id: 'skyreachCanopy',
  name: 'Skyreach Canopy',
  startMap: 'canopyApproach',
  entry: ENTRY,
  maps: {
    canopyApproach: {
      name: 'Canopy',
      width: CANOPY_W,
      height: CANOPY_H,
      tiles: canopyApproachTiles,
      npcs: [
        {
          id: 'hale',
          x: 6,
          y: 18,
          facing: 'up',
          spriteId: 'skyreach_hale',
          dialogue: [
            'Hale: Gale stalkers are thick in the canopy now.',
            'Hale: The refuge is north — hurry.',
            'Hale: One of the giant trunks west of here has a false knothole.',
          ],
        },
      ],
      enemySpawns: [
        { id: 'canopy_galeStalker1', x: 6, y: 6, enemyId: 'skyreach_galeStalker', spriteId: 'skyreach_galeStalker' },
        { id: 'canopy_windReaver1', x: 18, y: 6, enemyId: 'skyreach_windReaver', spriteId: 'skyreach_windReaver' },
        { id: 'canopy_galeStalker2', x: 9, y: 12, enemyId: 'skyreach_galeStalker', spriteId: 'skyreach_galeStalker' },
        { id: 'canopy_windReaver2', x: 17, y: 12, enemyId: 'skyreach_windReaver', spriteId: 'skyreach_windReaver' },
      ],
      secrets: [
        {
          id: 'canopyTrunkStash',
          x: 5,
          y: 9,
          reward: { tonic: 1 },
          dialogue: ['The knothole is hollow — a windkin cache!', 'Found a tonic!'],
        },
      ],
      warps: [{ x: 13, y: 1, toMap: 'skykinRefuge', toX: 10, toY: 15 }],
      triggers: [
        {
          x: 13,
          y: 5,
          once: true,
          setsFlag: 'skyreach_approachLoreSeen',
          onEnter: (ctx) => {
            ctx.showDialogue([
              'A grinding hum rises from far below the clouds.',
              'Gogu shivers. "That\'s where they want to take me."',
            ])
          },
        },
        {
          x: 8,
          y: 10,
          once: true,
          setsFlag: 'skyreach_approachCacheFound',
          onEnter: (ctx) => {
            ctx.state.inventory.medkit = (ctx.state.inventory.medkit || 0) + 1
            ctx.showDialogue(['Found a spare medkit in a hollow root.'])
          },
        },
      ],
    },

    skykinRefuge: {
      name: 'Skykin Refuge',
      width: REFUGE_W,
      height: REFUGE_H,
      tiles: skykinRefugeTiles,
      npcs: [
        {
          id: 'senna',
          x: 5,
          y: 4,
          facing: 'down',
          spriteId: 'skyreach_senna',
          watchesQuests: [WATCH_QUEST],
          // Plot quest-giver: the Syndicate thread for this chapter.
          dialogue: (state) => {
            const q = state.quests[WATCH_QUEST]
            if (!q) {
              startQuest(state, WATCH_QUEST, 'Shroud the Current-Well', WATCH_QUEST_KEY)
              return [
                'Senna: The Current-well is singing straight to the Syndicate.',
                'Senna: Still it in the High Reaches before they arrive.',
              ]
            }
            if (q.complete) {
              return ['Senna: The enforcer is gone. The refuge stands.']
            }
            if (q.stage >= 1) {
              return ['Senna: You stilled it. Thank the Current.', "Senna: She's almost here — stand with us."]
            }
            return ["Senna: Please hurry — they're getting closer."]
          },
        },
        {
          id: 'orin',
          x: 14,
          y: 4,
          facing: 'down',
          spriteId: 'skyreach_orin',
          watchesQuests: [ROOST_QUEST],
          // Practical quest-giver: a "go rescue a Skykin in the Depths" quest.
          dialogue: (state) => {
            const q = state.quests[ROOST_QUEST]
            if (!q) {
              startQuest(state, ROOST_QUEST, 'Find Wren in the High Reaches', ROOST_QUEST_KEY)
              return ['Orin: Wren never came back from scouting.', 'Orin: Please find them near the roost towers.']
            }
            if (q.complete) {
              return ['Orin: Wren\'s back safe. Thank you, Wando.']
            }
            return ['Orin: Please, hurry — find Wren.']
          },
        },
        {
          id: 'tamsin',
          x: 5,
          y: 13,
          facing: 'down',
          spriteId: 'skyreach_tamsin',
          watchesQuests: [ROOST_QUEST],
          watchesFlags: ['skyreach_hasCharm'],
          // Hands over the Windward Charm once the roost quest is active —
          // the item/flag that gates the High Reaches' inner section.
          dialogue: (state) => {
            const roost = state.quests[ROOST_QUEST]
            if (roost && !roost.complete && !state.flags.has('skyreach_hasCharm')) {
              state.flags.add('skyreach_hasCharm')
              return ['Tamsin: Take this Windward Charm.', 'Tamsin: It opens the vine-locks up high.']
            }
            if (state.flags.has('skyreach_hasCharm')) {
              return ['Tamsin: The charm still hums warm. Good.']
            }
            return ['Tamsin: The High Reaches are sealed in vine-lock.']
          },
        },
        {
          id: 'fenn',
          x: 14,
          y: 13,
          facing: 'down',
          spriteId: 'skyreach_fenn',
          dialogue: ["Fenn: You're really Wando Ironhelm?", "Fenn: Gogu doesn't look scary at all."],
        },
      ],
      enemySpawns: [],
      warps: [
        { x: 10, y: 16, toMap: 'canopyApproach', toX: 13, toY: 2 },
        { x: 10, y: 1, toMap: 'highReaches', toX: 11, toY: 21 },
      ],
      triggers: [],
    },

    highReaches: {
      name: 'High Reaches',
      width: REACHES_W,
      height: REACHES_H,
      tiles: highReachesTiles,
      npcs: [
        {
          id: 'wren',
          x: 11,
          y: 3,
          facing: 'down',
          spriteId: 'skyreach_wren',
          watchesQuests: [ROOST_QUEST],
          dialogue: (state) => {
            const q = state.quests[ROOST_QUEST]
            if (q && !q.complete) {
              setQuestStage(state, ROOST_QUEST, 1)
              completeQuest(state, ROOST_QUEST)
              state.flags.add('skyreach_wrenRescued')
              const moss = state.party.moss
              moss.maxFocus += 1
              moss.focus = moss.maxFocus
              return ['Wren: Wando! You found me.', "Wren: Here — this will steady Gogu's Focus."]
            }
            if (state.flags.has('skyreach_wrenRescued')) {
              return ["Wren: Steadier than I've felt in days."]
            }
            return ['Wren: Oh — thank the Current, someone found me.']
          },
        },
      ],
      enemySpawns: [
        { id: 'reaches_rootLurker1', x: 7, y: 13, enemyId: 'skyreach_rootLurker', spriteId: 'skyreach_rootLurker' },
        { id: 'reaches_galeStalker1', x: 14, y: 13, enemyId: 'skyreach_galeStalker', spriteId: 'skyreach_galeStalker' },
        { id: 'reaches_rootLurker2', x: 7, y: 18, enemyId: 'skyreach_rootLurker', spriteId: 'skyreach_rootLurker' },
        { id: 'reaches_galeStalker2', x: 15, y: 18, enemyId: 'skyreach_galeStalker', spriteId: 'skyreach_galeStalker' },
      ],
      // Visible marker for the Current-well beacon, same tile as its
      // (unchanged) Trigger below.
      items: [{ id: 'currentWellBeacon', x: 8, y: 15, spriteId: 'skyreach_currentWellBeacon' }],
      warps: [
        { x: 11, y: 22, toMap: 'skykinRefuge', toX: 10, toY: 2 },
        { x: 15, y: 4, toMap: 'enforcerArena', toX: 7, toY: 11 },
      ],
      triggers: [
        // Vine-lock gate guarding "the Roost" (Wren + the way down into the
        // arena). Fires every time the tile is entered (not `once`), so it
        // keeps blocking until the Windward Charm flag is set, and is a
        // harmless no-op afterward.
        {
          x: 11,
          y: 7,
          onEnter: (ctx) => {
            if (!ctx.state.flags.has('skyreach_hasCharm')) {
              ctx.showDialogue(['Thick vines block the way. You need the Windward Charm.'])
              ctx.warpTo({ toMap: 'highReaches', toX: 11, toY: 8 })
            }
          },
        },
        // Current-well beacon: the plot quest's objective. Idempotent via
        // its own flag check rather than `once`, so it stays a harmless
        // flavor line before the quest is accepted and after it's doused.
        {
          x: 8,
          y: 15,
          onEnter: (ctx) => {
            const q = ctx.state.quests[WATCH_QUEST]
            if (ctx.state.flags.has('skyreach_beaconDoused')) {
              ctx.showDialogue(['The well sits dark and quiet now.'])
              return
            }
            if (q && q.stage === 0 && !q.complete) {
              ctx.state.flags.add('skyreach_beaconDoused')
              setQuestStage(ctx.state, WATCH_QUEST, 1)
              ctx.showDialogue([
                'The well hums, loud enough to feel in your teeth.',
                'Gogu silences it. "They can\'t hear it now."',
              ])
              return
            }
            ctx.showDialogue(['A dim lantern-well hums quietly here.'])
          },
        },
        {
          x: 16,
          y: 15,
          once: true,
          setsFlag: 'skyreach_alcoveCacheFound',
          onEnter: (ctx) => {
            ctx.state.inventory.medkit = (ctx.state.inventory.medkit || 0) + 1
            ctx.showDialogue(['Found a medkit in a root alcove.'])
          },
        },
      ],
    },

    enforcerArena: {
      name: 'Enforcer Arena',
      width: ARENA_W,
      height: ARENA_H,
      tiles: enforcerArenaTiles,
      npcs: [],
      enemySpawns: [],
      warps: [{ x: 7, y: 11, toMap: 'highReaches', toX: 15, toY: 5 }],
      triggers: [
        // Mandatory boss encounter: the only tile connecting the corridor
        // to the arena room, so it cannot be bypassed.
        {
          x: 7,
          y: 6,
          once: true,
          setsFlag: 'skyreach_enforcerEngaged',
          onEnter: (ctx) => {
            ctx.showDialogue(
              [
                'A figure drops from above on a glider-rig.',
                '"Enforcer Vane," she says. "Hiding ends today."',
                'Wando steps in front of Gogu. "Not today."',
              ],
              () => {
                ctx.startBattle(['skyreach_enforcerVane'], {
                  onVictory: (state) => {
                    const nextWorldId = unlockNextWorld(state, 'skyreachCanopy')
                    completeQuest(state, WATCH_QUEST)
                    ctx.showDialogue(
                      [
                        'Enforcer Vane crashes against the rail, defeated.',
                        'The refuge is safe — for now.',
                        'Head back to the Starskiff. The Hollow awaits.',
                      ],
                      () => ctx.openShip({ preselectWorldId: nextWorldId })
                    )
                  },
                })
              }
            )
          },
        },
      ],
    },
  },
}

registerWorld(skyreachCanopyWorld)
