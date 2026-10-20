import { registerWorld } from './registry.js'
import { registerTileTypes } from '../assets/tiles.js'
import { registerSprites } from '../assets/sprites/registry.js'
import { registerEnemies } from '../battle/enemies.js'
import { registerMoves } from '../battle/moves.js'
import { HUMANOID_TEMPLATE, buildSprite } from '../assets/spriteTemplates.js'
import { startQuest, setQuestStage, completeQuest } from '../data/gameState.js'

/**
 * World 5 — The Hollow: the Hollow Syndicate's buried stronghold, and the end
 * of the Drift. This is the FINALE — there is no chapter after it, so this
 * file never calls unlockNextWorld. Structure, infiltration-style:
 *   outerHollow (entry, patrols, shield relay)
 *     -> innerSanctum (regrouped forces, a captive to free)
 *       -> wardenChamber (corridor build-up into the one-tile-chokepoint
 *          boss arena — same chokepoint pattern v1 used, just with more
 *          lead-in before it, and a real onVictory ending instead of the
 *          old "walk past the boss" epilogue-trigger workaround).
 */

function makeRoom(width, height, floorId, wallId = 'hollow_wall') {
  const tiles = []
  for (let y = 0; y < height; y++) {
    const row = []
    for (let x = 0; x < width; x++) {
      const border = x === 0 || y === 0 || x === width - 1 || y === height - 1
      row.push(border ? wallId : floorId)
    }
    tiles.push(row)
  }
  return tiles
}

function setTile(tiles, x, y, id) {
  tiles[y][x] = id
}

// --- Tile types (namespaced 'hollow_' — deep reds/blacks/purples) --------
registerTileTypes({
  hollow_floor: { color: '#1a0e14', dither: '#120a0e', walkable: true },
  hollow_wall: { color: '#2e0f16', walkable: false },
  hollow_rune: { color: '#6e1620', dither: '#4a0f16', walkable: true },
  hollow_courtyard: { color: '#241018', dither: '#1a0c12', walkable: true, encounter: true },
  hollow_cellFloor: { color: '#2a1620', dither: '#1c0f16', walkable: true },
})

// --- Sprites ---------------------------------------------------------------
const rellSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#4a3a3a',
  V: '#0b0d12',
  T: '#8a6a6a',
  A: '#3a2a2a',
  L: '#1a1212',
})

const vexSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#5c4a5c',
  V: '#0b0d12',
  T: '#c9a876',
  A: '#3a2e3a',
  L: '#1a1420',
})

const lookoutSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#3a2a30',
  V: '#8a1526',
  T: '#6e1620',
  A: '#2e1a22',
  L: '#120a0e',
})

const junSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#2e1420',
  V: '#e0564b',
  T: '#8a1526',
  A: '#3a1826',
  L: '#120a0e',
})

const eliteGuardSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#4a0f16',
  V: '#120a0e',
  T: '#8a1526',
  A: '#2e0f16',
  L: '#120a0e',
})

const shadowAgentSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#1a0e14',
  V: '#e0564b',
  T: '#4a0f16',
  A: '#120a0e',
  L: '#0b0d12',
})

const wardenSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#2e0f16',
  V: '#e0564b',
  T: '#8a1526',
  A: '#4a0f16',
  L: '#120a0e',
})

registerSprites({
  hollow_rell: rellSprite,
  hollow_vex: vexSprite,
  hollow_lookout: lookoutSprite,
  hollow_jun: junSprite,
  hollow_eliteGuard: eliteGuardSprite,
  hollow_shadowAgent: shadowAgentSprite,
  hollow_syndicateWarden: wardenSprite,
})

// --- Moves -------------------------------------------------------------
registerMoves({
  hollow_shockLance: { name: 'Shock Lance', kind: 'attack', power: 10, focusCost: 0, accuracy: 0.88 },
  hollow_crushingBlow: { name: 'Crushing Blow', kind: 'attack', power: 16, focusCost: 0, accuracy: 0.85 },
  hollow_resonantSlam: { name: 'Resonant Slam', kind: 'attack', power: 19, focusCost: 0, accuracy: 0.78 },
  hollow_syndicateVenom: { name: 'Syndicate Venom', kind: 'debuff', power: 5, focusCost: 0, accuracy: 0.9 },
  hollow_wardenResolve: { name: "Warden's Resolve", kind: 'heal', power: 16, focusCost: 0, accuracy: 1 },
})

