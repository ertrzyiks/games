import { registerWorld, unlockNextWorld } from './registry.js'
import { registerTileTypes } from '../assets/tiles.js'
import { registerSprites } from '../assets/sprites/registry.js'
import { registerEnemies } from '../battle/enemies.js'
import { registerMoves } from '../battle/moves.js'
import { HUMANOID_TEMPLATE, CHILD_TEMPLATE, buildSprite } from '../assets/spriteTemplates.js'
import { startQuest, setQuestStage, completeQuest } from '../data/gameState.js'

function fillRow(width, id) {
  return Array(width).fill(id)
}

/**
 * World 4 — Skyreach Canopy: a hidden refuge of Current-sensitive "Skykin"
 * strung between glowing treetop platforms high above the Drift's cloud
 * layer. The Hollow Syndicate has tracked them here; an elite enforcer is
 * already climbing toward the refuge. Four connected maps: the windswept
 * Canopy Approach, the Skykin Refuge hub, the maze-like High Reaches (gated
 * behind a Windward Charm), and the Enforcer's Arena — a one-tile
 * chokepoint boss gate, right before the finale (The Hollow).
 */

// --- Tile types (namespaced 'skyreach_' to avoid colliding with other
// worlds being built in parallel) ---------------------------------------
registerTileTypes({
  skyreach_walkway: { color: '#3c6b74', dither: '#2a4e55', walkable: true },
  skyreach_canopy: { color: '#4a2f6e', dither: '#381f57', walkable: true, encounter: true },
  skyreach_railing: { color: '#1f2d33', walkable: false },
  skyreach_door: { color: '#39c6b0', walkable: true },
  skyreach_refugeFloor: { color: '#2f4a52', dither: '#22363c', walkable: true },
  skyreach_rootPath: { color: '#3a2f52', dither: '#2a2240', walkable: true },
  skyreach_vinewall: { color: '#241a38', walkable: false },
  skyreach_depthCanopy: { color: '#5c2f7a', dither: '#431f5c', walkable: true, encounter: true },
  skyreach_vineGate: { color: '#2f6b57', dither: '#1f4d3d', walkable: true },
  skyreach_arenaFloor: { color: '#3d3450', dither: '#2a2440', walkable: true },
  skyreach_arenaWall: { color: '#17121f', walkable: false },
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

const galeStalkerSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#1f2d33',
  V: '#39c6b0',
  T: '#6fe3d0',
  A: '#2a4e55',
  L: '#101820',
})

const windReaverSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#214047',
  V: '#dfffe8',
  T: '#6fe3d0',
  A: '#2f6b74',
  L: '#12282c',
})

const rootLurkerSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#2a2038',
  V: '#120c1a',
  T: '#5c3f7a',
  A: '#3a2a52',
  L: '#160f24',
})

const enforcerVaneSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#2e2440',
  V: '#dfe3ea',
  T: '#8a6fd1',
  A: '#3d3450',
  L: '#17121f',
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
const WATCH_QUEST = 'skyreach_hollowWatch'

// --- Maps --------------------------------------------------------------

// Map 1 — Canopy Approach (18x14, outdoor, encounter zone). Railings line
// the outer edge; a wide canopy grove holds the encounter zone; a door on
// the north wall leads into the Skykin Refuge.
const canopyApproachTiles = [
  fillRow(18, 'skyreach_railing'),
  [
    'skyreach_railing',
    ...fillRow(7, 'skyreach_walkway'),
    'skyreach_door',
    ...fillRow(8, 'skyreach_walkway'),
    'skyreach_railing',
  ],
  ...fillRow(8, 0).map(() => [
    'skyreach_railing',
    ...fillRow(2, 'skyreach_walkway'),
    ...fillRow(12, 'skyreach_canopy'),
    ...fillRow(2, 'skyreach_walkway'),
    'skyreach_railing',
  ]),
  ['skyreach_railing', ...fillRow(16, 'skyreach_walkway'), 'skyreach_railing'],
  ['skyreach_railing', ...fillRow(16, 'skyreach_walkway'), 'skyreach_railing'],
  ['skyreach_railing', ...fillRow(16, 'skyreach_walkway'), 'skyreach_railing'],
  fillRow(18, 'skyreach_railing'),
]

