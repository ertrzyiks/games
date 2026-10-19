import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../engine/constants.js'
import { Dialogue } from '../engine/dialogue.js'
import { drawSprite } from '../engine/sprite.js'
import { input } from '../engine/input.js'
import { getMove } from './moves.js'
import { getEnemy } from './enemies.js'
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

    const names = this.enemies.map((e) => e.name).join(' and ')
    this.dialogue.start([`${names} appeared!`], () => this._beginSelection())
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
    return [...unit.moves, 'item']
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
    } else {
      const move = getMove(choice)
      if (move.focusCost > unit.focus) return
      unit.focus -= move.focusCost
      this.queuedActions.push({ unit, isParty: true, moveId: choice, speed: unit.spd, name: unit.name })
    }

    this.actIdx += 1
    this._promptForActor()
  }

  _enemyChoose() {
    for (const enemy of this._livingEnemies()) {
      const moveId = enemy.moves[Math.floor(Math.random() * enemy.moves.length)]
      this.queuedActions.push({ unit: enemy, isParty: false, moveId, speed: enemy.spd, name: enemy.name })
    }
    this._buildMessages()
  }

  _buildMessages() {
    for (const unit of [...Object.values(this.party), ...this.enemies]) unit.guarding = false

    const lines = []
    const rest = []
    for (const action of this.queuedActions) {
      if (action.unit.hp <= 0) continue
      if (action.special === 'item') {
        const before = action.unit.hp
        action.unit.hp = Math.min(action.unit.maxHp, action.unit.hp + ITEM_HEAL_AMOUNT)
        lines.push(`${action.name} uses a medkit and recovers ${action.unit.hp - before} HP!`)
        continue
      }
      const move = getMove(action.moveId)
      if (move.kind === 'buff') {
        action.unit.guarding = true
        lines.push(`${action.name} guards.`)
      } else {
        rest.push(action)
      }
    }

    rest.sort((a, b) => b.speed - a.speed)
    for (const action of rest) {
      lines.push(...this._resolveAction(action))
      if (this._battleOver()) break
    }

    this.phase = 'resolving'
    this.dialogue.start(lines.length ? lines : ['...'], () => this._afterResolve())
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
      lines.push(`${action.name} uses ${move.name} on ${target.name}, healing ${target.hp - before} HP!`)
      return lines
    }

    // attack
    const targets = action.isParty ? this._livingEnemies() : this._livingPartyUnits()
    if (targets.length === 0) return lines
    const target = targets[Math.floor(Math.random() * targets.length)]

    if (Math.random() > move.accuracy) {
      lines.push(`${action.name} uses ${move.name} but misses!`)
      return lines
    }

    let dmg = Math.max(1, Math.round(move.power + action.unit.atk - target.def * 0.5))
    if (target.guarding) dmg = Math.max(1, Math.round(dmg / 2))
    target.hp = Math.max(0, target.hp - dmg)
    lines.push(`${action.name} uses ${move.name}! ${target.name} takes ${dmg} damage.`)
    if (target.hp <= 0) lines.push(`${target.name} is defeated!`)
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
    const lines = [`Victory! Gained ${xpTotal} XP.`]
    for (const member of Object.values(this.party)) {
      if (member.hp <= 0) continue
      const leveledUp = grantXp(member, xpTotal)
      if (leveledUp) lines.push(`${member.name} leveled up to Lv.${member.level}!`)
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
    this.dialogue.update(dt, input)

    if (this.dialogue.active) return
    if (this.phase !== 'menu') return

    const options = this._currentOptions()
    if (input.wasPressed('down')) this.menuIndex = (this.menuIndex + 1) % options.length
    if (input.wasPressed('up')) this.menuIndex = (this.menuIndex - 1 + options.length) % options.length
    if (input.wasPressed('a')) this._confirmSelection()
  }

  draw(ctx) {
    ctx.fillStyle = '#1b1f2a'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    this.enemies.forEach((enemy, i) => {
      if (enemy.hp <= 0) return
      const sprite = getSprite(enemy.spriteId)
      const x = 60 + i * 36
      const y = 18
      if (sprite) drawSprite(ctx, sprite, 0, x, y, { scale: 1 })
      this._drawBar(ctx, x - 4, y - 8, enemy.name, enemy.hp, enemy.maxHp, null, null, 30)
    })

    Object.entries(this.party).forEach(([key, member], i) => {
      const sprite = PARTY_SPRITES[key]
      const x = 14 + i * 44
      const y = CANVAS_HEIGHT - 70
      if (sprite && member.hp > 0) drawSprite(ctx, sprite, 0, x, y, { scale: 1 })
      this._drawBar(ctx, x - 4, y + 36, `${member.name} Lv${member.level}`, member.hp, member.maxHp, member.focus, member.maxFocus, 34)
    })

    if (this.phase === 'menu' && !this.dialogue.active) {
      this._drawMenu(ctx)
    }

    this.dialogue.draw(ctx)
  }

  _drawBar(ctx, x, y, label, hp, maxHp, focus, maxFocus, barW = 34) {
    ctx.font = '6px monospace'
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
    ctx.font = '7px monospace'
    options.forEach((opt, i) => {
      const label = opt === 'item' ? `Medkit x${this.state.inventory.medkit || 0}` : getMove(opt).name
      ctx.fillStyle = i === this.menuIndex ? '#dfe3ea' : '#9ba1b4'
      ctx.fillText(`${i === this.menuIndex ? '>' : ' '}${label}`, x + 4, y + 6 + i * 10)
    })
  }
}
