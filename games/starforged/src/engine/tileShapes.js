/**
 * Procedural pixel-art icons drawn on top of a tile's flat color+dither
 * fill, so a "tree" tile actually looks like a tree, a "rock" tile looks
 * like a rock, and so on — instead of every piece of scenery reading as
 * just a colored square. Purely additive: a TileType with no `shape` field
 * (most floor/path/ground-texture tiles — walkable, usually tiled over a
 * large area, where a repeated discrete icon would look busier, not
 * better) renders exactly as before. `shape` is reserved for the discrete,
 * usually-unwalkable scenery/obstacle tiles each world places individually
 * (a tree, a boulder, a crate, ...).
 *
 * Each drawer takes (ctx, px, py, color) where (px, py) is the tile's
 * top-left corner in canvas space and `color` is the TileType's own
 * `color` — most drawers shade lighter/darker variants from that single
 * color (via `shade()`) so a reskinned tile (e.g. a different world's
 * boulder color) automatically gets matching highlights/shadows without
 * any extra authoring.
 */

const TILE_SIZE = 16

function clamp(v) {
  return Math.max(0, Math.min(255, v))
}

// percent > 0 lightens toward white, percent < 0 darkens toward black.
function shade(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = (num >> 16) & 0xff
  const g = (num >> 8) & 0xff
  const b = num & 0xff
  const target = percent < 0 ? 0 : 255
  const p = Math.abs(percent)
  const nr = clamp(Math.round(r + (target - r) * p))
  const ng = clamp(Math.round(g + (target - g) * p))
  const nb = clamp(Math.round(b + (target - b) * p))
  return `#${((1 << 24) + (nr << 16) + (ng << 8) + nb).toString(16).slice(1)}`
}

function drawTree(ctx, px, py, color) {
  const dark = shade(color, -0.35)
  const light = shade(color, 0.25)
  ctx.fillStyle = '#4a3222'
  ctx.fillRect(px + 7, py + 10, 2, 5)
  ctx.fillStyle = dark
  ctx.fillRect(px + 3, py + 4, 10, 7)
  ctx.fillStyle = color
  ctx.fillRect(px + 4, py + 2, 8, 8)
  ctx.fillStyle = light
  ctx.fillRect(px + 5, py + 3, 4, 3)
}

function drawDeadTree(ctx, px, py, color) {
  // Lightened (not darkened) relative to its own base color: deadTree
  // tiles tend to already be very dark, so a same-direction shade would
  // barely separate from the flat fill behind it.
  const trunk = shade(color, 0.45)
  const branch = shade(color, 0.25)
  ctx.fillStyle = trunk
  ctx.fillRect(px + 7, py + 6, 2, 9)
  ctx.fillStyle = branch
  ctx.fillRect(px + 4, py + 4, 3, 2)
  ctx.fillRect(px + 9, py + 3, 3, 2)
  ctx.fillRect(px + 3, py + 8, 3, 2)
  ctx.fillRect(px + 10, py + 7, 3, 2)
}

function drawTrunk(ctx, px, py, color) {
  const dark = shade(color, -0.3)
  const light = shade(color, 0.2)
  ctx.fillStyle = color
  ctx.fillRect(px + 2, py, 12, 16)
  ctx.fillStyle = dark
  ctx.fillRect(px + 2, py, 2, 16)
  ctx.fillRect(px + 7, py, 2, 16)
  ctx.fillStyle = light
  ctx.fillRect(px + 11, py, 2, 16)
}

function drawRock(ctx, px, py, color) {
  const dark = shade(color, -0.3)
  const light = shade(color, 0.25)
  ctx.fillStyle = dark
  ctx.fillRect(px + 2, py + 6, 12, 8)
  ctx.fillRect(px + 4, py + 4, 8, 3)
  ctx.fillStyle = color
  ctx.fillRect(px + 3, py + 7, 10, 6)
  ctx.fillRect(px + 5, py + 5, 6, 3)
  ctx.fillStyle = light
  ctx.fillRect(px + 4, py + 6, 4, 2)
}

function drawMossyRock(ctx, px, py, color) {
  drawRock(ctx, px, py, color)
  ctx.fillStyle = '#4f7a3a'
  ctx.fillRect(px + 4, py + 4, 2, 2)
  ctx.fillRect(px + 9, py + 3, 2, 2)
  ctx.fillRect(px + 6, py + 5, 2, 2)
}

function drawRubble(ctx, px, py, color) {
  const dark = shade(color, -0.3)
  const light = shade(color, 0.2)
  const chunks = [
    [2, 9, 4, 3],
    [7, 10, 3, 3],
    [11, 8, 3, 4],
    [4, 5, 3, 3],
    [9, 4, 4, 3],
  ]
  for (const [cx, cy, cw, ch] of chunks) {
    ctx.fillStyle = color
    ctx.fillRect(px + cx, py + cy, cw, ch)
    ctx.fillStyle = dark
    ctx.fillRect(px + cx, py + cy + ch - 1, cw, 1)
  }
  ctx.fillStyle = light
  ctx.fillRect(px + 5, py + 5, 2, 1)
}

