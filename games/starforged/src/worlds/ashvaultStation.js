import { registerWorld, unlockNextWorld } from './registry.js'
import { registerTileTypes } from '../assets/tiles.js'
import { registerSprites } from '../assets/sprites/registry.js'
import { buildSprite, HUMANOID_TEMPLATE } from '../assets/spriteTemplates.js'
import { registerEnemies } from '../battle/enemies.js'
import { registerMoves } from '../battle/moves.js'
import { startQuest, setQuestStage, completeQuest } from '../data/gameState.js'

function fillRow(width, id) {
  return Array(width).fill(id)
}

/**
 * World 3 — Ashvault Station: the Hollow Syndicate's industrial foothold,
 * where they are building a "Current Extractor" to drain Moss's power at
 * scale. Four connected maps: an exterior ship-graveyard approach, a
 * habitation ring (hub) of workers living under Syndicate control, a
 * maze-like engine core with a quest-gated vault corridor, and the
 * Extractor vault itself as the boss arena.
 */

// --- Cold industrial tile set, namespaced to avoid collisions with other
// worlds being built in parallel. ---
const STEEL = '#7a828f'
const STEEL_DARK = '#4a515c'
const VOID_BLACK = '#14161c'
const RUST_ORANGE = '#b3522b'
const RUST_DARK = '#6e3015'
const WARNING_YELLOW = '#e3b23c'
const EMBER_RED = '#e0564b'
const COOLANT_TEAL = '#3c8f8a'
const CIVILIAN_GREY = '#8a8f99'
const CIVILIAN_DARK = '#565b63'

registerTileTypes({
  ashvault_metalFloor: { color: STEEL, dither: STEEL_DARK, walkable: true },
  ashvault_gratedFloor: { color: '#5c6472', dither: VOID_BLACK, walkable: true },
  ashvault_hazardStripe: { color: WARNING_YELLOW, dither: VOID_BLACK, walkable: true },
  ashvault_rustFloor: { color: RUST_ORANGE, dither: RUST_DARK, walkable: true, encounter: true },
  // Exterior-only tiles for the Docking Approach.
  ashvault_hullPlate: { color: '#23262e', walkable: false },
  ashvault_wreckage: { color: RUST_DARK, dither: VOID_BLACK, walkable: false },
  ashvault_voidGap: { color: VOID_BLACK, walkable: false },
})

// --- Sprites, built from the shared humanoid silhouette with a cold,
// corroded Syndicate color legend (or, for workers/civilians, a plainer
// muted legend). ---
const dockHandSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: STEEL_DARK,
  V: VOID_BLACK,
  T: WARNING_YELLOW,
  A: STEEL,
  L: VOID_BLACK,
})

const technicianSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#5c6472',
  V: VOID_BLACK,
  T: RUST_ORANGE,
  A: '#3d434d',
  L: VOID_BLACK,
})

const cinderTrooperSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: VOID_BLACK,
  V: EMBER_RED,
  T: WARNING_YELLOW,
  A: '#3a3f47',
  L: VOID_BLACK,
})

const foremanSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: VOID_BLACK,
  V: EMBER_RED,
  T: WARNING_YELLOW,
  A: STEEL_DARK,
  L: VOID_BLACK,
})

const scrapRunnerSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: CIVILIAN_DARK,
  V: VOID_BLACK,
  T: RUST_ORANGE,
  A: CIVILIAN_GREY,
  L: VOID_BLACK,
})

const restingWorkerSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: CIVILIAN_DARK,
  V: VOID_BLACK,
  T: STEEL,
  A: CIVILIAN_GREY,
  L: VOID_BLACK,
})

const tamsinSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#6b4a3a',
  V: VOID_BLACK,
  T: CIVILIAN_GREY,
  A: '#4a3528',
  L: VOID_BLACK,
})

const ventTechSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: STEEL_DARK,
  V: VOID_BLACK,
  T: COOLANT_TEAL,
  A: '#3d434d',
  L: VOID_BLACK,
})

const scrapLurkerSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: RUST_DARK,
  V: EMBER_RED,
  T: CIVILIAN_GREY,
  A: RUST_ORANGE,
  L: VOID_BLACK,
})

const reclaimerDroneSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: COOLANT_TEAL,
  V: VOID_BLACK,
  T: STEEL,
  A: '#2c4a47',
  L: VOID_BLACK,
})

registerSprites({
  ashvault_dockHand: dockHandSprite,
  ashvault_technician: technicianSprite,
  ashvault_cinderTrooper: cinderTrooperSprite,
  ashvault_foreman: foremanSprite,
  ashvault_scrapRunner: scrapRunnerSprite,
  ashvault_restingWorker: restingWorkerSprite,
  ashvault_tamsin: tamsinSprite,
  ashvault_ventTech: ventTechSprite,
  ashvault_scrapLurker: scrapLurkerSprite,
  ashvault_reclaimerDrone: reclaimerDroneSprite,
})

// --- Moves ---
registerMoves({
  ashvault_shockBaton: { name: 'Shock Baton', kind: 'attack', power: 7, focusCost: 0, accuracy: 0.9 },
  ashvault_overloadVent: { name: 'Overload Vent', kind: 'attack', power: 13, focusCost: 3, accuracy: 0.8 },
  ashvault_chainLash: { name: 'Chain Lash', kind: 'attack', power: 9, focusCost: 1, accuracy: 0.9 },
  ashvault_rustedClaw: { name: 'Rusted Claw', kind: 'attack', power: 10, focusCost: 0, accuracy: 0.85 },
  ashvault_dronePulse: { name: 'Drone Pulse', kind: 'attack', power: 12, focusCost: 0, accuracy: 0.8 },
})

// --- Enemies ---
// Balance target for this chapter: regular enemies 34-44 HP, boss 100-125 HP
// (buffed up from the v1 Foreman's 82).
registerEnemies({
  ashvault_cinderTrooper: {
    name: 'Cinder Trooper',
    spriteId: 'ashvault_cinderTrooper',
    maxHp: 40,
    atk: 10,
    def: 5,
    spd: 5,
    moves: ['ashvault_shockBaton', 'ashvault_chainLash'],
    xpReward: 30,
  },
  ashvault_scrapLurker: {
    name: 'Scrap Lurker',
    spriteId: 'ashvault_scrapLurker',
    maxHp: 36,
    atk: 11,
    def: 4,
    spd: 7,
    moves: ['ashvault_rustedClaw', 'ashvault_shockBaton'],
    xpReward: 28,
  },
  ashvault_reclaimerDrone: {
    name: 'Reclaimer Drone',
    spriteId: 'ashvault_reclaimerDrone',
    maxHp: 44,
    atk: 9,
    def: 7,
    spd: 4,
    moves: ['ashvault_dronePulse', 'ashvault_overloadVent'],
    xpReward: 32,
  },
  ashvault_foreman: {
    name: 'Syndicate Foreman',
    spriteId: 'ashvault_foreman',
    maxHp: 115,
    atk: 16,
    def: 8,
    spd: 6,
    moves: ['forgeSlam', 'ashvault_overloadVent', 'ashvault_chainLash'],
    xpReward: 95,
    isBoss: true,
  },
})

// --- Maps ---

