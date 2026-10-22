/**
 * Append-only move registry — add new moves with registerMoves({...}) from
 * any file (e.g. battle/movesExtra.js) instead of editing this list, so
 * parallel work doesn't collide here.
 */
const registry = new Map()

export function registerMoves(defs) {
  for (const [id, def] of Object.entries(defs)) {
    registry.set(id, { id, ...def })
  }
}

export function getMove(id) {
  return registry.get(id)
}

// Read-only snapshot of every registered move, in registration order. Used
// by the wiki package to document moves straight from this registry instead
// of hand-duplicating the data — battle code has no need for this, so it's
// additive only.
export function getAllMoves() {
  return [...registry.values()]
}

// `damageType` tags every attack move as 'kinetic' (blasters/blunt/metal),
// 'fire', or 'force' (Current/psychic). battleScene._resolveAction compares
// it against a target's `weakTo`/`resistantTo` (see battle/enemies.js) to
// apply a damage multiplier — purely additive, a move with no damageType
// (heals/buffs, or an attack nobody's been tagged weak/resistant to yet)
// just never triggers either multiplier.
registerMoves({
  // Still used by various enemies/bosses across world files by id — kept
  // as-is even though Wando's own loadout moved to the blaster-themed
  // moves below, so nothing else needs to change.
  strike: { name: 'Strike', kind: 'attack', power: 6, focusCost: 0, accuracy: 0.95, damageType: 'kinetic' },
  forgeSlam: { name: 'Forge Slam', kind: 'attack', power: 11, focusCost: 3, accuracy: 0.85, damageType: 'kinetic' },
  guard: { name: 'Guard', kind: 'buff', power: 0, focusCost: 0, accuracy: 1 },
  scavengerSlash: { name: 'Rusty Slash', kind: 'attack', power: 5, focusCost: 0, accuracy: 0.85, damageType: 'kinetic' },

  // Wando's kit: a blaster pistol/rifle, a trick shot, and (unlocked later,
  // see data/gameState.js MOVE_UNLOCKS) a ricochet shot and a grenade.
  // pistolShot never misses - it's Wando's reliable fallback whenever
  // Focus is tight, so it has to always land.
  pistolShot: { name: 'Pistol Shot', kind: 'attack', power: 6, focusCost: 0, accuracy: 1, damageType: 'kinetic' },
  rifleShot: { name: 'Rifle Shot', kind: 'attack', power: 12, focusCost: 3, accuracy: 0.78, damageType: 'kinetic' },
  flamethrower: {
    name: 'Flamethrower',
    kind: 'attack',
    power: 9,
    focusCost: 2,
    accuracy: 0.8,
    damageType: 'fire',
    applyStatus: { type: 'burn', duration: 3, power: 3 },
  },
  // Cheap and reliable, like pistolShot, but the ricochet bites back some
  // HP for Wando — reuses the generic lifesteal flag (see `drain` below)
  // rather than inventing a new mechanic just for this move.
  trickShot: { name: 'Trick Shot', kind: 'attack', power: 7, focusCost: 1, accuracy: 0.92, lifesteal: true, damageType: 'kinetic' },
  // Wando's heaviest hit: highest power of his kit, but costly - slightly
  // more reliable than it used to be, still the least accurate of his kit,
  // a real risk/reward pick next to rifleShot.
  grenadeToss: { name: 'Grenade Toss', kind: 'attack', power: 16, focusCost: 5, accuracy: 0.68, damageType: 'kinetic' },

  // Gogu's kit: Force-themed. glimmer is Gogu's free move — every party
  // member needs at least one 0-focus-cost option so the battle menu can
  // never be left with nothing selectable.
  push: { name: 'Force Push', kind: 'attack', power: 7, focusCost: 2, accuracy: 0.9, damageType: 'force' },
  mend: { name: 'Force Heal', kind: 'heal', power: 10, focusCost: 4, accuracy: 1 },
  // Force Heal's level-7 upgrade (see data/gameState.js MOVE_UNLOCKS /
  // grantXp's `upgradesFrom` handling) — heals the whole party at once
  // instead of just the lowest-HP ally, and for more per target.
  mendPlus: { name: 'Force Heal+', kind: 'heal', power: 14, focusCost: 6, accuracy: 1, healAll: true, upgradesFrom: 'mend' },
  glimmer: {
    name: 'Force Spark',
    kind: 'attack',
    power: 3,
    focusCost: 0,
    accuracy: 0.95,
    damageType: 'force',
    applyStatus: { type: 'burn', duration: 3, power: 3 },
  },

  // Boss-tier / reusable additions. Other worlds' enemy/move files may
  // reference these by id, or not — fully opt-in, doesn't affect existing
  // fights.
  heavySlam: { name: 'Heavy Slam', kind: 'attack', power: 14, focusCost: 4, accuracy: 0.8, damageType: 'kinetic' },
  // lifesteal is a generic flag battleScene._resolveAction checks for any
  // attack move (move.kind === 'attack' && move.lifesteal), so it isn't
  // special-cased by move id.
  drain: { name: 'Drain', kind: 'attack', power: 8, focusCost: 3, accuracy: 0.9, lifesteal: true, damageType: 'kinetic' },
  // focusRestore is a generic flag battleScene._buildMessages checks for
  // any buff move, in addition to the normal guard effect.
  rally: { name: 'Rally', kind: 'buff', power: 0, focusCost: 0, accuracy: 1, focusRestore: 2 },
})
