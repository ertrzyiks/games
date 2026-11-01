import { registerWorld } from './registry.js'
import { registerTileTypes } from '../assets/tiles.js'
import { registerSprites } from '../assets/sprites/registry.js'
import {
  buildSprite,
  HUMANOID_TEMPLATE,
  ARMORED_TEMPLATE,
  CREATURE_FLYER_TEMPLATE,
  ROBOT_DRONE_TEMPLATE,
  BOSS_HERALD_TEMPLATE,
  CONSOLE_TEMPLATE,
  CACHE_TEMPLATE,
} from '../assets/spriteTemplates.js'
import { registerEnemies } from '../battle/enemies.js'
import { registerMoves } from '../battle/moves.js'
import { startQuest, setQuestStage, completeQuest } from '../data/gameState.js'

function fillRow(width, id) {
  return Array(width).fill(id)
}

function makeGrid(width, height, fillId) {
  const grid = []
  for (let y = 0; y < height; y++) grid.push(fillRow(width, fillId))
  return grid
}

function fillRect(grid, x0, y0, x1, y1, id) {
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      grid[y][x] = id
    }
  }
}

function setTile(grid, x, y, id) {
  grid[y][x] = id
}

function setBorder(grid, id) {
  const h = grid.length
  const w = grid[0].length
  fillRect(grid, 0, 0, w - 1, 0, id)
  fillRect(grid, 0, h - 1, w - 1, h - 1, id)
  fillRect(grid, 0, 0, 0, h - 1, id)
  fillRect(grid, w - 1, 0, w - 1, h - 1, id)
}

/**
 * World 6 — Driftfall: the true source behind the Hollow Syndicate, a
 * derelict flagship drifting beyond the Drift's last charted edge. Reached
 * only after beating The Hollow (see theHollow.js's boss onVictory, which
 * now calls unlockNextWorld instead of ending the game). Three maps:
 *   voidApproach (exterior debris field, entry, Kessa's quest, a side
 *     quest tucked in the wreckage)
 *     -> citadelHalls (interior hub - a branching corridor with a west
 *        and east wing, not one big room - Tomas reports back, Ren trades)
 *       -> commandSanctum (corridor build-up into the one-tile-chokepoint
 *          boss arena, same pattern every other world's finale uses)
 *
 * Random encounters are disabled engine-wide: every map below uses
 * visible, map-placed enemySpawns instead (including the boss - see
 * commandSanctumMap). Every warp has a matching return warp on the far
 * side, same as every other world (see theHollow.js's own fix for why
 * that matters).
 */

// --- Cold void/energy tile set, namespaced to avoid collisions with other
// worlds. ---
const HULL_STEEL = '#5c6478'
const HULL_STEEL_DARK = '#3a4050'
const VOID_FLOOR = '#242840'
const VOID_FLOOR_DARK = '#1a1d30'

registerTileTypes({
  driftfall_hullFloor: { color: HULL_STEEL, dither: HULL_STEEL_DARK, walkable: true },
  driftfall_voidFloor: { color: VOID_FLOOR, dither: VOID_FLOOR_DARK, walkable: true },
  driftfall_wall: { color: '#2a2d3a', walkable: false, shape: 'wall' },
  driftfall_debris: { color: '#4a4258', dither: '#332c40', walkable: false, shape: 'wreckage' },
  driftfall_strut: { color: '#6b7284', dither: '#454c5c', walkable: false, shape: 'pillar' },
  driftfall_brokenStrut: { color: '#454c5c', dither: '#2e333f', walkable: false, shape: 'brokenPillar' },
  driftfall_consoleArray: { color: '#3a3f52', dither: '#262a38', walkable: false, shape: 'machinery' },
  driftfall_coolantPool: { color: '#1f4a4a', walkable: false, shape: 'water' },
  driftfall_crateStack: { color: '#5a4a7a', dither: '#3a2f52', walkable: false, shape: 'crate' },
  // Walkable, used sparingly (a couple of accent tiles in the boss arena
  // only) - a repeated glow icon over a big tiled floor would look busier,
  // not better, same reasoning as every other world's floor tiles.
  driftfall_coreFloor: { color: '#3a2a52', dither: '#281c3a', walkable: true, shape: 'rune' },
})

// --- Sprites -----------------------------------------------------------
const kessaSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#7a5cd1',
  V: '#0e1018',
  T: '#dfe3ea',
  A: '#3a2e5c',
  L: '#1a1420',
})

const tomasSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#39c6b0',
  V: '#0e1018',
  T: '#8a8f99',
  A: '#1f3a36',
  L: '#101820',
})

const renSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#e3b23c',
  V: '#0e1018',
  T: '#8a8f99',
  A: '#4a4030',
  L: '#1a1420',
})

const sorenSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#5c6478',
  V: '#0e1018',
  T: '#e3b23c',
  A: '#3a4050',
  L: '#1a1d26',
})

// Heavy elite trooper - ARMORED_TEMPLATE, same silhouette as eliteGuard/
// cinderTrooper, reskinned void-purple for the Syndicate's own flagship
// guard.
const voidSentinelSprite = buildSprite(ARMORED_TEMPLATE, {
  H: '#2e2a40',
  F: '#7a5cd1',
  S: '#1a1626',
  T: '#5a4a8a',
  A: '#22203a',
  L: '#120e1c',
})

// Winged - CREATURE_FLYER_TEMPLATE, a void-adapted predator stalking the
// debris field.
const driftReaperSprite = buildSprite(CREATURE_FLYER_TEMPLATE, {
  W: '#9a7ad1',
  B: '#3a2e5c',
  H: '#241c3a',
  E: '#dfb8ff',
  T: '#120e1c',
})

// Hovers - ROBOT_DRONE_TEMPLATE, a sentry drone patrolling the citadel.
const nullDroneSprite = buildSprite(ROBOT_DRONE_TEMPLATE, {
  N: '#7a5cd1',
  H: '#3a3f52',
  O: '#dfb8ff',
  A: '#262a38',
  G: '#120e1c',
})

// Boss: BOSS_HERALD_TEMPLATE's amorphous energy-being silhouette - nothing
// else in the game looks like this.
const nullHeraldSprite = buildSprite(BOSS_HERALD_TEMPLATE, {
  K: '#dfb8ff',
  G: '#7a5cd1',
  B: '#140e24',
  E: '#f4846b',
  W: '#5a4a8a',
})

// A dormant signal array (voidApproach, plot quest payoff) - cold steel
// casing around a glowing, restless display.
const signalArraySprite = buildSprite(CONSOLE_TEMPLATE, {
  B: '#3a3f52',
  S: '#dfb8ff',
  L: '#7a5cd1',
})

// A sealed supply cache (voidApproach secret).
const voidCacheSprite = buildSprite(CACHE_TEMPLATE, {
  C: '#5a4a7a',
  B: '#2e2640',
})

// Soren's stuck cargo crate (voidApproach's side quest).
const stuckCrateSprite = buildSprite(CACHE_TEMPLATE, {
  C: '#e3b23c',
  B: '#6e5420',
})

registerSprites({
  driftfall_kessa: kessaSprite,
  driftfall_tomas: tomasSprite,
  driftfall_ren: renSprite,
  driftfall_soren: sorenSprite,
  driftfall_voidSentinel: voidSentinelSprite,
  driftfall_driftReaper: driftReaperSprite,
  driftfall_nullDrone: nullDroneSprite,
  driftfall_nullHerald: nullHeraldSprite,
  driftfall_signalArray: signalArraySprite,
  driftfall_voidCache: voidCacheSprite,
  driftfall_stuckCrate: stuckCrateSprite,
})

// --- Moves ---------------------------------------------------------------
registerMoves({
  driftfall_voidLash: { name: 'Void Lash', kind: 'attack', power: 13, focusCost: 0, accuracy: 0.85, damageType: 'kinetic' },
  driftfall_shardBurst: { name: 'Shard Burst', kind: 'attack', power: 15, focusCost: 0, accuracy: 0.8, damageType: 'kinetic' },
  driftfall_witherPulse: { name: 'Wither Pulse', kind: 'attack', power: 14, focusCost: 0, accuracy: 0.85, damageType: 'force' },
  driftfall_staticArc: { name: 'Static Arc', kind: 'attack', power: 12, focusCost: 0, accuracy: 0.9, damageType: 'force' },
  driftfall_nullBlast: { name: 'Null Blast', kind: 'attack', power: 20, focusCost: 0, accuracy: 0.78, damageType: 'fire' },
  driftfall_voidCollapse: { name: 'Void Collapse', kind: 'attack', power: 24, focusCost: 0, accuracy: 0.72, damageType: 'kinetic' },
  // Capped at 3 uses per fight by battleScene's MAX_ENEMY_SELF_HEALS, same
  // as every other self-healing boss move.
  driftfall_heraldReknit: { name: "Herald's Reknit", kind: 'heal', power: 18, focusCost: 0, accuracy: 1 },
})

