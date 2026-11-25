// Wando & Gogu: ARTS — simplified 3D MOBA-lite. See .scratch/wando-gogu-arts/map.md.

export const TEAM = {
  ALLY: 'ally',
  ENEMY: 'enemy',
}

export const TEAM_COLOR = {
  [TEAM.ALLY]: 0x3a7bd5,
  [TEAM.ENEMY]: 0xd5473a,
}

// Lane runs along Z. Ally base at +Z, enemy base at -Z. Creeps/heroes advance
// toward negative Z if ally, positive Z if enemy.
export const LANE_LENGTH = 140
export const LANE_HALF = LANE_LENGTH / 2
export const LANE_WIDTH = 16

export const BASE_Z = {
  [TEAM.ALLY]: LANE_HALF,
  [TEAM.ENEMY]: -LANE_HALF,
}

// Two towers per side, spaced along their half of the lane.
export const TOWER_Z = {
  [TEAM.ALLY]: [LANE_HALF - 25, LANE_HALF - 55],
  [TEAM.ENEMY]: [-LANE_HALF + 25, -LANE_HALF + 55],
}

export const ADVANCE_DIR = {
  [TEAM.ALLY]: -1,
  [TEAM.ENEMY]: 1,
}

export function otherTeam(team) {
  return team === TEAM.ALLY ? TEAM.ENEMY : TEAM.ALLY
}

// Shared AI tuning (see issues/05-ai-behavior.md).
export const AGGRO_RADIUS = 14

// Hero roles (issues/02-heroes.md). Wando is the player's Vanguard.
export const HERO_ROLES = {
  VANGUARD: 'vanguard',
  MYSTIC: 'mystic',
  MARKSMAN: 'marksman',
  SKIRMISHER: 'skirmisher',
  SENTINEL: 'sentinel',
}

export const HERO_STATS = {
  [HERO_ROLES.VANGUARD]: { hp: 220, damage: 16, attackRange: 3, attackIntervalMs: 900, speed: 7 },
  [HERO_ROLES.MYSTIC]: { hp: 150, damage: 14, attackRange: 9, attackIntervalMs: 1100, speed: 7 },
  [HERO_ROLES.MARKSMAN]: { hp: 120, damage: 20, attackRange: 10, attackIntervalMs: 950, speed: 7.5 },
  [HERO_ROLES.SKIRMISHER]: { hp: 160, damage: 15, attackRange: 2.5, attackIntervalMs: 800, speed: 9 },
  [HERO_ROLES.SENTINEL]: { hp: 260, damage: 12, attackRange: 2.5, attackIntervalMs: 1000, speed: 6 },
}

export const HERO_ABILITY = {
  [HERO_ROLES.VANGUARD]: { name: 'Guard Up', cooldownMs: 8000 },
  [HERO_ROLES.MYSTIC]: { name: 'Pulse Wave', cooldownMs: 7000, radius: 6, damage: 18 },
  [HERO_ROLES.MARKSMAN]: { name: 'Piercing Shot', cooldownMs: 6000, damage: 36 },
  [HERO_ROLES.SKIRMISHER]: { name: 'Dash Strike', cooldownMs: 6500, bonusDamage: 20 },
  [HERO_ROLES.SENTINEL]: { name: 'Fortify', cooldownMs: 9000, shieldAmount: 70 },
}

export const RESPAWN_MS = 5000

// Piloting feel for the player's hero (2026-11-25 — see
// .scratch/wando-gogu-arts/issues/06-controls-camera.md): constant forward
// flight, steering only adjusts heading, no stop/reverse.
export const STEER_MAX_RADIUS_PX = 110
export const STEER_TURN_RATE = 0.9 // rad/sec at full steer deflection
export const PITCH_LIMIT = 0.6 // radians, ~34 degrees either way

// Manual fire is a straight-ahead raycast, not an angular cone: it hits
// whatever's within a lateral distance of the exact forward line (a
// forgiving "reticle width", not pixel-perfect), never something off to the
// side. The tolerance widens with distance (FIRE_RAY_TOLERANCE at point-blank
// up to +FIRE_RAY_SPREAD per unit of range) — a fixed tolerance made hits at
// long range require near-pixel-perfect alignment, which read as "shots do
// nothing far away" even though they were landing fine up close — see
// .scratch/wando-gogu-arts/issues/06-controls-camera.md.
export const FIRE_RAY_TOLERANCE = 1.8
export const FIRE_RAY_SPREAD = 0.12

// Wando is flying a starfighter, not melee-ing on foot — override the
// Vanguard role's melee range with laser-cannon range so manual fire is both
// usable while constantly moving forward and visibly a projectile (see
// effects.js: ranged vs. melee attack visuals key off attackRange).
export const WANDO_ATTACK_RANGE = 36
// Machine-gun fire rate — overrides the Vanguard role's slow melee cadence.
export const WANDO_ATTACK_INTERVAL_MS = 150
export const ALTITUDE_MIN = 1
export const ALTITUDE_MAX = 28

export const CREEP_STATS = { hp: 55, damage: 9, attackRange: 2, attackIntervalMs: 1000, speed: 4.5 }
export const CREEP_WAVE_SIZE = 3
export const CREEP_WAVE_INTERVAL_MS = 15000
export const CREEP_SPAWN_STAGGER_MS = 600

// Towers telegraph before firing (TOWER_AIM_MS) so a shot is dodgeable, not
// instant — see .scratch/wando-gogu-arts/issues/04-towers-base.md. Slower,
// harder-hitting than before: attackIntervalMs is the minimum time between
// the *start* of one aim phase and the next, so the real cadence is roughly
// TOWER_AIM_MS plus an idle gap, not back-to-back shots.
export const TOWER_AIM_MS = 2000
export const TOWER_STATS = { hp: 700, damage: 70, attackRange: 14, attackIntervalMs: 3800 }
export const BASE_STATS = { hp: 1400, damage: 18, attackRange: 10, attackIntervalMs: 700 }

// Economy — gold for destroying enemy structures/units. A placeholder for a
// later shop; no spending exists yet, this just accrues.
export const GOLD_FOR_CREEP_KILL = 10
export const GOLD_FOR_TOWER_KILL = 100

// Wando's death sequence: fall to the ground, camera cuts to an external
// crash-site view on impact, then a countdown before respawning. Reuses
// RESPAWN_MS (5000ms) as the post-impact countdown so it's literally a
// 5-second count, matching the ask.
export const CRASH_FALL_MS = 900

// Wando's rocket: a special action distinct from Guard Up and manual fire —
// fires straight ahead along the same forward line as the gun (so it's
// always visible in view, unlike the original straight-down bomb, which
// fell behind her as she kept flying forward and was never actually seen),
// but as a single bigger/slower projectile that explodes in a radius
// wherever it lands — see .scratch/wando-gogu-arts/issues/06-controls-camera.md.
export const ROCKET_COOLDOWN_MS = 8000
export const ROCKET_DAMAGE = 90
export const ROCKET_RADIUS = 8
export const ROCKET_SPEED = 26 // units/sec — slower than bullets, so it's visibly a projectile in flight
// Rocket hit detection reuses the gun's forward-ray check but more
// forgiving (a bigger projectile should be easier to land), hence the
// larger added tolerance on top of the gun's own FIRE_RAY_TOLERANCE/SPREAD.
export const ROCKET_EXTRA_TOLERANCE = 2.5

// Wando's second special action: a temporary speed boost.
export const TURBO_DURATION_MS = 3000
export const TURBO_SPEED_MULTIPLIER = 1.8
export const TURBO_COOLDOWN_MS = 10000
