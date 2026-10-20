import { registerWorld, unlockNextWorld } from './registry.js'
import { registerTileTypes } from '../assets/tiles.js'
import { registerSprites } from '../assets/sprites/registry.js'
import { registerEnemies } from '../battle/enemies.js'
import { registerMoves } from '../battle/moves.js'
import { startQuest, setQuestStage, completeQuest } from '../data/gameState.js'
import { CHILD_TEMPLATE, HUMANOID_TEMPLATE, buildSprite } from '../assets/spriteTemplates.js'

function fillRow(width, id) {
  return Array(width).fill(id)
}

/**
 * World 2 — Mossfen Reach: Gogu's homeworld. The fenling kin here were
 * already raided once by the Hollow Syndicate before Wando and Gogu arrive;
 * a corrupted "Bog Warden" now guards whatever the Syndicate was digging
 * out of the old shrine grounds. Four connected maps: an outdoor Reach
 * Approach (encounter zone) -> the Fenling Settlement hub -> the Deep
 * Mire (maze dungeon, one stretch gated behind a quest item) -> the Bog
 * Warden's lair (one-tile chokepoint boss arena, reached from the Mire's
 * last corridor).
 */

// --- World-specific tile types (namespaced to avoid collisions with other
// worlds being built in parallel) ---------------------------------------
registerTileTypes({
  mossfen_mud: { color: '#4a3b2a', dither: '#3a2d20', walkable: true },
  mossfen_murkwater: { color: '#1f4a4a', walkable: false },
  mossfen_reeds: { color: '#2f6b4a', dither: '#245438', walkable: true, encounter: true },
  mossfen_glowFloor: { color: '#2a4a46', dither: '#1d3330', walkable: true },
  mossfen_hutWall: { color: '#5a4a33', walkable: false },
  mossfen_hutFloor: { color: '#7a6240', dither: '#5f4c30', walkable: true },
  mossfen_mireFloor: { color: '#2e3a2a', dither: '#232d20', walkable: true },
  mossfen_mireWall: { color: '#1b2419', walkable: false },
  mossfen_wardenFloor: { color: '#33242e', dither: '#23161c', walkable: true },
  mossfen_wardenWall: { color: '#1c1420', walkable: false },
})

// --- World-specific sprites ----------------------------------------------
const fenlingSprite = buildSprite(CHILD_TEMPLATE, {
  H: '#8fd1c7',
  E: '#1a1d26',
  R: '#4a9a8a',
  B: '#dff5f0',
})

const sentrySprite = buildSprite(CHILD_TEMPLATE, {
  H: '#6fb89a',
  E: '#1a1d26',
  R: '#2f6b4a',
  B: '#c9d9b8',
})

const trackerSprite = buildSprite(CHILD_TEMPLATE, {
  H: '#9adf8a',
  E: '#1a1d26',
  R: '#3a7a4a',
  B: '#dff5e4',
})

const elderSprite = buildSprite(CHILD_TEMPLATE, {
  H: '#c8d4c0',
  E: '#1a1d26',
  R: '#5a6b52',
  B: '#e8e8e8',
})

const netmenderSprite = buildSprite(CHILD_TEMPLATE, {
  H: '#7ac9c0',
  E: '#1a1d26',
  R: '#3a5a52',
  B: '#d9f0ea',
})

const hermitSprite = buildSprite(CHILD_TEMPLATE, {
  H: '#9a8f7a',
  E: '#1a1d26',
  R: '#4a4336',
  B: '#cfc6b0',
})

const bogStalkerSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#3a5a3a',
  V: '#102018',
  T: '#6b8f5a',
  A: '#2f4a38',
  L: '#1a2a20',
})

const mireLurkerSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#2a4030',
  V: '#0b1a12',
  T: '#4a6b40',
  A: '#223a28',
  L: '#101c14',
})

const reedViperSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#5a7a2a',
  V: '#1a2a0e',
  T: '#8fae4a',
  A: '#3a5a20',
  L: '#17240c',
})

const bogWardenSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#2e3a1e',
  V: '#e0564b',
  T: '#8a9a3a',
  A: '#3a2a38',
  L: '#1c1420',
})

