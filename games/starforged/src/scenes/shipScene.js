import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../engine/constants.js'
import { input } from '../engine/input.js'
import { getWorld, listWorldIds } from '../worlds/registry.js'
import { saveGame } from '../engine/save.js'
import { playBlip, playConfirm, playCancel } from '../engine/audio.js'
import { t, tf, getLanguage, cycleLanguage, LANGUAGES } from '../engine/i18n.js'

/**
 * Ship / pause screen, reached from the overworld via the B button.
 * Top-level hub: Travel (world-select) / Quest Log / Language / Close.
 *
 * World-entry contract: this scene only talks to worlds through the
 * registry (`getWorld`/`listWorldIds`), so it stays decoupled from exactly
 * which worlds exist. World authors each export their own `ENTRY` constant
 * from their world file for *their own* convenience (e.g. warps within that
 * world), but that's a named export the registry has no generic way to
 * reach. To give ship travel a clean landing spot, a world object may
 * OPTIONALLY also carry `world.entry = { x, y }` (in addition to its
 * file-local `ENTRY` export). When a world doesn't set `entry`, we fall
 * back to a safe default of `{ x: 2, y: 2 }`.
 */
export class ShipScene {
  enter({ state, onClose, preselectWorldId }) {
    this.state = state
    this.onClose = onClose

    const ids = listWorldIds().filter((id) => state.unlockedWorlds.includes(id))
    // Rustmoor is the starting world and always unlocked, even if something
    // upstream forgot to list it in state.unlockedWorlds.
    if (!ids.includes('rustmoor')) ids.unshift('rustmoor')
    this.worldIds = ids

    // Coming straight from a boss victory: jump directly to the Travel
    // list with the world that was just unlocked already highlighted,
    // instead of leaving the player on the main hub menu or defaulting
    // to whatever's first in the list.
    const preIdx = preselectWorldId ? ids.indexOf(preselectWorldId) : -1
    this.mode = preIdx >= 0 ? 'travel' : 'main'
    this.mainIndex = 0
    this.travelIndex = preIdx >= 0 ? preIdx : 0
    this.questIndex = 0
  }

  exit() {}

  get mainOptions() {
    const current = LANGUAGES.find((l) => l.code === getLanguage()) || LANGUAGES[0]
    return [
      { id: 'travel', label: t('Travel') },
      { id: 'questlog', label: t('Quest Log') },
      { id: 'language', label: tf('{label}: {value}', { label: t('Language'), value: current.label }) },
      { id: 'close', label: t('Close') },
    ]
  }

  get questList() {
    return Object.values(this.state.quests || {})
  }

  _confirmTravel() {
    const id = this.worldIds[this.travelIndex]
    if (!id) return
    const world = getWorld(id)
    if (!world.maps[world.startMap]) return

    this.state.worldId = id
    this.state.mapId = world.startMap
    this.state.x = world.entry?.x ?? 2
    this.state.y = world.entry?.y ?? 2
    saveGame(this.state)
    playConfirm()
    if (this.onClose) this.onClose()
  }

  _close() {
    playCancel()
    if (this.onClose) this.onClose()
  }

  update() {
    if (this.mode === 'main') {
      const options = this.mainOptions
      if (input.wasPressed('down')) {
        this.mainIndex = (this.mainIndex + 1) % options.length
        playBlip()
      }
      if (input.wasPressed('up')) {
        this.mainIndex = (this.mainIndex - 1 + options.length) % options.length
        playBlip()
      }
      if (input.wasPressed('b')) this._close()
      if (input.wasPressed('a')) {
        const choice = options[this.mainIndex]
        if (choice.id === 'travel') {
          this.mode = 'travel'
          playConfirm()
        } else if (choice.id === 'questlog') {
          this.mode = 'questlog'
          playConfirm()
        } else if (choice.id === 'language') {
          cycleLanguage()
          playBlip()
        } else {
          this._close()
        }
      }
      return
    }

    if (this.mode === 'travel') {
      if (input.wasPressed('b')) {
        this.mode = 'main'
        playCancel()
        return
      }
      if (this.worldIds.length === 0) return
      if (input.wasPressed('down')) {
        this.travelIndex = (this.travelIndex + 1) % this.worldIds.length
        playBlip()
      }
      if (input.wasPressed('up')) {
        this.travelIndex = (this.travelIndex - 1 + this.worldIds.length) % this.worldIds.length
        playBlip()
      }
      if (input.wasPressed('a')) this._confirmTravel()
      return
    }

    if (this.mode === 'questlog') {
      if (input.wasPressed('b') || input.wasPressed('a')) {
        this.mode = 'main'
        playCancel()
      }
      return
    }
  }

