import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../engine/constants.js'
import { input } from '../engine/input.js'
import { saveGame } from '../engine/save.js'
import { playBlip, playConfirm, playCancel } from '../engine/audio.js'
import { t, tf } from '../engine/i18n.js'
import { getMove } from '../battle/moves.js'
import { healWithMedkit, restoreFocusWithTonic } from '../battle/items.js'
import { MAX_EQUIPPED_MOVES } from '../data/gameState.js'

/**
 * Hero / party screen, reached from the Ship menu's "Heroes" option.
 * Lets the player, outside of any fight: use a medkit or tonic on a party
 * member, and configure which ≤MAX_EQUIPPED_MOVES of a member's known
 * moves are currently equipped for battle.
 *
 * Four modes, drilling down: 'list' (pick a party member) -> 'actions'
 * (medkit / tonic / moves / back) -> 'moves' (pick an equipped slot) ->
 * 'pool' (assign a known move into that slot).
 */
export class HeroScreen {
  enter({ state, onClose }) {
    this.state = state
    this.onClose = onClose
    this.mode = 'list'
    this.listIndex = 0
    this.actionIndex = 0
    this.slotIndex = 0
    this.poolIndex = 0
    this.message = null
  }

  exit() {}

  get memberKeys() {
    return Object.keys(this.state.party)
  }

  get selectedMember() {
    return this.state.party[this.memberKeys[this.listIndex]]
  }

  get actionOptions() {
    const inv = this.state.inventory
    const opts = []
    if ((inv.medkit || 0) > 0) opts.push({ id: 'medkit', label: tf('Medkit x{count}', { count: inv.medkit }) })
    if ((inv.tonic || 0) > 0) opts.push({ id: 'tonic', label: tf('Tonic x{count}', { count: inv.tonic }) })
    opts.push({ id: 'moves', label: t('Moves') })
    opts.push({ id: 'back', label: t('Back') })
    return opts
  }

  _useMedkit() {
    const member = this.selectedMember
    if (member.hp >= member.maxHp) {
      this.message = t('Already at full HP.')
      playCancel()
      return
    }
    this.state.inventory.medkit -= 1
    const healed = healWithMedkit(member)
    this.message = tf('{name} recovers {amount} HP!', { name: t(member.name), amount: healed })
    playConfirm()
    saveGame(this.state)
  }

  _useTonic() {
    const member = this.selectedMember
    if (member.focus >= member.maxFocus) {
      this.message = t('Already at full Focus.')
      playCancel()
      return
    }
    this.state.inventory.tonic -= 1
    const restored = restoreFocusWithTonic(member)
    this.message = tf('{name} restores {amount} Focus!', { name: t(member.name), amount: restored })
    playConfirm()
    saveGame(this.state)
  }

  // Assigns `moveId` (from the known-moves pool) into equipped slot
  // `slotIndex`. If that move is already equipped elsewhere, the two
  // slots swap instead of ending up with the same move equipped twice.
  _assignMove(slotIndex, moveId) {
    const moves = this.selectedMember.moves
    const prevAtSlot = moves[slotIndex]
    const dupIndex = moves.indexOf(moveId)
    if (dupIndex !== -1 && dupIndex !== slotIndex) {
      if (prevAtSlot !== undefined) moves[dupIndex] = prevAtSlot
      else moves.splice(dupIndex, 1)
    }
    if (slotIndex < moves.length) moves[slotIndex] = moveId
    else moves.push(moveId)
    saveGame(this.state)
  }

