import { registerWorld, unlockNextWorld } from './registry.js'
import { registerTileTypes } from '../assets/tiles.js'
import { registerSprites } from '../assets/sprites/registry.js'
import { registerEnemies } from '../battle/enemies.js'
import { registerMoves } from '../battle/moves.js'
import { HUMANOID_TEMPLATE, CHILD_TEMPLATE, buildSprite } from '../assets/spriteTemplates.js'
import { PALETTE } from '../assets/palette.js'
import { startQuest, setQuestStage, completeQuest } from '../data/gameState.js'

/**
 * World 1 — Rustmoor: Wando's exile canyon, and Gogu's introduction. Four
 * connected maps: an outdoor Canyon Approach (ship landing site, visible
 * raider/scavenger enemySpawns), the Settlement hub (4 NPCs including
 * Yara), the Depths (old mine tunnels — gated behind Yara's mining pick),
 * and the boss arena as the Depths' final chamber, reached through a
 * one-tile chokepoint in the same style as theHollow.js. Beating the
 * Scavenger Captain here is what gets Wando's skiff fueled to leave
 * Rustmoor. Random encounterZones are inert at the engine level now —
 * enemies are visible map sprites (enemySpawns) instead.
 */

// --- Tile types (namespaced 'rustmoor_') ---------------------------------
registerTileTypes({
  rustmoor_wreck: { color: '#4a3a2a', walkable: false },
  rustmoor_rubble: { color: '#5a5248', walkable: false },
  rustmoor_tunnelFloor: { color: '#3a3228', dither: '#2c261e', walkable: true },
  rustmoor_tunnelWall: { color: '#6b5f4e', walkable: false },
  // New decorative terrain for the bigger maps — all unwalkable scenery.
  rustmoor_boulder: { color: '#7d6f5c', dither: '#5e5342', walkable: false },
  rustmoor_scrub: { color: '#8a7a42', dither: '#6b5e30', walkable: false },
  rustmoor_debris: { color: '#6a4a32', dither: '#4a3322', walkable: false },
  rustmoor_fence: { color: '#2e2520', walkable: false },
})

// --- Sprites ---------------------------------------------------------------
const dessaSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#8a6a52',
  V: '#2a2d36',
  T: '#c79b6a',
  A: '#6b5438',
  L: '#3a2e22',
})

const yaraSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#5a3a2a',
  V: '#2a2d36',
  T: PALETTE.sand,
  A: '#7a4a2a',
  L: '#3a241a',
})

const tamsinSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#3a4a5a',
  V: '#1a1d26',
  T: '#6a7a8a',
  A: '#2f3a46',
  L: '#1a222a',
})

const pipSprite = buildSprite(CHILD_TEMPLATE, {
  H: '#e8c468',
  E: '#1a1d26',
  R: '#4a8fd1',
  B: '#dfe8f5',
})

const raiderSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#4a3828',
  V: '#1a1d26',
  T: '#7a5a3a',
  A: '#5a4228',
  L: '#2a2018',
})

const raiderScoutSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#3a4a38',
  V: '#1a1d26',
  T: '#6a8a5a',
  A: '#3f5a3a',
  L: '#1a2a1a',
})

const captainSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#2a1818',
  V: PALETTE.danger,
  T: '#8a2a2a',
  A: '#4a1a1a',
  L: '#1a0e0e',
})

registerSprites({
  rustmoor_dessa: dessaSprite,
  rustmoor_yara: yaraSprite,
  rustmoor_tamsin: tamsinSprite,
  rustmoor_pip: pipSprite,
  rustmoor_raider: raiderSprite,
  rustmoor_raiderScout: raiderScoutSprite,
  rustmoor_scavengerCaptain: captainSprite,
})

// --- Moves (namespaced) ----------------------------------------------------
registerMoves({
  rustmoor_slash: { name: 'Raider Slash', kind: 'attack', power: 7, focusCost: 0, accuracy: 0.85 },
  rustmoor_scoutJab: { name: 'Scout Jab', kind: 'attack', power: 6, focusCost: 0, accuracy: 0.9 },
  rustmoor_shrapnelBurst: { name: 'Shrapnel Burst', kind: 'attack', power: 13, focusCost: 0, accuracy: 0.8 },
})

