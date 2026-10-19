import { PALETTE } from './palette.js'

/**
 * Global tile-type registry, keyed by string id. Worlds register their own
 * tile types (append-only) so parallel world files never need to edit a
 * shared map — call registerTileTypes({...}) once per world module.
 *
 * TileType: { color, dither?, walkable, encounter? }
 */
const registry = new Map()

export function registerTileTypes(defs) {
  for (const [id, def] of Object.entries(defs)) {
    registry.set(id, def)
  }
}

export function getTileType(id) {
  return registry.get(id) || { color: '#ff00ff', walkable: false }
}

registerTileTypes({
  floor: { color: PALETTE.dark, dither: PALETTE.darkest, walkable: true },
  wall: { color: PALETTE.mid, walkable: false },
  grass: { color: '#3a6e3f', dither: '#2f5a33', walkable: true, encounter: true },
  path: { color: PALETTE.sand, dither: PALETTE.sandDark, walkable: true },
  water: { color: '#2b5f82', walkable: false },
  door: { color: PALETTE.heroDark, walkable: true },
  rock: { color: '#6b6258', walkable: false },
})
