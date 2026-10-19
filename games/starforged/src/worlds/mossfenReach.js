import { registerWorld } from './registry.js'
import { registerTileTypes } from '../assets/tiles.js'
import { registerSprites } from '../assets/sprites/registry.js'
import { registerEnemies } from '../battle/enemies.js'
import { registerMoves } from '../battle/moves.js'
import { CHILD_TEMPLATE, HUMANOID_TEMPLATE, buildSprite } from '../assets/spriteTemplates.js'

function fillRow(width, id) {
  return Array(width).fill(id)
}

// --- World-specific tile types (namespaced to avoid collisions with other
// worlds being built in parallel) ---------------------------------------
registerTileTypes({
  mossfen_mud: { color: '#4a3b2a', dither: '#3a2d20', walkable: true },
  mossfen_murkwater: { color: '#1f4a4a', walkable: false },
  mossfen_reeds: { color: '#2f6b4a', dither: '#245438', walkable: true, encounter: true },
  mossfen_glowFloor: { color: '#2a4a46', dither: '#1d3330', walkable: true },
})

// --- World-specific sprites ----------------------------------------------
const fenlingSprite = buildSprite(CHILD_TEMPLATE, {
  H: '#8fd1c7',
  E: '#1a1d26',
  R: '#4a9a8a',
  B: '#dff5f0',
})

const bogStalkerSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#3a5a3a',
  V: '#102018',
  T: '#6b8f5a',
  A: '#2f4a38',
  L: '#1a2a20',
})

registerSprites({
  mossfen_fenling: fenlingSprite,
  mossfen_bogStalker: bogStalkerSprite,
})

// --- World-specific move(s) ------------------------------------------------
registerMoves({
  mireGrasp: { name: 'Mire Grasp', kind: 'attack', power: 8, focusCost: 0, accuracy: 0.8 },
})

// --- World-specific enemy --------------------------------------------------
registerEnemies({
  mossfen_bogStalker: {
    name: 'Bog Stalker',
    spriteId: 'mossfen_bogStalker',
    maxHp: 27,
    atk: 7,
    def: 3,
    spd: 4,
    moves: ['mireGrasp', 'strike'],
    xpReward: 18,
  },
})

// --- Maps -------------------------------------------------------------

const reachTiles = [
  fillRow(12, 'mossfen_murkwater'),
  ['mossfen_murkwater', ...fillRow(10, 'mossfen_mud'), 'mossfen_murkwater'],
  ['mossfen_murkwater', 'mossfen_mud', ...fillRow(8, 'mossfen_reeds'), 'mossfen_mud', 'mossfen_murkwater'],
  ['mossfen_murkwater', 'mossfen_mud', ...fillRow(8, 'mossfen_reeds'), 'mossfen_mud', 'mossfen_murkwater'],
  ['mossfen_murkwater', 'mossfen_mud', ...fillRow(8, 'mossfen_reeds'), 'mossfen_mud', 'mossfen_murkwater'],
  ['mossfen_murkwater', ...fillRow(10, 'mossfen_mud'), 'mossfen_murkwater'],
  ['mossfen_murkwater', 'mossfen_mud', 'door', ...fillRow(8, 'mossfen_mud'), 'mossfen_murkwater'],
  ['mossfen_murkwater', ...fillRow(10, 'mossfen_mud'), 'mossfen_murkwater'],
  ['mossfen_murkwater', ...fillRow(10, 'mossfen_mud'), 'mossfen_murkwater'],
  fillRow(12, 'mossfen_murkwater'),
]

const shrineTiles = [
  fillRow(8, 'wall'),
  ['wall', ...fillRow(6, 'mossfen_glowFloor'), 'wall'],
  ['wall', ...fillRow(6, 'mossfen_glowFloor'), 'wall'],
  ['wall', ...fillRow(6, 'mossfen_glowFloor'), 'wall'],
  ['wall', 'door', ...fillRow(5, 'mossfen_glowFloor'), 'wall'],
  fillRow(8, 'wall'),
]

// Landing-pad tile in the startMap, near where the starskiff would set down
// on the fringe of the bog. Open mud tile, walkable, clear of NPCs/triggers.
export const ENTRY = { x: 6, y: 7 }

export const mossfenReachWorld = {
  id: 'mossfenReach',
  name: 'Mossfen Reach',
  startMap: 'reach',
  entry: ENTRY,
  maps: {
    reach: {
      width: 12,
      height: 10,
      tiles: reachTiles,
      npcs: [
        {
          id: 'birchKeeper',
          x: 8,
          y: 3,
          facing: 'down',
          spriteId: 'npc',
          dialogue: [
            "The reeds remember the night the sky cracked and the Syndicate's cutters came hunting fenling kin.",
            'Moss was not the only child born to the Current here — the others were taken, or ran deep into the mire and never came back.',
            "Kade Ironhelm wears forge-plate, but it's his word that shields the boy now. Keep him close on the Drift.",
          ],
        },
      ],
      encounterZones: [{ x: 2, y: 2, w: 8, h: 3, chance: 0.16, enemyIds: ['mossfen_bogStalker'] }],
      warps: [{ x: 2, y: 6, toMap: 'shrine', toX: 1, toY: 3 }],
      triggers: [
        {
          x: 3,
          y: 3,
          once: true,
          setsFlag: 'mossfen_loreSeen',
          onEnter: (ctx) => {
            ctx.showDialogue([
              'Moss goes still, eyes fixed on the dark water.',
              '"This place... I was born here. Before the nets, before the running."',
              '"The Syndicate came for the Current in the mud. We were the first they hunted."',
            ])
          },
        },
        {
          x: 9,
          y: 7,
          once: true,
          setsFlag: 'mossfen_cacheFound',
          onEnter: (ctx) => {
            ctx.state.inventory.medkit = (ctx.state.inventory.medkit || 0) + 1
            ctx.showDialogue(['Tucked beneath the reeds, a waterproofed satchel.', 'Found a medkit!'])
          },
        },
      ],
    },
    shrine: {
      width: 8,
      height: 6,
      tiles: shrineTiles,
      npcs: [
        {
          id: 'fenling',
          x: 4,
          y: 2,
          facing: 'down',
          spriteId: 'mossfen_fenling',
          dialogue: [
            'You feel it too, don\'t you? The hum under the mossfen floor — that\'s the Current, same as what sings in Moss.',
            'Our kin used to gather at this shrine, before the Hollow Syndicate started dragging nets through the bog.',
            'Tell Moss... the Reach still waits for him, whenever the running stops.',
          ],
        },
      ],
      encounterZones: [],
      warps: [{ x: 1, y: 4, toMap: 'reach', toX: 2, toY: 7 }],
      triggers: [],
    },
  },
}

registerWorld(mossfenReachWorld)