// --- Enemies -----------------------------------------------------------
// Regular variety: the existing 'scavenger' plus two namespaced originals.
// Named boss: Scavenger Captain (Rustmoor currently has no boss at all).
registerEnemies({
  rustmoor_raider: {
    name: 'Rustmoor Raider',
    spriteId: 'rustmoor_raider',
    maxHp: 22,
    atk: 6,
    def: 3,
    spd: 4,
    moves: ['rustmoor_slash', 'strike'],
    xpReward: 16,
  },
  rustmoor_raiderScout: {
    name: 'Raider Scout',
    spriteId: 'rustmoor_raiderScout',
    maxHp: 20,
    atk: 5,
    def: 2,
    spd: 7,
    moves: ['rustmoor_scoutJab'],
    xpReward: 15,
  },
  rustmoor_scavengerCaptain: {
    name: 'Scavenger Captain',
    spriteId: 'rustmoor_scavengerCaptain',
    maxHp: 52,
    atk: 11,
    def: 6,
    spd: 5,
    moves: ['strike', 'rustmoor_shrapnelBurst', 'heavySlam'],
    xpReward: 100,
    isBoss: true,
  },
})

// --- Map: Canyon Approach (26x20) --------------------------------------
// Ship lands at the top path lane (kept at the original (9,1) so the new
// game's hardcoded starting position in data/gameState.js still lands on
// a walkable tile); a grass field fills the middle, scattered with
// decorative rock/scrub/debris/fence terrain and 4 visible enemySpawns; a
// raided caravan (Dessa) sits south of the field; path lanes lead to the
// settlement door at the bottom.
const CANYON_W = 26
const CANYON_H = 20
const canyonTiles = []
for (let y = 0; y < CANYON_H; y++) {
  const row = []
  for (let x = 0; x < CANYON_W; x++) {
    let tile
    if (x === 0 || x === CANYON_W - 1 || y === 0 || y === CANYON_H - 1) {
      tile = 'rock'
    } else if (y === 1 || (y >= 17 && y <= 18)) {
      tile = 'path'
    } else if (x === 1 || x === CANYON_W - 2) {
      tile = 'path'
    } else {
      tile = 'grass'
    }
    row.push(tile)
  }
  canyonTiles.push(row)
}
canyonTiles[CANYON_H - 1][13] = 'door' // settlement door, bottom border
// Raided caravan wreckage — Dessa's camp.
canyonTiles[14][5] = 'rustmoor_wreck'
canyonTiles[14][6] = 'rustmoor_wreck'
canyonTiles[15][5] = 'rustmoor_wreck'
// Decorative scatter: boulders, scrub, debris piles, fence/watchtower silhouettes.
canyonTiles[3][3] = 'rustmoor_boulder'
canyonTiles[3][22] = 'rustmoor_scrub'
canyonTiles[4][8] = 'rustmoor_scrub'
canyonTiles[4][17] = 'rustmoor_boulder'
canyonTiles[8][4] = 'rustmoor_debris'
canyonTiles[7][12] = 'rustmoor_fence'
canyonTiles[9][20] = 'rustmoor_fence'
canyonTiles[13][9] = 'rustmoor_scrub'
canyonTiles[12][16] = 'rustmoor_boulder'
canyonTiles[15][23] = 'rustmoor_debris'

export const ENTRY = { x: 9, y: 1 }

// --- Map: Settlement hub (20x18) ----------------------------------------
// An exterior plaza ringed by a palisade wall: door north back to the
// canyon, door south down into the mine tunnels (Depths). A safe hub —
// no enemySpawns here, matching the original's empty encounterZones.
const SETTLEMENT_W = 20
const SETTLEMENT_H = 18
const settlementTiles = []
for (let y = 0; y < SETTLEMENT_H; y++) {
  const row = []
  for (let x = 0; x < SETTLEMENT_W; x++) {
    if (x === 0 || x === SETTLEMENT_W - 1 || y === 0 || y === SETTLEMENT_H - 1) {
      row.push('wall')
    } else {
      row.push('floor')
    }
  }
  settlementTiles.push(row)
}
settlementTiles[0][10] = 'door' // north: back to the canyon
settlementTiles[SETTLEMENT_H - 1][10] = 'door' // south: down into the Depths
// Decorative scatter: palisade fence posts, boulders, scrub, debris.
settlementTiles[2][3] = 'rustmoor_fence'
settlementTiles[2][16] = 'rustmoor_fence'
settlementTiles[15][3] = 'rustmoor_fence'
settlementTiles[15][16] = 'rustmoor_fence'
settlementTiles[8][2] = 'rustmoor_debris'
settlementTiles[8][17] = 'rustmoor_boulder'
settlementTiles[4][9] = 'rustmoor_scrub'
settlementTiles[13][11] = 'rustmoor_scrub'

