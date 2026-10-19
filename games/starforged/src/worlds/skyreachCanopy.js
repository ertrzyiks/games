import { registerWorld } from './registry.js'
import { registerTileTypes } from '../assets/tiles.js'
import { registerSprites } from '../assets/sprites/registry.js'
import { registerEnemies } from '../battle/enemies.js'
import { registerMoves } from '../battle/moves.js'
import { HUMANOID_TEMPLATE, buildSprite } from '../assets/spriteTemplates.js'

function fillRow(width, id) {
  return Array(width).fill(id)
}

/**
 * World 4 — Skyreach Canopy: a floating-forest world strung between
 * glowing treetop platforms high above the Drift's cloud layer. Wind-swept
 * walkways connect bioluminescent canopy groves to a watchtower where the
 * last free scouts keep watch on the Hollow Syndicate's stronghold below.
 */

// --- Tile types (namespaced 'skyreach_' to avoid colliding with other
// worlds being built in parallel) ---------------------------------------
registerTileTypes({
  skyreach_walkway: { color: '#3c6b74', dither: '#2a4e55', walkable: true },
  skyreach_canopy: { color: '#4a2f6e', dither: '#381f57', walkable: true, encounter: true },
  skyreach_railing: { color: '#1f2d33', walkable: false },
  skyreach_door: { color: '#39c6b0', walkable: true },
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

const galeStalkerSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#1f2d33',
  V: '#39c6b0',
  T: '#6fe3d0',
  A: '#2a4e55',
  L: '#101820',
})

registerSprites({
  skyreach_senna: sennaSprite,
  skyreach_orin: orinSprite,
  skyreach_galeStalker: galeStalkerSprite,
})

// --- Moves -----------------------------------------------------------------
registerMoves({
  skyreach_windSlash: { name: 'Wind Slash', kind: 'attack', power: 9, focusCost: 0, accuracy: 0.88 },
})

// --- Enemies ---------------------------------------------------------------
registerEnemies({
  skyreach_galeStalker: {
    name: 'Gale Stalker',
    spriteId: 'skyreach_galeStalker',
    maxHp: 50,
    atk: 11,
    def: 5,
    spd: 7,
    moves: ['skyreach_windSlash', 'strike'],
    xpReward: 34,
  },
})

// --- Maps --------------------------------------------------------------

// Outdoor canopy-walkway map (start map). 14 wide x 10 tall. Railings line
// the outer edge (the walkway is suspended high above the Drift's clouds),
// a wide canopy grove in the middle holds the encounter zone, and a
// themed door on the east edge leads into the watchtower interior.
const canopyWalkTiles = [
  fillRow(14, 'skyreach_railing'),
  ['skyreach_railing', ...fillRow(12, 'skyreach_walkway'), 'skyreach_railing'],
  ['skyreach_railing', 'skyreach_walkway', ...fillRow(10, 'skyreach_canopy'), 'skyreach_walkway', 'skyreach_railing'],
  ['skyreach_railing', 'skyreach_walkway', ...fillRow(10, 'skyreach_canopy'), 'skyreach_walkway', 'skyreach_railing'],
  ['skyreach_railing', 'skyreach_walkway', ...fillRow(10, 'skyreach_canopy'), 'skyreach_walkway', 'skyreach_railing'],
  ['skyreach_railing', 'skyreach_walkway', ...fillRow(10, 'skyreach_canopy'), 'skyreach_walkway', 'skyreach_railing'],
  ['skyreach_railing', ...fillRow(12, 'skyreach_walkway'), 'skyreach_railing'],
  ['skyreach_railing', ...fillRow(11, 'skyreach_walkway'), 'skyreach_door', 'skyreach_railing'],
  ['skyreach_railing', ...fillRow(12, 'skyreach_walkway'), 'skyreach_railing'],
  fillRow(14, 'skyreach_railing'),
]

// Interior watchtower (treehouse lookout post). 8 wide x 6 tall.
const watchtowerTiles = [
  fillRow(8, 'wall'),
  ['wall', ...fillRow(6, 'floor'), 'wall'],
  ['wall', ...fillRow(6, 'floor'), 'wall'],
  ['wall', ...fillRow(6, 'floor'), 'wall'],
  ['wall', ...fillRow(5, 'floor'), 'skyreach_door', 'wall'],
  fillRow(8, 'wall'),
]

export const ENTRY = { x: 6, y: 7 }

export const skyreachCanopyWorld = {
  id: 'skyreachCanopy',
  name: 'Skyreach Canopy',
  startMap: 'canopyWalk',
  entry: ENTRY,
  maps: {
    canopyWalk: {
      width: 14,
      height: 10,
      tiles: canopyWalkTiles,
      npcs: [
        {
          id: 'senna',
          x: 4,
          y: 3,
          facing: 'down',
          spriteId: 'skyreach_senna',
          dialogue: [
            'The wind runs strange up here since the Syndicate dug into the world below us.',
            "That's the Hollow, child. Its roots go down into the dark — we call it that for a reason.",
            'Moss flinches every time he looks toward it. He can feel what they want from him.',
            "Kade, if you mean to end this, you'll only get one run at their stronghold. Rest first.",
          ],
        },
        {
          id: 'orin',
          x: 10,
          y: 7,
          facing: 'left',
          spriteId: 'skyreach_orin',
          dialogue: [
            'I keep this watchtower so no Syndicate skiff crosses the canopy unseen.',
            'They took three scouts trying to chart a way into the Hollow. None came back.',
            "Whatever bond you two have, Kade — it's the only thing Moss trusts more than his own fear. Hold onto that down there.",
          ],
        },
      ],
      encounterZones: [{ x: 2, y: 2, w: 10, h: 4, chance: 0.18, enemyIds: ['skyreach_galeStalker'] }],
      warps: [{ x: 12, y: 7, toMap: 'watchtower', toX: 1, toY: 3 }],
      triggers: [
        {
          x: 7,
          y: 4,
          once: true,
          setsFlag: 'skyreach_loreSeen',
          onEnter: (ctx) => {
            ctx.showDialogue([
              'A gust off the canopy carries a low, grinding hum from far below the clouds.',
              'Moss presses close to Kade, trembling. "That sound... it comes from where they want to take me."',
              'Somewhere beneath the Drift, the Hollow Syndicate waits in their stronghold — the Hollow itself.',
              'Kade tightens the straps on his plate. "Then we end it there. Not one step further for them."',
            ])
          },
        },
        {
          x: 9,
          y: 3,
          once: true,
          onEnter: (ctx) => {
            ctx.state.inventory.medkit = (ctx.state.inventory.medkit || 0) + 1
            ctx.showDialogue(['Tucked into a hollow root, a scout cache yields a spare medkit.'])
          },
        },
      ],
    },
    watchtower: {
      width: 8,
      height: 6,
      tiles: watchtowerTiles,
      npcs: [],
      encounterZones: [],
      warps: [{ x: 6, y: 4, toMap: 'canopyWalk', toX: 11, toY: 7 }],
      triggers: [],
    },
  },
}

registerWorld(skyreachCanopyWorld)
