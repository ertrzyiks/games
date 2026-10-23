import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js'
import { t } from './i18n.js'

const BOX_HEIGHT = 48
const PADDING = 6
const CHAR_INTERVAL_MS = 28
// Discrete font-size ladder for auto-shrinking long (e.g. Polish-translated)
// dialogue lines so they fit inside the fixed-size textbox. Kept small and
// discrete so text stays crisp at this tiny canvas resolution.
const FONT_SIZES = [8, 7, 6, 5]
// Line height scales down roughly proportionally with font size so smaller
// text doesn't end up with oversized gaps between wrapped lines.
const LINE_HEIGHT_RATIO = 1.25
// Leaves a little headroom below the wrapped text so it never collides with
// the blinking "continue" ▼ indicator in the box's bottom-right corner.
const BOTTOM_RESERVE = 2

// Any of these freshly-pressed inputs advances the dialogue (completes the
// typewriter reveal, then on a subsequent press moves to the next line /
// closes). Direction keys are included so mashing arrows/WASD works just
// like A/B, since wasPressed() is edge-triggered and won't rapid-fire while
// a key is held.
const ADVANCE_ACTIONS = ['a', 'b', 'up', 'down', 'left', 'right']

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
    // Cached { lineIndex, fontSize, lineHeight } for the current line's
    // auto-shrunk font size. Computed once per line (from the full line's
    // text, never the typewriter-revealed substring) so the size stays
    // stable while that line is being revealed — recomputed only when
    // lineIndex changes. -1 means "no cache yet, compute on next draw".
    this._layoutLineIndex = -1
    this._layout = null
  }

  start(lines, onDone) {
    this.active = true
    // Translate here, once, so every dialogue source across the game (NPC
    // conversations, quest text, battle messages) gets localized for free
    // without any world/content file needing to call t() itself. A line may
    // be a plain string (the common case, drawn in the default color) or
    // `{ text, color }` (e.g. battleScene's weak-point/resisted hints) to
    // render that one line in a specific color; `.text` is still what gets
    // translated either way.
    this.lines = (Array.isArray(lines) ? lines : [lines]).map((line) =>
      typeof line === 'string' ? { text: t(line), color: null } : { text: t(line.text), color: line.color }
    )
    this.lineIndex = 0
    this.charIndex = 0
    this.timer = 0
    this.onDone = onDone || null
    // Force a fresh layout computation for the new content even though
    // lineIndex resets to 0 (which could otherwise collide with a stale
    // cache left over from a previous dialogue).
    this._layoutLineIndex = -1
    this._layout = null
  }

  get currentLine() {
    return this.lines[this.lineIndex]?.text || ''
  }

  get currentLineColor() {
    return this.lines[this.lineIndex]?.color || null
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

    const advancePressed = ADVANCE_ACTIONS.some((action) => input.wasPressed(action))
    if (advancePressed) {
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

    const maxWidth = CANVAS_WIDTH - 8 - PADDING * 2
    if (this._layoutLineIndex !== this.lineIndex) {
      this._layoutLineIndex = this.lineIndex
      this._layout = pickDialogueFontSize(ctx, this.currentLine, maxWidth)
    }
    const { fontSize, lineHeight } = this._layout

    ctx.fillStyle = this.currentLineColor || '#e8e8e8'
    ctx.font = `${fontSize}px Consolas, Menlo, monospace`
    ctx.textBaseline = 'top'
    // Only the REVEALED portion is drawn (typewriter effect); the font
    // size above was decided from the full line so it never changes
    // mid-reveal.
    const text = this.currentLine.slice(0, this.charIndex)
    const lines = wrapTextLines(ctx, text, maxWidth)
    lines.forEach((line, i) => ctx.fillText(line, 4 + PADDING, boxY + PADDING + i * lineHeight))

    if (this.isLineFullyShown) {
      const blink = Math.floor(performance.now() / 400) % 2 === 0
      if (blink) {
        // Keep the continue indicator itself at the normal, fixed size
        // regardless of what size the body text shrank to.
        ctx.font = '8px Consolas, Menlo, monospace'
        ctx.fillText('▼', CANVAS_WIDTH - 16, boxY + BOX_HEIGHT - 14)
      }
    }
  }
}

// Picks the largest font size from FONT_SIZES whose word-wrapped rendering
// of `text` fits within `maxWidth` x the box's available interior height,
// falling back to the smallest size in the ladder if even that overflows
// (never loops forever).
function pickDialogueFontSize(ctx, text, maxWidth) {
  const availableHeight = BOX_HEIGHT - PADDING * 2 - BOTTOM_RESERVE
  for (let i = 0; i < FONT_SIZES.length; i++) {
    const fontSize = FONT_SIZES[i]
    const lineHeight = Math.round(fontSize * LINE_HEIGHT_RATIO)
    ctx.font = `${fontSize}px Consolas, Menlo, monospace`
    const lineCount = Math.max(1, wrapTextLines(ctx, text, maxWidth).length)
    const isLast = i === FONT_SIZES.length - 1
    if (lineCount * lineHeight <= availableHeight || isLast) {
      return { fontSize, lineHeight }
    }
  }
  // Unreachable (FONT_SIZES is never empty), but keep a safe fallback.
  return { fontSize: FONT_SIZES[FONT_SIZES.length - 1], lineHeight: Math.round(FONT_SIZES[FONT_SIZES.length - 1] * LINE_HEIGHT_RATIO) }
}

// Word-wraps `text` to fit `maxWidth` at whatever font is currently set on
// `ctx`, returning the wrapped lines without drawing them.
function wrapTextLines(ctx, text, maxWidth) {
  const words = text.split(' ')
  const lines = []
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}