// --- Map: Depths (24x24) -------------------------------------------------
// Entrance chamber -> single-column corridor (x=6) -> mid chamber (Tamsin,
// the Syndicate scout sign, Yara's cache, 2 enemySpawns) -> single-column
// corridor (x=17) -> rubble gate (needs Yara's pick) -> one-tile
// chokepoint -> boss arena. Every corridor row is wall except its one
// floor column, and the gate/chokepoint rows are the same way, so there
// is exactly one path through and the boss cannot be bypassed.
const DEPTHS_W = 24
const DEPTHS_H = 24
const DEPTHS_CORR1_X = 6
const DEPTHS_CORR2_X = 17
const depthsTiles = []
for (let y = 0; y < DEPTHS_H; y++) {
  const row = []
  for (let x = 0; x < DEPTHS_W; x++) {
    let tile
    if (x === 0 || x === DEPTHS_W - 1 || y === 0 || y === DEPTHS_H - 1) {
      tile = 'rustmoor_tunnelWall'
    } else if (y >= 1 && y <= 4) {
      tile = 'rustmoor_tunnelFloor' // entrance chamber
    } else if (y >= 5 && y <= 7) {
      tile = x === DEPTHS_CORR1_X ? 'rustmoor_tunnelFloor' : 'rustmoor_tunnelWall'
    } else if (y >= 8 && y <= 12) {
      tile = 'rustmoor_tunnelFloor' // mid chamber
    } else if (y >= 13 && y <= 15) {
      tile = x === DEPTHS_CORR2_X ? 'rustmoor_tunnelFloor' : 'rustmoor_tunnelWall'
    } else if (y === 16) {
      tile = x === DEPTHS_CORR2_X ? 'rustmoor_rubble' : 'rustmoor_tunnelWall' // rubble gate
    } else if (y === 17) {
      tile = x === DEPTHS_CORR2_X ? 'rustmoor_tunnelFloor' : 'rustmoor_tunnelWall' // chokepoint
    } else {
      tile = 'rustmoor_tunnelFloor' // y 18-22: boss arena
    }
    row.push(tile)
  }
  depthsTiles.push(row)
}
// Decorative cave-in rocks and debris piles, clear of both corridor
// columns and the gate/chokepoint tiles.
depthsTiles[2][9] = 'rustmoor_debris'
depthsTiles[4][19] = 'rustmoor_boulder'
depthsTiles[12][6] = 'rustmoor_boulder'
depthsTiles[8][16] = 'rustmoor_debris'

