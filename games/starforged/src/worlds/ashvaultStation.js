import { registerWorld } from './registry.js'
import { registerTileTypes } from '../assets/tiles.js'
import { registerSprites } from '../assets/sprites/registry.js'
import { buildSprite, HUMANOID_TEMPLATE } from '../assets/spriteTemplates.js'
import { registerEnemies } from '../battle/enemies.js'
import { registerMoves } from '../battle/moves.js'

function fillRow(width, id) {
  return Array(width).fill(id)
}

// --- Cold industrial tile set, namespaced to avoid collisions with other
// worlds being built in parallel. ---
const STEEL = '#7a828f'
const STEEL_DARK = '#4a515c'
const VOID_BLACK = '#14161c'
const RUST_ORANGE = '#b3522b'
const RUST_DARK = '#6e3015'
const WARNING_YELLOW = '#e3b23c'
const EMBER_RED = '#e0564b'

registerTileTypes({
  ashvault_metalFloor: { color: STEEL, dither: STEEL_DARK, walkable: true },
  ashvault_gratedFloor: { color: '#5c6472', dither: VOID_BLACK, walkable: true },
  ashvault_hazardStripe: { color: WARNING_YELLOW, dither: VOID_BLACK, walkable: true },
  ashvault_rustFloor: { color: RUST_ORANGE, dither: RUST_DARK, walkable: true, encounter: true },
})

// --- Sprites, built from the shared humanoid silhouette with a cold,
// corroded Syndicate color legend. ---
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

const cinderTrooperSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: VOID_BLACK,
  V: EMBER_RED,
  T: WARNING_YELLOW,
  A: '#3a3f47',
  L: VOID_BLACK,
})

const foremanSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: VOID_BLACK,
  V: EMBER_RED,
  T: WARNING_YELLOW,
  A: STEEL_DARK,
  L: VOID_BLACK,
})

registerSprites({
  ashvault_dockHand: dockHandSprite,
  ashvault_technician: technicianSprite,
  ashvault_cinderTrooper: cinderTrooperSprite,
  ashvault_foreman: foremanSprite,
})

// --- Moves ---
registerMoves({
  ashvault_shockBaton: { name: 'Shock Baton', kind: 'attack', power: 7, focusCost: 0, accuracy: 0.9 },
  ashvault_overloadVent: { name: 'Overload Vent', kind: 'attack', power: 13, focusCost: 3, accuracy: 0.8 },
  ashvault_chainLash: { name: 'Chain Lash', kind: 'attack', power: 9, focusCost: 1, accuracy: 0.9 },
})

// --- Enemies ---
registerEnemies({
  ashvault_cinderTrooper: {
    name: 'Cinder Trooper',
    spriteId: 'ashvault_cinderTrooper',
    maxHp: 38,
    atk: 9,
    def: 4,
    spd: 5,
    moves: ['ashvault_shockBaton'],
    xpReward: 25,
  },
  ashvault_foreman: {
    name: 'Syndicate Foreman',
    spriteId: 'ashvault_foreman',
    maxHp: 82,
    atk: 13,
    def: 6,
    spd: 5,
    moves: ['forgeSlam', 'ashvault_overloadVent', 'ashvault_chainLash'],
    xpReward: 70,
    isBoss: true,
  },
})

// --- Maps ---
const hangarBayTiles = [
  fillRow(12, 'wall'),
  ['wall', ...fillRow(10, 'ashvault_metalFloor'), 'wall'],
  ['wall', ...fillRow(10, 'ashvault_gratedFloor'), 'wall'],
  ['wall', ...fillRow(4, 'ashvault_metalFloor'), ...fillRow(2, 'ashvault_hazardStripe'), ...fillRow(4, 'ashvault_metalFloor'), 'wall'],
  ['wall', ...fillRow(10, 'ashvault_metalFloor'), 'wall'],
  ['wall', ...fillRow(10, 'ashvault_gratedFloor'), 'wall'],
  ['wall', ...fillRow(10, 'ashvault_metalFloor'), 'wall'],
  ['wall', ...fillRow(4, 'ashvault_metalFloor'), 'door', ...fillRow(5, 'ashvault_metalFloor'), 'wall'],
  fillRow(12, 'wall'),
]