  draw(ctx) {
    ctx.fillStyle = '#0b0d12'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    if (this.mode === 'main') this._drawMain(ctx)
    else if (this.mode === 'travel') this._drawTravel(ctx)
    else if (this.mode === 'questlog') this._drawQuestLog(ctx)
  }

  _drawMain(ctx) {
    ctx.font = '8px Consolas, Menlo, monospace'
    ctx.fillStyle = '#e8e8e8'
    ctx.fillText('STARSKIFF', 6, 14)

    const options = this.mainOptions
    const boxX = 6
    const boxY = 28
    const boxW = CANVAS_WIDTH - 12
    const rowH = 14
    const boxH = options.length * rowH + 8
    ctx.fillStyle = '#0b0d12'
    ctx.fillRect(boxX, boxY, boxW, boxH)
    ctx.strokeStyle = '#e8e8e8'
    ctx.lineWidth = 1
    ctx.strokeRect(boxX, boxY, boxW, boxH)

    ctx.font = '7px Consolas, Menlo, monospace'
    options.forEach((opt, i) => {
      const selected = i === this.mainIndex
      ctx.fillStyle = selected ? '#dfe3ea' : '#9ba1b4'
      ctx.fillText(`${selected ? '>' : ' '} ${opt.label}`, boxX + 4, boxY + 10 + i * rowH)
    })

    ctx.font = '6px Consolas, Menlo, monospace'
    ctx.fillStyle = '#52586a'
    ctx.fillText(t('A: Select   B: Close'), boxX + 4, CANVAS_HEIGHT - 6)
  }

  _drawTravel(ctx) {
    ctx.font = '7px Consolas, Menlo, monospace'
    ctx.fillStyle = '#9ba1b4'
    ctx.fillText(t('Select a world'), 6, 12)

    const boxX = 6
    const boxY = 20
    const boxW = CANVAS_WIDTH - 12
    const rowH = 12
    const rowCount = Math.max(1, this.worldIds.length)
    const boxH = rowCount * rowH + 8

    ctx.fillStyle = '#0b0d12'
    ctx.fillRect(boxX, boxY, boxW, boxH)
    ctx.strokeStyle = '#e8e8e8'
    ctx.lineWidth = 1
    ctx.strokeRect(boxX, boxY, boxW, boxH)

    ctx.font = '7px Consolas, Menlo, monospace'
    if (this.worldIds.length === 0) {
      ctx.fillStyle = '#9ba1b4'
      ctx.fillText(t('No worlds unlocked yet.'), boxX + 4, boxY + 10)
    } else {
      this.worldIds.forEach((id, i) => {
        const world = getWorld(id)
        const selected = i === this.travelIndex
        ctx.fillStyle = selected ? '#dfe3ea' : '#9ba1b4'
        ctx.fillText(`${selected ? '>' : ' '} ${t(world.name)}`, boxX + 4, boxY + 10 + i * rowH)
      })
    }

    ctx.font = '6px Consolas, Menlo, monospace'
    ctx.fillStyle = '#52586a'
    ctx.fillText(t('A: Travel   B: Back'), boxX + 4, CANVAS_HEIGHT - 6)
  }

  _drawQuestLog(ctx) {
    ctx.font = '7px Consolas, Menlo, monospace'
    ctx.fillStyle = '#9ba1b4'
    ctx.fillText(t('Quest Log'), 6, 12)

    const boxX = 6
    const boxY = 20
    const boxW = CANVAS_WIDTH - 12
    const boxH = CANVAS_HEIGHT - 20 - 14
    ctx.fillStyle = '#0b0d12'
    ctx.fillRect(boxX, boxY, boxW, boxH)
    ctx.strokeStyle = '#e8e8e8'
    ctx.lineWidth = 1
    ctx.strokeRect(boxX, boxY, boxW, boxH)

    const quests = this.questList
    ctx.font = '6px Consolas, Menlo, monospace'
    if (quests.length === 0) {
      ctx.fillStyle = '#9ba1b4'
      ctx.fillText(t('No quests yet. Talk to people!'), boxX + 4, boxY + 10)
    } else {
      quests.forEach((q, i) => {
        const y = boxY + 10 + i * 10
        if (y > boxY + boxH - 4) return
        ctx.fillStyle = q.complete ? '#5bd17a' : '#dfe3ea'
        const status = q.complete ? t('[done]') : `[${q.stage}]`
        ctx.fillText(`${status} ${t(q.name)}`, boxX + 4, y)
      })
    }

    ctx.font = '6px Consolas, Menlo, monospace'
    ctx.fillStyle = '#52586a'
    ctx.fillText(t('A/B: Back'), boxX + 4, CANVAS_HEIGHT - 6)
  }
}
