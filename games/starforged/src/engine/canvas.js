import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js'

// The canvas is displayed much larger (up to 640 CSS px) than its logical
// CANVAS_WIDTH x CANVAS_HEIGHT game resolution (192x176 - see
// constants.js). Backing the canvas at only that many pixels and relying
// on `image-rendering: pixelated` to blow it up made small text (6-8px
// dialogue/HUD labels) look blurry/mushy — the glyphs get anti-aliased at
// a tiny size, then that blur gets magnified on top.
// Supersampling the backing store (bigger bitmap, same CSS size, same
// logical coordinate space via ctx.scale) renders every glyph at much
// higher pixel density before any upscaling happens, which is far
// crisper, while leaving every existing draw call's x/y/size math
// untouched since it still thinks in logical pixels.
export const RENDER_SCALE = 3

export function setupCanvas(canvasEl) {
  canvasEl.width = CANVAS_WIDTH * RENDER_SCALE
  canvasEl.height = CANVAS_HEIGHT * RENDER_SCALE
  const ctx = canvasEl.getContext('2d')
  ctx.imageSmoothingEnabled = false
  ctx.scale(RENDER_SCALE, RENDER_SCALE)
  return ctx
}