export const rustmoorWorld = {
  id: 'rustmoor',
  name: 'Rustmoor',
  startMap: 'canyonApproach',
  entry: ENTRY,
  maps: {
    canyonApproach: {
      width: CANYON_W,
      height: CANYON_H,
      tiles: canyonTiles,
      npcs: [
        {
          id: 'dessa',
          x: 7,
          y: 15,
          facing: 'up',
          spriteId: 'rustmoor_dessa',
          watchesQuests: ['rustmoor_syndicateSigns'],
          // Plot quest giver: first sign of the Hollow Syndicate in Rustmoor.
          dialogue: (state) => {
            const q = state.quests['rustmoor_syndicateSigns']
            if (!q) {
              startQuest(state, 'rustmoor_syndicateSigns', 'Signs of the Syndicate')
              return [
                'Raiders hit us at dawn — Hollow Syndicate markings on their wagon.',
                'Find proof deep in the old mine tunnels.',
              ]
            }
            if (q.complete) {
              return [
                "Rustmoor's safe from that captain's crew.",
                "But the Syndicate's still watching the Drift.",
              ]
            }
            if (q.stage >= 2) {
              return [
                "So it's real — they're not done with Rustmoor.",
                'Kill that raider captain and cut their leash.',
              ]
            }
            return [
              'No proof yet? Check the old mine tunnels.',
              "That raider camp isn't just scavengers anymore.",
            ]
          },
        },
      ],
      enemySpawns: [
        { id: 'canyonRaider1', x: 10, y: 5, enemyId: 'rustmoor_raider', spriteId: 'rustmoor_raider' },
        { id: 'canyonScav1', x: 19, y: 6, enemyId: 'scavenger', spriteId: 'enemyScavenger' },
        { id: 'canyonScout1', x: 14, y: 10, enemyId: 'rustmoor_raiderScout', spriteId: 'rustmoor_raiderScout' },
        { id: 'canyonRaider2', x: 21, y: 13, enemyId: 'rustmoor_raider', spriteId: 'rustmoor_raider' },
      ],
      // Hidden stash behind the boulder at (16,12) — Bram's camp gossip
      // hints at it (see settlement NPCs below).
      secrets: [
        {
          id: 'canyonBoulderStash',
          x: 16,
          y: 12,
          reward: { medkit: 1, tonic: 1 },
          dialogue: ['You shove the boulder aside...', 'A scavenger stash! (+1 medkit, +1 tonic)'],
        },
      ],
      warps: [{ x: 13, y: CANYON_H - 1, toMap: 'settlement', toX: 10, toY: 1 }],
      triggers: [],
    },
    settlement: {
      width: SETTLEMENT_W,
      height: SETTLEMENT_H,
      tiles: settlementTiles,
      npcs: [
        {
          id: 'elder',
          x: 5,
          y: 5,
          facing: 'down',
          spriteId: 'npc',
          dialogue: [
            "This raider captain's bleeding us slow.",
            "Deal with him, and I'll fuel your skiff myself.",
          ],
        },
        {
          id: 'yara',
          x: 14,
          y: 5,
          facing: 'down',
          spriteId: 'rustmoor_yara',
          watchesQuests: ['rustmoor_yaraCache'],
          // Practical quest giver: retrieve her buried medkit cache from the
          // Depths, and take her mining pick to get past the rockfall.
          dialogue: (state) => {
            const q = state.quests['rustmoor_yaraCache']
            if (!q) {
              startQuest(state, 'rustmoor_yaraCache', "Yara's Buried Cache")
              state.flags.add('rustmoor_hasPick')
              return [
                'My medkit cache is buried past the rockfall.',
                "Take my pick — it'll clear the rubble.",
              ]
            }
            if (q.complete) {
              return ['Pick served you well? Stay sharp out there.']
            }
            if (q.stage >= 1) {
              completeQuest(state, 'rustmoor_yaraCache')
              state.inventory.medkit = (state.inventory.medkit || 0) + 2
              state.party.kade.def += 1
              return [
                'You found it — the kits are still good!',
                'Take your share. (+2 medkits, DEF +1!)',
              ]
            }
            return ["Rockfall's east of the mid chamber. My pick breaks through."]
          },
        },
        {
          id: 'pip',
          x: 6,
          y: 12,
          facing: 'down',
          spriteId: 'rustmoor_pip',
          dialogue: [
            'Gogu, are you Current-touched too?',
            'Stay away from the rockfall — a scary boss lives there!',
          ],
        },
        {
          id: 'bram',
          x: 12,
          y: 13,
          facing: 'down',
          spriteId: 'npc',
          dialogue: [
            'Raiders dug in deep down there.',
            'Their captain answers to someone bigger now.',
            "There's a boulder up in the canyon that looks shoved into place.",
            'Scavengers hide stashes like that. Worth a look.',
          ],
        },
      ],
      enemySpawns: [],
      warps: [
        { x: 10, y: 0, toMap: 'canyonApproach', toX: 13, toY: CANYON_H - 2 },
        { x: 10, y: SETTLEMENT_H - 1, toMap: 'depths', toX: 11, toY: 2 },
      ],
      triggers: [],
    },
    depths: {
      width: DEPTHS_W,
      height: DEPTHS_H,
      tiles: depthsTiles,
      npcs: [
        {
          id: 'tamsin',
          x: 4,
          y: 10,
          facing: 'down',
          spriteId: 'rustmoor_tamsin',
          watchesQuests: ['rustmoor_syndicateSigns'],
          dialogue: (state) => {
            const q = state.quests['rustmoor_syndicateSigns']
            if (q && q.stage >= 2) {
              return [
                'You found their marker — I told you it was real.',
                'Warn Dessa. Watch for that captain.',
              ]
            }
            return [
              'Raiders dragged me down here and left me chained.',
              'I saw them meet someone in black sailcloth — Syndicate colors.',
            ]
          },
        },
      ],
      enemySpawns: [
        { id: 'depthsScav1', x: 3, y: 3, enemyId: 'scavenger', spriteId: 'enemyScavenger' },
        { id: 'depthsRaider1', x: 15, y: 3, enemyId: 'rustmoor_raider', spriteId: 'rustmoor_raider' },
        { id: 'depthsScout1', x: 8, y: 9, enemyId: 'rustmoor_raiderScout', spriteId: 'rustmoor_raiderScout' },
        { id: 'depthsRaider2', x: 14, y: 11, enemyId: 'rustmoor_raider', spriteId: 'rustmoor_raider' },
      ],
      warps: [{ x: 11, y: 1, toMap: 'settlement', toX: 10, toY: SETTLEMENT_H - 2 }],
      triggers: [
        // Syndicate scout sign — advances the plot quest once it has been
        // started by Dessa. Not gated behind the rubble, so the player can
        // find it on the first pass through the mid chamber.
        {
          x: 10,
          y: 9,
          onEnter: (ctx) => {
            const q = ctx.state.quests['rustmoor_syndicateSigns']
            if (q && q.stage < 2) {
              setQuestStage(ctx.state, 'rustmoor_syndicateSigns', 2)
              ctx.showDialogue([
                'A jagged sigil is scratched into the wall.',
                'Fresh boot prints lead deeper in.',
              ])
            }
          },
        },
        // Yara's buried cache — the "go do a thing in the Depths" fetch
        // quest's payload. Reachable without the pick; only the rockfall
        // further in requires it.
        {
          x: 19,
          y: 11,
          onEnter: (ctx) => {
            const q = ctx.state.quests['rustmoor_yaraCache']
            if (q && q.stage === 0 && !q.complete) {
              setQuestStage(ctx.state, 'rustmoor_yaraCache', 1)
              ctx.showDialogue([
                "You find Yara's cache — some medkits survived.",
                'Worth bringing back to her.',
              ])
            }
          },
        },
        // Rubble gate — the quest-item-gated area. Requires the mining
        // pick Yara hands over when her quest is accepted; re-checks every
        // time so getting the pick later still opens the way through.
        {
          x: DEPTHS_CORR2_X,
          y: 15,
          onEnter: (ctx) => {
            if (depthsTiles[16][DEPTHS_CORR2_X] !== 'rustmoor_rubble') return
            if (ctx.state.flags.has('rustmoor_hasPick')) {
              depthsTiles[16][DEPTHS_CORR2_X] = 'rustmoor_tunnelFloor'
              ctx.showDialogue(["Yara's pick clears the rockfall. The way south opens."])
            } else {
              ctx.showDialogue([
                'Fallen rock blocks the tunnel ahead.',
                "You'd need the right tool to clear it.",
              ])
            }
          },
        },
        // Boss chokepoint: the single tile connecting the corridor to the
        // arena room (walled on both sides at this row, same pattern as
        // theHollow.js), so the fight cannot be bypassed once the rubble
        // is cleared.
        {
          x: DEPTHS_CORR2_X,
          y: 17,
          once: true,
          setsFlag: 'rustmoor_bossEngaged',
          onEnter: (ctx) => {
            ctx.showDialogue([
              'The tunnel opens into a torch-lit chamber.',
              '"Hand him over — the Syndicate pays well," the raider sneers.',
              'Wando steps between them. "Not a chance."',
            ])
            ctx.startBattle(['rustmoor_scavengerCaptain'], {
              onVictory: (state) => {
                const nextWorldId = unlockNextWorld(state, 'rustmoor')
                completeQuest(state, 'rustmoor_syndicateSigns')
                ctx.showDialogue(
                  [
                    'The captain falls — a Syndicate sigil-coin rolls free.',
                    "Rustmoor's shakedown is over. Wando's skiff is fueled and ready.",
                    'Head back to the Starskiff — a new world awaits.',
                  ],
                  () => ctx.openShip({ preselectWorldId: nextWorldId })
                )
              },
            })
          },
        },
      ],
    },
  },
}

registerWorld(rustmoorWorld)
