/**
 * Append-only world registry. Each world file calls registerWorld(world)
 * at its own bottom; main.js just needs to import each world file once
 * (for the side effect) so parallel world agents never edit this file.
 */
const registry = new Map()
const order = []

export function registerWorld(world) {
  registry.set(world.id, world)
  if (!order.includes(world.id)) order.push(world.id)
}

export function getWorld(id) {
  const world = registry.get(id)
  if (!world) throw new Error(`Unknown world id: ${id}`)
  return world
}

export function listWorldIds() {
  return [...order]
}

// Progression order is simply registration order, which matches the
// chapter order main.js imports world files in (rustmoor -> mossfenReach
// -> ashvaultStation -> skyreachCanopy -> theHollow). A boss-victory
// callback calls this to unlock the next chapter.
export function unlockNextWorld(state, currentWorldId) {
  const idx = order.indexOf(currentWorldId)
  if (idx === -1 || idx + 1 >= order.length) return null
  const nextId = order[idx + 1]
  if (!state.unlockedWorlds.includes(nextId)) state.unlockedWorlds.push(nextId)
  return nextId
}