// --- Enemies -------------------------------------------------------------
// Two regular elite-guard types patrolling the outer courtyard and the
// regrouped forces in the sanctum, plus the buffed final boss.
registerEnemies({
  hollow_eliteGuard: {
    name: 'Hollow Elite Guard',
    spriteId: 'hollow_eliteGuard',
    maxHp: 64,
    atk: 14,
    def: 7,
    spd: 6,
    moves: ['hollow_shockLance', 'push'],
    xpReward: 55,
  },
  hollow_shadowAgent: {
    name: 'Hollow Shadow Agent',
    spriteId: 'hollow_shadowAgent',
    maxHp: 52,
    atk: 11,
    def: 5,
    spd: 9,
    moves: ['hollow_syndicateVenom', 'strike'],
    xpReward: 50,
  },
  // Final boss — buffed from v1's 155 HP to the ch.5 balance target
  // (190-230) since the party is well leveled by the time it's reached.
  hollow_syndicateWarden: {
    name: 'Syndicate Warden',
    spriteId: 'hollow_syndicateWarden',
    maxHp: 210,
    atk: 22,
    def: 12,
    spd: 8,
    moves: ['hollow_crushingBlow', 'hollow_resonantSlam', 'hollow_syndicateVenom', 'hollow_wardenResolve'],
    xpReward: 260,
    isBoss: true,
  },
})

// --- Quest -----------------------------------------------------------------
const FINALE_QUEST_ID = 'hollow_finaleQuestId'
const FINALE_QUEST_NAME = 'Break the Hollow'

// --- Map 1: Outer Hollow (entry, patrols, shield relay) --------------------
const OUTER_W = 16
const OUTER_H = 14
const outerHollowTiles = makeRoom(OUTER_W, OUTER_H, 'hollow_courtyard')
// A handful of interior pillars for patrol cover — decorative, none of them
// sit on the column-8 route between the entry and the exit, or on any
// NPC/trigger tile.
for (const [x, y] of [[3, 3], [3, 4], [12, 10], [12, 11], [6, 7]]) {
  setTile(outerHollowTiles, x, y, 'hollow_wall')
}
// Shield-relay console, marked with rune tiling.
setTile(outerHollowTiles, 8, 3, 'hollow_rune')

export const ENTRY = { x: 8, y: 12 }

function vexDialogue(state) {
  const quest = state.quests[FINALE_QUEST_ID]
  if (!quest || quest.stage === 0) {
    return [
      "You're Kade. The armorer. Word travels even down here.",
      "I'm Vex — ran courier for the Syndicate until I saw what they actually want Moss for.",
      "The Warden's shield relay is still live, up past the courtyard. Knock it out before you push deeper, or every alarm in the Hollow finds you at once.",
    ]
  }
  if (quest.stage === 1) {
    return [
      "Relay's dark — good. That buys you a straight run through the sanctum.",
      "They're still holding some of the people they dragged in off Ashvault and the Canopy. If you can free them, do it.",
    ]
  }
  return [
    'You freed them. That\'s more mercy than the Hollow\'s shown anyone in years.',
    "The Warden's past the sanctum, in the old rune chamber. Whatever happens in there — Moss doesn't face it alone.",
  ]
}

function lookoutDialogue(state) {
  if (state.flags.has('hollow_relayDisabled')) {
    return ['Alarms are dead now. Patrols are still walking their old routes out of habit — use that.']
  }
  return ['Patrol sweeps every few minutes. Stick to the open floor and you can read their pattern before they see you.']
}

const outerHollowMap = {
  width: OUTER_W,
  height: OUTER_H,
  tiles: outerHollowTiles,
  npcs: [
    {
      id: 'vex',
      x: 5,
      y: 10,
      facing: 'up',
      spriteId: 'hollow_vex',
      dialogue: vexDialogue,
    },
    {
      id: 'lookout',
      x: 11,
      y: 9,
      facing: 'left',
      spriteId: 'hollow_lookout',
      dialogue: lookoutDialogue,
    },
  ],
  encounterZones: [{ x: 2, y: 2, w: 12, h: 9, chance: 0.15, enemyIds: ['hollow_eliteGuard', 'hollow_shadowAgent'] }],
  warps: [{ x: 8, y: 1, toMap: 'innerSanctum', toX: 7, toY: 12 }],
  triggers: [
    // Fires on the first step away from the entry — kicks off the finale
    // quest regardless of which path the player takes afterward.
    {
      x: 8,
      y: 11,
      once: true,
      onEnter(ctx) {
        startQuest(ctx.state, FINALE_QUEST_ID, FINALE_QUEST_NAME)
        ctx.showDialogue([
          'This is it — the Hollow itself. Every road since Rustmoor led here.',
          'Moss presses close to Kade\'s side. "I can feel it. Whatever they built to use me... it\'s close."',
          "Cut their defenses, get anyone they're still holding, and we go straight for the one in charge.",
        ])
      },
    },
    // Shield relay — a quest beat, not a fight. Defensively starts the
    // quest too, in case the player reaches it before talking to Vex.
    {
      x: 8,
      y: 3,
      once: true,
      setsFlag: 'hollow_relayDisabled',
      onEnter(ctx) {
        startQuest(ctx.state, FINALE_QUEST_ID, FINALE_QUEST_NAME)
        setQuestStage(ctx.state, FINALE_QUEST_ID, 1)
        ctx.showDialogue([
          'A humming console, half-buried in rune conduit — the shield relay.',
          'Kade jams a blade into the housing. The hum dies. Somewhere deep in the Hollow, an alarm that never got to ring goes quiet.',
        ])
      },
    },
  ],
}

