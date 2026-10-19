import { registerWorld } from './registry.js'
import { registerTileTypes } from '../assets/tiles.js'
import { registerSprites } from '../assets/sprites/registry.js'
import { registerEnemies } from '../battle/enemies.js'
import { registerMoves } from '../battle/moves.js'
import { HUMANOID_TEMPLATE, buildSprite } from '../assets/spriteTemplates.js'

function fillRow(width, id) {
  return Array(width).fill(id)
}

/**
 * World 5 — The Hollow: the Hollow Syndicate's buried stronghold, and the
 * end of the Drift. Short and climactic by design — a single tight map: a
 * one-tile-wide corridor funnels straight into a rune-lit arena room, so
 * the final boss cannot be walked around.
 */

// --- Tile types (namespaced 'hollow_' — ominous deep reds/blacks/purples) -
registerTileTypes({
  hollow_floor: { color: '#1a0e14', dither: '#120a0e', walkable: true },
  hollow_wall: { color: '#2e0f16', walkable: false },
  hollow_rune: { color: '#6e1620', dither: '#4a0f16', walkable: true },
})

// --- Sprites -------------------------------------------------------------
const rellSprite = buildSprite(HUMANOID_TEMPLATE, {
  H: '#4a3a3a',
  V: '#0b0d12',
  T: '#8a6a6a',
  A: '#3a2a2a',
  L: '#1a1212',
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
  hollow_syndicateWarden: wardenSprite,
})

// --- Moves (namespaced; only the Warden's kit — one existing move ('push')
// rounds out its move list) -------------------------------------------
registerMoves({
  hollow_crushingBlow: { name: 'Crushing Blow', kind: 'attack', power: 14, focusCost: 0, accuracy: 0.85 },
  hollow_syndicateVenom: { name: 'Syndicate Venom', kind: 'debuff', power: 4, focusCost: 0, accuracy: 0.9 },
  hollow_wardenResolve: { name: "Warden's Resolve", kind: 'heal', power: 12, focusCost: 0, accuracy: 1 },
})

// --- Final boss --------------------------------------------------------
registerEnemies({
  hollow_syndicateWarden: {
    name: 'Syndicate Warden',
    spriteId: 'hollow_syndicateWarden',
    maxHp: 155,
    atk: 18,
    def: 9,
    spd: 7,
    moves: ['hollow_crushingBlow', 'hollow_syndicateVenom', 'hollow_wardenResolve', 'push'],
    xpReward: 180,
    isBoss: true,
  },
})

// --- Map -----------------------------------------------------------------
// 10x10. Rows 1-3, cols 2-7 form the rune-lit arena room. The only way in
// is the single-tile opening at (4,4), fed by a one-tile-wide corridor
// running straight down to the entry door at (4,8) — so a player walking
// up the corridor is forced onto (4,3), the boss trigger tile, the moment
// they step into the room. There is no way to sidestep it.
const hollowTiles = [
  fillRow(10, 'hollow_wall'),
  ['hollow_wall', 'hollow_wall', ...fillRow(6, 'hollow_rune'), 'hollow_wall', 'hollow_wall'],
  ['hollow_wall', 'hollow_wall', ...fillRow(6, 'hollow_rune'), 'hollow_wall', 'hollow_wall'],
  ['hollow_wall', 'hollow_wall', ...fillRow(6, 'hollow_rune'), 'hollow_wall', 'hollow_wall'],
  [...fillRow(4, 'hollow_wall'), 'hollow_rune', ...fillRow(5, 'hollow_wall')],
  [...fillRow(4, 'hollow_wall'), 'hollow_floor', ...fillRow(5, 'hollow_wall')],
  [...fillRow(4, 'hollow_wall'), 'hollow_floor', ...fillRow(5, 'hollow_wall')],
  [...fillRow(3, 'hollow_wall'), 'hollow_floor', 'hollow_floor', ...fillRow(5, 'hollow_wall')],
  [...fillRow(4, 'hollow_wall'), 'door', ...fillRow(5, 'hollow_wall')],
  fillRow(10, 'hollow_wall'),
]

export const ENTRY = { x: 4, y: 8 }

export const theHollowWorld = {
  id: 'theHollow',
  name: 'The Hollow',
  startMap: 'stronghold',
  entry: ENTRY,
  maps: {
    stronghold: {
      width: 10,
      height: 10,
      tiles: hollowTiles,
      npcs: [
        {
          id: 'rell',
          x: 3,
          y: 7,
          facing: 'right',
          spriteId: 'hollow_rell',
          dialogue: [
            "Kade— you made it in. They've had me chained since Ashvault.",
            "The Warden's through there, past the rune floor. Don't give it an opening.",
            'Get Moss out of here, whatever it takes. The rest of us already lost that chance.',
          ],
        },
      ],
      encounterZones: [],
      warps: [],
      triggers: [
        // Mandatory boss encounter: the only tile connecting the corridor
        // to the arena room, so it cannot be bypassed (see map comment
        // above). once:true so re-entering the room after the fight does
        // not replay the lead-in or restart the battle.
        {
          x: 4,
          y: 3,
          once: true,
          setsFlag: 'hollow_bossEngaged',
          onEnter: (ctx) => {
            ctx.showDialogue([
              'The corridor opens onto a floor etched in cold red runes.',
              'At its center, wreathed in Syndicate sigils, the Warden rises to meet you.',
              '"The little psychic comes to us after all," it rasps. "Kneel, armorer, and he lives."',
              'Kade plants his feet, shield raised. "Moss — stay behind me. This ends now."',
            ])
            ctx.startBattle(['hollow_syndicateWarden'])
          },
        },
        // Ending / epilogue trigger, on the back wall where the Warden
        // stood. NOTE: there is currently no battle-outcome callback wired
        // into triggers, so this cannot be strictly gated on winning the
        // fight above. As a reasonable simplification for this scope, it
        // is simply placed past the boss trigger tile, deeper into the
        // arena, so it is only reachable by walking through/past the boss
        // encounter.
        {
          x: 4,
          y: 1,
          once: true,
          onEnter: (ctx) => {
            ctx.showDialogue([
              'The rune-light dims and goes dark. The Hollow falls silent around you.',
              'Moss steps out from behind Kade, small fingers finding his armored hand.',
              '"It\'s quiet," Moss says. "I\'ve never felt it this quiet before."',
              'Kade kneels to his level. "That\'s the Current settling. No one\'s hunting it now."',
              "The Drift stretches out beyond the Hollow's broken gate — worn, but finally theirs to walk.",
            ])
            ctx.state.flags.add('gameCompleted')
          },
        },
      ],
    },
  },
}

registerWorld(theHollowWorld)
