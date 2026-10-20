import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js'
import { t } from './i18n.js'

const BOX_HEIGHT = 48
const PADDING = 6
const CHAR_INTERVAL_MS = 28

/**
 * A reusable GB-style textbox. Any scene can own one instance, feed it
 * `.start(lines, onDone)`, call `.update(dt, input)` + `.draw(ctx)` while
 * `.active` is true, and block gameplay input meanwhile.
 */
export class Dialogue {
  constructor() {
    this.active = false
    this.lines = []
    this.lineIndex = 0
    this.charIndex = 0
    this.timer = 0
    this.onDone = null
  }

  start(lines, onDone) {
    this.active = true
    // Translate here, once, so every dialogue source across the game (NPC
    // conversations, quest text, battle messages) gets localized for free
    // without any world/content file needing to call t() itself.
    this.lines = (Array.isArray(lines) ? lines : [lines]).map(t)
    this.lineIndex = 0
    this.charIndex = 0
    this.timer = 0
    this.onDone = onDone || null
  }

  get currentLine() {
    return this.lines[this.lineIndex] || ''
  }

  get isLineFullyShown() {
    return this.charIndex >= this.currentLine.length
  }

  update(dt, input) {
    if (!this.active) return
    if (!this.isLineFullyShown) {
      this.timer += dt
      while (this.timer >= CHAR_INTERVAL_MS && !this.isLineFullyShown) {
        this.timer -= CHAR_INTERVAL_MS
        this.charIndex += 1
      }
    }

    if (input.wasPressed('a') || input.wasPressed('b')) {
      if (!this.isLineFullyShown) {
        this.charIndex = this.currentLine.length
        return
      }
      this.lineIndex += 1
      this.charIndex = 0
      this.timer = 0
      if (this.lineIndex >= this.lines.length) {
        this.active = false
        const cb = this.onDone
        this.onDone = null
        if (cb) cb()
      }
    }
  }

  draw(ctx) {
    if (!this.active) return
    const boxY = CANVAS_HEIGHT - BOX_HEIGHT - 4
    ctx.fillStyle = '#0b0d12'
    ctx.fillRect(4, boxY, CANVAS_WIDTH - 8, BOX_HEIGHT)
    ctx.strokeStyle = '#e8e8e8'
    ctx.lineWidth = 2
    ctx.strokeRect(4, boxY, CANVAS_WIDTH - 8, BOX_HEIGHT)

    ctx.fillStyle = '#e8e8e8'
    ctx.font = '8px Consolas, Menlo, monospace'
    ctx.textBaseline = 'top'
    const text = this.currentLine.slice(0, this.charIndex)
    wrapText(ctx, text, 4 + PADDING, boxY + PADDING, CANVAS_WIDTH - 8 - PADDING * 2, 10)

    if (this.isLineFullyShown) {
      const blink = Math.floor(performance.now() / 400) % 2 === 0
      if (blink) {
        ctx.fillText('▼', CANVAS_WIDTH - 16, boxY + BOX_HEIGHT - 14)
      }
    }
  }
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ')
  let line = ''
  let dy = 0
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y + dy)
      line = word
      dy += lineHeight
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, x, y + dy)
}