// --- Map 2: Inner Sanctum (regrouped forces, a captive to free) ------------
const INNER_W = 14
const INNER_H = 14
const innerSanctumTiles = makeRoom(INNER_W, INNER_H, 'hollow_floor')
// A walled cell alcove on the west side, reachable only through the single
// doorway tile at (4,6) — the same one-tile-chokepoint idea as the boss
// corridor, just scaled down for a small rescue beat.
for (const [x, y] of [[2, 5], [3, 5], [2, 6], [3, 6], [2, 7], [3, 7], [4, 6]]) {
  setTile(innerSanctumTiles, x, y, 'hollow_cellFloor')
}
for (const [x, y] of [[2, 4], [3, 4], [4, 4], [2, 8], [3, 8], [4, 8], [1, 5], [1, 6], [1, 7], [4, 5], [4, 7]]) {
  setTile(innerSanctumTiles, x, y, 'hollow_wall')
}

function rellDialogue(state) {
  if (state.flags.has('hollow_rellFreed')) {
    return [
      "Air. Real air. I'd almost forgotten what that felt like.",
      "Go, Kade — finish this. I've got people to find and a long walk out of here.",
    ]
  }
  return [
    '...Kade? They said you\'d be dead by Ashvault.',
    "Get this chain off and I'll tell you everything I heard them say about Moss.",
  ]
}

function junDialogue(state) {
  if (state.unlockedWorlds.length >= 5) {
    return [
      'Rustmoor. Mossfen. Ashvault. The Canopy. And now here.',
      "You crossed the whole Drift to reach this room. The Warden knows it too — that's why it hasn't fled.",
    ]
  }
  return [
    "Whatever path brought you here, it ends past that door.",
    "The Warden doesn't run. It's waited this long on purpose.",
  ]
}

const innerSanctumMap = {
  width: INNER_W,
  height: INNER_H,
  tiles: innerSanctumTiles,
  npcs: [
    {
      id: 'rell',
      x: 2,
      y: 6,
      facing: 'right',
      spriteId: 'hollow_rell',
      dialogue: rellDialogue,
    },
    {
      id: 'jun',
      x: 9,
      y: 7,
      facing: 'left',
      spriteId: 'hollow_jun',
      dialogue: junDialogue,
    },
  ],
  encounterZones: [{ x: 5, y: 2, w: 7, h: 8, chance: 0.17, enemyIds: ['hollow_eliteGuard', 'hollow_shadowAgent'] }],
  warps: [{ x: 7, y: 1, toMap: 'wardenChamber', toX: 4, toY: 13 }],
  triggers: [
    {
      x: 7,
      y: 11,
      once: true,
      onEnter(ctx) {
        const quest = ctx.state.quests[FINALE_QUEST_ID]
        const lines =
          quest && quest.stage >= 1
            ? ["The sanctum beyond is quiet — too quiet. Whatever's left of the Warden's guard is falling back to regroup."]
            : ['Alarms are still live somewhere behind you. Move fast.']
        ctx.showDialogue(lines)
      },
    },
    // Freeing Rell: the single doorway tile into her cell. once:true so
    // walking past her again doesn't replay the rescue.
    {
      x: 4,
      y: 6,
      once: true,
      setsFlag: 'hollow_rellFreed',
      onEnter(ctx) {
        startQuest(ctx.state, FINALE_QUEST_ID, FINALE_QUEST_NAME)
        setQuestStage(ctx.state, FINALE_QUEST_ID, 2)
        ctx.showDialogue([
          'Chains shatter at a touch — these were never meant to hold against a real fight.',
          'Rell slumps forward, then catches herself. "...Kade. You actually came."',
        ])
      },
    },
  ],
}

