import { registerWorld, unlockNextWorld } from './registry.js'
import { registerTileTypes } from '../assets/tiles.js'
import { registerSprites } from '../assets/sprites/registry.js'
import { buildSprite, HUMANOID_TEMPLATE, ARMORED_TEMPLATE, ROBOT_TEMPLATE } from '../assets/spriteTemplates.js'
import { registerEnemies } from '../battle/enemies.js'
import { registerMoves } from '../battle/moves.js'
import { startQuest, setQuestStage, completeQuest } from '../data/gameState.js'

function fillRow(width, id) {
  return Array(width).fill(id)
}

// Grid-builder helpers used below so the bigger maps can be assembled by
// carving/stamping regions instead of hand-counting array literals.
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

/**
 * World 3 — Ashvault Station: the Hollow Syndicate's industrial foothold,
 * where they are building a "Current Extractor" to drain Gogu's power at
 * scale. Four connected maps: an exterior ship-graveyard approach, a
 * habitation ring (hub) of workers living under Syndicate control, a
 * maze-like engine core with a quest-gated vault corridor, and the
 * Extractor vault itself as the boss arena. Enemies stand visibly on the
 * map (enemySpawns) instead of rolling random encounters.
 */

// --- Cold industrial tile set, namespaced to avoid collisions with other
// worlds being built in parallel. ---
const STEEL = '#7a828f'
const STEEL_DARK = '#4a515c'
const VOID_BLACK = '#14161c'
const RUST_ORANGE = '#b3522b'
const RUST_DARK = '#6e3015'
const WARNING_YELLOW = '#e3b23c'
const EMBER_RED = '#e0564b'
const COOLANT_TEAL = '#3c8f8a'
const CIVILIAN_GREY = '#8a8f99'
const CIVILIAN_DARK = '#565b63'

registerTileTypes({
  ashvault_metalFloor: { color: STEEL, dither: STEEL_DARK, walkable: true },
  ashvault_gratedFloor: { color: '#5c6472', dither: VOID_BLACK, walkable: true },
  ashvault_hazardStripe: { color: WARNING_YELLOW, dither: VOID_BLACK, walkable: true },
  ashvault_rustFloor: { color: RUST_ORANGE, dither: RUST_DARK, walkable: true, encounter: true },
  // Exterior-only tiles for the Docking Approach.
  ashvault_hullPlate: { color: '#23262e', walkable: false },
  ashvault_wreckage: { color: RUST_DARK, dither: VOID_BLACK, walkable: false },
  ashvault_voidGap: { color: VOID_BLACK, walkable: false },
  // Decorative, mostly-unwalkable clutter for the bigger maps.
  ashvault_cargoCrate: { color: '#8a5a2e', dither: '#5c3a1c', walkable: false },
  ashvault_supportPillar: { color: '#555f6e', dither: '#2e343d', walkable: false },
  ashvault_warningBarrier: { color: '#d9a62c', dither: VOID_BLACK, walkable: false },
  ashvault_brokenMachinery: { color: '#6b7280', dither: '#3a3f47', walkable: false },
  ashvault_hullBreach: { color: '#223044', dither: VOID_BLACK, walkable: false },
})

// --- Sprites, built from the shared humanoid silhouette with a cold,
// corroded Syndicate color legend (or, for workers/civilians, a plainer
// muted legend). ---
const dockHandSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: STEEL_DARK,
  V: VOID_BLACK,
  T: WARNING_YELLOW,
  A: STEEL,
  L: VOID_BLACK,
})

const technicianSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#5c6472',
  V: VOID_BLACK,
  T: RUST_ORANGE,
  A: '#3d434d',
  L: VOID_BLACK,
})

const cinderTrooperSprite = buildSprite(ARMORED_TEMPLATE, {
  H: VOID_BLACK,
  F: EMBER_RED,
  S: '#3a3f47',
  T: WARNING_YELLOW,
  A: '#3a3f47',
  L: VOID_BLACK,
})