// Map 2 — Skykin Refuge (14x12 hub). A single clearing of root-plank floor;
// a south door back to the Approach, a north door up into the High Reaches.
const skykinRefugeTiles = [
  fillRow(14, 'skyreach_railing'),
  [
    'skyreach_railing',
    ...fillRow(7, 'skyreach_refugeFloor'),
    'skyreach_door',
    ...fillRow(4, 'skyreach_refugeFloor'),
    'skyreach_railing',
  ],
  ...fillRow(8, 0).map(() => ['skyreach_railing', ...fillRow(12, 'skyreach_refugeFloor'), 'skyreach_railing']),
  [
    'skyreach_railing',
    ...fillRow(7, 'skyreach_refugeFloor'),
    'skyreach_door',
    ...fillRow(4, 'skyreach_refugeFloor'),
    'skyreach_railing',
  ],
  fillRow(14, 'skyreach_railing'),
]

// Map 3 — High Reaches (16x16, maze-like dungeon). Room D ("the Roost",
// rows 1-4) is sealed off from the rest of the maze by a vine-lock gate
// (row 5) that only opens for someone carrying the Windward Charm
// (state.flags.has('skyreach_hasCharm')) — Wren and the way down into the
// boss arena both sit beyond it.
const highReachesTiles = [
  fillRow(16, 'skyreach_vinewall'),
  ['skyreach_vinewall', 'skyreach_vinewall', 'skyreach_vinewall', ...fillRow(10, 'skyreach_rootPath'), 'skyreach_vinewall', 'skyreach_vinewall', 'skyreach_vinewall'],
  ['skyreach_vinewall', 'skyreach_vinewall', 'skyreach_vinewall', ...fillRow(10, 'skyreach_rootPath'), 'skyreach_vinewall', 'skyreach_vinewall', 'skyreach_vinewall'],
  [
    'skyreach_vinewall',
    'skyreach_vinewall',
    'skyreach_vinewall',
    'skyreach_rootPath',
    'skyreach_rootPath',
    'skyreach_rootPath',
    'skyreach_rootPath',
    'skyreach_rootPath',
    'skyreach_rootPath',
    'skyreach_rootPath',
    'skyreach_rootPath',
    'skyreach_door',
    'skyreach_rootPath',
    'skyreach_vinewall',
    'skyreach_vinewall',
    'skyreach_vinewall',
  ],
  ['skyreach_vinewall', 'skyreach_vinewall', 'skyreach_vinewall', ...fillRow(10, 'skyreach_rootPath'), 'skyreach_vinewall', 'skyreach_vinewall', 'skyreach_vinewall'],
  [...fillRow(8, 'skyreach_vinewall'), 'skyreach_vineGate', ...fillRow(7, 'skyreach_vinewall')],
  [...fillRow(8, 'skyreach_vinewall'), 'skyreach_rootPath', ...fillRow(7, 'skyreach_vinewall')],
  [...fillRow(8, 'skyreach_vinewall'), 'skyreach_rootPath', ...fillRow(7, 'skyreach_vinewall')],
  ['skyreach_vinewall', 'skyreach_vinewall', 'skyreach_rootPath', ...fillRow(10, 'skyreach_depthCanopy'), 'skyreach_vinewall', 'skyreach_vinewall', 'skyreach_vinewall'],
  ['skyreach_vinewall', 'skyreach_vinewall', 'skyreach_vinewall', ...fillRow(10, 'skyreach_depthCanopy'), 'skyreach_vinewall', 'skyreach_vinewall', 'skyreach_vinewall'],
  ['skyreach_vinewall', 'skyreach_vinewall', 'skyreach_vinewall', ...fillRow(10, 'skyreach_depthCanopy'), 'skyreach_vinewall', 'skyreach_vinewall', 'skyreach_vinewall'],
  ['skyreach_vinewall', 'skyreach_vinewall', 'skyreach_vinewall', ...fillRow(10, 'skyreach_depthCanopy'), 'skyreach_vinewall', 'skyreach_vinewall', 'skyreach_vinewall'],
  [...fillRow(8, 'skyreach_vinewall'), 'skyreach_rootPath', ...fillRow(7, 'skyreach_vinewall')],
  [...fillRow(8, 'skyreach_vinewall'), 'skyreach_rootPath', ...fillRow(7, 'skyreach_vinewall')],
  ['skyreach_vinewall', 'skyreach_vinewall', 'skyreach_vinewall', ...fillRow(10, 'skyreach_rootPath'), 'skyreach_vinewall', 'skyreach_vinewall', 'skyreach_vinewall'],
  fillRow(16, 'skyreach_vinewall'),
]

