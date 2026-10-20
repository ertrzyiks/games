import { registerWorld, unlockNextWorld } from './registry.js'
import { registerTileTypes } from '../assets/tiles.js'
import { registerSprites } from '../assets/sprites/registry.js'
import { registerEnemies } from '../battle/enemies.js'
import { registerMoves } from '../battle/moves.js'
import { startQuest, setQuestStage, completeQuest } from '../data/gameState.js'
import { CHILD_TEMPLATE, CREATURE_TEMPLATE, buildSprite } from '../assets/spriteTemplates.js'

// Builds a width x height grid filled with a single tile id.
function buildGrid(width, height, fillId) {
  return Array.from({ length: height }, () => Array(width).fill(fillId))
}

// Stamps a w x h rectangle of a tile id onto a grid, top-left at (x0, y0).
function fillRect(grid, x0, y0, w, h, id) {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) {
      grid[y][x] = id
    }
  }
}

// Sets a single tile.
function setTile(grid, x, y, id) {
  grid[y][x] = id
}

/**
 * World 2 — Mossfen Reach: Gogu's homeworld. The fenling kin here were
 * already raided once by the Hollow Syndicate before Wando and Gogu arrive;
 * a corrupted "Bog Warden" now guards whatever the Syndicate was digging
 * out of the old shrine grounds. Four connected maps: an outdoor Reach
 * Approach -> the Fenling Settlement hub -> the Deep Mire (maze dungeon,
 * one stretch gated behind a quest item) -> the Bog Warden's lair
 * (one-tile chokepoint boss arena, reached from the Mire's last corridor).
 *
 * Enemies are visible, map-placed sprites (enemySpawns) that start a fight
 * on contact and stay defeated once beaten — there are no random encounter
 * rolls in this world.
 */