// Docking Approach (exterior, 18x14): a ship graveyard of derelict hulls
// clustered around the station's outer platforms. Hull plating (non-walkable)
// borders the yard; scattered wreckage breaks up the open ground. An
// airlock door (9,1) leads up into the Habitation Ring.
const dockingApproachTiles = [
  fillRow(18, 'ashvault_hullPlate'),
  [
    'ashvault_hullPlate',
    ...fillRow(8, 'ashvault_metalFloor'),
    'door',
    ...fillRow(7, 'ashvault_metalFloor'),
    'ashvault_hullPlate',
  ],
  [
    'ashvault_hullPlate',
    ...fillRow(3, 'ashvault_metalFloor'),
    ...fillRow(2, 'ashvault_wreckage'),
    ...fillRow(6, 'ashvault_metalFloor'),
    ...fillRow(2, 'ashvault_wreckage'),
    ...fillRow(3, 'ashvault_metalFloor'),
    'ashvault_hullPlate',
  ],
  ['ashvault_hullPlate', ...fillRow(16, 'ashvault_gratedFloor'), 'ashvault_hullPlate'],
  ['ashvault_hullPlate', ...fillRow(16, 'ashvault_rustFloor'), 'ashvault_hullPlate'],
  ['ashvault_hullPlate', ...fillRow(16, 'ashvault_rustFloor'), 'ashvault_hullPlate'],
  [
    'ashvault_hullPlate',
    ...fillRow(7, 'ashvault_gratedFloor'),
    ...fillRow(2, 'ashvault_voidGap'),
    ...fillRow(7, 'ashvault_gratedFloor'),
    'ashvault_hullPlate',
  ],
  ['ashvault_hullPlate', ...fillRow(16, 'ashvault_metalFloor'), 'ashvault_hullPlate'],
  ['ashvault_hullPlate', ...fillRow(16, 'ashvault_hazardStripe'), 'ashvault_hullPlate'],
  [
    'ashvault_hullPlate',
    ...fillRow(7, 'ashvault_metalFloor'),
    ...fillRow(2, 'ashvault_wreckage'),
    ...fillRow(7, 'ashvault_metalFloor'),
    'ashvault_hullPlate',
  ],
  ['ashvault_hullPlate', ...fillRow(16, 'ashvault_metalFloor'), 'ashvault_hullPlate'],
  ['ashvault_hullPlate', ...fillRow(16, 'ashvault_gratedFloor'), 'ashvault_hullPlate'],
  ['ashvault_hullPlate', ...fillRow(16, 'ashvault_metalFloor'), 'ashvault_hullPlate'],
  fillRow(18, 'ashvault_hullPlate'),
]

// Habitation Ring (hub, 14x12): where Syndicate-controlled workers live.
// South door (6,11) back to the Docking Approach, east door (13,6) down
// into the Engine Core.
const habitationRingTiles = [
  fillRow(14, 'wall'),
  ['wall', ...fillRow(12, 'ashvault_metalFloor'), 'wall'],
  ['wall', ...fillRow(12, 'ashvault_metalFloor'), 'wall'],
  ['wall', ...fillRow(12, 'ashvault_gratedFloor'), 'wall'],
  ['wall', ...fillRow(12, 'ashvault_metalFloor'), 'wall'],
  ['wall', ...fillRow(12, 'ashvault_metalFloor'), 'wall'],
  ['wall', ...fillRow(12, 'ashvault_metalFloor'), 'door'],
  ['wall', ...fillRow(12, 'ashvault_gratedFloor'), 'wall'],
  ['wall', ...fillRow(12, 'ashvault_metalFloor'), 'wall'],
  ['wall', ...fillRow(12, 'ashvault_metalFloor'), 'wall'],
  ['wall', ...fillRow(12, 'ashvault_hazardStripe'), 'wall'],
  ['wall', ...fillRow(5, 'ashvault_metalFloor'), 'door', ...fillRow(6, 'ashvault_metalFloor'), 'wall'],
]

// Engine Core (depths, 16x16): maze-like industrial corridors. Entrance
// hall -> narrow corridor -> junction room (Tamsin's restraint pit) ->
// corridor -> pre-vault chamber (schematics console) -> a one-tile blast
// door chokepoint, gated until the console has been read -> vault
// antechamber -> south door into the Extractor Vault (boss arena).
const engineCoreTiles = [
  fillRow(16, 'wall'),
  ['wall', 'door', ...fillRow(13, 'ashvault_metalFloor'), 'wall'],
  ['wall', ...fillRow(14, 'ashvault_metalFloor'), 'wall'],
  ['wall', ...fillRow(14, 'ashvault_gratedFloor'), 'wall'],
  ['wall', ...fillRow(5, 'wall'), ...fillRow(2, 'ashvault_metalFloor'), ...fillRow(7, 'wall'), 'wall'],
  ['wall', ...fillRow(5, 'wall'), ...fillRow(2, 'ashvault_metalFloor'), ...fillRow(7, 'wall'), 'wall'],
  ['wall', ...fillRow(14, 'ashvault_metalFloor'), 'wall'],
  ['wall', ...fillRow(14, 'ashvault_gratedFloor'), 'wall'],
  ['wall', ...fillRow(14, 'ashvault_metalFloor'), 'wall'],
  ['wall', ...fillRow(5, 'wall'), ...fillRow(2, 'ashvault_rustFloor'), ...fillRow(7, 'wall'), 'wall'],
  ['wall', ...fillRow(5, 'wall'), ...fillRow(2, 'ashvault_rustFloor'), ...fillRow(7, 'wall'), 'wall'],
  ['wall', ...fillRow(14, 'ashvault_hazardStripe'), 'wall'],
  ['wall', ...fillRow(14, 'ashvault_metalFloor'), 'wall'],
  ['wall', ...fillRow(7, 'wall'), 'ashvault_metalFloor', ...fillRow(6, 'wall'), 'wall'],
  ['wall', ...fillRow(14, 'ashvault_metalFloor'), 'wall'],
  ['wall', ...fillRow(5, 'wall'), 'door', ...fillRow(8, 'wall'), 'wall'],
]