const foremanSprite = buildSprite(ARMORED_TEMPLATE, {
  H: VOID_BLACK,
  F: EMBER_RED,
  S: STEEL_DARK,
  T: WARNING_YELLOW,
  A: STEEL_DARK,
  L: VOID_BLACK,
})

const scrapRunnerSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: CIVILIAN_DARK,
  V: VOID_BLACK,
  T: RUST_ORANGE,
  A: CIVILIAN_GREY,
  L: VOID_BLACK,
})

const restingWorkerSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: CIVILIAN_DARK,
  V: VOID_BLACK,
  T: STEEL,
  A: CIVILIAN_GREY,
  L: VOID_BLACK,
})

const tamsinSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#6b4a3a',
  V: VOID_BLACK,
  T: CIVILIAN_GREY,
  A: '#4a3528',
  L: VOID_BLACK,
})

const ventTechSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: STEEL_DARK,
  V: VOID_BLACK,
  T: COOLANT_TEAL,
  A: '#3d434d',
  L: VOID_BLACK,
})

const scrapLurkerSprite = buildSprite(ROBOT_TEMPLATE, {
  N: RUST_DARK,
  H: RUST_DARK,
  O: EMBER_RED,
  T: CIVILIAN_GREY,
  A: RUST_ORANGE,
  L: VOID_BLACK,
})

const reclaimerDroneSprite = buildSprite(ROBOT_TEMPLATE, {
  N: COOLANT_TEAL,
  H: COOLANT_TEAL,
  O: VOID_BLACK,
  T: STEEL,
  A: '#2c4a47',
  L: VOID_BLACK,
})

registerSprites({
  ashvault_dockHand: dockHandSprite,
  ashvault_technician: technicianSprite,
  ashvault_cinderTrooper: cinderTrooperSprite,
  ashvault_foreman: foremanSprite,
  ashvault_scrapRunner: scrapRunnerSprite,
  ashvault_restingWorker: restingWorkerSprite,
  ashvault_tamsin: tamsinSprite,
  ashvault_ventTech: ventTechSprite,
  ashvault_scrapLurker: scrapLurkerSprite,
  ashvault_reclaimerDrone: reclaimerDroneSprite,
})

// --- Moves ---
registerMoves({
  ashvault_shockBaton: { name: 'Shock Baton', kind: 'attack', power: 7, focusCost: 0, accuracy: 0.9 },
  ashvault_overloadVent: { name: 'Overload Vent', kind: 'attack', power: 13, focusCost: 3, accuracy: 0.8 },
  ashvault_chainLash: { name: 'Chain Lash', kind: 'attack', power: 9, focusCost: 1, accuracy: 0.9 },
  ashvault_rustedClaw: { name: 'Rusted Claw', kind: 'attack', power: 10, focusCost: 0, accuracy: 0.85 },
  ashvault_dronePulse: { name: 'Drone Pulse', kind: 'attack', power: 12, focusCost: 0, accuracy: 0.8 },
})

// --- Enemies ---
// Balance target for this chapter: regular enemies 34-44 HP, boss 100-125 HP
// (buffed up from the v1 Foreman's 82).
registerEnemies({
  ashvault_cinderTrooper: {
    name: 'Cinder Trooper',
    spriteId: 'ashvault_cinderTrooper',
    maxHp: 40,
    atk: 10,
    def: 5,
    spd: 5,
    moves: ['ashvault_shockBaton', 'ashvault_chainLash'],
    xpReward: 30,
  },
  ashvault_scrapLurker: {
    name: 'Scrap Lurker',
    spriteId: 'ashvault_scrapLurker',
    maxHp: 36,
    atk: 11,
    def: 4,
    spd: 7,
    moves: ['ashvault_rustedClaw', 'ashvault_shockBaton'],
    xpReward: 28,
  },
  ashvault_reclaimerDrone: {
    name: 'Reclaimer Drone',
    spriteId: 'ashvault_reclaimerDrone',
    maxHp: 44,
    atk: 9,
    def: 7,
    spd: 4,
    moves: ['ashvault_dronePulse', 'ashvault_overloadVent'],
    xpReward: 32,
  },
  ashvault_foreman: {
    name: 'Syndicate Foreman',
    spriteId: 'ashvault_foreman',
    maxHp: 115,
    atk: 16,
    def: 8,
    spd: 6,
    moves: ['forgeSlam', 'ashvault_overloadVent', 'ashvault_chainLash'],
    xpReward: 95,
    isBoss: true,
  },
})

