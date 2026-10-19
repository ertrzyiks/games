import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../engine/constants.js'
import { input } from '../engine/input.js'
import { getWorld, listWorldIds } from '../worlds/registry.js'
import { saveGame } from '../engine/save.js'
import { playBlip, playConfirm, playCancel } from '../engine/audio.js'

/**
 * Ship / world-select screen, reached from the overworld via the B button.
 * Lists every unlocked world and warps the party there on confirm.
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
    this.menuIndex = 0

    const ids = listWorldIds().filter((id) => state.unlockedWorlds.includes(id))
    // Rustmoor is the starting world and always unlocked, even if something
    // upstream forgot to list it in state.unlockedWorlds.
    if (!ids.includes('rustmoor')) ids.unshift('rustmoor')
    this.worldIds = ids
  }

  exit() {}

  _confirm() {
    const id = this.worldIds[this.menuIndex]
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

  _cancel() {
    playCancel()
    if (this.onClose) this.onClose()
  }

  update() {
    if (this.worldIds.length === 0) {
      if (input.wasPressed('a') || input.wasPressed('b')) this._cancel()
      return
    }

    if (input.wasPressed('down')) {
      this.menuIndex = (this.menuIndex + 1) % this.worldIds.length
      playBlip()
    }
    if (input.wasPressed('up')) {
      this.menuIndex = (this.menuIndex - 1 + this.worldIds.length) % this.worldIds.length
      playBlip()
    }
    if (input.wasPressed('a')) this._confirm()
    if (input.wasPressed('b')) this._cancel()
  }

  draw(ctx) {
    ctx.fillStyle = '#0b0d12'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    ctx.font = '8px monospace'
    ctx.fillStyle = '#e8e8e8'
    ctx.fillText('STARSKIFF', 6, 14)
    ctx.font = '7px monospace'
    ctx.fillStyle = '#9ba1b4'
    ctx.fillText('Select a world', 6, 24)

    const boxX = 6
    const boxY = 32
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
        const selected = i === this.menuIndex
        ctx.fillStyle = selected ? '#dfe3ea' : '#9ba1b4'
        ctx.fillText(`${selected ? '>' : ' '} ${world.name}`, boxX + 4, boxY + 10 + i * rowH)
      })
    }

    ctx.font = '6px monospace'
    ctx.fillStyle = '#52586a'
    ctx.fillText('A: Travel   B: Cancel', boxX + 4, CANVAS_HEIGHT - 6)
  }
}
