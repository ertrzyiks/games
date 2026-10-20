import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../engine/constants.js'
import { Dialogue } from '../engine/dialogue.js'
import { drawSprite } from '../engine/sprite.js'
import { input } from '../engine/input.js'
import { getMove } from './moves.js'
import { getEnemy } from './enemies.js'
import { t, tf } from '../engine/i18n.js'
import { getSprite } from '../assets/sprites/registry.js'
import { heroSprite } from '../assets/sprites/hero.js'
import { mossSprite } from '../assets/sprites/moss.js'
import { grantXp } from '../data/gameState.js'

const PARTY_SPRITES = { kade: heroSprite, moss: mossSprite }
const ITEM_HEAL_AMOUNT = 15

/**
 * Turn-based battle: each round, the player picks a move for every living
 * party member, then all living enemies pick a move (simple random AI),
 * guard moves resolve first, then the rest resolve in speed order.
 */
export class BattleScene {
  constructor() {
    this.dialogue = new Dialogue()
  }

  enter({ state, enemyIds, onEnd }) {
    this.state = state
    this.party = state.party
    this.onEnd = onEnd
    this.enemies = enemyIds.map((id) => {
      const def = getEnemy(id)
      return { ...def, hp: def.maxHp, maxHp: def.maxHp, guarding: false }
    })
    this.phase = 'intro'
    this.menuIndex = 0
    this.queuedActions = []

    const names = this.enemies.map((e) => t(e.name)).join(` ${t('and')} `)
    this.dialogue.start([tf('{names} appeared!', { names })], () => this._beginSelection())
  }

  exit() {}

  _livingPartyKeys() {
    return Object.keys(this.party).filter((k) => this.party[k].hp > 0)
  }

  _livingPartyUnits() {
    return Object.values(this.party).filter((m) => m.hp > 0)
  }

  _livingEnemies() {
    return this.enemies.filter((e) => e.hp > 0)
  }

  _beginSelection() {
    this.actOrder = this._livingPartyKeys()
    this.actIdx = 0
    this.queuedActions = []
    if (this.actOrder.length === 0) {
      this._onDefeat()
      return
    }
    this._promptForActor()
  }

  _promptForActor() {
    if (this.actIdx >= this.actOrder.length) {
      this._enemyChoose()
      return
    }
    this.currentActorKey = this.actOrder[this.actIdx]
    this.phase = 'menu'
    this.menuIndex = 0
  }

  _currentOptions() {
    const unit = this.party[this.currentActorKey]
    // Only ever show options that can actually be confirmed right now, so
    // the menu can never get "stuck" on a selection that silently does
    // nothing (insufficient Focus, or no medkits left). Every party member
    // is guaranteed at least one 0-focus-cost move (see data/gameState.js),
    // so `usable` is never empty.
    const usable = unit.moves.filter((id) => getMove(id).focusCost <= unit.focus)
    const options = usable.length > 0 ? usable : [unit.moves[0]]
    if ((this.state.inventory.medkit || 0) > 0) options.push('item')
    return options
  }

  _confirmSelection() {
    const unit = this.party[this.currentActorKey]
    const options = this._currentOptions()
    const choice = options[this.menuIndex]

    if (choice === 'item') {
      if ((this.state.inventory.medkit || 0) <= 0) return
      this.state.inventory.medkit -= 1
      this.queuedActions.push({
        unit,
        isParty: true,
        special: 'item',
        speed: unit.spd,
        name: unit.name,
      })
      this.actIdx += 1
      this._promptForActor()
      return
    }

    const move = getMove(choice)
    if (move.focusCost > unit.focus) return

    // Multi-enemy fights let the player pick a target; single-enemy fights
    // keep the old instant-confirm flow untouched for speed/backward compat.
    if (move.kind === 'attack' && this._livingEnemies().length > 1) {
      this._pendingChoice = choice
      this._pendingMove = move
      this.targetIndex = 0
      this.phase = 'target'
      return
    }

    unit.focus -= move.focusCost
    this.queuedActions.push({ unit, isParty: true, moveId: choice, speed: unit.spd, name: unit.name })
    this.actIdx += 1
    this._promptForActor()
  }

  _confirmTarget() {
    const unit = this.party[this.currentActorKey]
    const move = this._pendingMove
    const choice = this._pendingChoice
    const targets = this._livingEnemies()
    const target = targets[this.targetIndex] || targets[0]

    unit.focus -= move.focusCost
    this.queuedActions.push({
      unit,
      isParty: true,
      moveId: choice,
      speed: unit.spd,
      name: unit.name,
      targetUnit: target,
    })
    this._pendingChoice = null
    this._pendingMove = null
    this.actIdx += 1
    this._promptForActor()
  }