// Extractor Vault (boss arena, 10x10): a narrow one-tile-wide corridor
// funnels straight into the vault chamber, same proven chokepoint pattern
// as theHollow.js, so the Foreman fight cannot be skipped.
const extractorVaultTiles = [
  fillRow(10, 'wall'),
  ['wall', 'wall', ...fillRow(6, 'ashvault_rustFloor'), 'wall', 'wall'],
  ['wall', 'wall', ...fillRow(6, 'ashvault_rustFloor'), 'wall', 'wall'],
  ['wall', 'wall', ...fillRow(6, 'ashvault_rustFloor'), 'wall', 'wall'],
  [...fillRow(4, 'wall'), 'ashvault_metalFloor', ...fillRow(5, 'wall')],
  [...fillRow(4, 'wall'), 'ashvault_metalFloor', ...fillRow(5, 'wall')],
  [...fillRow(4, 'wall'), 'ashvault_metalFloor', ...fillRow(5, 'wall')],
  [...fillRow(3, 'wall'), ...fillRow(2, 'ashvault_metalFloor'), ...fillRow(5, 'wall')],
  [...fillRow(4, 'wall'), 'door', ...fillRow(5, 'wall')],
  fillRow(10, 'wall'),
]

// Ship lands on the open platform in the Docking Approach yard.
export const ENTRY = { x: 9, y: 12 }

