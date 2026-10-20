import { registerWorld } from './registry.js'
import { registerTileTypes } from '../assets/tiles.js'
import { registerSprites } from '../assets/sprites/registry.js'
import { registerEnemies } from '../battle/enemies.js'
import { registerMoves } from '../battle/moves.js'
import { HUMANOID_TEMPLATE, ARMORED_TEMPLATE, buildSprite } from '../assets/spriteTemplates.js'
import { startQuest, setQuestStage, completeQuest } from '../data/gameState.js'

/**
 * World 5 — The Hollow: the Hollow Syndicate's buried stronghold, and the end
 * of the Drift. This is the FINALE — there is no chapter after it, so this
 * file never calls unlockNextWorld. Structure, infiltration-style:
 *   outerHollow (entry, patrols, shield relay)
 *     -> innerSanctum (regrouped forces, a captive to free)
 *       -> wardenChamber (corridor build-up into the one-tile-chokepoint
 *          boss arena — a longer corridor than before, now with a few
 *          visible patrol enemySpawns, feeding a real onVictory ending).
 *
 * Random encounters are disabled engine-wide: encounterZones are inert, so
 * every map below uses visible, map-placed enemySpawns instead (walking
 * into one's tile starts the fight; once beaten it's remembered as
 * defeated and stops blocking the tile). The only forced fight is the
 * final boss, which stays a Trigger on the chamber's one-tile chokepoint —
 * that cannot be an enemySpawn, since it must be unavoidable.
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
  // Decorative additions for the enlarged maps — mostly unwalkable so they
  // read as stronghold debris/fixtures rather than new floor space.
  hollow_brokenPillar: { color: '#241c1c', dither: '#160f0f', walkable: false },
  hollow_crackedRune: { color: '#4a0a1e', dither: '#2e0612', walkable: true },
  hollow_cage: { color: '#15151c', dither: '#0a0a10', walkable: false },
  hollow_machinery: { color: '#241c08', dither: '#160f04', walkable: false },
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

const eliteGuardSprite = buildSprite(ARMORED_TEMPLATE, {
  H: '#4a0f16',
  F: '#120a0e',
  S: '#120a0e',
  T: '#8a1526',
  A: '#2e0f16',
  L: '#120a0e',
})

const shadowAgentSprite = buildSprite(ARMORED_TEMPLATE, {
  H: '#1a0e14',
  F: '#e0564b',
  S: '#0b0d12',
  T: '#4a0f16',
  A: '#120a0e',
  L: '#0b0d12',
})

const wardenSprite = buildSprite(ARMORED_TEMPLATE, {
  H: '#2e0f16',
  F: '#e0564b',
  S: '#120a0e',
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
  hollow_syndicateVenom: {
    name: 'Syndicate Venom',
    kind: 'debuff',
    power: 5,
    focusCost: 0,
    accuracy: 0.9,
    applyStatus: { type: 'poison', duration: 3, power: 4 },
  },
  hollow_wardenResolve: { name: "Warden's Resolve", kind: 'heal', power: 16, focusCost: 0, accuracy: 1 },
})

// --- Enemies -------------------------------------------------------------
// Two regular elite-guard types, now placed as visible enemySpawns across
// the outer courtyard, the sanctum, and the warden's corridor, plus the
// buffed final boss (still a forced Trigger fight at the chokepoint).
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
const FINALE_QUEST_KEY = 'T9'

// --- Map 1: Outer Hollow (entry, patrols, shield relay) --------------------
// 19x16 (was 16x14) — bigger courtyard with pillar cover, broken-pillar
// rubble, cracked-rune floor patches, an empty cage cluster, and a
// machinery bank filling the extra space. Main thoroughfare is kept clear
// along column x=8 from the entry up to the relay/warp.
const OUTER_W = 19
const OUTER_H = 16
const outerHollowTiles = makeRoom(OUTER_W, OUTER_H, 'hollow_courtyard')
// Patrol-cover pillars — kept off the x=9 thoroughfare and every
// NPC/trigger/enemySpawn tile.
for (const [x, y] of [[4, 3], [4, 4], [14, 10], [14, 11], [7, 8]]) {
  setTile(outerHollowTiles, x, y, 'hollow_wall')
}
for (const [x, y] of [[3, 7], [3, 8], [16, 8]]) {
  setTile(outerHollowTiles, x, y, 'hollow_brokenPillar')
}
for (const [x, y] of [[11, 5], [11, 6], [6, 13]]) {
  setTile(outerHollowTiles, x, y, 'hollow_crackedRune')
}
for (const [x, y] of [[15, 12], [16, 12]]) {
  setTile(outerHollowTiles, x, y, 'hollow_cage')
}
for (const [x, y] of [[12, 4], [13, 4]]) {
  setTile(outerHollowTiles, x, y, 'hollow_machinery')
}
// Shield-relay console, marked with rune tiling.
setTile(outerHollowTiles, 9, 3, 'hollow_rune')

export const ENTRY = { x: 9, y: 14 }

function vexDialogue(state) {
  const quest = state.quests[FINALE_QUEST_ID]
  if (!quest || quest.stage === 0) {
    return ["I'm Vex. I escaped the Syndicate.", 'Kill the shield relay past the courtyard before you go deeper.']
  }
  if (quest.stage === 1) {
    return ["Relay's dead — good.", "They're still holding prisoners. Free them if you can."]
  }
  return ["You freed them. That's rare mercy down here.", "The Warden waits past the sanctum. Gogu won't face it alone."]
}

function lookoutDialogue(state) {
  if (state.flags.has('hollow_relayDisabled')) {
    return ['Alarms are dead. Patrols still walk old routes.', 'One of the broken pillars near the west wall is hollow.']
  }
  return ['Patrols sweep every few minutes. Watch the pattern.', 'One of the broken pillars near the west wall is hollow.']
}

const outerHollowMap = {
  width: OUTER_W,
  height: OUTER_H,
  tiles: outerHollowTiles,
  npcs: [
    {
      id: 'vex',
      x: 6,
      y: 11,
      facing: 'up',
      spriteId: 'hollow_vex',
      watchesQuests: [FINALE_QUEST_ID],
      dialogue: vexDialogue,
    },
    {
      id: 'lookout',
      x: 13,
      y: 10,
      facing: 'left',
      spriteId: 'hollow_lookout',
      watchesFlags: ['hollow_relayDisabled'],
      dialogue: lookoutDialogue,
    },
  ],
  enemySpawns: [
    { id: 'outer_guard1', x: 5, y: 5, enemyId: 'hollow_eliteGuard', spriteId: 'hollow_eliteGuard' },
    { id: 'outer_guard2', x: 15, y: 5, enemyId: 'hollow_shadowAgent', spriteId: 'hollow_shadowAgent' },
    { id: 'outer_guard3', x: 12, y: 12, enemyId: 'hollow_eliteGuard', spriteId: 'hollow_eliteGuard' },
  ],
  secrets: [
    {
      id: 'outerPillarStash',
      x: 3,
      y: 7,
      reward: { medkit: 1, tonic: 1 },
      dialogue: ['The pillar crumbles — a guard’s stashed kit!', 'Found a medkit and a tonic!'],
    },
  ],
  warps: [{ x: 9, y: 1, toMap: 'innerSanctum', toX: 8, toY: 13 }],
  triggers: [
    // Fires on the first step away from the entry — kicks off the finale
    // quest regardless of which path the player takes afterward.
    {
      x: 9,
      y: 13,
      once: true,
      onEnter(ctx) {
        startQuest(ctx.state, FINALE_QUEST_ID, FINALE_QUEST_NAME, FINALE_QUEST_KEY)
        ctx.showDialogue(['This is the Hollow — it ends here.', 'Cut their defenses, then go for the one in charge.'])
      },
    },
    // Shield relay — a quest beat, not a fight. Defensively starts the
    // quest too, in case the player reaches it before talking to Vex.
    {
      x: 9,
      y: 3,
      once: true,
      setsFlag: 'hollow_relayDisabled',
      onEnter(ctx) {
        startQuest(ctx.state, FINALE_QUEST_ID, FINALE_QUEST_NAME, FINALE_QUEST_KEY)
        setQuestStage(ctx.state, FINALE_QUEST_ID, 1)
        ctx.showDialogue(['The shield relay hums before you.', 'Wando cuts it dead — the alarms go silent.'])
      },
    },
  ],
}

// --- Map 2: Inner Sanctum (regrouped forces, a captive to free) ------------
// 17x16 (was 14x14) — the west cell alcove is unchanged (same one-tile
// doorway chokepoint), with the extra room filled by broken pillars,
// cracked-rune floor, a cage cluster, and a machinery bank to the east.
const INNER_W = 17
const INNER_H = 16
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
for (const [x, y] of [[9, 3], [9, 4], [6, 3]]) {
  setTile(innerSanctumTiles, x, y, 'hollow_brokenPillar')
}
for (const [x, y] of [[12, 8], [12, 9], [14, 6]]) {
  setTile(innerSanctumTiles, x, y, 'hollow_crackedRune')
}
for (const [x, y] of [[6, 13], [7, 13]]) {
  setTile(innerSanctumTiles, x, y, 'hollow_cage')
}
for (const [x, y] of [[13, 4], [14, 4]]) {
  setTile(innerSanctumTiles, x, y, 'hollow_machinery')
}

function rellDialogue(state) {
  if (state.flags.has('hollow_rellFreed')) {
    return ["Real air. I'd forgotten the feel.", 'Go finish this, Wando.']
  }
  return ['...Wando? They said you were dead.', "Free me and I'll tell you about Gogu."]
}

function junDialogue(state) {
  if (state.unlockedWorlds.length >= 5) {
    return ['You crossed the whole Drift to get here.', "The Warden knows — that's why it stayed."]
  }
  return ['This ends past that door.', "The Warden isn't running."]
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
      watchesQuests: [FINALE_QUEST_ID],
      dialogue: rellDialogue,
    },
    {
      id: 'jun',
      x: 10,
      y: 7,
      facing: 'left',
      spriteId: 'hollow_jun',
      dialogue: junDialogue,
    },
  ],
  enemySpawns: [
    { id: 'inner_guard1', x: 12, y: 4, enemyId: 'hollow_eliteGuard', spriteId: 'hollow_eliteGuard' },
    { id: 'inner_guard2', x: 6, y: 10, enemyId: 'hollow_shadowAgent', spriteId: 'hollow_shadowAgent' },
    { id: 'inner_guard3', x: 13, y: 11, enemyId: 'hollow_eliteGuard', spriteId: 'hollow_eliteGuard' },
  ],
  warps: [{ x: 8, y: 1, toMap: 'wardenChamber', toX: 4, toY: 17 }],
  triggers: [
    {
      x: 8,
      y: 12,
      once: true,
      onEnter(ctx) {
        const quest = ctx.state.quests[FINALE_QUEST_ID]
        const lines = quest && quest.stage >= 1 ? ["The sanctum's quiet — too quiet."] : ['Alarms are still live. Move fast.']
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
        startQuest(ctx.state, FINALE_QUEST_ID, FINALE_QUEST_NAME, FINALE_QUEST_KEY)
        setQuestStage(ctx.state, FINALE_QUEST_ID, 2)
        ctx.showDialogue(['The chains break at a touch.', 'Rell: "...Wando. You came."'])
      },
    },
  ],
}

// --- Map 3: Warden's Chamber (corridor build-up into the boss arena) -------
// 10x19 (was 10x15). Rows 1-3, cols 2-7 form the rune-lit arena, unchanged.
// The only way in is the single-tile opening at (4,4), fed by a one-tile-
// wide corridor (rows 5-16, col 4 only) running down to the door at
// (4,17) — longer than before (12 corridor rows vs. 8), but still exactly
// one tile wide, so there is no route around the chokepoint trigger at
// (4,4); every other tile in the corridor rows and the chokepoint row is a
// wall. The corridor's side walls (cols 3 and 5) get cage/machinery/
// broken-pillar dressing at a few rows purely for flavor — they stay
// unwalkable either way, so the chokepoint geometry is untouched. A few
// visible enemySpawns patrol the corridor itself as build-up before the
// boss.
const WC_W = 10
const WC_H = 19
const wardenChamberTiles = []
for (let y = 0; y < WC_H; y++) {
  if (y === 0 || y === WC_H - 1) {
    wardenChamberTiles.push(Array(WC_W).fill('hollow_wall'))
  } else if (y >= 1 && y <= 3) {
    wardenChamberTiles.push(['hollow_wall', 'hollow_wall', ...Array(6).fill('hollow_rune'), 'hollow_wall', 'hollow_wall'])
  } else if (y === 4) {
    wardenChamberTiles.push([...Array(4).fill('hollow_wall'), 'hollow_rune', ...Array(5).fill('hollow_wall')])
  } else if (y >= 5 && y <= 16) {
    wardenChamberTiles.push([...Array(4).fill('hollow_wall'), 'hollow_floor', ...Array(5).fill('hollow_wall')])
  } else {
    // y === 17: the entry door
    wardenChamberTiles.push([...Array(4).fill('hollow_wall'), 'door', ...Array(5).fill('hollow_wall')])
  }
}
// Cosmetic-only side-wall dressing — cols 3 and 5 are already unwalkable
// 'hollow_wall', so swapping a few rows to other unwalkable decorative
// types changes nothing about the chokepoint's one-tile-wide geometry.
for (const [x, y] of [[3, 6], [5, 6]]) {
  setTile(wardenChamberTiles, x, y, 'hollow_cage')
}
for (const [x, y] of [[3, 10], [5, 10]]) {
  setTile(wardenChamberTiles, x, y, 'hollow_machinery')
}
for (const [x, y] of [[3, 13], [5, 13]]) {
  setTile(wardenChamberTiles, x, y, 'hollow_brokenPillar')
}

const wardenChamberMap = {
  width: WC_W,
  height: WC_H,
  tiles: wardenChamberTiles,
  npcs: [],
  enemySpawns: [
    { id: 'warden_corridor_guard1', x: 4, y: 8, enemyId: 'hollow_eliteGuard', spriteId: 'hollow_eliteGuard' },
    { id: 'warden_corridor_guard2', x: 4, y: 11, enemyId: 'hollow_shadowAgent', spriteId: 'hollow_shadowAgent' },
    { id: 'warden_corridor_guard3', x: 4, y: 14, enemyId: 'hollow_eliteGuard', spriteId: 'hollow_eliteGuard' },
  ],
  warps: [],
  triggers: [
    // Mandatory boss encounter — the only tile connecting the corridor to
    // the arena, so it cannot be bypassed (see map comment above). This
    // stays a Trigger, not an enemySpawn, specifically because it must be
    // a forced, unavoidable fight. once: true so re-entering the arena
    // after the fight doesn't replay the lead-in or restart the battle.
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
          'Wando plants his feet, shield raised. "Gogu — stay behind me. This ends now. Not with him."',
        ])
        ctx.startBattle(['hollow_syndicateWarden'], {
          onVictory: (state) => {
            completeQuest(state, FINALE_QUEST_ID)
            state.flags.add('gameCompleted')
            ctx.showDialogue(
              [
                'The Warden falls still. The rune-light flickers, dims, and finally goes dark — the Hollow has nothing left to throw at you.',
                'Gogu steps out from behind Wando, small fingers finding his armored hand. "...It\'s quiet. I\'ve never felt it this quiet before."',
                'Wando kneels to his level. "That\'s the Current settling. Nobody\'s hunting it anymore — not here, not in the Reach, not anywhere we\'ve been."',
                "Rell, and everyone else the Syndicate dragged down here, will walk out into daylight they didn't expect to see again.",
                "Wando thinks of the forge-clan that exiled him, a raider's canyon, a drowned bog shrine, a station full of smoke, a refuge in the clouds — every place this road ran through to get here.",
                '"Come on, Gogu," he says, straightening up. "Let\'s go see what the Drift looks like without the Hollow watching it."',
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