  _cancelTarget() {
    // Back out of target selection without spending focus or queuing an
    // action, so the player returns to the move menu to pick again.
    this._pendingChoice = null
    this._pendingMove = null
    this.phase = 'menu'
  }

  _enemyChoose() {
    for (const enemy of this._livingEnemies()) {
      const moveId = this._chooseEnemyMove(enemy)
      this.queuedActions.push({ unit: enemy, isParty: false, moveId, speed: enemy.spd, name: enemy.name })
    }
    this._buildMessages()
  }

  _chooseEnemyMove(enemy) {
    const healMoves = enemy.moves.filter((id) => getMove(id).kind === 'heal')
    const isLowHp = enemy.hp / enemy.maxHp < 0.4
    if (isLowHp && healMoves.length > 0) {
      return healMoves[Math.floor(Math.random() * healMoves.length)]
    }
    const nonHealMoves = enemy.moves.filter((id) => getMove(id).kind !== 'heal')
    const pool = nonHealMoves.length > 0 ? nonHealMoves : enemy.moves
    return pool[Math.floor(Math.random() * pool.length)]
  }

  // Enemy AI target selection: weight toward whoever is lowest on HP, but
  // leave some randomness so fights don't always focus-fire one member.
  _pickWeightedPartyTarget(targets) {
    if (Math.random() < 0.6) {
      return targets.reduce((lowest, t) => (t.hp / t.maxHp < lowest.hp / lowest.maxHp ? t : lowest), targets[0])
    }
    return targets[Math.floor(Math.random() * targets.length)]
  }

  // Processes the round's actions ONE AT A TIME, synced to the dialogue:
  // each action's state mutation (HP/focus change) happens exactly when
  // its message starts displaying, not all upfront for the whole round
  // (that used to let the HP bar already show the round's end state while
  // the player was still reading the first message).
  _buildMessages() {
    for (const unit of [...Object.values(this.party), ...this.enemies]) unit.guarding = false

    const live = this.queuedActions.filter((a) => a.unit.hp > 0)
    // Guard's *protective* flag still has to be set before anything else
    // this round resolves (so it correctly halves incoming damage no
    // matter the speed order) — but its message/focus-restore are shown
    // in their normal sequence position, synced like everything else.
    const isBuff = (a) => a.special !== 'item' && getMove(a.moveId).kind === 'buff'
    for (const action of live) {
      if (isBuff(action)) action.unit.guarding = true
    }

    const buffs = live.filter(isBuff)
    const rest = live.filter((a) => !isBuff(a)).sort((a, b) => b.speed - a.speed)
    this._actionQueue = [...buffs, ...rest]
    this._processNextQueuedAction()
  }

  _processNextQueuedAction() {
    if (this._battleOver() || this._actionQueue.length === 0) {
      this._afterResolve()
      return
    }
    const action = this._actionQueue.shift()
    if (action.unit.hp <= 0) {
      this._processNextQueuedAction()
      return
    }
    const lines = this._resolveSingleAction(action)
    this.phase = 'resolving'
    this.dialogue.start(lines.length ? lines : ['...'], () => this._processNextQueuedAction())
  }

  _resolveSingleAction(action) {
    if (action.special === 'item') {
      const before = action.unit.hp
      action.unit.hp = Math.min(action.unit.maxHp, action.unit.hp + ITEM_HEAL_AMOUNT)
      return [
        tf('{name} uses a medkit and recovers {amount} HP!', { name: t(action.name), amount: action.unit.hp - before }),
      ]
    }
    const move = getMove(action.moveId)
    if (move.kind === 'buff') {
      if (move.focusRestore) {
        const before = action.unit.focus
        action.unit.focus = Math.min(action.unit.maxFocus, action.unit.focus + move.focusRestore)
        const restored = action.unit.focus - before
        return [
          restored > 0
            ? tf('{name} uses {move}, guarding and restoring {amount} focus!', {
                name: t(action.name),
                move: t(move.name),
                amount: restored,
              })
            : tf('{name} guards.', { name: t(action.name) }),
        ]
      }
      return [tf('{name} guards.', { name: t(action.name) })]
    }
    return this._resolveAction(action)
  }

  _resolveAction(action) {
    if (action.unit.hp <= 0) return []
    const move = getMove(action.moveId)
    const lines = []

    if (move.kind === 'heal') {
      const allies = action.isParty ? this._livingPartyUnits() : this._livingEnemies()
      const target = allies.sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0]
      if (!target) return lines
      const before = target.hp
      target.hp = Math.min(target.maxHp, target.hp + move.power)
      lines.push(
        tf('{name} uses {move} on {target}, healing {amount} HP!', {
          name: t(action.name),
          move: t(move.name),
          target: t(target.name),
          amount: target.hp - before,
        })
      )
      return lines
    }

