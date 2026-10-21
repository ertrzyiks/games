/**
 * Append-only enemy registry — world/content agents add their own enemies
 * with registerEnemies({...}) from their own world file instead of editing
 * this list.
 */
const registry = new Map()

export function registerEnemies(defs) {
  for (const [id, def] of Object.entries(defs)) {
    registry.set(id, { id, ...def })
  }
}

export function getEnemy(id) {
  const def = registry.get(id)
  if (!def) throw new Error(`Unknown enemy id: ${id}`)
  return def
}

// Read-only snapshot of every registered enemy, in registration order. Used
// by the wiki package to document enemies straight from this registry
// instead of hand-duplicating the data — battle code has no need for this,
// so it's additive only.
export function getAllEnemies() {
  return [...registry.values()]
}

registerEnemies({
  scavenger: {
    name: 'Rustmoor Scavenger',
    spriteId: 'enemyScavenger',
    maxHp: 18,
    atk: 5,
    def: 2,
    spd: 3,
    moves: ['scavengerSlash'],
    xpReward: 12,
  },
})
