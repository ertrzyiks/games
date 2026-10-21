import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../engine/constants.js'
import { input } from '../engine/input.js'
import { playExplosion } from '../engine/audio.js'
import { t } from '../engine/i18n.js'

/**
 * Shown when the whole party is knocked out in battle (both Wando and Gogu
 * at 0 HP) — a real "you lost" beat, rather than the previous silent
 * full-heal-back-to-the-overworld behavior. `enter({ onContinue })` is
 * called once with a callback that hands control back to the caller
 * (OverworldScene sends the player to the TitleScene, so they fall through
 * to its existing Continue/New Game flow instead of this scene owning a
 * save/load decision itself).
 */
export class GameOverScene {
  enter({ onContinue } = {}) {
    this.onContinue = onContinue || null
    this.timer = 0
    this.accepting = false
    playExplosion()
  }

  exit() {}

  update(dt) {
    this.timer += dt
    // A short pause before any input is accepted, so a stray held-down key
    // from the battle's final blow can't instantly skip past this screen.
    if (!this.accepting && this.timer > 600) this.accepting = true
    if (this.accepting && (input.wasPressed('a') || input.wasPressed('b'))) {
      if (this.onContinue) this.onContinue()
    }
  }

  draw(ctx) {
    ctx.fillStyle = '#0b0d12'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    ctx.textAlign = 'center'
    ctx.fillStyle = '#e0564b'
    ctx.font = '14px Consolas, Menlo, monospace'
    ctx.fillText(t('GAME OVER'), CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10)

    ctx.font = '7px Consolas, Menlo, monospace'
    ctx.fillStyle = '#9ba1b4'
    ctx.fillText(t('Wando and Gogu were overwhelmed.'), CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10)

    if (this.accepting) {
      const blink = Math.floor(performance.now() / 400) % 2 === 0
      if (blink) {
        ctx.fillStyle = '#e8e8e8'
        ctx.fillText(t('Press A to continue'), CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 28)
      }
    }
    ctx.textAlign = 'left'
  }
}
