import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../engine/constants.js'
import { input } from '../engine/input.js'
import { saveGame } from '../engine/save.js'
import { playBlip, playConfirm, playCancel } from '../engine/audio.js'
import { t, tf } from '../engine/i18n.js'
import { MEDKIT_PRICE, ATK_ELIXIR_PRICE, RESIST_ELIXIR_PRICE } from '../battle/items.js'

// Name shown in the "Bought a {item}!" message - keyed by inventory id,
// same ids ShopScene/battleScene/heroScreen already use.
const ITEM_NAME = { medkit: 'Medkit', tonic: 'Attack Elixir', resistTonic: 'Resistance Elixir' }

/**
 * Merchant shop, reached by talking to a world's one merchant NPC (see
 * overworldScene.js's `npc.isMerchant` branch). Spends from the party's
 * single shared `state.credits` wallet to buy medkits/elixirs into the
 * shared `state.inventory` - there's nothing per-hero to pick here, unlike
 * the Hero screen's per-member actions.
 */
export class ShopScene {
  enter({ state, onClose }) {
    this.state = state
    this.onClose = onClose
    this.index = 0
    this.message = null
  }

  exit() {}

  get options() {
    return [
      { id: 'medkit', label: tf('Medkit — {price}cr', { price: MEDKIT_PRICE }), price: MEDKIT_PRICE, item: 'medkit' },
      {
        id: 'tonic',
        label: tf('Attack Elixir — {price}cr', { price: ATK_ELIXIR_PRICE }),
        price: ATK_ELIXIR_PRICE,
        item: 'tonic',
      },
      {
        id: 'resistTonic',
        label: tf('Resistance Elixir — {price}cr', { price: RESIST_ELIXIR_PRICE }),
        price: RESIST_ELIXIR_PRICE,
        item: 'resistTonic',
      },
      { id: 'close', label: t('Leave') },
    ]
  }

  _buy(option) {
    if ((this.state.credits || 0) < option.price) {
      this.message = t('Not enough credits.')
      playCancel()
      return
    }
    this.state.credits -= option.price
    this.state.inventory[option.item] = (this.state.inventory[option.item] || 0) + 1
    this.message = tf('Bought a {item}!', { item: t(ITEM_NAME[option.item]) })
    playConfirm()
    saveGame(this.state)
  }

  update() {
    const options = this.options
    if (input.wasPressed('down')) {
      this.index = (this.index + 1) % options.length
      playBlip()
    }
    if (input.wasPressed('up')) {
      this.index = (this.index - 1 + options.length) % options.length
      playBlip()
    }
    if (input.wasPressed('b')) {
      playCancel()
      if (this.onClose) this.onClose()
      return
    }
    if (input.wasPressed('a')) {
      const choice = options[this.index]
      if (choice.id === 'close') {
        playCancel()
        if (this.onClose) this.onClose()
        return
      }
      this._buy(choice)
    }
  }

  draw(ctx) {
    ctx.fillStyle = '#0b0d12'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    ctx.font = '8px Consolas, Menlo, monospace'
    ctx.fillStyle = '#e8e8e8'
    ctx.fillText(t('Shop'), 6, 14)
    ctx.font = '6px Consolas, Menlo, monospace'
    ctx.fillStyle = '#f4d35b'
    ctx.fillText(tf('Credits: {amount}', { amount: this.state.credits || 0 }), 6, 23)

    const options = this.options
    const boxX = 6
    const boxY = 30
    const boxW = CANVAS_WIDTH - 12
    const rowH = 12
    const boxH = options.length * rowH + 8
    ctx.fillStyle = '#0b0d12'
    ctx.fillRect(boxX, boxY, boxW, boxH)
    ctx.strokeStyle = '#e8e8e8'
    ctx.lineWidth = 1
    ctx.strokeRect(boxX, boxY, boxW, boxH)

    ctx.font = '7px Consolas, Menlo, monospace'
    options.forEach((opt, i) => {
      const selected = i === this.index
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
    ctx.fillText(t('A: Buy   B: Leave'), boxX + 4, CANVAS_HEIGHT - 6)
  }
}
