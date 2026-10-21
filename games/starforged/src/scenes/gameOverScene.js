import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../engine/constants.js'
import { input } from '../engine/input.js'
import { playExplosion } from '../engine/audio.js'
import { t } from '../engine/i18n.js'

/**
 * Shown when the whole party is knocked out in battle (both Wando and Gogu
 * at 0 HP) — a real "you lost" beat, rather than the previous silent
 * full-heal-back-to-the-overworld behavior. `enter({ onRetry, onGiveUp })`
 * is called once with the two things the player can do next: retry from
 * the last travel checkpoint (only offered when one exists), or give up
 * and fall through to the Title screen's Continue/New Game flow. Neither
 * callback is this scene's business beyond invoking it - OverworldScene
 * owns the actual save/load decision.
 */
export class GameOverScene {
  enter({ onRetry, onGiveUp } = {}) {
    this.onRetry = onRetry || null
    this.onGiveUp = onGiveUp || null
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
    if (!this.accepting) return
    if (input.wasPressed('a')) {
      if (this.onRetry) this.onRetry()
      else if (this.onGiveUp) this.onGiveUp()
    } else if (input.wasPressed('b')) {
      if (this.onGiveUp) this.onGiveUp()
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
        ctx.fillText(
          this.onRetry ? t('Press A to retry') : t('Press A to continue'),
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT / 2 + 28,
        )
      }
      if (this.onRetry) {
        ctx.font = '6px Consolas, Menlo, monospace'
        ctx.fillStyle = '#52586a'
        ctx.fillText(t('A: Retry   B: Give up'), CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40)
      }
    }
    ctx.textAlign = 'left'
  }
}
