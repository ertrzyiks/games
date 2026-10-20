import { registerWorld, unlockNextWorld } from './registry.js'
import { registerTileTypes } from '../assets/tiles.js'
import { registerSprites } from '../assets/sprites/registry.js'
import { registerEnemies } from '../battle/enemies.js'
import { registerMoves } from '../battle/moves.js'
import { HUMANOID_TEMPLATE, CHILD_TEMPLATE, buildSprite } from '../assets/spriteTemplates.js'
import { PALETTE } from '../assets/palette.js'
import { startQuest, setQuestStage, completeQuest } from '../data/gameState.js'

function fillRow(width, id) {
  return Array(width).fill(id)
}

/**
 * World 1 — Rustmoor: Wando's exile canyon, and Gogu's introduction. Four
 * connected maps: an outdoor Canyon Approach (encounter zone, ship landing
 * site), the Settlement hub (3-4 NPCs including Yara), the Depths (old mine
 * tunnels — maze-like, gated behind Yara's mining pick), and the boss arena
 * as the Depths' final chamber, reached through a one-tile chokepoint in
 * the same style as theHollow.js. Beating the Scavenger Captain here is
 * what gets Wando's skiff fueled to leave Rustmoor.
 */

// --- Tile types (namespaced 'rustmoor_') ---------------------------------
registerTileTypes({
  rustmoor_wreck: { color: '#4a3a2a', walkable: false },
  rustmoor_rubble: { color: '#5a5248', walkable: false },
  rustmoor_tunnelFloor: { color: '#3a3228', dither: '#2c261e', walkable: true },
  rustmoor_tunnelWall: { color: '#6b5f4e', walkable: false },
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

// --- Map: Canyon Approach (18x14) --------------------------------------
// Ship lands at the top path lane; a grass encounter field fills the
// middle; a raided caravan (Dessa) sits south of it, path leads to the
// settlement door at the bottom.
const canyonTiles = [
  fillRow(18, 'rock'),
  ['rock', ...fillRow(16, 'path'), 'rock'],
  ['rock', 'path', ...fillRow(14, 'grass'), 'path', 'rock'],
  ['rock', 'path', ...fillRow(14, 'grass'), 'path', 'rock'],
  ['rock', 'path', ...fillRow(14, 'grass'), 'path', 'rock'],
  ['rock', 'path', ...fillRow(14, 'grass'), 'path', 'rock'],
  ['rock', 'path', ...fillRow(14, 'grass'), 'path', 'rock'],
  ['rock', 'path', ...fillRow(14, 'grass'), 'path', 'rock'],
  ['rock', 'path', ...fillRow(14, 'grass'), 'path', 'rock'],
  ['rock', 'path', 'rustmoor_wreck', 'rustmoor_wreck', ...fillRow(13, 'path'), 'rock'],
  ['rock', 'path', 'path', 'rustmoor_wreck', ...fillRow(13, 'path'), 'rock'],
  ['rock', ...fillRow(16, 'path'), 'rock'],
  ['rock', ...fillRow(16, 'path'), 'rock'],
  [...fillRow(8, 'rock'), 'door', ...fillRow(9, 'rock')],
]

export const ENTRY = { x: 9, y: 1 }

// --- Map: Settlement hub (14x12) ----------------------------------------
// An exterior plaza ringed by a palisade wall: door north back to the
// canyon, door south down into the mine tunnels (Depths).
const settlementTiles = [
  [...fillRow(7, 'wall'), 'door', ...fillRow(6, 'wall')],
  ['wall', ...fillRow(12, 'floor'), 'wall'],
  ['wall', ...fillRow(12, 'floor'), 'wall'],
  ['wall', ...fillRow(12, 'floor'), 'wall'],
  ['wall', ...fillRow(12, 'floor'), 'wall'],
  ['wall', ...fillRow(12, 'floor'), 'wall'],
  ['wall', ...fillRow(12, 'floor'), 'wall'],
  ['wall', ...fillRow(12, 'floor'), 'wall'],
  ['wall', ...fillRow(12, 'floor'), 'wall'],
  ['wall', ...fillRow(12, 'floor'), 'wall'],
  ['wall', ...fillRow(12, 'floor'), 'wall'],
  [...fillRow(7, 'wall'), 'door', ...fillRow(6, 'wall')],
]

// --- Map: Depths (16x16) -------------------------------------------------
// Entrance chamber -> narrow corridor -> mid chamber (Tamsin, the
// Syndicate scout sign, Yara's cache) -> narrow corridor -> rubble gate
// (needs Yara's pick) -> one-tile chokepoint -> boss arena.
const depthsTiles = [
  fillRow(16, 'rustmoor_tunnelWall'),
  ['rustmoor_tunnelWall', ...fillRow(14, 'rustmoor_tunnelFloor'), 'rustmoor_tunnelWall'],
  ['rustmoor_tunnelWall', ...fillRow(14, 'rustmoor_tunnelFloor'), 'rustmoor_tunnelWall'],
  [...fillRow(3, 'rustmoor_tunnelWall'), 'rustmoor_tunnelFloor', ...fillRow(12, 'rustmoor_tunnelWall')],
  [...fillRow(3, 'rustmoor_tunnelWall'), 'rustmoor_tunnelFloor', ...fillRow(12, 'rustmoor_tunnelWall')],
  ['rustmoor_tunnelWall', ...fillRow(14, 'rustmoor_tunnelFloor'), 'rustmoor_tunnelWall'],
  ['rustmoor_tunnelWall', ...fillRow(14, 'rustmoor_tunnelFloor'), 'rustmoor_tunnelWall'],
  ['rustmoor_tunnelWall', ...fillRow(14, 'rustmoor_tunnelFloor'), 'rustmoor_tunnelWall'],
  ['rustmoor_tunnelWall', ...fillRow(14, 'rustmoor_tunnelFloor'), 'rustmoor_tunnelWall'],
  [...fillRow(12, 'rustmoor_tunnelWall'), 'rustmoor_tunnelFloor', ...fillRow(3, 'rustmoor_tunnelWall')],
  [...fillRow(12, 'rustmoor_tunnelWall'), 'rustmoor_tunnelFloor', ...fillRow(3, 'rustmoor_tunnelWall')],
  [...fillRow(12, 'rustmoor_tunnelWall'), 'rustmoor_rubble', ...fillRow(3, 'rustmoor_tunnelWall')],
  [...fillRow(12, 'rustmoor_tunnelWall'), 'rustmoor_tunnelFloor', ...fillRow(3, 'rustmoor_tunnelWall')],
  ['rustmoor_tunnelWall', ...fillRow(14, 'rustmoor_tunnelFloor'), 'rustmoor_tunnelWall'],
  ['rustmoor_tunnelWall', ...fillRow(14, 'rustmoor_tunnelFloor'), 'rustmoor_tunnelWall'],
  fillRow(16, 'rustmoor_tunnelWall'),
]

export const rustmoorWorld = {
  id: 'rustmoor',
  name: 'Rustmoor',
  startMap: 'canyonApproach',
  entry: ENTRY,
  maps: {
    canyonApproach: {
      width: 18,
      height: 14,
      tiles: canyonTiles,
      npcs: [
        {
          id: 'dessa',
          x: 4,
          y: 10,
          facing: 'up',
          spriteId: 'rustmoor_dessa',
          // Plot quest giver: first sign of the Hollow Syndicate in Rustmoor.
          dialogue: (state) => {
            const q = state.quests['rustmoor_syndicateSigns']
            if (!q) {
              startQuest(state, 'rustmoor_syndicateSigns', 'Signs of the Syndicate')
              return [
                'They came at dawn — black sails, no warning. Took half our grain before we even armed up.',
                "I saw their mark burned into the wagon side. Hollow Syndicate, same as the stories out of Mossfen.",
                "If they're scouting this far into the canyon, Rustmoor's just the start. Find proof, deep in the old mine tunnels.",
              ]
            }
            if (q.complete) {
              return [
                "Rustmoor's clear of that captain's crew, thanks to you. For now.",
                'Burn marks like that mean the Syndicate is still watching the Drift. Keep your guard up out there.',
              ]
            }
            if (q.stage >= 2) {
              return [
                "You found their sign in the depths? Then it's real — they're not done with Rustmoor.",
                "That raider captain's been taking a cut for the Syndicate's silence. End him and you cut their leash on this canyon.",
              ]
            }
            return [
              "Still haven't found proof? The old mine tunnels west of the settlement — that's where their scouts would have passed through.",
              "Be careful. Whatever's running that raider camp down there isn't just scavengers anymore.",
            ]
          },
        },
      ],
      encounterZones: [{ x: 2, y: 2, w: 14, h: 7, chance: 0.15, enemyIds: ['scavenger', 'rustmoor_raider'] }],
      warps: [{ x: 8, y: 13, toMap: 'settlement', toX: 7, toY: 1 }],
      triggers: [],
    },
    settlement: {
      width: 14,
      height: 12,
      tiles: settlementTiles,
      npcs: [
        {
          id: 'elder',
          x: 3,
          y: 3,
          facing: 'down',
          spriteId: 'npc',
          dialogue: [
            "Rustmoor's held on through worse than raiders, but this captain's bleeding us slow.",
            "Wando — if you and the boy can deal with him, I'll see your skiff gets fueled myself.",
            'Yara and Dessa both have their ears to the ground. Talk to them before you head into the tunnels.',
          ],
        },
        {
          id: 'yara',
          x: 10,
          y: 3,
          facing: 'down',
          spriteId: 'rustmoor_yara',
          // Practical quest giver: retrieve her buried medkit cache from the
          // Depths, and take her mining pick to get past the rockfall.
          dialogue: (state) => {
            const q = state.quests['rustmoor_yaraCache']
            if (!q) {
              startQuest(state, 'rustmoor_yaraCache', "Yara's Buried Cache")
              state.flags.add('rustmoor_hasPick')
              return [
                "You're headed into the tunnels? Then do an old trader a favor.",
                'I had a cache of medkits stashed past the old rockfall before the raiders ran us out.',
                "Take my mining pick — it's the only thing that'll shift that rubble now. Bring back what's left and I'll split it with you.",
              ]
            }
            if (q.complete) {
              return ["That pick's served you well, I hope. Mind yourself out there — the canyon's quieter, but not safe."]
            }
            if (q.stage >= 1) {
              completeQuest(state, 'rustmoor_yaraCache')
              state.inventory.medkit = (state.inventory.medkit || 0) + 2
              state.party.kade.def += 1
              return [
                "You found it! Half-crushed, but the kits inside are still good.",
                "Here — take a share, and keep the rest. That old armor of yours could use the extra plating too.",
                '(You gained 2 medkits and Wando\'s defense increased!)',
              ]
            }
            return ["The rockfall's past the mid chamber, east side. My pick should break through — look for the gap in the tunnel wall."]
          },
        },
        {
          id: 'pip',
          x: 4,
          y: 8,
          facing: 'down',
          spriteId: 'rustmoor_pip',
          dialogue: [
            'Gogu! Are you a Current-touched too? My gran says that\'s why the lights flicker when you\'re near.',
            "Don't go past the rockfall in the tunnels without a grown-up. That's where the scary raider boss lives!",
          ],
        },
        {
          id: 'bram',
          x: 8,
          y: 9,
          facing: 'down',
          spriteId: 'npc',
          dialogue: [
            "Mind yourself down there. Raiders've dug in deep, and their captain doesn't fight fair.",
            "Word is he answers to someone bigger these days. Didn't used to be that organized.",
          ],
        },
      ],
      encounterZones: [],
      warps: [
        { x: 7, y: 0, toMap: 'canyonApproach', toX: 8, toY: 12 },
        { x: 7, y: 11, toMap: 'depths', toX: 8, toY: 2 },
      ],
      triggers: [],
    },
    depths: {
      width: 16,
      height: 16,
      tiles: depthsTiles,
      npcs: [
        {
          id: 'tamsin',
          x: 3,
          y: 6,
          facing: 'down',
          spriteId: 'rustmoor_tamsin',
          dialogue: (state) => {
            const q = state.quests['rustmoor_syndicateSigns']
            if (q && q.stage >= 2) {
              return [
                "You found their marker, then. I told you it was real.",
                "Get back to the surface and warn Dessa properly — and watch for that captain. He answers to someone now.",
              ]
            }
            return [
              'Raiders dragged me down here when they hit my wagon. Left me chained once they realized I had nothing worth taking.',
              'I saw them meet someone in black sailcloth near an old marker, deeper in. Hollow Syndicate colors, if the stories are true.',
            ]
          },
        },
      ],
      encounterZones: [{ x: 1, y: 5, w: 14, h: 4, chance: 0.18, enemyIds: ['rustmoor_raider', 'rustmoor_raiderScout'] }],
      warps: [{ x: 8, y: 1, toMap: 'settlement', toX: 7, toY: 10 }],
      triggers: [
        // Syndicate scout sign — advances the plot quest once it has been
        // started by Dessa. Not gated behind the rubble, so the player can
        // find it on the first pass through the mid chamber.
        {
          x: 9,
          y: 6,
          onEnter: (ctx) => {
            const q = ctx.state.quests['rustmoor_syndicateSigns']
            if (q && q.stage < 2) {
              setQuestStage(ctx.state, 'rustmoor_syndicateSigns', 2)
              ctx.showDialogue([
                "Scratched into the tunnel wall: a jagged sigil, half-covered in soot. Not a scavenger's mark.",
                'Fresh boot prints lead deeper in — someone was here recently, and not alone.',
              ])
            }
          },
        },
        // Yara's buried cache — the "go do a thing in the Depths" fetch
        // quest's payload. Reachable without the pick; only the rockfall
        // further in requires it.
        {
          x: 13,
          y: 7,
          onEnter: (ctx) => {
            const q = ctx.state.quests['rustmoor_yaraCache']
            if (q && q.stage === 0 && !q.complete) {
              setQuestStage(ctx.state, 'rustmoor_yaraCache', 1)
              ctx.showDialogue([
                "Tucked behind a fallen beam, you find Yara's old supply cache — raiders picked through it, but some medkits survived.",
                'Worth bringing back to her.',
              ])
            }
          },
        },
        // Rubble gate — the quest-item-gated area. Requires the mining
        // pick Yara hands over when her quest is accepted; re-checks every
        // time so getting the pick later still opens the way through.
        {
          x: 12,
          y: 10,
          onEnter: (ctx) => {
            if (depthsTiles[11][12] !== 'rustmoor_rubble') return
            if (ctx.state.flags.has('rustmoor_hasPick')) {
              depthsTiles[11][12] = 'rustmoor_tunnelFloor'
              ctx.showDialogue(["Yara's old mining pick makes short work of the rockfall. The way south opens up."])
            } else {
              ctx.showDialogue([
                'A wall of fallen rock and old timber blocks the tunnel ahead.',
                "You'd need the right tool to clear a path through — someone back in the settlement might have one.",
              ])
            }
          },
        },
        // Boss chokepoint: the single tile connecting the corridor to the
        // arena room (walled on both sides at this row, same pattern as
        // theHollow.js), so the fight cannot be bypassed once the rubble
        // is cleared.
        {
          x: 12,
          y: 12,
          once: true,
          setsFlag: 'rustmoor_bossEngaged',
          onEnter: (ctx) => {
            ctx.showDialogue([
              'The tunnel opens into a wide, torch-lit chamber — scrap armor piled like trophies against the walls.',
              '"Another fool wandered into my canyon," a scarred raider sneers, hefting a jagged blade. "The Syndicate pays well for Current-touched brats. Hand him over."',
              'Wando steps between them, shield raised. "Not a chance."',
            ])
            ctx.startBattle(['rustmoor_scavengerCaptain'], {
              onVictory: (state) => {
                unlockNextWorld(state, 'rustmoor')
                completeQuest(state, 'rustmoor_syndicateSigns')
                ctx.showDialogue(
                  [
                    "The captain collapses amid his own scrap-metal trophies, a Syndicate contact's sigil-coin rolling free of his coat.",
                    "With Rustmoor's shakedown broken, the settlement makes good on its word — Wando's skiff sits fueled and ready at the canyon's edge.",
                    'But the sigil-coin is proof enough: the Hollow Syndicate is real, and it is already moving through the Drift.',
                    'Head back to the Starskiff — a new world on the Drift is ready to chart.',
                  ],
                  () => ctx.openShip()
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
