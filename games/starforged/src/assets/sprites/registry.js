/**
 * Append-only registry so each world/content file can add its own NPC or
 * enemy sprites (registerSprites({...})) without editing a shared index
 * file — avoids merge conflicts between parallel content agents.
 */
const registry = new Map()

export function registerSprites(defs) {
  for (const [id, def] of Object.entries(defs)) {
    registry.set(id, def)
  }
}

export function getSprite(id) {
  return registry.get(id)
}