// --- Map 3: Warden's Chamber (corridor build-up into the boss arena) -------
// 10x15. Rows 1-3, cols 2-7 form the rune-lit arena. The only way in is the
// single-tile opening at (4,4), fed by a one-tile-wide corridor (rows 5-12,
// col 4 only) running down to the door at (4,13) — so there is no route
// around the chokepoint trigger at (4,4); every other tile in the corridor
// rows and the chokepoint row is a wall. The corridor is longer than v1's
// so there's real build-up (a couple of patrol encounters) before the
// boss, instead of walking straight from the door into the fight.
const WC_W = 10
const WC_H = 15
const wardenChamberTiles = []
for (let y = 0; y < WC_H; y++) {
  if (y === 0 || y === WC_H - 1) {
    wardenChamberTiles.push(Array(WC_W).fill('hollow_wall'))
  } else if (y >= 1 && y <= 3) {
    wardenChamberTiles.push(['hollow_wall', 'hollow_wall', ...Array(6).fill('hollow_rune'), 'hollow_wall', 'hollow_wall'])
  } else if (y === 4) {
    wardenChamberTiles.push([...Array(4).fill('hollow_wall'), 'hollow_rune', ...Array(5).fill('hollow_wall')])
  } else if (y >= 5 && y <= 12) {
    wardenChamberTiles.push([...Array(4).fill('hollow_wall'), 'hollow_floor', ...Array(5).fill('hollow_wall')])
  } else {
    // y === 13: the entry door
    wardenChamberTiles.push([...Array(4).fill('hollow_wall'), 'door', ...Array(5).fill('hollow_wall')])
  }
}

const wardenChamberMap = {
  width: WC_W,
  height: WC_H,
  tiles: wardenChamberTiles,
  npcs: [],
  encounterZones: [{ x: 4, y: 5, w: 1, h: 8, chance: 0.2, enemyIds: ['hollow_eliteGuard', 'hollow_shadowAgent'] }],
  warps: [],
  triggers: [
    // Mandatory boss encounter — the only tile connecting the corridor to
    // the arena, so it cannot be bypassed (see map comment above). once:
    // true so re-entering the arena after the fight doesn't replay the
    // lead-in or restart the battle.
    {
      x: 4,
      y: 4,
      once: true,
      setsFlag: 'hollow_bossEngaged',
      onEnter: (ctx) => {
        ctx.showDialogue([
          "The corridor opens onto a floor etched in cold red runes — the same sigils from Ashvault's vault, from the Bog Warden's hollow, all of it tracing back here.",
          'At the center, wreathed in Syndicate light, the Warden rises to meet you.',
          '"The little psychic comes to us after all," it rasps. "Every world you crossed to get here, and it ends the same. Kneel, armorer, and he lives."',
          'Kade plants his feet, shield raised. "Moss — stay behind me. This ends now. Not with him."',
        ])
        ctx.startBattle(['hollow_syndicateWarden'], {
          onVictory: (state) => {
            completeQuest(state, FINALE_QUEST_ID)
            state.flags.add('gameCompleted')
            ctx.showDialogue(
              [
                'The Warden falls still. The rune-light flickers, dims, and finally goes dark — the Hollow has nothing left to throw at you.',
                'Moss steps out from behind Kade, small fingers finding his armored hand. "...It\'s quiet. I\'ve never felt it this quiet before."',
                'Kade kneels to his level. "That\'s the Current settling. Nobody\'s hunting it anymore — not here, not in the Reach, not anywhere we\'ve been."',
                "Rell, and everyone else the Syndicate dragged down here, will walk out into daylight they didn't expect to see again.",
                "Kade thinks of the forge-clan that exiled him, a raider's canyon, a drowned bog shrine, a station full of smoke, a refuge in the clouds — every place this road ran through to get here.",
                '"Come on, Moss," he says, straightening up. "Let\'s go see what the Drift looks like without the Hollow watching it."',
                'THE END — head back to the Starskiff to revisit any world of the Drift.',
              ],
              () => ctx.openShip()
            )
          },
        })
      },
    },
  ],
}

// --- World ------------------------------------------------------------
export const theHollowWorld = {
  id: 'theHollow',
  name: 'The Hollow',
  startMap: 'outerHollow',
  entry: ENTRY,
  maps: {
    outerHollow: outerHollowMap,
    innerSanctum: innerSanctumMap,
    wardenChamber: wardenChamberMap,
  },
}

registerWorld(theHollowWorld)
