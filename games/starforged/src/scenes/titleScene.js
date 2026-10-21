import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../engine/constants.js'
import { input } from '../engine/input.js'
import { sceneManager } from '../engine/sceneManager.js'
import { OverworldScene } from './overworldScene.js'
import { createInitialState } from '../data/gameState.js'
import { hasSave, loadGame, clearSave, clearCheckpoint } from '../engine/save.js'
import { drawSprite } from '../engine/sprite.js'
import { heroSprite } from '../assets/sprites/hero.js'
import { mossSprite } from '../assets/sprites/moss.js'
import { playBlip, playConfirm } from '../engine/audio.js'
import { t, tf, getLanguage, cycleLanguage, LANGUAGES } from '../engine/i18n.js'

export class TitleScene {
  enter() {
    this.hasSave = hasSave()
    this.menuIndex = 0
  }

  exit() {}

  get options() {
    const entries = []
    if (this.hasSave) entries.push({ id: 'continue', label: t('Continue') })
    entries.push({ id: 'newGame', label: t('New Game') })
    const current = LANGUAGES.find((l) => l.code === getLanguage()) || LANGUAGES[0]
    entries.push({ id: 'language', label: tf('{label}: {value}', { label: t('Language'), value: current.label }) })
    return entries
  }

  update() {
    const opts = this.options
    if (input.wasPressed('down')) {
      this.menuIndex = (this.menuIndex + 1) % opts.length
      playBlip()
    }
    if (input.wasPressed('up')) {
      this.menuIndex = (this.menuIndex - 1 + opts.length) % opts.length
      playBlip()
    }
    if (input.wasPressed('a')) {
      const choice = opts[this.menuIndex]
      if (choice.id === 'language') {
        cycleLanguage()
        playBlip()
        return
      }
      playConfirm()
      let state
      if (choice.id === 'continue') {
        state = loadGame() || createInitialState()
      } else {
        clearSave()
        clearCheckpoint()
        state = createInitialState()
      }
      sceneManager.replace(new OverworldScene(), { state })
    }
  }

  draw(ctx) {
    ctx.fillStyle = '#0b0d12'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    drawSprite(ctx, heroSprite, 0, CANVAS_WIDTH / 2 - 26, 30, { scale: 2 })
    drawSprite(ctx, mossSprite, 0, CANVAS_WIDTH / 2 + 10, 46, { scale: 1.5 })

    ctx.textAlign = 'center'
    ctx.fillStyle = '#e8e8e8'
    ctx.font = '12px Consolas, Menlo, monospace'
    ctx.fillText('STARFORGED', CANVAS_WIDTH / 2, 90)
    ctx.font = '7px Consolas, Menlo, monospace'
    ctx.fillStyle = '#9ba1b4'
    ctx.fillText(t('a tale of the Drift'), CANVAS_WIDTH / 2, 102)

    const opts = this.options
    opts.forEach((opt, i) => {
      ctx.fillStyle = i === this.menuIndex ? '#dfe3ea' : '#52586a'
      ctx.fillText(`${i === this.menuIndex ? '> ' : ''}${opt.label}`, CANVAS_WIDTH / 2, 120 + i * 12)
    })
    ctx.textAlign = 'left'
  }
}