  update() {
    if (this.mode === 'list') {
      const keys = this.memberKeys
      if (input.wasPressed('down')) {
        this.listIndex = (this.listIndex + 1) % keys.length
        playBlip()
      }
      if (input.wasPressed('up')) {
        this.listIndex = (this.listIndex - 1 + keys.length) % keys.length
        playBlip()
      }
      if (input.wasPressed('a')) {
        this.mode = 'actions'
        this.actionIndex = 0
        this.message = null
        playConfirm()
      }
      if (input.wasPressed('b')) {
        playCancel()
        if (this.onClose) this.onClose()
      }
      return
    }

    if (this.mode === 'actions') {
      const options = this.actionOptions
      if (input.wasPressed('down')) {
        this.actionIndex = (this.actionIndex + 1) % options.length
        playBlip()
      }
      if (input.wasPressed('up')) {
        this.actionIndex = (this.actionIndex - 1 + options.length) % options.length
        playBlip()
      }
      if (input.wasPressed('b')) {
        this.mode = 'list'
        this.message = null
        playCancel()
        return
      }
      if (input.wasPressed('a')) {
        const choice = options[this.actionIndex]
        if (choice.id === 'medkit') this._useMedkit()
        else if (choice.id === 'tonic') this._useTonic()
        else if (choice.id === 'moves') {
          this.mode = 'moves'
          this.slotIndex = 0
          this.message = null
          playConfirm()
        } else {
          this.mode = 'list'
          this.message = null
          playCancel()
        }
        // The action list can shrink (e.g. medkit count hits 0), so clamp
        // the cursor back onto a valid row instead of leaving it dangling.
        this.actionIndex = Math.min(this.actionIndex, this.actionOptions.length - 1)
      }
      return
    }

    if (this.mode === 'moves') {
      // Always exactly MAX_EQUIPPED_MOVES slots, whether or not they're all
      // filled yet, so an empty slot can be selected and assigned into.
      if (input.wasPressed('down')) {
        this.slotIndex = (this.slotIndex + 1) % MAX_EQUIPPED_MOVES
        playBlip()
      }
      if (input.wasPressed('up')) {
        this.slotIndex = (this.slotIndex - 1 + MAX_EQUIPPED_MOVES) % MAX_EQUIPPED_MOVES
        playBlip()
      }
      if (input.wasPressed('b')) {
        this.mode = 'actions'
        playCancel()
        return
      }
      if (input.wasPressed('a')) {
        this.poolIndex = 0
        this.mode = 'pool'
        playConfirm()
      }
      return
    }

    if (this.mode === 'pool') {
      const pool = this.selectedMember.knownMoves
      if (input.wasPressed('down')) {
        this.poolIndex = (this.poolIndex + 1) % pool.length
        playBlip()
      }
      if (input.wasPressed('up')) {
        this.poolIndex = (this.poolIndex - 1 + pool.length) % pool.length
        playBlip()
      }
      if (input.wasPressed('b')) {
        this.mode = 'moves'
        playCancel()
        return
      }
      if (input.wasPressed('a')) {
        this._assignMove(this.slotIndex, pool[this.poolIndex])
        this.mode = 'moves'
        playConfirm()
      }
      return
    }
  }

  draw(ctx) {
    ctx.fillStyle = '#0b0d12'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    if (this.mode === 'list') this._drawList(ctx)
    else if (this.mode === 'actions') this._drawActions(ctx)
    else if (this.mode === 'moves') this._drawMoves(ctx)
    else if (this.mode === 'pool') this._drawPool(ctx)
  }

  _drawPanel(ctx, boxY, boxH) {
    const boxX = 6
    const boxW = CANVAS_WIDTH - 12
    ctx.fillStyle = '#0b0d12'
    ctx.fillRect(boxX, boxY, boxW, boxH)
    ctx.strokeStyle = '#e8e8e8'
    ctx.lineWidth = 1
    ctx.strokeRect(boxX, boxY, boxW, boxH)
    return { boxX, boxY, boxW, boxH }
  }

  _drawList(ctx) {
    ctx.font = '8px Consolas, Menlo, monospace'
    ctx.fillStyle = '#e8e8e8'
    ctx.fillText(t('Heroes'), 6, 14)

    const keys = this.memberKeys
    const rowH = 20
    const { boxX, boxY } = this._drawPanel(ctx, 28, keys.length * rowH + 8)

    ctx.font = '7px Consolas, Menlo, monospace'
    keys.forEach((key, i) => {
      const member = this.state.party[key]
      const selected = i === this.listIndex
      const y = boxY + 10 + i * rowH
      ctx.fillStyle = selected ? '#dfe3ea' : '#9ba1b4'
      ctx.fillText(`${selected ? '>' : ' '} ${t(member.name)} Lv${member.level}`, boxX + 4, y)
      ctx.font = '6px Consolas, Menlo, monospace'
      ctx.fillStyle = '#52586a'
      ctx.fillText(
        tf('HP {hp}/{maxHp}  Focus {focus}/{maxFocus}', {
          hp: member.hp,
          maxHp: member.maxHp,
          focus: member.focus,
          maxFocus: member.maxFocus,
        }),
        boxX + 4,
        y + 9
      )
      ctx.font = '7px Consolas, Menlo, monospace'
    })

    ctx.font = '6px Consolas, Menlo, monospace'
    ctx.fillStyle = '#52586a'
    ctx.fillText(t('A: Select   B: Close'), 6, CANVAS_HEIGHT - 6)
  }

