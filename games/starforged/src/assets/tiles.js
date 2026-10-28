import { PALETTE } from './palette.js'

/**
 * Global tile-type registry, keyed by string id. Worlds register their own
 * tile types (append-only) so parallel world files never need to edit a
 * shared map — call registerTileTypes({...}) once per world module.
 *
 * TileType: { color, dither?, walkable, encounter?, shape? }
 *
 * `shape` is an optional id into engine/tileShapes.js's icon drawers — set
 * it on discrete, usually-unwalkable scenery tiles (a tree, a boulder, a
 * crate, ...) so they render as a matching pixel-art icon on top of the
 * flat color+dither fill, instead of just a colored square. Leave it unset
 * on ground-texture tiles (floor/path/grass/...) that tile over large
 * areas, where a repeated discrete icon would look busier, not better.
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
  wall: { color: PALETTE.mid, walkable: false, shape: 'wall' },
  grass: { color: '#3a6e3f', dither: '#2f5a33', walkable: true, encounter: true },
  path: { color: PALETTE.sand, dither: PALETTE.sandDark, walkable: true },
  water: { color: '#2b5f82', walkable: false, shape: 'water' },
  // Every world's warp-to-another-segment tile uses this one shared id
  // (see worlds/*.js's `setTile(..., 'door')`) - tagging it here marks
  // every such warp the same way in all five worlds for free, with no
  // per-world changes.
  door: { color: PALETTE.heroDark, walkable: true, shape: 'door' },
  rock: { color: '#6b6258', walkable: false, shape: 'rock' },
})