// --- Enemies ---------------------------------------------------------------
// Driftfall is the hardest chapter - its regulars run hotter than even
// Skyreach/Hollow's buffed ones (see skyreachCanopy.js/theHollow.js), and
// its boss is the toughest fight in the game.
registerEnemies({
  driftfall_voidSentinel: {
    name: 'Void Sentinel',
    spriteId: 'driftfall_voidSentinel',
    maxHp: 92,
    atk: 21,
    def: 11,
    spd: 7,
    moves: ['driftfall_voidLash', 'driftfall_shardBurst'],
    xpReward: 72,
    weakTo: 'kinetic',
  },
  driftfall_driftReaper: {
    name: 'Drift Reaper',
    spriteId: 'driftfall_driftReaper',
    maxHp: 84,
    atk: 19,
    def: 9,
    spd: 11,
    moves: ['driftfall_witherPulse', 'driftfall_staticArc'],
    xpReward: 68,
    weakTo: 'force',
  },
  driftfall_nullDrone: {
    name: 'Null Drone',
    spriteId: 'driftfall_nullDrone',
    maxHp: 88,
    atk: 18,
    def: 13,
    spd: 6,
    moves: ['driftfall_staticArc', 'driftfall_shardBurst'],
    xpReward: 70,
    weakTo: 'fire',
  },
  // resistantTo kinetic+fire, same as every other chapter's boss - never
  // force, so Gogu's kit always pays off here too.
  driftfall_nullHerald: {
    name: 'Herald of the Null',
    spriteId: 'driftfall_nullHerald',
    maxHp: 260,
    atk: 27,
    def: 15,
    spd: 10,
    moves: ['driftfall_nullBlast', 'driftfall_voidCollapse', 'driftfall_witherPulse', 'driftfall_heraldReknit'],
    xpReward: 320,
    isBoss: true,
    resistantTo: ['kinetic', 'fire'],
  },
})

// --- Quests ----------------------------------------------------------------
const FINALE_QUEST_ID = 'driftfall_signalBeyond'
const FINALE_QUEST_NAME = 'The Signal Beyond'
const FINALE_QUEST_KEY = 'T10'

// --- Maps ------------------------------------------------------------------

// Void Approach (exterior, 24x18): a debris field of drifting wreckage
// around the flagship's hull breach - the only way in. Dense scatter of
// struts/debris/crates instead of open ground, plus a few notches bitten
// out of the border, so the field reads as a winding path through
// wreckage rather than an open rectangle.
const VOID_W = 24
const VOID_H = 18
const voidApproachTiles = makeGrid(VOID_W, VOID_H, 'driftfall_voidFloor')
setBorder(voidApproachTiles, 'driftfall_wall')
setTile(voidApproachTiles, 12, 0, 'door') // north: into the citadel
for (const [x, y] of [[2, 2], [2, 3], [21, 2], [21, 15], [2, 15], [22, 9]]) {
  setTile(voidApproachTiles, x, y, 'driftfall_wall')
}
const VOID_DEBRIS = [
  [5, 4], [6, 4], [5, 5], [18, 4], [17, 5], [8, 8], [9, 9], [15, 9], [16, 8],
  [4, 11], [5, 12], [19, 11], [18, 12], [11, 14], [12, 14],
]
for (const [x, y] of VOID_DEBRIS) setTile(voidApproachTiles, x, y, 'driftfall_debris')
for (const [x, y] of [[7, 7], [16, 11], [10, 5]]) setTile(voidApproachTiles, x, y, 'driftfall_strut')
for (const [x, y] of [[14, 6], [6, 13]]) setTile(voidApproachTiles, x, y, 'driftfall_brokenStrut')

export const ENTRY = { x: 12, y: 16 }

function kessaDialogue(state) {
  const q = state.quests[FINALE_QUEST_ID]
  if (!q) {
    startQuest(state, FINALE_QUEST_ID, FINALE_QUEST_NAME, FINALE_QUEST_KEY)
    return [
      "Kessa: You made it through the Hollow? Then you felt it too - that signal.",
      'Kessa: Find the array still broadcasting it, deeper in the wreckage. I\'ll meet you past the airlock.',
    ]
  }
  if (q.stage >= 1) {
    return ["Kessa: You found it. Whatever's calling, it's close now.", 'Kessa: The airlock north of here leads in. Stay sharp.']
  }
  return ['Kessa: Somewhere out past the debris - an array, still lit. Find it.']
}