export const ashvaultStationWorld = {
  id: 'ashvaultStation',
  name: 'Ashvault Station',
  startMap: 'dockingApproach',
  entry: ENTRY,
  maps: {
    dockingApproach: {
      width: 18,
      height: 14,
      tiles: dockingApproachTiles,
      npcs: [
        {
          id: 'scrapRunner',
          x: 3,
          y: 7,
          facing: 'down',
          spriteId: 'ashvault_scrapRunner',
          dialogue: [
            "Half these hulls were ships that tried running the Syndicate blockade. Didn't make it past the yard.",
            "Ashvault used to be a relay station before the Hollow Syndicate muscled in and started 'refining.'",
            "Keep off the grating near the gaps — some of it's rusted clean through to open space.",
          ],
        },
      ],
      encounterZones: [
        { x: 1, y: 4, w: 16, h: 2, chance: 0.16, enemyIds: ['ashvault_cinderTrooper', 'ashvault_scrapLurker'] },
      ],
      warps: [{ x: 9, y: 1, toMap: 'habitationRing', toX: 6, toY: 10 }],
      triggers: [
        {
          x: 2,
          y: 2,
          once: true,
          setsFlag: 'ashvault_scrapCacheFound',
          onEnter(ctx) {
            ctx.state.inventory.medkit = (ctx.state.inventory.medkit || 0) + 1
            ctx.showDialogue(['Wedged in a derelict hull, a sealed supply case.', 'Found a medkit!'])
          },
        },
      ],
    },
    habitationRing: {
      width: 14,
      height: 12,
      tiles: habitationRingTiles,
      npcs: [
        {
          id: 'dockHand',
          x: 3,
          y: 2,
          facing: 'down',
          spriteId: 'ashvault_dockHand',
          dialogue: (state) => {
            const quest = state.quests['ashvault_tamsinRescue']
            if (!quest) {
              startQuest(state, 'ashvault_tamsinRescue', 'Free Tamsin')
              return [
                "They've got one of ours chained up in the engine core restraint pit — Tamsin, from the scrap crews.",
                "There's a release switch near her cell. Trip it before a trooper notices you.",
              ]
            }
            if (quest.complete) {
              return [
                "Tamsin's resting easier thanks to you. Shouldn't have taken a stranger to get her out, but here we are.",
                "Mind the engine core deeper in — the foreman's keeping it locked tight for a reason.",
              ]
            }
            if (quest.stage >= 1) {
              completeQuest(state, 'ashvault_tamsinRescue')
              state.inventory.medkit = (state.inventory.medkit || 0) + 1
              return [
                "You actually got her out. I won't forget this — take what's left of our medical stock.",
                'Found a medkit!',
              ]
            }
            return ["She's deep in the core, past the grated corridors. Watch for patrols on your way."]
          },
        },
        {
          id: 'technician',
          x: 10,
          y: 4,
          facing: 'down',
          spriteId: 'ashvault_technician',
          dialogue: (state) => {
            const quest = state.quests['ashvault_extractorSabotage']
            if (!quest) {
              startQuest(state, 'ashvault_extractorSabotage', 'The Current Extractor')
              return [
                "There's a device down in the core they call the Extractor. Built to pull the Current out of someone and hold it.",
                "Moss goes pale just hearing the word. Find their schematics console, confirm what it does before you touch anything.",
              ]
            }
            if (quest.complete) {
              return [
                "The Extractor's slag now, and the foreman with it. Whatever they meant to do to Moss, it dies here.",
                'Skyreach Canopy is further out past the ridge — if the Syndicate was hunting this hard, they will be there too.',
              ]
            }
            if (quest.stage >= 1) {
              return [
                "You read the schematics? Then you know — that thing was built to drain Moss dry, not just study the Current.",
                "The vault blast door should answer to the console now. Finish it before the foreman calls in more troopers.",
              ]
            }
            return ["Find the console in the core's control chamber. Don't touch the Extractor itself until you know what it does."]
          },
        },
        {
          id: 'restingWorker',
          x: 5,
          y: 8,
          facing: 'up',
          spriteId: 'ashvault_restingWorker',
          dialogue: [
            "They work us the core in shifts and call it 'labor debt.' Debt to who, I keep asking.",
            "The foreman doesn't come up to the ring much anymore — too busy babysitting whatever they're building down there.",
            "You've got a look about you. The Syndicate doesn't like strangers asking questions. Neither do I, until I know whose side you're on.",
          ],
        },
      ],
      encounterZones: [],
      warps: [
        { x: 6, y: 11, toMap: 'dockingApproach', toX: 9, toY: 2 },
        { x: 13, y: 6, toMap: 'engineCore', toX: 2, toY: 1 },
      ],
      triggers: [],
    },
    engineCore: {
      width: 16,
      height: 16,
      tiles: engineCoreTiles,
      npcs: [
        {
          id: 'ventTech',
          x: 10,
          y: 2,
          facing: 'down',
          spriteId: 'ashvault_ventTech',
          dialogue: [
            "Core's running hotter every cycle since they brought that device online.",
            "The foreman doesn't let anyone near the vault without the console's say-so. Smart, if you ask me — I've seen what's chained to it.",
            "Watch the grated floors. Half of them haven't held a trooper's weight in months.",
          ],
        },
        {
          id: 'tamsin',
          x: 2,
          y: 7,
          facing: 'right',
          spriteId: 'ashvault_tamsin',
          dialogue: (state) => {
            if (state.flags.has('ashvault_tamsinFreed')) {
              return [
                "Go on — find the dock hand by the ring door, he'll want to know I'm out.",
                "I won't forget who pulled that clamp.",
              ]
            }
            return [
              "They've had this restraint field locked since the strike. Can't so much as sit up straight.",
              "There's a release switch on the wall south of here — if you can reach it without a trooper seeing...",
            ]
          },
        },
      ],
      encounterZones: [
        {
          x: 1,
          y: 6,
          w: 14,
          h: 5,
          chance: 0.2,
          enemyIds: ['ashvault_cinderTrooper', 'ashvault_scrapLurker', 'ashvault_reclaimerDrone'],
        },
      ],
      warps: [
        { x: 1, y: 1, toMap: 'habitationRing', toX: 12, toY: 6 },
        { x: 6, y: 15, toMap: 'extractorVault', toX: 4, toY: 8 },
      ],
      triggers: [
        {
          x: 3,
          y: 8,
          once: true,
          setsFlag: 'ashvault_tamsinFreed',
          onEnter(ctx) {
            if (!ctx.state.quests['ashvault_tamsinRescue']) {
              startQuest(ctx.state, 'ashvault_tamsinRescue', 'Free Tamsin')
            }
            setQuestStage(ctx.state, 'ashvault_tamsinRescue', 1)
            ctx.showDialogue([
              "You yank the restraint clamp release. The field drops — Tamsin stumbles free, rubbing her wrists.",
              '"Go, before they notice! I\'ll find my own way out."',
            ])
          },
        },
        {
          x: 3,
          y: 11,
          once: true,
          setsFlag: 'ashvault_extractorConfirmed',
          onEnter(ctx) {
            if (!ctx.state.quests['ashvault_extractorSabotage']) {
              startQuest(ctx.state, 'ashvault_extractorSabotage', 'The Current Extractor')
            }
            setQuestStage(ctx.state, 'ashvault_extractorSabotage', 1)
            ctx.showDialogue([
              "The console lights up with schematics — a Current Extractor, keyed to a single signature. Moss's.",
              'Moss grips Kade\'s sleeve. "That\'s... that\'s for me. They built that for me."',
              'The blast door down the corridor should answer to this console now.',
            ])
          },
        },
        {
          // One-tile blast-door chokepoint. Soft-gated behind the
          // 'ashvault_extractorConfirmed' flag set by the console trigger
          // above: until it's set, stepping here bounces the player back
          // instead of letting them through, since map tiles themselves
          // can't be conditionally walkable.
          x: 8,
          y: 13,
          once: false,
          onEnter(ctx) {
            if (!ctx.state.flags.has('ashvault_extractorConfirmed')) {
              ctx.showDialogue([
                'A sealed blast door. A console readout blinks: SCHEMATICS VERIFICATION REQUIRED.',
                "Whatever's through there, the station won't open it without proof you know what it is.",
              ])
              ctx.warpTo({ toMap: 'engineCore', toX: 8, toY: 12 })
            }
          },
        },
      ],
    },
    extractorVault: {
      width: 10,
      height: 10,
      tiles: extractorVaultTiles,
      npcs: [],
      encounterZones: [],
      warps: [],
      triggers: [
        // Mandatory boss encounter: the only tile connecting the corridor
        // to the vault chamber, so it cannot be bypassed (see map comment
        // above). once:true so re-entering after the fight doesn't replay
        // the lead-in or restart the battle.
        {
          x: 4,
          y: 3,
          once: true,
          setsFlag: 'ashvault_bossEngaged',
          onEnter(ctx) {
            ctx.showDialogue(
              [
                'The corridor opens into a vaulted chamber humming with contained Current — the Extractor, half-built, chained in conduits.',
                "Beside it, the Syndicate Foreman turns from the controls, ember-lit visor fixed on you.",
                '"Scrap and a boy," he growls. "The device stays. You don\'t."',
                'Kade steps between him and Moss, plate grinding against the deck. "Try it."',
              ],
              () => {
                ctx.startBattle(['ashvault_foreman'], {
                  onVictory: (state) => {
                    unlockNextWorld(state, 'ashvaultStation')
                    completeQuest(state, 'ashvault_extractorSabotage')
                    ctx.showDialogue([
                      'The Foreman crashes against the conduits — the Extractor sparks, cracks, and dies in a shower of slag.',
                      'Moss exhales, shoulders dropping like a held breath finally let go. "It\'s gone quiet. Whatever it wanted from me... it\'s gone."',
                      'Kade lowers his hammer. "Then Ashvault\'s done with us. Skyreach Canopy waits past the ridge — let\'s see what else the Syndicate\'s reaching for."',
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

registerWorld(ashvaultStationWorld)
