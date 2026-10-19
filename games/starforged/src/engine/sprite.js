/**
 * Procedural pixel-art sprites: no image files, just data.
 *
 * A SpriteDef looks like:
 * {
 *   palette: { 1: '#8893f4', 2: '#101624', ... },  // 0 is always transparent
 *   frames: [ grid, grid, ... ],                    // grid = number[][] of palette indices
 * }
 *
 * Each grid cell is drawn as a `pixel`x`pixel` square, so sprite art is
 * authored at a tiny native resolution (e.g. 16x16) and scales crisply.
 */

const cache = new Map()

function cacheKey(spriteDef, frameIndex, flip) {
  return `${spriteDef.__id || spriteDef}-${frameIndex}-${flip}`
}

function renderFrameToOffscreen(spriteDef, frameIndex, flip) {
  const grid = spriteDef.frames[frameIndex] || spriteDef.frames[0]
  const h = grid.length
  const w = grid[0].length
  const off = document.createElement('canvas')
  off.width = w
  off.height = h
  const octx = off.getContext('2d')
  for (let row = 0; row < h; row++) {
    for (let col = 0; col < w; col++) {
      const idx = grid[row][col]
      if (!idx) continue
      const color = spriteDef.palette[idx]
      octx.fillStyle = color
      const drawCol = flip ? w - 1 - col : col
      octx.fillRect(drawCol, row, 1, 1)
    }
  }
  return off
}

let idCounter = 0
export function defineSprite(def) {
  def.__id = `sprite-${idCounter++}`
  return def
}

export function drawSprite(ctx, spriteDef, frameIndex, x, y, { scale = 1, flip = false } = {}) {
  const frame = frameIndex % spriteDef.frames.length
  const key = cacheKey(spriteDef, frame, flip)
  let off = cache.get(key)
  if (!off) {
    off = renderFrameToOffscreen(spriteDef, frame, flip)
    cache.set(key, off)
  }
  const prevSmoothing = ctx.imageSmoothingEnabled
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(off, 0, 0, off.width, off.height, Math.round(x), Math.round(y), off.width * scale, off.height * scale)
  ctx.imageSmoothingEnabled = prevSmoothing
}