const engineCoreTiles = [
  fillRow(8, 'wall'),
  ['wall', 'door', ...fillRow(5, 'ashvault_metalFloor'), 'wall'],
  ['wall', ...fillRow(6, 'ashvault_metalFloor'), 'wall'],
  ['wall', ...fillRow(6, 'ashvault_gratedFloor'), 'wall'],
  ['wall', ...fillRow(6, 'ashvault_rustFloor'), 'wall'],
  ['wall', ...fillRow(6, 'ashvault_rustFloor'), 'wall'],
  ['wall', ...fillRow(6, 'ashvault_rustFloor'), 'wall'],
  ['wall', ...fillRow(6, 'ashvault_metalFloor'), 'wall'],
  ['wall', 'wall', 'wall', 'ashvault_metalFloor', 'ashvault_metalFloor', 'wall', 'wall', 'wall'],
  ['wall', 'wall', 'wall', 'wall', 'ashvault_metalFloor', 'wall', 'wall', 'wall'],
  ['wall', ...fillRow(6, 'ashvault_hazardStripe'), 'wall'],
  fillRow(8, 'wall'),
]

export const ENTRY = { x: 6, y: 2 }

export const ashvaultStationWorld = {
  id: 'ashvaultStation',
  name: 'Ashvault Station',
  startMap: 'hangarBay',
  entry: ENTRY,
  maps: {
    hangarBay: {
      width: 12,
      height: 9,
      tiles: hangarBayTiles,
      npcs: [
        {
          id: 'dockHand',
          x: 2,
          y: 4,
          facing: 'down',
          spriteId: 'ashvault_dockHand',
          dialogue: [
            "Ashvault's been Syndicate-held since the refinery strike. Mind the catwalks — the grating's half rusted through.",
            'A tagged ship docked in bay three. Hollow crew, hauling cargo nobody talks about.',
            "If you're pushing into the engine core, watch for their foreman. He doesn't ask twice.",
          ],
        },
      ],
      encounterZones: [],
      warps: [{ x: 5, y: 7, toMap: 'engineCore', toX: 1, toY: 2 }],
      triggers: [],
    },
    engineCore: {
      width: 8,
      height: 12,
      tiles: engineCoreTiles,
      npcs: [
        {
          id: 'technician',
          x: 2,
          y: 2,
          facing: 'down',
          spriteId: 'ashvault_technician',
          dialogue: [
            "They rerouted the core's output weeks ago. Something in this station runs hotter than it should.",
            "Moss flinched when we passed the old vault door. Whatever they're feeding the Current down here, it isn't natural.",
            "Keep moving. The foreman patrols this corridor, and he's not the forgiving type.",
          ],
        },
      ],
      encounterZones: [{ x: 1, y: 4, w: 6, h: 3, chance: 0.18, enemyIds: ['ashvault_cinderTrooper'] }],
      warps: [{ x: 1, y: 1, toMap: 'hangarBay', toX: 5, toY: 6 }],
      triggers: [
        {
          x: 3,
          y: 7,
          once: true,
          setsFlag: 'ashvault_medkitFound',
          onEnter(ctx) {
            ctx.state.inventory.medkit = (ctx.state.inventory.medkit || 0) + 1
            ctx.showDialogue(['Found a medkit!'])
          },
        },
        {
          x: 4,
          y: 9,
          once: true,
          setsFlag: 'ashvault_bossDefeated',
          onEnter(ctx) {
            ctx.showDialogue(
              [
                'The corridor narrows — ahead, a hulking figure blocks the vault door.',
                "That's their foreman. No talking our way past this one.",
              ],
              () => ctx.startBattle(['ashvault_foreman'])
            )
          },
        },
      ],
    },
  },
}

registerWorld(ashvaultStationWorld)
