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

// Wando is flying a starfighter, not melee-ing on foot — override the
// Vanguard role's melee range with laser-cannon range so manual fire is both
// usable while constantly moving forward and visibly a projectile (see
// effects.js: ranged vs. melee attack visuals key off attackRange).
export const WANDO_ATTACK_RANGE = 20
export const ALTITUDE_MIN = 1
export const ALTITUDE_MAX = 28

export const CREEP_STATS = { hp: 55, damage: 9, attackRange: 2, attackIntervalMs: 1000, speed: 4.5 }
export const CREEP_WAVE_SIZE = 3
export const CREEP_WAVE_INTERVAL_MS = 15000
export const CREEP_SPAWN_STAGGER_MS = 600

export const TOWER_STATS = { hp: 700, damage: 24, attackRange: 14, attackIntervalMs: 700 }
export const BASE_STATS = { hp: 1400, damage: 18, attackRange: 10, attackIntervalMs: 700 }