// --- Maps ---

// Docking Approach (exterior, 26x20): a ship graveyard of derelict hulls
// clustered around the station's outer platforms. Hull plating (non-walkable)
// borders the yard; wreckage, void gaps, cargo crates, support pillars,
// warning barriers and broken machinery break up the open ground. An
// airlock door (13,1) leads up into the Habitation Ring.
const dockingApproachTiles = makeGrid(26, 20, 'ashvault_metalFloor')
fillRect(dockingApproachTiles, 0, 0, 25, 0, 'ashvault_hullPlate')
fillRect(dockingApproachTiles, 0, 19, 25, 19, 'ashvault_hullPlate')
fillRect(dockingApproachTiles, 0, 0, 0, 19, 'ashvault_hullPlate')
fillRect(dockingApproachTiles, 25, 0, 25, 19, 'ashvault_hullPlate')
setTile(dockingApproachTiles, 13, 1, 'door')

fillRect(dockingApproachTiles, 1, 4, 24, 4, 'ashvault_gratedFloor')
fillRect(dockingApproachTiles, 1, 5, 24, 6, 'ashvault_rustFloor')
fillRect(dockingApproachTiles, 1, 7, 24, 7, 'ashvault_gratedFloor')
fillRect(dockingApproachTiles, 1, 10, 24, 10, 'ashvault_hazardStripe')
fillRect(dockingApproachTiles, 1, 14, 24, 14, 'ashvault_gratedFloor')

fillRect(dockingApproachTiles, 5, 6, 6, 6, 'ashvault_wreckage')
fillRect(dockingApproachTiles, 19, 6, 20, 6, 'ashvault_wreckage')
setTile(dockingApproachTiles, 4, 7, 'ashvault_voidGap')
setTile(dockingApproachTiles, 5, 7, 'ashvault_voidGap')
setTile(dockingApproachTiles, 20, 7, 'ashvault_voidGap')
setTile(dockingApproachTiles, 21, 7, 'ashvault_voidGap')
fillRect(dockingApproachTiles, 2, 9, 3, 9, 'ashvault_cargoCrate')
fillRect(dockingApproachTiles, 21, 9, 22, 9, 'ashvault_cargoCrate')
setTile(dockingApproachTiles, 9, 12, 'ashvault_supportPillar')
setTile(dockingApproachTiles, 17, 12, 'ashvault_supportPillar')
fillRect(dockingApproachTiles, 4, 10, 4, 11, 'ashvault_warningBarrier')
fillRect(dockingApproachTiles, 21, 10, 21, 11, 'ashvault_warningBarrier')
fillRect(dockingApproachTiles, 3, 16, 3, 17, 'ashvault_brokenMachinery')
fillRect(dockingApproachTiles, 22, 16, 22, 17, 'ashvault_brokenMachinery')
setTile(dockingApproachTiles, 2, 2, 'ashvault_hullBreach')
setTile(dockingApproachTiles, 23, 2, 'ashvault_hullBreach')

// Habitation Ring (hub, 20x18): where Syndicate-controlled workers live.
// South door (10,17) back to the Docking Approach, east door (19,8) down
// into the Engine Core.
const habitationRingTiles = makeGrid(20, 18, 'ashvault_metalFloor')
fillRect(habitationRingTiles, 0, 0, 19, 0, 'wall')
fillRect(habitationRingTiles, 0, 17, 19, 17, 'wall')
fillRect(habitationRingTiles, 0, 0, 0, 17, 'wall')
fillRect(habitationRingTiles, 19, 0, 19, 17, 'wall')
setTile(habitationRingTiles, 10, 17, 'door')
setTile(habitationRingTiles, 19, 8, 'door')

