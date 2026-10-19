import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js'

export function setupCanvas(canvasEl) {
  canvasEl.width = CANVAS_WIDTH
  canvasEl.height = CANVAS_HEIGHT
  const ctx = canvasEl.getContext('2d')
  ctx.imageSmoothingEnabled = false
  return ctx
}
