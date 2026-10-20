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

registerMoves({
  // Still used by various enemies/bosses across world files by id — kept
  // as-is even though Wando's own loadout moved to the blaster-themed
  // moves below, so nothing else needs to change.
  strike: { name: 'Strike', kind: 'attack', power: 6, focusCost: 0, accuracy: 0.95 },
  forgeSlam: { name: 'Forge Slam', kind: 'attack', power: 11, focusCost: 3, accuracy: 0.85 },
  guard: { name: 'Guard', kind: 'buff', power: 0, focusCost: 0, accuracy: 1 },
  scavengerSlash: { name: 'Rusty Slash', kind: 'attack', power: 5, focusCost: 0, accuracy: 0.85 },

  // Wando's kit: a blaster pistol/rifle and a trick shot.
  pistolShot: { name: 'Pistol Shot', kind: 'attack', power: 6, focusCost: 0, accuracy: 0.95 },
  rifleShot: { name: 'Rifle Shot', kind: 'attack', power: 12, focusCost: 3, accuracy: 0.85 },
  flamethrower: { name: 'Flamethrower', kind: 'attack', power: 9, focusCost: 2, accuracy: 0.8 },

  // Gogu's kit: Force-themed. glimmer is Gogu's free move — every party
  // member needs at least one 0-focus-cost option so the battle menu can
  // never be left with nothing selectable.
  push: { name: 'Force Push', kind: 'attack', power: 7, focusCost: 2, accuracy: 0.9 },
  mend: { name: 'Force Heal', kind: 'heal', power: 10, focusCost: 4, accuracy: 1 },
  glimmer: { name: 'Force Spark', kind: 'attack', power: 4, focusCost: 0, accuracy: 0.95 },

  // Boss-tier / reusable additions. Other worlds' enemy/move files may
  // reference these by id, or not — fully opt-in, doesn't affect existing
  // fights.
  heavySlam: { name: 'Heavy Slam', kind: 'attack', power: 14, focusCost: 4, accuracy: 0.8 },
  // lifesteal is a generic flag battleScene._resolveAction checks for any
  // attack move (move.kind === 'attack' && move.lifesteal), so it isn't
  // special-cased by move id.
  drain: { name: 'Drain', kind: 'attack', power: 8, focusCost: 3, accuracy: 0.9, lifesteal: true },
  // focusRestore is a generic flag battleScene._buildMessages checks for
  // any buff move, in addition to the normal guard effect.
  rally: { name: 'Rally', kind: 'buff', power: 0, focusCost: 0, accuracy: 1, focusRestore: 2 },
})