// Map 4 — Enforcer's Arena (10x10). A single-tile-wide corridor funnels
// straight into the arena room (same chokepoint pattern as theHollow.js),
// so the boss fight cannot be walked around.
const enforcerArenaTiles = [
  fillRow(10, 'skyreach_arenaWall'),
  ['skyreach_arenaWall', 'skyreach_arenaWall', ...fillRow(6, 'skyreach_arenaFloor'), 'skyreach_arenaWall', 'skyreach_arenaWall'],
  ['skyreach_arenaWall', 'skyreach_arenaWall', ...fillRow(6, 'skyreach_arenaFloor'), 'skyreach_arenaWall', 'skyreach_arenaWall'],
  ['skyreach_arenaWall', 'skyreach_arenaWall', ...fillRow(6, 'skyreach_arenaFloor'), 'skyreach_arenaWall', 'skyreach_arenaWall'],
  [...fillRow(4, 'skyreach_arenaWall'), 'skyreach_arenaFloor', ...fillRow(5, 'skyreach_arenaWall')],
  [...fillRow(4, 'skyreach_arenaWall'), 'skyreach_arenaFloor', ...fillRow(5, 'skyreach_arenaWall')],
  [...fillRow(4, 'skyreach_arenaWall'), 'skyreach_arenaFloor', ...fillRow(5, 'skyreach_arenaWall')],
  [...fillRow(3, 'skyreach_arenaWall'), 'skyreach_arenaFloor', 'skyreach_arenaFloor', ...fillRow(5, 'skyreach_arenaWall')],
  [...fillRow(4, 'skyreach_arenaWall'), 'skyreach_door', ...fillRow(5, 'skyreach_arenaWall')],
  fillRow(10, 'skyreach_arenaWall'),
]

export const ENTRY = { x: 9, y: 12 }