registerSprites({
  mossfen_fenling: fenlingSprite,
  mossfen_sentry: sentrySprite,
  mossfen_tracker: trackerSprite,
  mossfen_elder: elderSprite,
  mossfen_netmender: netmenderSprite,
  mossfen_hermit: hermitSprite,
  mossfen_bogStalker: bogStalkerSprite,
  mossfen_mireLurker: mireLurkerSprite,
  mossfen_reedViper: reedViperSprite,
  mossfen_bogWarden: bogWardenSprite,
})

// --- World-specific moves ------------------------------------------------
registerMoves({
  mossfen_mireGrasp: { name: 'Mire Grasp', kind: 'attack', power: 8, focusCost: 0, accuracy: 0.8 },
  mossfen_bogSlam: { name: 'Bog Slam', kind: 'attack', power: 10, focusCost: 0, accuracy: 0.82 },
  mossfen_venomBite: { name: 'Venom Bite', kind: 'attack', power: 7, focusCost: 0, accuracy: 0.92 },
  mossfen_corruptedSurge: { name: 'Corrupted Surge', kind: 'attack', power: 15, focusCost: 0, accuracy: 0.85 },
  mossfen_mireRegen: { name: 'Mire Regeneration', kind: 'heal', power: 14, focusCost: 0, accuracy: 1 },
})

// --- World-specific enemies -----------------------------------------------
registerEnemies({
  mossfen_bogStalker: {
    name: 'Bog Stalker',
    spriteId: 'mossfen_bogStalker',
    maxHp: 28,
    atk: 8,
    def: 3,
    spd: 4,
    moves: ['mossfen_mireGrasp', 'strike'],
    xpReward: 20,
  },
  mossfen_mireLurker: {
    name: 'Mire Lurker',
    spriteId: 'mossfen_mireLurker',
    maxHp: 32,
    atk: 9,
    def: 4,
    spd: 3,
    moves: ['mossfen_bogSlam', 'mossfen_mireGrasp'],
    xpReward: 24,
  },
  mossfen_reedViper: {
    name: 'Reed Viper',
    spriteId: 'mossfen_reedViper',
    maxHp: 26,
    atk: 8,
    def: 2,
    spd: 7,
    moves: ['mossfen_venomBite', 'strike'],
    xpReward: 19,
  },
  mossfen_bogWarden: {
    name: 'Bog Warden',
    spriteId: 'mossfen_bogWarden',
    maxHp: 88,
    atk: 12,
    def: 6,
    spd: 5,
    moves: ['mossfen_mireGrasp', 'mossfen_corruptedSurge', 'mossfen_mireRegen'],
    xpReward: 70,
    isBoss: true,
  },
})

// === Map 1: Reach Approach (18x14) — outdoor swamp/reed encounter zone ===
const approachTiles = [
  fillRow(18, 'mossfen_murkwater'),
  ['mossfen_murkwater', ...fillRow(7, 'mossfen_mud'), 'door', ...fillRow(8, 'mossfen_mud'), 'mossfen_murkwater'],
  ['mossfen_murkwater', ...fillRow(16, 'mossfen_mud'), 'mossfen_murkwater'],
  ['mossfen_murkwater', ...fillRow(16, 'mossfen_reeds'), 'mossfen_murkwater'],
  ['mossfen_murkwater', ...fillRow(16, 'mossfen_reeds'), 'mossfen_murkwater'],
  ['mossfen_murkwater', ...fillRow(16, 'mossfen_mud'), 'mossfen_murkwater'],
  ['mossfen_murkwater', ...fillRow(16, 'mossfen_mud'), 'mossfen_murkwater'],
  ['mossfen_murkwater', ...fillRow(16, 'mossfen_mud'), 'mossfen_murkwater'],
  ['mossfen_murkwater', ...fillRow(16, 'mossfen_mud'), 'mossfen_murkwater'],
  ['mossfen_murkwater', ...fillRow(16, 'mossfen_reeds'), 'mossfen_murkwater'],
  ['mossfen_murkwater', ...fillRow(16, 'mossfen_mud'), 'mossfen_murkwater'],
  ['mossfen_murkwater', ...fillRow(16, 'mossfen_mud'), 'mossfen_murkwater'],
  ['mossfen_murkwater', ...fillRow(16, 'mossfen_mud'), 'mossfen_murkwater'],
  fillRow(18, 'mossfen_murkwater'),
]

