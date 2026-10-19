import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../engine/constants.js'
import { input } from '../engine/input.js'
import { getWorld, listWorldIds } from '../worlds/registry.js'
import { saveGame } from '../engine/save.js'
import { playBlip, playConfirm, playCancel } from '../engine/audio.js'

const MAIN_OPTIONS = ['Travel', 'Quest Log', 'Close']

/**
 * Ship / pause screen, reached from the overworld via the B button.
 * Top-level hub: Travel (world-select) / Quest Log / Close.
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
  enter({ state, onClose }) {
    this.state = state
    this.onClose = onClose
    this.mode = 'main'
    this.mainIndex = 0

    const ids = listWorldIds().filter((id) => state.unlockedWorlds.includes(id))
    // Rustmoor is the starting world and always unlocked, even if something
    // upstream forgot to list it in state.unlockedWorlds.
    if (!ids.includes('rustmoor')) ids.unshift('rustmoor')
    this.worldIds = ids
    this.travelIndex = 0
    this.questIndex = 0
  }

  exit() {}

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
      if (input.wasPressed('down')) {
        this.mainIndex = (this.mainIndex + 1) % MAIN_OPTIONS.length
        playBlip()
      }
      if (input.wasPressed('up')) {
        this.mainIndex = (this.mainIndex - 1 + MAIN_OPTIONS.length) % MAIN_OPTIONS.length
        playBlip()
      }
      if (input.wasPressed('b')) this._close()
      if (input.wasPressed('a')) {
        const choice = MAIN_OPTIONS[this.mainIndex]
        if (choice === 'Travel') {
          this.mode = 'travel'
          playConfirm()
        } else if (choice === 'Quest Log') {
          this.mode = 'questlog'
          playConfirm()
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
    ctx.font = '8px monospace'
    ctx.fillStyle = '#e8e8e8'
    ctx.fillText('STARSKIFF', 6, 14)

    const boxX = 6
    const boxY = 28
    const boxW = CANVAS_WIDTH - 12
    const rowH = 14
    const boxH = MAIN_OPTIONS.length * rowH + 8
    ctx.fillStyle = '#0b0d12'
    ctx.fillRect(boxX, boxY, boxW, boxH)
    ctx.strokeStyle = '#e8e8e8'
    ctx.lineWidth = 1
    ctx.strokeRect(boxX, boxY, boxW, boxH)

    ctx.font = '7px monospace'
    MAIN_OPTIONS.forEach((opt, i) => {
      const selected = i === this.mainIndex
      ctx.fillStyle = selected ? '#dfe3ea' : '#9ba1b4'
      ctx.fillText(`${selected ? '>' : ' '} ${opt}`, boxX + 4, boxY + 10 + i * rowH)
    })

    ctx.font = '6px monospace'
    ctx.fillStyle = '#52586a'
    ctx.fillText('A: Select   B: Close', boxX + 4, CANVAS_HEIGHT - 6)
  }

  _drawTravel(ctx) {
    ctx.font = '7px monospace'
    ctx.fillStyle = '#9ba1b4'
    ctx.fillText('Select a world', 6, 12)

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

    ctx.font = '7px monospace'
    if (this.worldIds.length === 0) {
      ctx.fillStyle = '#9ba1b4'
      ctx.fillText('No worlds unlocked yet.', boxX + 4, boxY + 10)
    } else {
      this.worldIds.forEach((id, i) => {
        const world = getWorld(id)
        const selected = i === this.travelIndex
        ctx.fillStyle = selected ? '#dfe3ea' : '#9ba1b4'
        ctx.fillText(`${selected ? '>' : ' '} ${world.name}`, boxX + 4, boxY + 10 + i * rowH)
      })
    }

    ctx.font = '6px monospace'
    ctx.fillStyle = '#52586a'
    ctx.fillText('A: Travel   B: Back', boxX + 4, CANVAS_HEIGHT - 6)
  }

  _drawQuestLog(ctx) {
    ctx.font = '7px monospace'
    ctx.fillStyle = '#9ba1b4'
    ctx.fillText('Quest Log', 6, 12)

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
    ctx.font = '6px monospace'
    if (quests.length === 0) {
      ctx.fillStyle = '#9ba1b4'
      ctx.fillText('No quests yet. Talk to people!', boxX + 4, boxY + 10)
    } else {
      quests.forEach((q, i) => {
        const y = boxY + 10 + i * 10
        if (y > boxY + boxH - 4) return
        ctx.fillStyle = q.complete ? '#5bd17a' : '#dfe3ea'
        const status = q.complete ? '[done]' : `[${q.stage}]`
        ctx.fillText(`${status} ${q.name}`, boxX + 4, y)
      })
    }

    ctx.font = '6px monospace'
    ctx.fillStyle = '#52586a'
    ctx.fillText('A/B: Back', boxX + 4, CANVAS_HEIGHT - 6)
  }
}
