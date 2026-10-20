import { setupCanvas } from './engine/canvas.js'
import { input } from './engine/input.js'
import { sceneManager } from './engine/sceneManager.js'
import { TitleScene } from './scenes/titleScene.js'
import { t, onLanguageChange } from './engine/i18n.js'

// Side-effect imports: each registers itself into an append-only registry
// (tiles/sprites/enemies/moves/worlds) so new content files only need to be
// added to this list, never edited elsewhere.
import './assets/sprites/npc.js'
import './assets/sprites/enemyScavenger.js'
import './worlds/rustmoor.js'
import './worlds/mossfenReach.js'
import './worlds/ashvaultStation.js'
import './worlds/skyreachCanopy.js'
import './worlds/theHollow.js'
import './i18n/pl/common.js'
import './i18n/pl/combatNames.js'
import './i18n/pl/rustmoor.js'
import './i18n/pl/mossfenReach.js'
import './i18n/pl/ashvaultStation.js'
import './i18n/pl/skyreachCanopy.js'
import './i18n/pl/theHollow.js'

const canvasEl = document.getElementById('game-canvas')
if (!canvasEl) throw new Error('Missing #game-canvas element')

const ctx = setupCanvas(canvasEl)
input.init()
sceneManager.push(new TitleScene())

const footerHint = document.getElementById('footer-hint')
const FOOTER_TEXT = 'Arrows/WASD to move · Z/Enter = A · X/Esc = B'
function refreshFooter() {
  if (footerHint) footerHint.textContent = t(FOOTER_TEXT)
}
refreshFooter()
onLanguageChange(refreshFooter)

let last = performance.now()
function loop(now) {
  const dt = Math.min(now - last, 100)
  last = now
  input.update()
  sceneManager.update(dt)
  sceneManager.draw(ctx)
  requestAnimationFrame(loop)
}
requestAnimationFrame(loop)
