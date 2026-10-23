import { TILE_SIZE, VIEW_COLS, VIEW_ROWS, CANVAS_WIDTH, CANVAS_HEIGHT, DIRECTIONS } from './constants.js'
import { getTileType } from '../assets/tiles.js'

function hash2(x, y) {
  const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return h - Math.floor(h)
}

export function computeCamera(mapDef, px, py) {
  let camX = px - Math.floor(VIEW_COLS / 2)
  let camY = py - Math.floor(VIEW_ROWS / 2)
  camX = Math.max(0, Math.min(camX, mapDef.width - VIEW_COLS))
  camY = Math.max(0, Math.min(camY, mapDef.height - VIEW_ROWS))
  return { camX, camY }
}

export function drawMap(ctx, mapDef, camera) {
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  for (let row = 0; row < VIEW_ROWS; row++) {
    const ty = camera.camY + row
    if (ty < 0 || ty >= mapDef.height) continue
    for (let col = 0; col < VIEW_COLS; col++) {
      const tx = camera.camX + col
      if (tx < 0 || tx >= mapDef.width) continue
      const tileId = mapDef.tiles[ty][tx]
      const type = getTileType(tileId)
      const px = col * TILE_SIZE
      const py = row * TILE_SIZE
      ctx.fillStyle = type.color
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE)
      if (type.dither) {
        ctx.fillStyle = type.dither
        if (hash2(tx, ty) > 0.5) ctx.fillRect(px + 2, py + 2, 2, 2)
        if (hash2(tx + 50, ty + 50) > 0.6) ctx.fillRect(px + 10, py + 9, 2, 2)
      }
      // 'door' is the one tile id every world's warp-to-another-segment
      // tile uses (see worlds/*.js's `setTile(..., 'door')`) - drawing its
      // icon here, keyed only off that shared id, marks every such warp the
      // same way in all five worlds for free, with no per-world changes.
      if (tileId === 'door') drawDoorIcon(ctx, px, py)
    }
  }
}

function drawDoorIcon(ctx, px, py) {
  const w = 8
  const h = 12
  const x = px + Math.floor((TILE_SIZE - w) / 2)
  const y = py + TILE_SIZE - h - 1
  ctx.fillStyle = '#2a1708'
  ctx.fillRect(x, y, w, h)
  ctx.fillStyle = '#c9a876'
  ctx.fillRect(x + 1, y + 1, w - 2, h - 2)
  ctx.fillStyle = '#2a1708'
  ctx.fillRect(x + w - 3, y + Math.floor(h / 2), 1, 1)
}

export function tileAt(mapDef, x, y) {
  if (x < 0 || y < 0 || x >= mapDef.width || y >= mapDef.height) return null
  return mapDef.tiles[y][x]
}

export function isWalkable(mapDef, x, y) {
  const id = tileAt(mapDef, x, y)
  if (id == null) return false
  return !!getTileType(id).walkable
}

export function isEncounterTile(mapDef, x, y) {
  const id = tileAt(mapDef, x, y)
  if (id == null) return false
  return !!getTileType(id).encounter
}

export function getNpcAt(mapDef, x, y) {
  return (mapDef.npcs || []).find((n) => n.x === x && n.y === y)
}

// Visible overworld enemies: standing on the map like an NPC, battle
// starts the moment the player walks into their tile (no random encounter
// rolls). See MapDef.enemySpawns: [{ id, x, y, enemyId, spriteId }].
export function getEnemySpawnAt(mapDef, x, y) {
  return (mapDef.enemySpawns || []).find((e) => e.x === x && e.y === y)
}

// Hidden chests/secret walls: usually sit on an otherwise-unwalkable tile
// (a "fake wall") and are found either by walking straight into that tile
// (bump-to-reveal, mirroring how walking into an NPC starts dialogue) or,
// as a fallback, by pressing A while facing it — same interact gesture as
// talking to an NPC, just aimed at a wall instead of a person. See
// MapDef.secrets: [{ id, x, y, reward: {medkit?, tonic?}, dialogue: string[],
// opensTiles?: [{ x, y, tileId }] }]. `opensTiles` lets a secret mutate
// other tiles on the same map once found — e.g. turning the fake wall
// itself and a short corridor into walkable floor, opening a passage to a
// hidden chamber. Always a one-time find (no `once` flag needed —
// overworldScene tracks found secrets the same way as defeated enemies).
export function getSecretAt(mapDef, x, y) {
  return (mapDef.secrets || []).find((s) => s.x === x && s.y === y)
}

export function getNpcFacing(mapDef, px, py, facing) {
  const { dx, dy } = DIRECTIONS[facing]
  return getNpcAt(mapDef, px + dx, py + dy)
}

export function getWarpAt(mapDef, x, y) {
  return (mapDef.warps || []).find((w) => w.x === x && w.y === y)
}

export function getTriggerAt(mapDef, x, y) {
  return (mapDef.triggers || []).find((t) => t.x === x && t.y === y)
}

// Visible markers for important story/quest objects (a lamp, a console, ...)
// sitting on an otherwise-plain floor tile. Purely a rendering lookup —
// nothing here participates in collision or interaction; the actual
// gameplay (dialogue, quest stage, flags) still comes entirely from a
// Trigger/Warp/NPC at the same coordinates. See MapDef.items:
// [{ id, x, y, spriteId }].
export function getItemAt(mapDef, x, y) {
  return (mapDef.items || []).find((i) => i.x === x && i.y === y)
}