fillRect(habitationRingTiles, 1, 3, 18, 3, 'ashvault_gratedFloor')
fillRect(habitationRingTiles, 1, 9, 18, 9, 'ashvault_gratedFloor')
fillRect(habitationRingTiles, 1, 13, 18, 13, 'ashvault_hazardStripe')

fillRect(habitationRingTiles, 6, 5, 6, 6, 'ashvault_supportPillar')
fillRect(habitationRingTiles, 14, 5, 14, 6, 'ashvault_supportPillar')
fillRect(habitationRingTiles, 3, 11, 4, 11, 'ashvault_cargoCrate')
fillRect(habitationRingTiles, 15, 11, 16, 11, 'ashvault_cargoCrate')
fillRect(habitationRingTiles, 8, 15, 9, 15, 'ashvault_warningBarrier')
setTile(habitationRingTiles, 2, 2, 'ashvault_brokenMachinery')
setTile(habitationRingTiles, 17, 2, 'ashvault_brokenMachinery')

// Engine Core (depths, 24x24): maze-like industrial corridors. Entrance
// hall -> narrow neck -> junction room (Tamsin's restraint pit) -> narrow
// neck -> pre-vault chamber (schematics console) -> a one-tile blast door
// chokepoint, soft-gated until the console has been read -> vault
// antechamber -> south door into the Extractor Vault (boss arena).
const engineCoreTiles = makeGrid(24, 24, 'ashvault_metalFloor')
fillRect(engineCoreTiles, 0, 0, 23, 0, 'wall')
fillRect(engineCoreTiles, 0, 23, 23, 23, 'wall')
fillRect(engineCoreTiles, 0, 0, 0, 23, 'wall')
fillRect(engineCoreTiles, 23, 0, 23, 23, 'wall')
setTile(engineCoreTiles, 1, 1, 'door')
setTile(engineCoreTiles, 12, 23, 'door')

fillRect(engineCoreTiles, 1, 3, 22, 3, 'ashvault_gratedFloor')
fillRect(engineCoreTiles, 1, 8, 22, 8, 'ashvault_gratedFloor')
fillRect(engineCoreTiles, 1, 13, 22, 13, 'ashvault_hazardStripe')
fillRect(engineCoreTiles, 1, 19, 22, 19, 'ashvault_gratedFloor')

// First narrow neck — bottleneck between the entrance hall and the
// junction room where Tamsin is held.
fillRect(engineCoreTiles, 1, 5, 22, 5, 'wall')
fillRect(engineCoreTiles, 1, 6, 22, 6, 'wall')
fillRect(engineCoreTiles, 9, 5, 11, 5, 'ashvault_metalFloor')
fillRect(engineCoreTiles, 9, 6, 11, 6, 'ashvault_metalFloor')

// Second narrow neck — bottleneck between the junction room and the
// pre-vault console chamber.
fillRect(engineCoreTiles, 1, 11, 22, 11, 'wall')
fillRect(engineCoreTiles, 1, 12, 22, 12, 'wall')
fillRect(engineCoreTiles, 9, 11, 11, 11, 'ashvault_rustFloor')
fillRect(engineCoreTiles, 9, 12, 11, 12, 'ashvault_rustFloor')

// Blast-door chokepoint — the single tile connecting the console chamber
// to the vault antechamber. Soft-gated by a trigger below (see triggers),
// since map tiles can't be conditionally walkable — stays a true
// bottleneck even on the bigger map.
fillRect(engineCoreTiles, 1, 16, 22, 16, 'wall')
setTile(engineCoreTiles, 12, 16, 'ashvault_metalFloor')

