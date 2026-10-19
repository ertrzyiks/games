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
  strike: { name: 'Strike', kind: 'attack', power: 6, focusCost: 0, accuracy: 0.95 },
  forgeSlam: { name: 'Forge Slam', kind: 'attack', power: 11, focusCost: 3, accuracy: 0.85 },
  guard: { name: 'Guard', kind: 'buff', power: 0, focusCost: 0, accuracy: 1 },
  push: { name: 'Push', kind: 'attack', power: 7, focusCost: 2, accuracy: 0.9 },
  mend: { name: 'Mend', kind: 'heal', power: 10, focusCost: 4, accuracy: 1 },
  scavengerSlash: { name: 'Rusty Slash', kind: 'attack', power: 5, focusCost: 0, accuracy: 0.85 },
})