function drawCrate(ctx, px, py, color) {
  const dark = shade(color, -0.35)
  const light = shade(color, 0.2)
  ctx.fillStyle = color
  ctx.fillRect(px + 2, py + 2, 12, 12)
  ctx.fillStyle = dark
  ctx.fillRect(px + 2, py + 2, 12, 2)
  ctx.fillRect(px + 2, py + 8, 12, 2)
  ctx.fillRect(px + 2, py + 2, 2, 12)
  ctx.fillRect(px + 12, py + 2, 2, 12)
  ctx.fillStyle = light
  ctx.fillRect(px + 4, py + 4, 8, 1)
}

function drawPillar(ctx, px, py, color) {
  const dark = shade(color, -0.3)
  const light = shade(color, 0.2)
  ctx.fillStyle = dark
  ctx.fillRect(px + 3, py, 10, 3)
  ctx.fillRect(px + 3, py + 13, 10, 3)
  ctx.fillStyle = color
  ctx.fillRect(px + 5, py + 3, 6, 10)
  ctx.fillStyle = light
  ctx.fillRect(px + 5, py + 3, 1, 10)
}

function drawBrokenPillar(ctx, px, py, color) {
  const dark = shade(color, -0.3)
  const light = shade(color, 0.2)
  ctx.fillStyle = dark
  ctx.fillRect(px + 3, py + 12, 10, 4)
  ctx.fillStyle = color
  ctx.fillRect(px + 5, py + 7, 6, 5)
  ctx.fillRect(px + 4, py + 9, 2, 3)
  ctx.fillRect(px + 10, py + 5, 2, 7)
  ctx.fillStyle = light
  ctx.fillRect(px + 10, py + 5, 1, 4)
}

function drawFence(ctx, px, py, color) {
  const dark = shade(color, -0.3)
  ctx.fillStyle = color
  ctx.fillRect(px + 1, py + 4, 2, 11)
  ctx.fillRect(px + 7, py + 4, 2, 11)
  ctx.fillRect(px + 13, py + 4, 2, 11)
  ctx.fillRect(px, py + 6, 16, 2)
  ctx.fillStyle = dark
  ctx.fillRect(px, py + 10, 16, 1)
}

function drawCage(ctx, px, py, color) {
  const dark = shade(color, -0.45)
  ctx.fillStyle = dark
  ctx.fillRect(px + 1, py + 1, 14, 14)
  ctx.fillStyle = color
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(px + 2 + i * 4, py + 2, 2, 12)
  }
}

function drawWreckage(ctx, px, py, color) {
  const dark = shade(color, -0.35)
  const light = shade(color, 0.3)
  ctx.fillStyle = color
  ctx.fillRect(px + 2, py + 5, 7, 6)
  ctx.fillRect(px + 8, py + 8, 6, 5)
  ctx.fillStyle = dark
  ctx.fillRect(px + 2, py + 9, 7, 2)
  ctx.fillRect(px + 8, py + 11, 6, 2)
  ctx.fillStyle = light
  ctx.fillRect(px + 4, py + 6, 2, 1)
  ctx.fillRect(px + 10, py + 9, 2, 1)
}

function drawBush(ctx, px, py, color) {
  const dark = shade(color, -0.25)
  const light = shade(color, 0.2)
  ctx.fillStyle = dark
  ctx.fillRect(px + 3, py + 7, 10, 6)
  ctx.fillStyle = color
  ctx.fillRect(px + 4, py + 5, 8, 6)
  ctx.fillRect(px + 2, py + 8, 4, 4)
  ctx.fillRect(px + 10, py + 8, 4, 4)
  ctx.fillStyle = light
  ctx.fillRect(px + 6, py + 6, 3, 2)
}

function drawRoots(ctx, px, py, color) {
  // Lightened, same reasoning as drawDeadTree — rootTangle's base color is
  // already dark, so the tangle needs to stand out brighter, not darker.
  const root = shade(color, 0.4)
  const dark = shade(color, 0.1)
  ctx.fillStyle = root
  ctx.fillRect(px + 1, py + 3, 3, 2)
  ctx.fillRect(px + 4, py + 5, 3, 2)
  ctx.fillRect(px + 7, py + 3, 3, 2)
  ctx.fillRect(px + 10, py + 6, 3, 2)
  ctx.fillRect(px + 3, py + 8, 3, 2)
  ctx.fillRect(px + 8, py + 9, 3, 2)
  ctx.fillRect(px + 6, py + 11, 4, 2)
  ctx.fillStyle = dark
  ctx.fillRect(px + 5, py + 6, 2, 1)
  ctx.fillRect(px + 9, py + 10, 2, 1)
}

function drawVine(ctx, px, py, color) {
  const dark = shade(color, -0.3)
  ctx.fillStyle = color
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE)
  ctx.fillStyle = dark
  ctx.fillRect(px, py, TILE_SIZE, 2)
  ctx.fillStyle = '#3f7a4a'
  ctx.fillRect(px + 6, py + 2, 2, 4)
  ctx.fillRect(px + 8, py + 6, 2, 4)
  ctx.fillRect(px + 6, py + 10, 2, 4)
  ctx.fillStyle = '#5bd17a'
  ctx.fillRect(px + 4, py + 4, 2, 2)
  ctx.fillRect(px + 10, py + 8, 2, 2)
  ctx.fillRect(px + 4, py + 12, 2, 2)
}

