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
    }
  }
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
// (a "fake wall") and are found by pressing A while facing them — same
// interact gesture as talking to an NPC, just aimed at a wall instead of
// a person. See MapDef.secrets: [{ id, x, y, reward: {medkit?, tonic?},
// dialogue: string[] }]. Always a one-time find (no `once` flag needed —
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
