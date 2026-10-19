import { registerWorld } from './registry.js'

function fillRow(width, id) {
  return Array(width).fill(id)
}

const canyonTiles = [
  fillRow(12, 'rock'),
  ['rock', ...fillRow(10, 'path'), 'rock'],
  ['rock', 'path', ...fillRow(8, 'grass'), 'path', 'rock'],
  ['rock', 'path', ...fillRow(8, 'grass'), 'path', 'rock'],
  ['rock', 'path', ...fillRow(8, 'grass'), 'path', 'rock'],
  ['rock', ...fillRow(10, 'path'), 'rock'],
  ['rock', 'path', 'door', ...fillRow(8, 'path'), 'rock'],
  ['rock', ...fillRow(10, 'path'), 'rock'],
  ['rock', ...fillRow(10, 'path'), 'rock'],
  fillRow(12, 'rock'),
]

const outpostTiles = [
  fillRow(8, 'wall'),
  ['wall', ...fillRow(6, 'floor'), 'wall'],
  ['wall', ...fillRow(6, 'floor'), 'wall'],
  ['wall', ...fillRow(6, 'floor'), 'wall'],
  ['wall', 'door', ...fillRow(5, 'floor'), 'wall'],
  fillRow(8, 'wall'),
]

export const rustmoorWorld = {
  id: 'rustmoor',
  name: 'Rustmoor',
  startMap: 'canyon',
  entry: { x: 5, y: 7 },
  maps: {
    canyon: {
      width: 12,
      height: 10,
      tiles: canyonTiles,
      npcs: [
        {
          id: 'elder',
          x: 8,
          y: 5,
          facing: 'down',
          spriteId: 'npc',
          dialogue: [
            'Rustmoor has gone quiet since Syndicate ships passed over the ridge.',
            'Keep to the path — scavengers linger in the tall grass.',
            "The outpost door is west of here. Yara keeps what supplies she can spare.",
          ],
        },
      ],
      encounterZones: [{ x: 2, y: 2, w: 8, h: 3, chance: 0.16, enemyIds: ['scavenger'] }],
      warps: [{ x: 2, y: 6, toMap: 'outpost', toX: 1, toY: 3 }],
      triggers: [],
    },
    outpost: {
      width: 8,
      height: 6,
      tiles: outpostTiles,
      npcs: [
        {
          id: 'yara',
          x: 4,
          y: 2,
          facing: 'down',
          spriteId: 'npc',
          dialogue: [
            'Welcome to my shop, such as it is these days.',
            'Moss keeps staring west, toward the reach. He senses something out there.',
            'I only carry medkits, no miracles. Stock up before you push further into the Drift.',
          ],
        },
      ],
      encounterZones: [],
      warps: [{ x: 1, y: 4, toMap: 'canyon', toX: 2, toY: 7 }],
      triggers: [],
    },
  },
}

registerWorld(rustmoorWorld)