const voidApproachMap = {
  name: 'Void Approach',
  width: VOID_W,
  height: VOID_H,
  tiles: voidApproachTiles,
  npcs: [
    {
      id: 'kessa',
      x: 11,
      y: 10,
      facing: 'down',
      spriteId: 'driftfall_kessa',
      watchesQuests: [FINALE_QUEST_ID],
      dialogue: kessaDialogue,
    },
    {
      id: 'soren',
      x: 20,
      y: 5,
      facing: 'left',
      spriteId: 'driftfall_soren',
      watchesQuests: ['driftfall_stuckCrate'],
      // Small side quest, self-contained in this one corner: no plot
      // stakes, just a few extra credits for poking around the wreckage.
      dialogue: (state) => {
        const q = state.quests['driftfall_stuckCrate']
        if (!q) {
          startQuest(state, 'driftfall_stuckCrate', "Soren's Stuck Crate", 'S6')
          return [
            "Soren: My own crate's wedged under a strut since we crashed through. Can't budge it alone.",
            'Soren: Pry it loose and we split what survived?',
          ]
        }
        if (q.complete) {
          return ["Soren: Still can't believe any of that made it through the crash."]
        }
        return ['Soren: Under the strut, east of here.']
      },
    },
  ],
  enemySpawns: [
    { id: 'void_sentinel1', x: 9, y: 6, enemyId: 'driftfall_voidSentinel', spriteId: 'driftfall_voidSentinel' },
    { id: 'void_reaper1', x: 17, y: 8, enemyId: 'driftfall_driftReaper', spriteId: 'driftfall_driftReaper' },
    { id: 'void_drone1', x: 6, y: 9, enemyId: 'driftfall_nullDrone', spriteId: 'driftfall_nullDrone' },
  ],
  secrets: [
    {
      id: 'voidDebrisStash',
      x: 14,
      y: 6,
      reward: { medkit: 1, resistTonic: 1 },
      dialogue: ['The broken strut shifts loose - a sealed cache!', 'Found a medkit and a Resistance Elixir!'],
    },
  ],
  items: [
    { id: 'signalArray', x: 19, y: 3, spriteId: 'driftfall_signalArray', hideWhenFlag: 'driftfall_arrayFound' },
    { id: 'stuckCrate', x: 21, y: 5, spriteId: 'driftfall_stuckCrate', hideWhenFlag: 'driftfall_stuckCrateFound' },
  ],
  warps: [{ x: 12, y: 0, toMap: 'citadelHalls', toX: 10, toY: 18 }],
  triggers: [
    {
      x: 19,
      y: 3,
      once: true,
      setsFlag: 'driftfall_arrayFound',
      onEnter(ctx) {
        if (!ctx.state.quests[FINALE_QUEST_ID]) {
          startQuest(ctx.state, FINALE_QUEST_ID, FINALE_QUEST_NAME, FINALE_QUEST_KEY)
        }
        setQuestStage(ctx.state, FINALE_QUEST_ID, 1)
        ctx.state.credits = (ctx.state.credits || 0) + 10
        ctx.showDialogue([
          'The array is still warm, still broadcasting - not Syndicate make at all.',
          "Wando: \"Whatever this is, it's older than the Hollow.\" (+10 credits)",
        ])
      },
    },
    {
      x: 21,
      y: 5,
      once: true,
      setsFlag: 'driftfall_stuckCrateFound',
      onEnter(ctx) {
        if (!ctx.state.quests['driftfall_stuckCrate']) {
          startQuest(ctx.state, 'driftfall_stuckCrate', "Soren's Stuck Crate", 'S6')
        }
        completeQuest(ctx.state, 'driftfall_stuckCrate')
        ctx.state.credits = (ctx.state.credits || 0) + 12
        ctx.showDialogue(['The strut gives way - Soren\'s crate, battered but sealed!', 'Soren splits the surviving stock with you. (+12 credits)'])
      },
    },
  ],
}