function drawFungus(ctx, px, py, color) {
  // A dark cap outline so the mushroom silhouette reads clearly even
  // though glowFungus-style tiles are themselves already bright green —
  // the tile's own color is used only as a mid-tone cap fill plus a
  // bright glow dot, sandwiched between a dark rim and the pale stems.
  const dark = shade(color, -0.4)
  const bright = shade(color, 0.5)
  ctx.fillStyle = '#d8e8d0'
  ctx.fillRect(px + 6, py + 9, 2, 5)
  ctx.fillRect(px + 10, py + 10, 2, 4)
  ctx.fillStyle = dark
  ctx.fillRect(px + 2, py + 5, 7, 5)
  ctx.fillRect(px + 7, py + 6, 6, 4)
  ctx.fillStyle = color
  ctx.fillRect(px + 3, py + 6, 5, 3)
  ctx.fillRect(px + 8, py + 7, 4, 2)
  ctx.fillStyle = bright
  ctx.fillRect(px + 5, py + 7, 2, 1)
}

function drawBarrier(ctx, px, py, color) {
  ctx.fillStyle = '#14161c'
  ctx.fillRect(px + 1, py + 5, 14, 2)
  ctx.fillRect(px + 1, py + 9, 14, 2)
  ctx.fillStyle = color
  ctx.fillRect(px + 1, py + 5, 4, 2)
  ctx.fillRect(px + 9, py + 5, 4, 2)
  ctx.fillRect(px + 5, py + 9, 4, 2)
  ctx.fillRect(px + 13, py + 9, 2, 2)
}

function drawMachinery(ctx, px, py, color) {
  const dark = shade(color, -0.3)
  const light = shade(color, 0.3)
  ctx.fillStyle = color
  ctx.fillRect(px + 2, py + 3, 12, 10)
  ctx.fillStyle = dark
  ctx.fillRect(px + 2, py + 3, 12, 2)
  ctx.fillStyle = light
  ctx.fillRect(px + 4, py + 6, 3, 3)
  ctx.fillStyle = '#e3b23c'
  ctx.fillRect(px + 10, py + 6, 2, 2)
}

function drawWaterRipple(ctx, px, py, color) {
  const light = shade(color, 0.3)
  ctx.fillStyle = light
  ctx.fillRect(px + 2, py + 5, 3, 1)
  ctx.fillRect(px + 6, py + 5, 2, 1)
  ctx.fillRect(px + 9, py + 9, 3, 1)
  ctx.fillRect(px + 13, py + 9, 2, 1)
  ctx.fillRect(px + 2, py + 12, 2, 1)
  ctx.fillRect(px + 5, py + 12, 3, 1)
}

function drawWallPanel(ctx, px, py, color) {
  const dark = shade(color, -0.2)
  ctx.fillStyle = dark
  ctx.fillRect(px, py + 7, TILE_SIZE, 1)
  ctx.fillRect(px + 7, py, 1, 7)
  ctx.fillRect(px + 3, py + 8, 1, 8)
  ctx.fillRect(px + 11, py + 8, 1, 8)
}

function drawRune(ctx, px, py, color) {
  const glow = shade(color, 0.5)
  const brighter = shade(color, 0.75)
  ctx.fillStyle = glow
  ctx.fillRect(px + 6, py + 3, 4, 1)
  ctx.fillRect(px + 3, py + 6, 1, 4)
  ctx.fillRect(px + 12, py + 6, 1, 4)
  ctx.fillRect(px + 6, py + 12, 4, 1)
  ctx.fillRect(px + 5, py + 5, 1, 1)
  ctx.fillRect(px + 10, py + 5, 1, 1)
  ctx.fillRect(px + 5, py + 10, 1, 1)
  ctx.fillRect(px + 10, py + 10, 1, 1)
  ctx.fillStyle = brighter
  ctx.fillRect(px + 7, py + 7, 2, 2)
}

function drawDoor(ctx, px, py) {
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

const SHAPE_DRAWERS = {
  tree: drawTree,
  deadTree: drawDeadTree,
  trunk: drawTrunk,
  rock: drawRock,
  mossyRock: drawMossyRock,
  rubble: drawRubble,
  crate: drawCrate,
  pillar: drawPillar,
  brokenPillar: drawBrokenPillar,
  fence: drawFence,
  cage: drawCage,
  wreckage: drawWreckage,
  bush: drawBush,
  roots: drawRoots,
  vine: drawVine,
  fungus: drawFungus,
  barrier: drawBarrier,
  machinery: drawMachinery,
  water: drawWaterRipple,
  wall: drawWallPanel,
  rune: drawRune,
  door: drawDoor,
}

export function drawTileShape(ctx, shape, px, py, color) {
  const drawer = SHAPE_DRAWERS[shape]
  if (drawer) drawer(ctx, px, py, color)
}