// --- World-specific tile types (namespaced to avoid collisions with other
// worlds being built in parallel) ---------------------------------------
registerTileTypes({
  mossfen_mud: { color: '#4a3b2a', dither: '#3a2d20', walkable: true },
  mossfen_murkwater: { color: '#1f4a4a', walkable: false },
  mossfen_reeds: { color: '#2f6b4a', dither: '#245438', walkable: true },
  mossfen_glowFloor: { color: '#2a4a46', dither: '#1d3330', walkable: true },
  mossfen_hutWall: { color: '#5a4a33', walkable: false },
  mossfen_hutFloor: { color: '#7a6240', dither: '#5f4c30', walkable: true },
  mossfen_mireFloor: { color: '#2e3a2a', dither: '#232d20', walkable: true },
  mossfen_mireWall: { color: '#1b2419', walkable: false },
  mossfen_wardenFloor: { color: '#33242e', dither: '#23161c', walkable: true },
  mossfen_wardenWall: { color: '#1c1420', walkable: false },
  // Decorative swamp/bog dressing, mostly unwalkable, scattered through
  // the bigger maps below for visual variety.
  mossfen_deadTree: { color: '#2f2a24', dither: '#1f1b17', walkable: false },
  mossfen_mossRock: { color: '#4f5a3a', dither: '#3c4530', walkable: false },
  mossfen_bogPool: { color: '#163838', dither: '#0e2626', walkable: false },
  mossfen_ruins: { color: '#6b6f72', dither: '#52565a', walkable: false },
  mossfen_rootTangle: { color: '#3a2f1e', dither: '#2a2014', walkable: false },
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

const bogStalkerSprite = buildSprite(CREATURE_TEMPLATE, {
  H: '#3a5a3a',
  E: '#102018',
  B: '#2f4a38',
  T: '#6b8f5a',
  L: '#1a2a20',
})

const mireLurkerSprite = buildSprite(CREATURE_TEMPLATE, {
  H: '#2a4030',
  E: '#0b1a12',
  B: '#223a28',
  T: '#4a6b40',
  L: '#101c14',
})

const reedViperSprite = buildSprite(CREATURE_TEMPLATE, {
  H: '#5a7a2a',
  E: '#1a2a0e',
  B: '#3a5a20',
  T: '#8fae4a',
  L: '#17240c',
})

const bogWardenSprite = buildSprite(CREATURE_TEMPLATE, {
  H: '#2e3a1e',
  E: '#e0564b',
  B: '#3a2a38',
  T: '#8a9a3a',
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
  mossfen_venomBite: {
    name: 'Venom Bite',
    kind: 'attack',
    power: 7,
    focusCost: 0,
    accuracy: 0.92,
    applyStatus: { type: 'poison', duration: 3, power: 2 },
  },
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

// === Map 1: Reach Approach (26x20) — outdoor swamp/reed approach. A mud
// flat ringed by murkwater, dotted with reed patches and swamp dressing,
// with a north door up to the settlement. ===
const approachTiles = buildGrid(26, 20, 'mossfen_murkwater')
fillRect(approachTiles, 1, 1, 24, 18, 'mossfen_mud')
fillRect(approachTiles, 2, 2, 6, 2, 'mossfen_reeds')
fillRect(approachTiles, 16, 3, 7, 2, 'mossfen_reeds')
fillRect(approachTiles, 2, 14, 8, 2, 'mossfen_reeds')
fillRect(approachTiles, 15, 15, 6, 2, 'mossfen_reeds')
setTile(approachTiles, 3, 3, 'mossfen_deadTree')
setTile(approachTiles, 22, 3, 'mossfen_deadTree')
setTile(approachTiles, 12, 12, 'mossfen_deadTree')
setTile(approachTiles, 4, 9, 'mossfen_mossRock')
setTile(approachTiles, 17, 9, 'mossfen_mossRock')
setTile(approachTiles, 23, 17, 'mossfen_mossRock')
setTile(approachTiles, 9, 4, 'mossfen_bogPool')
setTile(approachTiles, 16, 14, 'mossfen_bogPool')
setTile(approachTiles, 12, 6, 'mossfen_ruins')
setTile(approachTiles, 12, 7, 'mossfen_ruins')
setTile(approachTiles, 2, 17, 'mossfen_rootTangle')
setTile(approachTiles, 24, 6, 'mossfen_rootTangle')
setTile(approachTiles, 16, 5, 'mossfen_rootTangle')
setTile(approachTiles, 13, 1, 'door')

// === Map 2: Fenling Settlement (21x18) — hub. A glow-floor patch at its
// heart marks where the old shrine light still lingers. ===
const settlementTiles = buildGrid(21, 18, 'mossfen_hutWall')
fillRect(settlementTiles, 1, 1, 19, 16, 'mossfen_hutFloor')
fillRect(settlementTiles, 9, 8, 3, 2, 'mossfen_glowFloor')
setTile(settlementTiles, 2, 14, 'mossfen_deadTree')
setTile(settlementTiles, 18, 13, 'mossfen_mossRock')
setTile(settlementTiles, 2, 3, 'mossfen_rootTangle')
setTile(settlementTiles, 18, 3, 'mossfen_ruins')
setTile(settlementTiles, 3, 12, 'mossfen_bogPool')
setTile(settlementTiles, 10, 14, 'door')
setTile(settlementTiles, 20, 6, 'door')

// === Map 3: Deep Mire (24x24) — maze-like bog/cave. A corridor descends
// from the settlement door into an entrance room, with a side branch up to
// the Wick-rescue detour. A one-tile "dark water" gate corridor stays
// impassable (bounces the player back) until mossfen_glowReed is set, then
// opens onto the Syndicate evidence room and the Warden's door. ===
const deepMireTiles = buildGrid(24, 24, 'mossfen_mireWall')
fillRect(deepMireTiles, 1, 10, 8, 5, 'mossfen_mireFloor') // room A: entrance
fillRect(deepMireTiles, 2, 2, 6, 3, 'mossfen_mireFloor') // Wick-detour room
fillRect(deepMireTiles, 4, 5, 1, 5, 'mossfen_mireFloor') // branch corridor
fillRect(deepMireTiles, 9, 12, 5, 1, 'mossfen_mireFloor') // gate corridor (chokepoint)
fillRect(deepMireTiles, 14, 9, 6, 7, 'mossfen_mireFloor') // room B: evidence/cache
fillRect(deepMireTiles, 20, 12, 4, 1, 'mossfen_mireFloor') // corridor to Warden door
setTile(deepMireTiles, 2, 10, 'mossfen_rootTangle')
setTile(deepMireTiles, 7, 14, 'mossfen_mossRock')
setTile(deepMireTiles, 14, 15, 'mossfen_ruins')
setTile(deepMireTiles, 15, 15, 'mossfen_ruins')
setTile(deepMireTiles, 19, 9, 'mossfen_bogPool')
setTile(deepMireTiles, 0, 12, 'door')
setTile(deepMireTiles, 23, 12, 'door')

// === Map 4: Bog Warden's Lair (12x12) — boss arena, last room off the
// Deep Mire. A single-tile corridor (x=5) funnels straight into the open
// rune grotto, so the fight at (5,6) cannot be sidestepped — same
// chokepoint pattern theHollow.js uses for its final boss. ===
const wardenLairTiles = buildGrid(12, 12, 'mossfen_wardenWall')
fillRect(wardenLairTiles, 1, 1, 10, 5, 'mossfen_wardenFloor') // grotto room
fillRect(wardenLairTiles, 5, 6, 1, 5, 'mossfen_wardenFloor') // approach corridor
setTile(wardenLairTiles, 2, 2, 'mossfen_ruins')
setTile(wardenLairTiles, 9, 2, 'mossfen_ruins')
setTile(wardenLairTiles, 8, 4, 'mossfen_mossRock')
setTile(wardenLairTiles, 3, 4, 'mossfen_rootTangle')

// Entry point near where the starskiff sets down on the fringe of the
// bog. Open mud tile, walkable, clear of NPCs/triggers/enemySpawns.
export const ENTRY = { x: 13, y: 16 }

export const mossfenReachWorld = {
  id: 'mossfenReach',
  name: 'Mossfen Reach',
  startMap: 'approach',
  entry: ENTRY,
  maps: {
    approach: {
      width: 26,
      height: 20,
      tiles: approachTiles,
      npcs: [
        {
          id: 'juro',
          x: 8,
          y: 8,
          facing: 'down',
          spriteId: 'mossfen_sentry',
          dialogue: [
            'Bog-stalkers nest past the reeds — stay on the mud.',
            "Settlement's through the north gate. Go tell the elders.",
            "That mossy rock west of here looks hollow. Worth a look.",
          ],
        },
      ],
      enemySpawns: [
        { id: 'approach_stalker1', x: 6, y: 5, enemyId: 'mossfen_bogStalker', spriteId: 'mossfen_bogStalker' },
        { id: 'approach_viper1', x: 19, y: 4, enemyId: 'mossfen_reedViper', spriteId: 'mossfen_reedViper' },
        { id: 'approach_lurker1', x: 10, y: 15, enemyId: 'mossfen_mireLurker', spriteId: 'mossfen_mireLurker' },
        { id: 'approach_stalker2', x: 20, y: 16, enemyId: 'mossfen_bogStalker', spriteId: 'mossfen_bogStalker' },
      ],
      secrets: [
        {
          id: 'approachMossRockStash',
          x: 4,
          y: 9,
          reward: { tonic: 1 },
          dialogue: ['The moss-rock is hollow — someone hid a cache inside.', 'Found a tonic!'],
        },
      ],
      warps: [{ x: 13, y: 1, toMap: 'settlement', toX: 10, toY: 13 }],
      triggers: [
        {
          x: 5,
          y: 13,
          once: true,
          setsFlag: 'mossfen_loreSeen',
          onEnter: (ctx) => {
            ctx.showDialogue(['Gogu goes still. "I was born here."', '"The Syndicate came for the Current first."'])
          },
        },
        {
          x: 21,
          y: 13,
          once: true,
          setsFlag: 'mossfen_cacheFound',
          onEnter: (ctx) => {
            ctx.state.inventory.medkit = (ctx.state.inventory.medkit || 0) + 1
            ctx.showDialogue(['A waterproofed satchel, hidden in the reeds.', 'Found a medkit!'])
          },
        },
      ],
    },
    settlement: {
      width: 21,
      height: 18,
      tiles: settlementTiles,
      npcs: [
        {
          id: 'finnTheTracker',
          x: 4,
          y: 5,
          facing: 'down',
          spriteId: 'mossfen_tracker',
          watchesQuests: ['mossfen_lostScout'],
          dialogue: (state) => {
            const quest = state.quests['mossfen_lostScout']
            if (!quest) {
              startQuest(state, 'mossfen_lostScout', 'The Lost Scout', 'T3')
              return ['Finn grips his spear. "My kin Wick is missing in the Mire."', '"Please — find her."']
            }
            if (quest.complete) {
              return ["Wick's home safe, telling everyone her story.", '"Any kin of yours is kin of the Reach now."']
            }
            if (quest.stage >= 1) {
              state.inventory.medkit = (state.inventory.medkit || 0) + 1
              completeQuest(state, 'mossfen_lostScout')
              return ['"You found her!" Finn beams with relief.', 'He hands you a medkit for the road.']
            }
            return ['"She went in past the gate-tree. Hurry."']
          },
        },
        {
          id: 'birchKeeper',
          x: 16,
          y: 5,
          facing: 'down',
          spriteId: 'mossfen_elder',
          watchesQuests: ['mossfen_syndicateTrail'],
          dialogue: (state) => {
            const quest = state.quests['mossfen_syndicateTrail']
            if (!quest) {
              startQuest(state, 'mossfen_syndicateTrail', 'What the Syndicate Took', 'T4')
              return [
                '"The Syndicate dug for something at the old shrine."',
                '"I need to know what. Follow the shrine path."',
              ]
            }
            if (quest.complete) {
              return ['"The Warden\'s quiet now, but the Syndicate won\'t stop."', '"Watch the sky when you leave, Wando."']
            }
            if (quest.stage >= 1) {
              return [
                '"A siphon rig — they were draining the Current itself."',
                '"Something corrupted guards the rest. Go in strength."',
              ]
            }
            return ['"Follow the shrine path into the Mire."']
          },
        },
        {
          id: 'mireChild',
          x: 10,
          y: 4,
          facing: 'down',
          spriteId: 'mossfen_fenling',
          dialogue: [
            '"You feel the hum too? That\'s the Current."',
            '"Tell Gogu the Reach still waits for him."',
          ],
        },
        {
          id: 'selaNetmender',
          x: 15,
          y: 12,
          facing: 'down',
          spriteId: 'mossfen_netmender',
          dialogue: [
            '"The deep channel runs black — no kinlight, no crossing."',
            '"Wick carries a glow-reed lantern. Find it."',
          ],
        },
      ],
      enemySpawns: [],
      warps: [
        { x: 10, y: 14, toMap: 'approach', toX: 13, toY: 2 },
        { x: 20, y: 6, toMap: 'deepMire', toX: 1, toY: 12 },
      ],
      triggers: [],
    },
    deepMire: {
      width: 24,
      height: 24,
      tiles: deepMireTiles,
      npcs: [
        {
          id: 'oldHarl',
          x: 3,
          y: 3,
          facing: 'down',
          spriteId: 'mossfen_hermit',
          dialogue: [
            '"Lived in these roots since before the nets came."',
            '"Something woke in the deep water. Mind yourself."',
          ],
        },
      ],
      enemySpawns: [
        { id: 'mire_lurker1', x: 3, y: 11, enemyId: 'mossfen_mireLurker', spriteId: 'mossfen_mireLurker' },
        { id: 'mire_stalker1', x: 6, y: 13, enemyId: 'mossfen_bogStalker', spriteId: 'mossfen_bogStalker' },
        { id: 'mire_viper1', x: 17, y: 10, enemyId: 'mossfen_reedViper', spriteId: 'mossfen_reedViper' },
        { id: 'mire_stalker2', x: 18, y: 14, enemyId: 'mossfen_bogStalker', spriteId: 'mossfen_bogStalker' },
      ],
      warps: [
        { x: 0, y: 12, toMap: 'settlement', toX: 19, toY: 6 },
        { x: 23, y: 12, toMap: 'wardenLair', toX: 5, toY: 10 },
      ],
      triggers: [
        // Practical quest payoff: finding Wick is a short detour off the
        // main path — skipping it means never getting mossfen_glowReed,
        // and never getting past the gate below.
        {
          x: 5,
          y: 4,
          once: true,
          setsFlag: 'mossfen_glowReed',
          onEnter: (ctx) => {
            const { state } = ctx
            startQuest(state, 'mossfen_lostScout', 'The Lost Scout', 'T3')
            setQuestStage(state, 'mossfen_lostScout', 1)
            ctx.showDialogue(['Tangled in root-snares: Wick, Finn\'s kin.', '"Take this kinlight — it wards off the dark."'])
          },
        },
        // One-tile gate: the only way from the entrance side to the rest
        // of the Mire. Fires every time (not `once`) so it keeps bouncing
        // the player back until mossfen_glowReed is set, then is a no-op.
        {
          x: 12,
          y: 12,
          onEnter: (ctx) => {
            if (!ctx.state.flags.has('mossfen_glowReed')) {
              ctx.showDialogue(['The water runs black here.', 'No kinlight, no crossing.'])
              ctx.warpTo({ toMap: 'deepMire', toX: 11, toY: 12 })
            }
          },
        },
        // Plot quest payoff: proof of what the Syndicate was after here,
        // only reachable once the gate above has been passed.
        {
          x: 16,
          y: 13,
          once: true,
          setsFlag: 'mossfen_evidenceFound',
          onEnter: (ctx) => {
            const { state } = ctx
            startQuest(state, 'mossfen_syndicateTrail', 'What the Syndicate Took', 'T4')
            setQuestStage(state, 'mossfen_syndicateTrail', 1)
            ctx.showDialogue([
              'A cracked Syndicate siphon rig, half-buried in muck.',
              '"Mossroot nodes test positive for Current draw..."',
            ])
          },
        },
        {
          x: 18,
          y: 10,
          once: true,
          setsFlag: 'mossfen_mireCacheFound',
          onEnter: (ctx) => {
            ctx.state.inventory.medkit = (ctx.state.inventory.medkit || 0) + 1
            ctx.showDialogue(['A waterproof satchel, wedged in the roots.', 'Found a medkit!'])
          },
        },
      ],
    },
    wardenLair: {
      width: 12,
      height: 12,
      tiles: wardenLairTiles,
      npcs: [],
      enemySpawns: [],
      warps: [],
      triggers: [
        // Mandatory boss encounter: the single tile connecting the
        // corridor to the grotto room, so it cannot be bypassed (see map
        // comment above). once:true so re-entering after the fight does
        // not replay the lead-in or restart the battle.
        {
          x: 5,
          y: 6,
          once: true,
          setsFlag: 'mossfen_bossEngaged',
          onEnter: (ctx) => {
            ctx.showDialogue(
              [
                'The corridor opens on a sunken grotto.',
                '"Bog Warden..." Gogu\'s voice shakes. "What did they do to it?"',
                'Wando raises his shield. "Gogu — stay close."',
              ],
              () => {
                ctx.startBattle(['mossfen_bogWarden'], {
                  onVictory: (state) => {
                    const nextWorldId = unlockNextWorld(state, 'mossfenReach')
                    completeQuest(state, 'mossfen_syndicateTrail')
                    ctx.showDialogue(
                      [
                        'The corrupted plating cracks away; only still water remains.',
                        'Wando finds a scorched Syndicate medallion. "There\'s a bigger station out there — Ashvault."',
                        '"Then that\'s where we go," Gogu says. Head back to the Starskiff.',
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

registerWorld(mossfenReachWorld)