// === Map 2: Fenling Settlement (14x12) — hub, replaces/absorbs the old
// shrine. A glow-floor patch at its heart marks where the old shrine light
// still lingers. ===
const settlementTiles = [
  fillRow(14, 'mossfen_hutWall'),
  ['mossfen_hutWall', ...fillRow(12, 'mossfen_hutFloor'), 'mossfen_hutWall'],
  ['mossfen_hutWall', ...fillRow(5, 'mossfen_hutFloor'), ...fillRow(2, 'mossfen_glowFloor'), ...fillRow(5, 'mossfen_hutFloor'), 'mossfen_hutWall'],
  ['mossfen_hutWall', ...fillRow(12, 'mossfen_hutFloor'), 'mossfen_hutWall'],
  ['mossfen_hutWall', ...fillRow(12, 'mossfen_hutFloor'), 'mossfen_hutWall'],
  ['mossfen_hutWall', ...fillRow(12, 'mossfen_hutFloor'), 'door'],
  ['mossfen_hutWall', ...fillRow(12, 'mossfen_hutFloor'), 'mossfen_hutWall'],
  ['mossfen_hutWall', ...fillRow(12, 'mossfen_hutFloor'), 'mossfen_hutWall'],
  ['mossfen_hutWall', ...fillRow(12, 'mossfen_hutFloor'), 'mossfen_hutWall'],
  ['mossfen_hutWall', ...fillRow(5, 'mossfen_hutFloor'), 'door', ...fillRow(6, 'mossfen_hutFloor'), 'mossfen_hutWall'],
  ['mossfen_hutWall', ...fillRow(12, 'mossfen_hutFloor'), 'mossfen_hutWall'],
  fillRow(14, 'mossfen_hutWall'),
]

// === Map 3: Deep Mire (16x16) — maze-like bog/cave. A single-width
// corridor descends from the settlement door, past the Wick-rescue
// detour, through a one-tile "dark water" gate that stays impassable
// (bounces the player back) until mossfen_glowReed is set, then loops
// down and across to the Syndicate evidence cache and the Warden's door.
const W = 'mossfen_mireWall'
const F = 'mossfen_mireFloor'
const deepMireTiles = [
  fillRow(16, W),
  fillRow(16, W),
  [W, W, W, W, W, W, F, W, W, W, W, W, W, W, W, W],
  [W, W, W, W, W, W, F, W, W, W, W, W, W, W, W, W],
  [W, W, W, W, F, F, F, F, F, F, W, W, W, W, W, W],
  [W, W, W, W, F, W, W, W, W, F, W, W, W, W, W, W],
  [W, W, W, W, F, W, W, W, W, F, W, W, W, W, W, W],
  [W, W, W, W, F, W, W, W, W, F, W, W, W, W, W, W],
  ['door', F, F, F, F, W, W, W, W, F, W, W, W, W, W, W],
  [W, W, W, W, W, W, W, W, W, F, W, W, W, F, F, 'door'],
  [W, W, W, W, W, W, W, W, W, F, W, W, W, F, W, W],
  [W, W, W, W, W, W, W, W, W, F, W, W, W, F, W, W],
  [W, W, W, W, W, W, W, W, W, F, F, F, F, F, W, W],
  fillRow(16, W),
  fillRow(16, W),
  fillRow(16, W),
]

// === Map 4: Bog Warden's Lair (8x8) — boss arena, last room off the Deep
// Mire. A single-tile corridor (x=3) funnels straight into the open rune
// grotto, so the fight at (3,4) cannot be sidestepped — same chokepoint
// pattern theHollow.js uses for its final boss. ===
const wardenLairTiles = [
  fillRow(8, 'mossfen_wardenWall'),
  ['mossfen_wardenWall', ...fillRow(6, 'mossfen_wardenFloor'), 'mossfen_wardenWall'],
  ['mossfen_wardenWall', ...fillRow(6, 'mossfen_wardenFloor'), 'mossfen_wardenWall'],
  ['mossfen_wardenWall', ...fillRow(6, 'mossfen_wardenFloor'), 'mossfen_wardenWall'],
  [...fillRow(3, 'mossfen_wardenWall'), 'mossfen_wardenFloor', ...fillRow(4, 'mossfen_wardenWall')],
  [...fillRow(3, 'mossfen_wardenWall'), 'mossfen_wardenFloor', ...fillRow(4, 'mossfen_wardenWall')],
  [...fillRow(3, 'mossfen_wardenWall'), 'mossfen_wardenFloor', ...fillRow(4, 'mossfen_wardenWall')],
  [...fillRow(3, 'mossfen_wardenWall'), 'door', ...fillRow(4, 'mossfen_wardenWall')],
]