  _drawActions(ctx) {
    const member = this.selectedMember
    ctx.font = '7px Consolas, Menlo, monospace'
    ctx.fillStyle = '#9ba1b4'
    ctx.fillText(`${t(member.name)} Lv${member.level}`, 6, 12)

    const options = this.actionOptions
    const rowH = 12
    const { boxX, boxY, boxH } = this._drawPanel(ctx, 20, options.length * rowH + 8)

    ctx.font = '7px Consolas, Menlo, monospace'
    options.forEach((opt, i) => {
      const selected = i === this.actionIndex
      ctx.fillStyle = selected ? '#dfe3ea' : '#9ba1b4'
      ctx.fillText(`${selected ? '>' : ' '} ${opt.label}`, boxX + 4, boxY + 10 + i * rowH)
    })

    if (this.message) {
      ctx.font = '6px Consolas, Menlo, monospace'
      ctx.fillStyle = '#f4d35b'
      ctx.fillText(this.message, boxX + 4, boxY + boxH + 10)
    }

    ctx.font = '6px Consolas, Menlo, monospace'
    ctx.fillStyle = '#52586a'
    ctx.fillText(t('A: Select   B: Back'), 6, CANVAS_HEIGHT - 6)
  }

  _drawMoves(ctx) {
    const member = this.selectedMember
    ctx.font = '7px Consolas, Menlo, monospace'
    ctx.fillStyle = '#9ba1b4'
    ctx.fillText(tf('{name}: Equipped Moves', { name: t(member.name) }), 6, 12)

    const rowH = 12
    const { boxX, boxY } = this._drawPanel(ctx, 20, MAX_EQUIPPED_MOVES * rowH + 8)

    ctx.font = '7px Consolas, Menlo, monospace'
    for (let i = 0; i < MAX_EQUIPPED_MOVES; i++) {
      const moveId = member.moves[i]
      const selected = i === this.slotIndex
      ctx.fillStyle = selected ? '#dfe3ea' : '#9ba1b4'
      const label = moveId ? t(getMove(moveId).name) : t('-- empty --')
      ctx.fillText(`${selected ? '>' : ' '} ${label}`, boxX + 4, boxY + 10 + i * rowH)
    }

    ctx.font = '6px Consolas, Menlo, monospace'
    ctx.fillStyle = '#52586a'
    ctx.fillText(t('A: Assign   B: Back'), 6, CANVAS_HEIGHT - 6)
  }

  _drawPool(ctx) {
    const member = this.selectedMember
    ctx.font = '7px Consolas, Menlo, monospace'
    ctx.fillStyle = '#9ba1b4'
    ctx.fillText(t('Known Moves'), 6, 12)

    const pool = member.knownMoves
    const rowH = 12
    const { boxX, boxY } = this._drawPanel(ctx, 20, pool.length * rowH + 8)

    ctx.font = '7px Consolas, Menlo, monospace'
    pool.forEach((moveId, i) => {
      const selected = i === this.poolIndex
      const equippedElsewhere = member.moves.includes(moveId) && member.moves.indexOf(moveId) !== this.slotIndex
      ctx.fillStyle = selected ? '#dfe3ea' : '#9ba1b4'
      const tag = equippedElsewhere ? ` [${t('equipped')}]` : ''
      ctx.fillText(`${selected ? '>' : ' '} ${t(getMove(moveId).name)}${tag}`, boxX + 4, boxY + 10 + i * rowH)
    })

    ctx.font = '6px Consolas, Menlo, monospace'
    ctx.fillStyle = '#52586a'
    ctx.fillText(t('A: Swap   B: Back'), 6, CANVAS_HEIGHT - 6)
  }
}