// Citadel Halls (interior, 22x20): a branching corridor instead of one big
// room - a south hub (entry/exit), a narrow corridor north, forking into
// a west wing (Tomas) and an east wing (Ren), before continuing on to the
// Command Sanctum. Built entirely from inward-walled rooms/corridors, not
// a resized rectangle, so every existing coordinate convention (border =
// edge row/col) still holds.
const HALLS_W = 22
const HALLS_H = 20
const citadelHallsTiles = makeGrid(HALLS_W, HALLS_H, 'driftfall_wall')
fillRect(citadelHallsTiles, 2, 12, 19, 18, 'driftfall_hullFloor') // south hub
fillRect(citadelHallsTiles, 10, 1, 11, 13, 'driftfall_hullFloor') // central corridor
fillRect(citadelHallsTiles, 2, 2, 8, 9, 'driftfall_hullFloor') // west wing
fillRect(citadelHallsTiles, 13, 2, 19, 9, 'driftfall_hullFloor') // east wing
setTile(citadelHallsTiles, 9, 5, 'driftfall_hullFloor') // west wing <-> corridor doorway
setTile(citadelHallsTiles, 12, 5, 'driftfall_hullFloor') // east wing <-> corridor doorway
setTile(citadelHallsTiles, 10, 18, 'door') // south: back to the Void Approach
setTile(citadelHallsTiles, 10, 0, 'door') // north: into the Command Sanctum
// Decorative clutter, clear of doorways/NPC/enemySpawn tiles.
for (const [x, y] of [[4, 4], [17, 4], [5, 15], [16, 15]]) {
  setTile(citadelHallsTiles, x, y, 'driftfall_strut')
}
for (const [x, y] of [[7, 7], [15, 7]]) {
  setTile(citadelHallsTiles, x, y, 'driftfall_consoleArray')
}
for (const [x, y] of [[3, 16], [18, 16]]) {
  setTile(citadelHallsTiles, x, y, 'driftfall_crateStack')
}

function tomasDialogue(state) {
  const q = state.quests[FINALE_QUEST_ID]
  if (!q) return ["Tomas: Careful. Whatever's running this place isn't Syndicate command."]
  if (q.complete) return ["Tomas: Null Herald's gone quiet. First real quiet I've felt in years."]
  if (q.stage >= 1) {
    const firstReport = !state.flags.has('driftfall_toldTomas')
    if (firstReport) {
      state.flags.add('driftfall_toldTomas')
      state.credits = (state.credits || 0) + 10
    }
    return [
      "Tomas: That array - I felt it the moment you activated it. Something old just woke up.",
      firstReport ? "Tomas: The Sanctum's north of here. Go carefully. (+10 credits)" : "Tomas: The Sanctum's north of here. Go carefully.",
    ]
  }
  return ["Tomas: Kessa sent you? Good. Find that signal source."]
}

const citadelHallsMap = {
  name: 'Citadel Halls',
  width: HALLS_W,
  height: HALLS_H,
  tiles: citadelHallsTiles,
  npcs: [
    {
      id: 'tomas',
      x: 5,
      y: 5,
      facing: 'down',
      spriteId: 'driftfall_tomas',
      watchesQuests: [FINALE_QUEST_ID],
      dialogue: tomasDialogue,
    },
    {
      id: 'ren',
      x: 16,
      y: 5,
      facing: 'down',
      spriteId: 'driftfall_ren',
      isMerchant: true,
      dialogue: ['Ren: Even out here, a merchant finds a way.', 'Ren: Medkits and elixirs, same as anywhere in the Drift.'],
    },
  ],
  enemySpawns: [
    { id: 'halls_sentinel1', x: 10, y: 9, enemyId: 'driftfall_voidSentinel', spriteId: 'driftfall_voidSentinel' },
    { id: 'halls_drone1', x: 6, y: 15, enemyId: 'driftfall_nullDrone', spriteId: 'driftfall_nullDrone' },
    { id: 'halls_reaper1', x: 15, y: 15, enemyId: 'driftfall_driftReaper', spriteId: 'driftfall_driftReaper' },
  ],
  secrets: [],
  warps: [
    { x: 10, y: 18, toMap: 'voidApproach', toX: 12, toY: 1 },
    { x: 10, y: 0, toMap: 'commandSanctum', toX: 4, toY: 17 },
  ],
  triggers: [],
}