// Decoration: support struts, crates, machinery, warning barriers.
setTile(engineCoreTiles, 19, 2, 'ashvault_supportPillar')
setTile(engineCoreTiles, 3, 4, 'ashvault_supportPillar')
fillRect(engineCoreTiles, 20, 9, 21, 9, 'ashvault_cargoCrate')
fillRect(engineCoreTiles, 6, 14, 7, 14, 'ashvault_cargoCrate')
setTile(engineCoreTiles, 15, 18, 'ashvault_brokenMachinery')
setTile(engineCoreTiles, 9, 21, 'ashvault_brokenMachinery')
fillRect(engineCoreTiles, 11, 19, 11, 20, 'ashvault_warningBarrier')

// Extractor Vault (boss arena, 15x14): a narrow one-tile-wide corridor
// funnels straight from the sealed door into the vault chamber, same
// proven chokepoint pattern as theHollow.js, so the Foreman fight cannot
// be skipped.
const extractorVaultTiles = makeGrid(15, 14, 'wall')
fillRect(extractorVaultTiles, 2, 1, 12, 5, 'ashvault_rustFloor')
fillRect(extractorVaultTiles, 7, 6, 7, 10, 'ashvault_metalFloor')
fillRect(extractorVaultTiles, 6, 11, 8, 11, 'ashvault_metalFloor')
setTile(extractorVaultTiles, 7, 12, 'door')
setTile(extractorVaultTiles, 3, 2, 'ashvault_cargoCrate')
setTile(extractorVaultTiles, 11, 2, 'ashvault_cargoCrate')
setTile(extractorVaultTiles, 3, 4, 'ashvault_supportPillar')
setTile(extractorVaultTiles, 11, 4, 'ashvault_supportPillar')

// Ship lands on the open platform in the Docking Approach yard.
export const ENTRY = { x: 13, y: 18 }