    // attack
    const targets = action.isParty ? this._livingEnemies() : this._livingPartyUnits()
    if (targets.length === 0) return lines

    let target
    if (action.targetUnit && action.targetUnit.hp > 0) {
      // Player picked this target explicitly in the target-select phase.
      target = action.targetUnit
    } else if (!action.isParty) {
      // Enemy AI: weight toward the lowest-HP living party member.
      target = this._pickWeightedPartyTarget(targets)
    } else {
      // Single-enemy fights (or no explicit target): old random behavior.
      target = targets[Math.floor(Math.random() * targets.length)]
    }

    if (Math.random() > move.accuracy) {
      lines.push(tf('{name} uses {move} but misses!', { name: t(action.name), move: t(move.name) }))
      return lines
    }

    let dmg = Math.max(1, Math.round(move.power + action.unit.atk - target.def * 0.5))
    if (target.guarding) dmg = Math.max(1, Math.round(dmg / 2))
    target.hp = Math.max(0, target.hp - dmg)
    lines.push(
      tf('{name} uses {move}! {target} takes {dmg} damage.', {
        name: t(action.name),
        move: t(move.name),
        target: t(target.name),
        dmg,
      })
    )

    if (move.lifesteal) {
      const healAmt = Math.max(1, Math.round(dmg / 2))
      const before = action.unit.hp
      action.unit.hp = Math.min(action.unit.maxHp, action.unit.hp + healAmt)
      const healed = action.unit.hp - before
      if (healed > 0) lines.push(tf('{name} drains {amount} HP!', { name: t(action.name), amount: healed }))
    }