export const skyreachCanopyWorld = {
  id: 'skyreachCanopy',
  name: 'Skyreach Canopy',
  startMap: 'canopyApproach',
  entry: ENTRY,
  maps: {
    canopyApproach: {
      width: 18,
      height: 14,
      tiles: canopyApproachTiles,
      npcs: [
        {
          id: 'hale',
          x: 5,
          y: 11,
          facing: 'up',
          spriteId: 'skyreach_hale',
          dialogue: [
            "Hale: Don't go further without your wits about you — gale stalkers have been thick in the canopy since the Syndicate started climbing.",
            'Hale: An enforcer led the last patrol. Moved like the wind owed her something. I barely got out.',
            "Hale: The refuge is just past the north walk. Go — warn them, if you haven't already.",
          ],
        },
      ],
      encounterZones: [
        { x: 3, y: 2, w: 12, h: 8, chance: 0.2, enemyIds: ['skyreach_galeStalker', 'skyreach_windReaver'] },
      ],
      warps: [{ x: 8, y: 1, toMap: 'skykinRefuge', toX: 8, toY: 2 }],
      triggers: [
        {
          x: 9,
          y: 3,
          once: true,
          setsFlag: 'skyreach_approachLoreSeen',
          onEnter: (ctx) => {
            ctx.showDialogue([
              'A gust off the canopy carries a low, grinding hum from far below the clouds.',
              'Moss presses close to Kade, trembling. "That sound... it comes from where they want to take me."',
              'Somewhere beneath the Drift, the Hollow Syndicate waits in their stronghold — the Hollow itself.',
              "Kade tightens the straps on his plate. Whatever's happening up ahead, it's already found this place.",
            ])
          },
        },
        {
          x: 6,
          y: 7,
          once: true,
          setsFlag: 'skyreach_approachCacheFound',
          onEnter: (ctx) => {
            ctx.state.inventory.medkit = (ctx.state.inventory.medkit || 0) + 1
            ctx.showDialogue(['Tucked into a hollow root, a scout cache yields a spare medkit.'])
          },
        },
      ],
    },

    skykinRefuge: {
      width: 14,
      height: 12,
      tiles: skykinRefugeTiles,
      npcs: [
        {
          id: 'senna',
          x: 3,
          y: 3,
          facing: 'down',
          spriteId: 'skyreach_senna',
          // Plot quest-giver: the Syndicate thread for this chapter.
          dialogue: (state) => {
            const q = state.quests[WATCH_QUEST]
            if (!q) {
              startQuest(state, WATCH_QUEST, 'Shroud the Current-Well')
              return [
                'Senna: Kade. Moss. You feel it too — the hum under our floor is louder every day.',
                "Senna: The Syndicate tracks the Current like a hound tracks blood. Our well up in the High Reaches is singing right to them.",
                'Senna: An enforcer is already climbing toward us. If we shroud the well before she arrives, we buy the refuge time.',
                'Senna: Go. Find the well in the High Reaches and still it, before they find us first.',
              ]
            }
            if (q.complete) {
              return [
                'Senna: The enforcer is gone, and the refuge is still standing. We owe you both more than words.',
                'Senna: The Hollow waits below the clouds, same as the map showed. End what they started, Kade.',
              ]
            }
            if (q.stage >= 1) {
              return [
                'Senna: You stilled it. Thank the Current, you stilled it.',
                'Senna: One of our scouts escaped Syndicate hands years back. Before she died, she drew us a map — she swore it marked their stronghold. The Hollow.',
                "Senna: I never thought we'd need it. Keep it close, Kade. If the enforcer falls here, you'll have somewhere to carry the fight next.",
                'Senna: But first — she is almost here. Stand with us.',
              ]
            }
            return ["Senna: The well's hum still carries. Please, hurry — I can feel them getting closer."]
          },
        },
        {
          id: 'orin',
          x: 11,
          y: 3,
          facing: 'down',
          spriteId: 'skyreach_orin',
          // Practical quest-giver: a "go rescue a Skykin in the Depths" quest.
          dialogue: (state) => {
            const q = state.quests[ROOST_QUEST]
            if (!q) {
              startQuest(state, ROOST_QUEST, 'Find Wren in the High Reaches')
              return [
                "Orin: Wren went scouting the enforcer's climb and never came back down.",
                'Orin: Last I saw, they were headed past the vine-locks toward the old roost towers.',
                'Orin: Please — find them. Wren knows those towers better than any of us, but that counts for nothing against a Syndicate blade.',
              ]
            }
            if (q.complete) {
              return [
                "Orin: Wren told me what you did up there. The Reaches feel steadier with them back.",
                'Orin: Whatever happens with the enforcer — you have our wings at your back, Kade.',
              ]
            }
            return ["Orin: Please, hurry. I keep listening for wingbeats that aren't Wren's."]
          },
        },
        {
          id: 'tamsin',
          x: 3,
          y: 8,
          facing: 'down',
          spriteId: 'skyreach_tamsin',
          // Hands over the Windward Charm once the roost quest is active —
          // the item/flag that gates the High Reaches' inner section.
          dialogue: (state) => {
            const roost = state.quests[ROOST_QUEST]
            if (roost && !roost.complete && !state.flags.has('skyreach_hasCharm')) {
              state.flags.add('skyreach_hasCharm')
              return [
                "Tamsin: Heading into the High Reaches for Orin's sake? Take this.",
                'Tamsin: A Windward Charm. The vine-locks up there answer to it — they were woven to keep Syndicate scouts out, not kin.',
                "Tamsin: Hold onto it. You will need it to reach the high roosts at all.",
              ]
            }
            if (state.flags.has('skyreach_hasCharm')) {
              return ["Tamsin: The charm still hums warm in your hand. Good. The Reaches don't forgive the unprepared."]
            }
            return [
              'Tamsin: The High Reaches used to be a nursery for fledgling Skykin. Now half of it is choked in vine-lock, sealed since the first Syndicate raid.',
            ]
          },
        },
        {
          id: 'fenn',
          x: 11,
          y: 8,
          facing: 'down',
          spriteId: 'skyreach_fenn',
          dialogue: [
            'Fenn: Are you really Kade Ironhelm? The forge-clan exile with the Current-touched kid?',
            "Fenn: Moss doesn't look scary at all. Everyone up here talks about the Current like it's a monster, but Moss just looks like... a kid.",
            "Fenn: I hope the enforcer doesn't come. But if she does, I hope you're as tough as the stories say.",
          ],
        },
      ],
      encounterZones: [],
      warps: [
        { x: 8, y: 10, toMap: 'canopyApproach', toX: 8, toY: 2 },
        { x: 8, y: 1, toMap: 'highReaches', toX: 8, toY: 13 },
      ],
      triggers: [],
    },

    highReaches: {
      width: 16,
      height: 16,
      tiles: highReachesTiles,
      npcs: [
        {
          id: 'wren',
          x: 8,
          y: 2,
          facing: 'down',
          spriteId: 'skyreach_wren',
          dialogue: (state) => {
            const q = state.quests[ROOST_QUEST]
            if (q && !q.complete) {
              setQuestStage(state, ROOST_QUEST, 1)
              completeQuest(state, ROOST_QUEST)
              state.flags.add('skyreach_wrenRescued')
              const moss = state.party.moss
              moss.maxFocus += 1
              moss.focus = moss.maxFocus
              return [
                'Wren: Kade?! You actually came all the way up here.',
                "Wren: I got turned around chasing an enforcer's scout past the vine-locks. Thought I'd be stuck roosting here till the Current went quiet for good.",
                'Wren: Here — let me show Moss how we steady the Current up in the high air. It might help in a real fight.',
                "Wren: (Moss feels something settle, like a held breath finally let go. Moss's Focus capacity increased!)",
                "Wren: Tell Orin I'm alright. And Kade — that enforcer's close. Be ready.",
              ]
            }
            if (state.flags.has('skyreach_wrenRescued')) {
              return ["Wren: Still steadier than I've felt in days. Thank you — truly."]
            }
            return ['Wren: ...? Who— ! Oh. Oh, thank the Current, someone finally found me.']
          },
        },
      ],
      encounterZones: [
        { x: 3, y: 8, w: 10, h: 4, chance: 0.22, enemyIds: ['skyreach_rootLurker', 'skyreach_galeStalker'] },
      ],
      warps: [
        { x: 8, y: 14, toMap: 'skykinRefuge', toX: 8, toY: 2 },
        { x: 11, y: 3, toMap: 'enforcerArena', toX: 4, toY: 8 },
      ],
      triggers: [
        // Vine-lock gate guarding "the Roost" (Wren + the way down into the
        // arena). Fires every time the tile is entered (not `once`), so it
        // keeps blocking until the Windward Charm flag is set, and is a
        // harmless no-op afterward.
        {
          x: 8,
          y: 5,
          onEnter: (ctx) => {
            if (!ctx.state.flags.has('skyreach_hasCharm')) {
              ctx.showDialogue(['Thick vine-cord seals the path. Only a Windward Charm will loosen it.'])
              ctx.warpTo({ toMap: 'highReaches', toX: 8, toY: 6 })
            }
          },
        },
        // Current-well beacon: the plot quest's objective. Idempotent via
        // its own flag check rather than `once`, so it stays a harmless
        // flavor line before the quest is accepted and after it's doused.
        {
          x: 5,
          y: 9,
          onEnter: (ctx) => {
            const q = ctx.state.quests[WATCH_QUEST]
            if (ctx.state.flags.has('skyreach_beaconDoused')) {
              ctx.showDialogue(['The Current-well sits dark and quiet now.'])
              return
            }
            if (q && q.stage === 0 && !q.complete) {
              ctx.state.flags.add('skyreach_beaconDoused')
              setQuestStage(ctx.state, WATCH_QUEST, 1)
              ctx.showDialogue([
                'A squat lantern-well pulses with raw Current-light, humming loud enough to feel in your teeth.',
                'Moss reaches out and the hum drops to nothing. "There. They can\'t hear it anymore."',
              ])
              return
            }
            ctx.showDialogue(['A dim lantern-well hums quietly here, half-buried in root and moss.'])
          },
        },
        {
          x: 2,
          y: 8,
          once: true,
          setsFlag: 'skyreach_alcoveCacheFound',
          onEnter: (ctx) => {
            ctx.state.inventory.medkit = (ctx.state.inventory.medkit || 0) + 1
            ctx.showDialogue(['A narrow root-alcove hides a scout cache.', 'Found a medkit!'])
          },
        },
      ],
    },

    enforcerArena: {
      width: 10,
      height: 10,
      tiles: enforcerArenaTiles,
      npcs: [],
      encounterZones: [],
      warps: [{ x: 4, y: 8, toMap: 'highReaches', toX: 11, toY: 4 }],
      triggers: [
        // Mandatory boss encounter: the only tile connecting the corridor
        // to the arena room, so it cannot be bypassed.
        {
          x: 4,
          y: 4,
          once: true,
          setsFlag: 'skyreach_enforcerEngaged',
          onEnter: (ctx) => {
            ctx.showDialogue(
              [
                'The arena floor opens beneath the high towers, wind screaming through broken rafters.',
                'A figure drops from above on a glider-rig, armor humming with stolen Current-charge.',
                '"Enforcer Vane," she says, landing light as a blade. "The refuge ends its hiding today."',
                'Kade steps between her and Moss. "Not today. Not while I\'m standing."',
              ],
              () => {
                ctx.startBattle(['skyreach_enforcerVane'], {
                  onVictory: (state) => {
                    unlockNextWorld(state, 'skyreachCanopy')
                    completeQuest(state, WATCH_QUEST)
                    ctx.showDialogue([
                      'Enforcer Vane crashes against the arena rail, her glider-rig sparking out.',
                      '"...the Hollow... will still..." Her voice fades as the stolen Current-charge bleeds out of her armor.',
                      "Senna's voice carries up from below: the refuge is safe, for now.",
                      "With the enforcer fallen, the location the old scout's map once marked is confirmed — the Hollow itself, buried beneath the Drift's deepest clouds.",
                      'Kade looks to Moss. "That\'s where they want to take you. So that\'s where we end it."',
                      'The way down into the Hollow lies open. The final confrontation awaits.',
                    ])
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