export const ashvaultStationWorld = {
  id: 'ashvaultStation',
  name: 'Ashvault Station',
  startMap: 'dockingApproach',
  entry: ENTRY,
  maps: {
    dockingApproach: {
      width: 26,
      height: 20,
      tiles: dockingApproachTiles,
      npcs: [
        {
          id: 'scrapRunner',
          x: 5,
          y: 12,
          facing: 'down',
          spriteId: 'ashvault_scrapRunner',
          dialogue: [
            "Ships that ran the blockade didn't make it past this yard.",
            "Mind the grating — some of it's rusted clean through.",
            "That support pillar near the middle sounds hollow when you knock it.",
          ],
        },
      ],
      enemySpawns: [
        { id: 'dock_cinder1', x: 18, y: 5, enemyId: 'ashvault_cinderTrooper', spriteId: 'ashvault_cinderTrooper' },
        { id: 'dock_lurker1', x: 8, y: 9, enemyId: 'ashvault_scrapLurker', spriteId: 'ashvault_scrapLurker' },
        { id: 'dock_cinder2', x: 20, y: 13, enemyId: 'ashvault_cinderTrooper', spriteId: 'ashvault_cinderTrooper' },
        { id: 'dock_lurker2', x: 13, y: 9, enemyId: 'ashvault_scrapLurker', spriteId: 'ashvault_scrapLurker' },
      ],
      secrets: [
        {
          id: 'dockPillarStash',
          x: 9,
          y: 12,
          reward: { medkit: 1, tonic: 1 },
          dialogue: ['The pillar panel pops loose — a smuggler stash!', 'Found a medkit and a tonic!'],
        },
      ],
      warps: [{ x: 13, y: 1, toMap: 'habitationRing', toX: 10, toY: 16 }],
      triggers: [
        {
          x: 4,
          y: 3,
          once: true,
          setsFlag: 'ashvault_scrapCacheFound',
          onEnter(ctx) {
            ctx.state.inventory.medkit = (ctx.state.inventory.medkit || 0) + 1
            ctx.showDialogue(['A sealed supply case, wedged in the wreckage.', 'Found a medkit!'])
          },
        },
      ],
    },
    habitationRing: {
      width: 20,
      height: 18,
      tiles: habitationRingTiles,
      npcs: [
        {
          id: 'dockHand',
          x: 3,
          y: 2,
          facing: 'down',
          spriteId: 'ashvault_dockHand',
          watchesQuests: ['ashvault_tamsinRescue'],
          dialogue: (state) => {
            const quest = state.quests['ashvault_tamsinRescue']
            if (!quest) {
              startQuest(state, 'ashvault_tamsinRescue', 'Free Tamsin', 'T5')
              return ["They've chained Tamsin in the engine core.", 'Find the release switch and free her.']
            }
            if (quest.complete) {
              return ["Thanks to you, Tamsin's safe now.", 'Watch yourself deeper in the core.']
            }
            if (quest.stage >= 1) {
              completeQuest(state, 'ashvault_tamsinRescue')
              state.inventory.medkit = (state.inventory.medkit || 0) + 1
              return ["You freed her. I won't forget it.", 'Found a medkit!']
            }
            return ["She's deep in the core — watch for patrols."]
          },
        },
        {
          id: 'technician',
          x: 12,
          y: 4,
          facing: 'down',
          spriteId: 'ashvault_technician',
          watchesQuests: ['ashvault_extractorSabotage'],
          dialogue: (state) => {
            const quest = state.quests['ashvault_extractorSabotage']
            if (!quest) {
              startQuest(state, 'ashvault_extractorSabotage', 'The Current Extractor', 'T6')
              return ["They built a device to drain Gogu's Current.", 'Find the schematics console and confirm it.']
            }
            if (quest.complete) {
              return ["The Extractor's slag now — it's over.", "Skyreach Canopy's next. They'll be there too."]
            }
            if (quest.stage >= 1) {
              return ['So the schematics confirm it — built for Gogu.', 'The vault door should open now. Hurry.']
            }
            return ["Find the console. Don't touch the Extractor yet."]
          },
        },
        {
          id: 'restingWorker',
          x: 5,
          y: 10,
          facing: 'up',
          spriteId: 'ashvault_restingWorker',
          dialogue: [
            "They call our shifts 'labor debt' — debt to who?",
            "The Syndicate doesn't trust strangers — neither do I, yet.",
          ],
        },
      ],
      enemySpawns: [
        { id: 'ring_cinder1', x: 8, y: 2, enemyId: 'ashvault_cinderTrooper', spriteId: 'ashvault_cinderTrooper' },
        { id: 'ring_drone1', x: 16, y: 9, enemyId: 'ashvault_reclaimerDrone', spriteId: 'ashvault_reclaimerDrone' },
        { id: 'ring_cinder2', x: 6, y: 14, enemyId: 'ashvault_cinderTrooper', spriteId: 'ashvault_cinderTrooper' },
      ],
      warps: [
        { x: 10, y: 17, toMap: 'dockingApproach', toX: 13, toY: 2 },
        { x: 19, y: 8, toMap: 'engineCore', toX: 2, toY: 1 },
      ],
      triggers: [],
    },
    engineCore: {
      width: 24,
      height: 24,
      tiles: engineCoreTiles,
      npcs: [
        {
          id: 'ventTech',
          x: 14,
          y: 2,
          facing: 'down',
          spriteId: 'ashvault_ventTech',
          dialogue: [
            "Core's been running hot since they powered that thing up.",
            "Mind the grated floors — some won't hold your weight.",
          ],
        },
        {
          id: 'tamsin',
          x: 3,
          y: 9,
          facing: 'right',
          spriteId: 'ashvault_tamsin',
          watchesFlags: ['ashvault_tamsinFreed'],
          dialogue: (state) => {
            if (state.flags.has('ashvault_tamsinFreed')) {
              return ["Tell the dock hand I'm out.", "I won't forget who freed me."]
            }
            return ["This restraint field's held me since the strike.", "There's a release switch south of here."]
          },
        },
      ],
      enemySpawns: [
        { id: 'core_cinder1', x: 6, y: 2, enemyId: 'ashvault_cinderTrooper', spriteId: 'ashvault_cinderTrooper' },
        { id: 'core_lurker1', x: 18, y: 4, enemyId: 'ashvault_scrapLurker', spriteId: 'ashvault_scrapLurker' },
        { id: 'core_drone1', x: 16, y: 9, enemyId: 'ashvault_reclaimerDrone', spriteId: 'ashvault_reclaimerDrone' },
        { id: 'core_cinder2', x: 8, y: 14, enemyId: 'ashvault_cinderTrooper', spriteId: 'ashvault_cinderTrooper' },
        { id: 'core_lurker2', x: 18, y: 18, enemyId: 'ashvault_scrapLurker', spriteId: 'ashvault_scrapLurker' },
      ],
      warps: [
        { x: 1, y: 1, toMap: 'habitationRing', toX: 18, toY: 8 },
        { x: 12, y: 23, toMap: 'extractorVault', toX: 7, toY: 12 },
      ],
      triggers: [
        {
          x: 4,
          y: 10,
          once: true,
          setsFlag: 'ashvault_tamsinFreed',
          onEnter(ctx) {
            if (!ctx.state.quests['ashvault_tamsinRescue']) {
              startQuest(ctx.state, 'ashvault_tamsinRescue', 'Free Tamsin', 'T5')
            }
            setQuestStage(ctx.state, 'ashvault_tamsinRescue', 1)
            ctx.showDialogue(["You trip the release — the field drops, Tamsin's free.", '"Go, before they notice!"'])
          },
        },
        {
          x: 4,
          y: 13,
          once: true,
          setsFlag: 'ashvault_extractorConfirmed',
          onEnter(ctx) {
            if (!ctx.state.quests['ashvault_extractorSabotage']) {
              startQuest(ctx.state, 'ashvault_extractorSabotage', 'The Current Extractor', 'T6')
            }
            setQuestStage(ctx.state, 'ashvault_extractorSabotage', 1)
            ctx.showDialogue(["The schematics are keyed to Gogu's signature.", 'The vault door should open now.'])
          },
        },
        {
          // One-tile blast-door chokepoint. Soft-gated behind the
          // 'ashvault_extractorConfirmed' flag set by the console trigger
          // above: until it's set, stepping here bounces the player back
          // instead of letting them through, since map tiles themselves
          // can't be conditionally walkable.
          x: 12,
          y: 16,
          once: false,
          onEnter(ctx) {
            if (!ctx.state.flags.has('ashvault_extractorConfirmed')) {
              ctx.showDialogue(['A sealed blast door blinks: VERIFICATION REQUIRED.', 'You need proof first.'])
              ctx.warpTo({ toMap: 'engineCore', toX: 12, toY: 15 })
            }
          },
        },
      ],
    },
    extractorVault: {
      width: 15,
      height: 14,
      tiles: extractorVaultTiles,
      npcs: [],
      enemySpawns: [],
      warps: [],
      triggers: [
        // Mandatory boss encounter: the only tile connecting the corridor
        // to the vault chamber, so it cannot be bypassed (see map comment
        // above). once:true so re-entering after the fight doesn't replay
        // the lead-in or restart the battle.
        {
          x: 7,
          y: 5,
          once: true,
          setsFlag: 'ashvault_bossEngaged',
          onEnter(ctx) {
            ctx.showDialogue(
              [
                'The Extractor hums behind the Foreman, half-built.',
                '"The device stays. You don\'t," he growls.',
                'Wando steps forward. "Try it."',
              ],
              () => {
                ctx.startBattle(['ashvault_foreman'], {
                  onVictory: (state) => {
                    const nextWorldId = unlockNextWorld(state, 'ashvaultStation')
                    completeQuest(state, 'ashvault_extractorSabotage')
                    ctx.showDialogue(
                      [
                        'The Foreman falls — the Extractor sparks and dies.',
                        'Gogu breathes out: "It\'s gone quiet."',
                        'Head back to the Starskiff for Skyreach Canopy.',
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

registerWorld(ashvaultStationWorld)