    if (target.hp <= 0) lines.push(tf('{target} is defeated!', { target: t(target.name) }))
    return lines
  }

  _battleOver() {
    return this._livingEnemies().length === 0 || this._livingPartyUnits().length === 0
  }

  _afterResolve() {
    if (this._livingEnemies().length === 0) {
      this._onVictory()
      return
    }
    if (this._livingPartyUnits().length === 0) {
      this._onDefeat()
      return
    }
    this._beginSelection()
  }

  _onVictory() {
    this.phase = 'end'
    const xpTotal = this.enemies.reduce((sum, e) => sum + e.xpReward, 0)
    const lines = [tf('Victory! Gained {xp} XP.', { xp: xpTotal })]
    for (const member of Object.values(this.party)) {
      if (member.hp <= 0) {
        // The rest of the party carried them through — revive a fallen
        // ally at half HP rather than leaving them knocked out after a
        // battle the team actually won.
        member.hp = Math.ceil(member.maxHp / 2)
        lines.push(tf('{name} is revived with {amount} HP!', { name: t(member.name), amount: member.hp }))
        continue
      }
      const leveledUp = grantXp(member, xpTotal)
      if (leveledUp) lines.push(tf('{name} leveled up to Lv.{level}!', { name: t(member.name), level: member.level }))
    }
    this.dialogue.start(lines, () => {
      if (this.onEnd) this.onEnd({ victory: true })
    })
  }

  _onDefeat() {
    this.phase = 'end'
    this.dialogue.start(['Your party has fallen...'], () => {
      if (this.onEnd) this.onEnd({ victory: false })
    })
  }

  update(dt) {
    const dialogueWasActive = this.dialogue.active
    this.dialogue.update(dt, input)
    // Same fix as overworldScene.js: don't let the press that just closed a
    // message box also be read as this frame's menu/target input.
    if (dialogueWasActive) return

    if (this.phase === 'menu') {
      const options = this._currentOptions()
      if (input.wasPressed('down')) this.menuIndex = (this.menuIndex + 1) % options.length
      if (input.wasPressed('up')) this.menuIndex = (this.menuIndex - 1 + options.length) % options.length
      if (input.wasPressed('a')) this._confirmSelection()
      return
    }

    if (this.phase === 'target') {
      const targets = this._livingEnemies()
      if (targets.length === 0) {
        // Shouldn't happen mid-selection, but bail out safely rather than
        // leaving the player stuck with no living targets to cycle through.
        this._cancelTarget()
        return
      }
      if (input.wasPressed('down') || input.wasPressed('right')) {
        this.targetIndex = (this.targetIndex + 1) % targets.length
      }
      if (input.wasPressed('up') || input.wasPressed('left')) {
        this.targetIndex = (this.targetIndex - 1 + targets.length) % targets.length
      }
      if (input.wasPressed('a')) this._confirmTarget()
      if (input.wasPressed('b')) this._cancelTarget()
      return
    }
  }

  draw(ctx) {
    ctx.fillStyle = '#1b1f2a'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    const targetedEnemy = this.phase === 'target' ? this._livingEnemies()[this.targetIndex] : null

    this.enemies.forEach((enemy, i) => {
      if (enemy.hp <= 0) return
      const sprite = getSprite(enemy.spriteId)
      const x = 60 + i * 36
      const y = 18
      if (sprite) drawSprite(ctx, sprite, 0, x, y, { scale: 1 })
      this._drawBar(ctx, x - 4, y - 8, t(enemy.name), enemy.hp, enemy.maxHp, null, null, 30)
      if (enemy === targetedEnemy) {
        ctx.font = '7px Consolas, Menlo, monospace'
        ctx.fillStyle = '#f4d35b'
        ctx.fillText('▶', x - 11, y - 2)
      }
    })

    Object.entries(this.party).forEach(([key, member], i) => {
      const sprite = PARTY_SPRITES[key]
      const x = 14 + i * 44
      const y = CANVAS_HEIGHT - 70
      if (sprite && member.hp > 0) drawSprite(ctx, sprite, 0, x, y, { scale: 1 })
      this._drawBar(
        ctx,
        x - 4,
        y + 36,
        tf('{name} Lv{level}', { name: t(member.name), level: member.level }),
        member.hp,
        member.maxHp,
        member.focus,
        member.maxFocus,
        34
      )
    })

    if (this.phase === 'menu' && !this.dialogue.active) {
      this._drawMenu(ctx)
    } else if (this.phase === 'target' && !this.dialogue.active) {
      this._drawTargetPrompt(ctx)
    }

    this.dialogue.draw(ctx)
  }

  _drawBar(ctx, x, y, label, hp, maxHp, focus, maxFocus, barW = 34) {
    ctx.font = '6px Consolas, Menlo, monospace'
    ctx.fillStyle = '#e8e8e8'
    ctx.fillText(label, x, y)
    ctx.fillStyle = '#2a2d36'
    ctx.fillRect(x, y + 7, barW, 4)
    ctx.fillStyle = hp / maxHp > 0.3 ? '#5bd17a' : '#e0564b'
    ctx.fillRect(x, y + 7, barW * Math.max(0, hp / maxHp), 4)
    if (maxFocus) {
      ctx.fillStyle = '#2a2d36'
      ctx.fillRect(x, y + 13, barW, 3)
      ctx.fillStyle = '#8893f4'
      ctx.fillRect(x, y + 13, barW * Math.max(0, focus / maxFocus), 3)
    }
  }

  _drawTargetPrompt(ctx) {
    const boxW = 70
    const boxH = 20
    const x = CANVAS_WIDTH - boxW - 6
    const y = CANVAS_HEIGHT - boxH - 54
    ctx.fillStyle = '#0b0d12'
    ctx.fillRect(x, y, boxW, boxH)
    ctx.strokeStyle = '#e8e8e8'
    ctx.lineWidth = 1
    ctx.strokeRect(x, y, boxW, boxH)
    ctx.font = '7px Consolas, Menlo, monospace'
    ctx.fillStyle = '#dfe3ea'
    ctx.fillText(t('Choose target'), x + 4, y + 7)
    ctx.fillStyle = '#9ba1b4'
    ctx.fillText(t('A: ok  B: back'), x + 4, y + 16)
  }

  _drawMenu(ctx) {
    const options = this._currentOptions()
    const boxW = 70
    const boxH = 10 + options.length * 10
    const x = CANVAS_WIDTH - boxW - 6
    const y = CANVAS_HEIGHT - boxH - 54
    ctx.fillStyle = '#0b0d12'
    ctx.fillRect(x, y, boxW, boxH)
    ctx.strokeStyle = '#e8e8e8'
    ctx.lineWidth = 1
    ctx.strokeRect(x, y, boxW, boxH)
    ctx.font = '7px Consolas, Menlo, monospace'
    options.forEach((opt, i) => {
      const label =
        opt === 'item'
          ? tf('Medkit x{count}', { count: this.state.inventory.medkit || 0 })
          : t(getMove(opt).name)
      ctx.fillStyle = i === this.menuIndex ? '#dfe3ea' : '#9ba1b4'
      ctx.fillText(`${i === this.menuIndex ? '>' : ' '}${label}`, x + 4, y + 6 + i * 10)
    })
  }
}