// Command Sanctum (boss arena, 10x19): same chokepoint pattern as every
// other world's finale - a one-tile corridor feeding into a small arena,
// so the boss cannot be bypassed.
const CS_W = 10
const CS_H = 19
const commandSanctumTiles = []
for (let y = 0; y < CS_H; y++) {
  if (y === 0 || y === CS_H - 1) {
    commandSanctumTiles.push(Array(CS_W).fill('driftfall_wall'))
  } else if (y >= 1 && y <= 3) {
    commandSanctumTiles.push(['driftfall_wall', 'driftfall_wall', ...Array(6).fill('driftfall_coreFloor'), 'driftfall_wall', 'driftfall_wall'])
  } else if (y === 4) {
    commandSanctumTiles.push([...Array(4).fill('driftfall_wall'), 'driftfall_coreFloor', ...Array(5).fill('driftfall_wall')])
  } else if (y >= 5 && y <= 16) {
    commandSanctumTiles.push([...Array(4).fill('driftfall_wall'), 'driftfall_hullFloor', ...Array(5).fill('driftfall_wall')])
  } else {
    commandSanctumTiles.push([...Array(4).fill('driftfall_wall'), 'door', ...Array(5).fill('driftfall_wall')])
  }
}
for (const [x, y] of [[3, 7], [5, 7]]) setTile(commandSanctumTiles, x, y, 'driftfall_strut')
for (const [x, y] of [[3, 11], [5, 11]]) setTile(commandSanctumTiles, x, y, 'driftfall_consoleArray')
for (const [x, y] of [[3, 14], [5, 14]]) setTile(commandSanctumTiles, x, y, 'driftfall_brokenStrut')

const commandSanctumMap = {
  name: 'Command Sanctum',
  width: CS_W,
  height: CS_H,
  tiles: commandSanctumTiles,
  npcs: [],
  enemySpawns: [
    { id: 'sanctum_sentinel1', x: 4, y: 9, enemyId: 'driftfall_voidSentinel', spriteId: 'driftfall_voidSentinel' },
    { id: 'sanctum_drone1', x: 4, y: 13, enemyId: 'driftfall_nullDrone', spriteId: 'driftfall_nullDrone' },
    // Final boss - a visible spawn like every other enemy here, not a
    // one-shot Trigger, so losing and retrying from the pre-fight
    // checkpoint re-engages it the same way (see theHollow.js's own fix).
    {
      id: 'sanctum_boss',
      x: 4,
      y: 4,
      enemyId: 'driftfall_nullHerald',
      spriteId: 'driftfall_nullHerald',
      leadInDialogue: [
        'The corridor opens on a chamber with no walls that stay still - light bends wrong here.',
        'At its center, a shape that is not quite a shape at all turns to face you.',
        '"EVERY CURRENT RETURNS TO ITS SOURCE," it says, in a voice like static. "YOU WILL TOO."',
        'Gogu grips Wando\'s arm. "That\'s what the Syndicate was listening to, all along."',
      ],
      onVictory: (state, ctx) => {
        completeQuest(state, FINALE_QUEST_ID)
        state.credits = (state.credits || 0) + 60
        state.flags.add('gameCompleted')
        ctx.showDialogue(
          [
            'The Herald unravels into drifting motes of light, and the static finally goes quiet.',
            "Salvaging what's left of the flagship is worth a fortune back at the Starskiff. (+60 credits)",
            'Gogu breathes out, slow. "It\'s not angry anymore. It\'s just... tired. Like it\'s been running a long time."',
            'Wando lowers his shield. "Then let it rest. We\'re done hunting, and so is it."',
            "Rell, Vex, Kessa, Tomas, Soren - everyone this road ever crossed - get to wake up tomorrow without the Syndicate watching.",
            '"Come on, Gogu," Wando says. "Let\'s go see what the Drift looks like, now that nothing\'s hunting it."',
            'THE END — head back to the Starskiff to revisit any world of the Drift.',
          ],
          () => ctx.openShip()
        )
      },
    },
  ],
  secrets: [],
  // Return trip back to citadelHalls: lands on the entry 'door' tile
  // itself (4, 17), same reasoning as every other world's bidirectional
  // warp pairs (arriving never re-triggers it, only a later move onto it
  // does).
  warps: [{ x: 4, y: 17, toMap: 'citadelHalls', toX: 10, toY: 1 }],
  triggers: [],
}

export const driftfallWorld = {
  id: 'driftfall',
  name: 'Driftfall',
  startMap: 'voidApproach',
  entry: ENTRY,
  maps: {
    voidApproach: voidApproachMap,
    citadelHalls: citadelHallsMap,
    commandSanctum: commandSanctumMap,
  },
}

registerWorld(driftfallWorld)