// Entry point near where the starskiff sets down on the fringe of the
// bog, carried over from v1. Open mud tile, walkable, clear of NPCs/
// triggers.
export const ENTRY = { x: 9, y: 11 }

export const mossfenReachWorld = {
  id: 'mossfenReach',
  name: 'Mossfen Reach',
  startMap: 'approach',
  entry: ENTRY,
  maps: {
    approach: {
      width: 18,
      height: 14,
      tiles: approachTiles,
      npcs: [
        {
          id: 'juro',
          x: 9,
          y: 6,
          facing: 'down',
          spriteId: 'mossfen_sentry',
          dialogue: [
            "Stay off the deep mud past the reeds — bog-stalkers nest thick this close to the settlement gate.",
            "Gogu's kin have kept watch here since the Syndicate cutters first came through. We don't forget a face like that.",
            "Settlement's through the north gate. Tell the elders Wando Ironhelm walks with the boy now — they'll want to see that for themselves.",
          ],
        },
      ],
      encounterZones: [
        { x: 1, y: 3, w: 16, h: 2, chance: 0.18, enemyIds: ['mossfen_bogStalker', 'mossfen_reedViper'] },
        { x: 1, y: 9, w: 16, h: 1, chance: 0.16, enemyIds: ['mossfen_bogStalker', 'mossfen_mireLurker'] },
      ],
      warps: [{ x: 8, y: 1, toMap: 'settlement', toX: 6, toY: 8 }],
      triggers: [
        {
          x: 4,
          y: 4,
          once: true,
          setsFlag: 'mossfen_loreSeen',
          onEnter: (ctx) => {
            ctx.showDialogue([
              'Gogu goes still, eyes fixed on the dark water.',
              '"This place... I was born here. Before the nets, before the running."',
              '"The Syndicate came for the Current in the mud. We were the first they hunted."',
            ])
          },
        },
        {
          x: 13,
          y: 9,
          once: true,
          setsFlag: 'mossfen_cacheFound',
          onEnter: (ctx) => {
            ctx.state.inventory.medkit = (ctx.state.inventory.medkit || 0) + 1
            ctx.showDialogue(['Tucked beneath the reeds, a waterproofed satchel.', 'Found a medkit!'])
          },
        },
      ],
    },
    settlement: {
      width: 14,
      height: 12,
      tiles: settlementTiles,
      npcs: [
        {
          id: 'finnTheTracker',
          x: 3,
          y: 4,
          facing: 'down',
          spriteId: 'mossfen_tracker',
          dialogue: (state) => {
            const quest = state.quests['mossfen_lostScout']
            if (!quest) {
              startQuest(state, 'mossfen_lostScout', 'The Lost Scout')
              return [
                "Finn's knuckles are white around his spear shaft.",
                '"My kin Wick went into the Deep Mire two days back, scouting the old shrine path — she hasn\'t come back."',
                '"The stalkers have gotten bolder since the raid. If you\'re headed into the mire anyway... please, look for her."',
              ]
            }
            if (quest.complete) {
              return [
                "Wick's back at her mother's fire, telling the story to anyone who'll sit still long enough.",
                "I won't forget this, Wando. Any kin of yours is kin of the Reach now.",
              ]
            }
            if (quest.stage >= 1) {
              state.inventory.medkit = (state.inventory.medkit || 0) + 1
              completeQuest(state, 'mossfen_lostScout')
              return [
                'Finn\'s shoulders drop the moment he sees you. "You found her. You actually found her."',
                'He presses a medkit into your hands. "Take this for the road — least I can do."',
              ]
            }
            return ["She went in past the gate-tree, following the old shrine path. Please — hurry."]
          },
        },
        {
          id: 'birchKeeper',
          x: 10,
          y: 4,
          facing: 'down',
          spriteId: 'mossfen_elder',
          dialogue: (state) => {
            const quest = state.quests['mossfen_syndicateTrail']
            if (!quest) {
              startQuest(state, 'mossfen_syndicateTrail', 'What the Syndicate Took')
              return [
                "The reeds remember the night the sky cracked and the Syndicate's cutters came hunting fenling kin.",
                'Gogu was not the only child born to the Current here — the others were taken, or ran deep into the mire and never came back.',
                "They didn't just take our kin. They were digging for something in the old shrine grounds, deep in the mire. I need to know what.",
              ]
            }
            if (quest.complete) {
              return [
                "The Warden's gone quiet, and the mire breathes easier for it. But Wando — whatever they built with what they learned here, it's still running somewhere out there.",
                "Watch the sky when you leave the Reach. The Syndicate doesn't stop just because one guard dog falls.",
              ]
            }
            if (quest.stage >= 1) {
              return [
                "A siphon rig, you say — and notes on 'mossroot nodes.' That's the Current itself they were after, pulled straight out of the bog.",
                'Something is guarding the rest of it now. Corrupted, the hunters say — wearing the shape of what used to watch over us.',
                "If you mean to go further, go in strength. That thing won't let you walk past it.",
              ]
            }
            return ["Follow the shrine path into the Deep Mire. If they left anything behind, it'll be there."]
          },
        },
        {
          id: 'mireChild',
          x: 6,
          y: 3,
          facing: 'down',
          spriteId: 'mossfen_fenling',
          dialogue: [
            "You feel it too, don't you? The hum under the ground — that's the Current, same as what sings in Gogu.",
            'Our kin used to gather at the old shrine, before the Hollow Syndicate started dragging nets through the bog.',
            'Tell Gogu the Reach still waits for him, whenever the running stops.',
          ],
        },
        {
          id: 'selaNetmender',
          x: 10,
          y: 7,
          facing: 'down',
          spriteId: 'mossfen_netmender',
          dialogue: [
            "Mind the deep channel past the shrine path — the water runs black down there, thick with old Current. No kinlight, no crossing, not if you want to see what's holding it back.",
            "Wick used to carry a glow-reed lantern on her scouting runs. If she dropped it out there, it'd still ward off the worst of the dark.",
            "The Syndicate never liked how bright this place burned. Guess that's why they came back for seconds.",
          ],
        },
      ],
      encounterZones: [],
      warps: [
        { x: 6, y: 9, toMap: 'approach', toX: 8, toY: 2 },
        { x: 13, y: 5, toMap: 'deepMire', toX: 1, toY: 8 },
      ],
      triggers: [],
    },
    deepMire: {
      width: 16,
      height: 16,
      tiles: deepMireTiles,
      npcs: [
        {
          id: 'oldHarl',
          x: 6,
          y: 2,
          facing: 'down',
          spriteId: 'mossfen_hermit',
          dialogue: [
            "Don't mind me — I've lived in these root-hollows since before the nets came.",
            "Something changed in the deep water after the raid. Whatever used to sleep down there is awake now, and it answers to the Syndicate's mark.",
            "If you're set on going further, keep your wits about you. The Warden doesn't forgive distraction.",
          ],
        },
      ],
      encounterZones: [
        { x: 4, y: 5, w: 1, h: 3, chance: 0.22, enemyIds: ['mossfen_bogStalker', 'mossfen_mireLurker'] },
        { x: 9, y: 9, w: 1, h: 3, chance: 0.22, enemyIds: ['mossfen_mireLurker', 'mossfen_reedViper'] },
        { x: 12, y: 12, w: 2, h: 1, chance: 0.2, enemyIds: ['mossfen_bogStalker', 'mossfen_reedViper'] },
        { x: 13, y: 9, w: 1, h: 3, chance: 0.2, enemyIds: ['mossfen_mireLurker'] },
      ],
      warps: [
        { x: 0, y: 8, toMap: 'settlement', toX: 12, toY: 5 },
        { x: 15, y: 9, toMap: 'wardenLair', toX: 3, toY: 6 },
      ],
      triggers: [
        // Practical quest payoff: finding Wick is a short detour off the
        // main corridor (via the branch at (6,4) up to (6,3)) — skipping
        // it means never getting mossfen_glowReed, and never getting past
        // the gate below.
        {
          x: 6,
          y: 3,
          once: true,
          setsFlag: 'mossfen_glowReed',
          onEnter: (ctx) => {
            const { state } = ctx
            startQuest(state, 'mossfen_lostScout', 'The Lost Scout')
            setQuestStage(state, 'mossfen_lostScout', 1)
            ctx.showDialogue([
              'Tangled in root-snares, a young fenling scout struggles against the mud — Wick, Finn\'s kin.',
              '"You found me! The stalkers nearly had me. Here — take this, it\'ll ward off the deep dark."',
              "Wick presses a glowing kinlight reed into your hand before slipping back toward the settlement.",
            ])
          },
        },
        // One-tile gate: the only way down into the rest of the Mire. Fires
        // every time (not `once`) so it keeps bouncing the player back to
        // (9,6) until mossfen_glowReed is set, then becomes a no-op.
        {
          x: 9,
          y: 7,
          onEnter: (ctx) => {
            if (!ctx.state.flags.has('mossfen_glowReed')) {
              ctx.showDialogue([
                'The water here runs black — the current pulls at your boots like something unseen is holding on.',
                "Without a kinlight to ward it off, you can't risk going further.",
              ])
              ctx.warpTo({ toMap: 'deepMire', toX: 9, toY: 6 })
            }
          },
        },
        // Plot quest payoff: proof of what the Syndicate was after here,
        // only reachable once the gate above has been passed.
        {
          x: 11,
          y: 12,
          once: true,
          setsFlag: 'mossfen_evidenceFound',
          onEnter: (ctx) => {
            const { state } = ctx
            startQuest(state, 'mossfen_syndicateTrail', 'What the Syndicate Took')
            setQuestStage(state, 'mossfen_syndicateTrail', 1)
            ctx.showDialogue([
              'Half-buried in the muck: a cracked Syndicate siphon rig, its collection vials shattered.',
              'A waterlogged ledger page survives inside. "...mossroot nodes test positive for sustained Current draw — recommend full extraction once site is secured..."',
              'Whatever they were drawing out of the Reach, they meant to come back for more of it.',
            ])
          },
        },
        {
          x: 13,
          y: 11,
          once: true,
          setsFlag: 'mossfen_mireCacheFound',
          onEnter: (ctx) => {
            ctx.state.inventory.medkit = (ctx.state.inventory.medkit || 0) + 1
            ctx.showDialogue(['Wedged into a root hollow, a waterproof satchel.', 'Found a medkit!'])
          },
        },
      ],
    },
    wardenLair: {
      width: 8,
      height: 8,
      tiles: wardenLairTiles,
      npcs: [],
      encounterZones: [],
      warps: [],
      triggers: [
        // Mandatory boss encounter: the single tile connecting the
        // corridor to the grotto room, so it cannot be bypassed (see map
        // comment above). once:true so re-entering after the fight does
        // not replay the lead-in or restart the battle.
        {
          x: 3,
          y: 4,
          once: true,
          setsFlag: 'mossfen_bossEngaged',
          onEnter: (ctx) => {
            ctx.showDialogue(
              [
                'The corridor opens onto a sunken grotto, Current-light flickering sick and green through cracked root walls.',
                'At its center, half-fused with corroded Syndicate plating, something that was once a guardian of the Reach turns to face you.',
                '"Bog Warden... no." Gogu\'s voice shakes. "That used to watch over the shrine. What did they do to it?"',
                'Wando raises his shield. "Whatever it is now, it\'s standing between us and answers. Gogu — stay close."',
              ],
              () => {
                ctx.startBattle(['mossfen_bogWarden'], {
                  onVictory: (state) => {
                    unlockNextWorld(state, 'mossfenReach')
                    completeQuest(state, 'mossfen_syndicateTrail')
                    ctx.showDialogue(
                      [
                        'The corrupted plating cracks and sloughs away; the light bleeds out of the creature until only still water remains.',
                        'Gogu kneels at the water\'s edge. "It\'s free. Whatever they did to it... it\'s finally free."',
                        'Wando pulls a scorched Syndicate medallion from the wreckage — the same mark from the siphon rig in the mire.',
                        '"This isn\'t the only place they\'ve been digging," Wando says grimly. "There\'s a station out past the reach, Ashvault — word is they\'re building something bigger there. A Current Extractor, they call it."',
                        '"Then that\'s where we go next," Gogu says, steadier now. "Before they finish it."',
                        'Head back to the Starskiff to set course for Ashvault Station.',
                      ],
                      () => ctx.openShip()
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

registerWorld(mossfenReachWorld)
