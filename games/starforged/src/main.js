import { setupCanvas } from './engine/canvas.js'
import { input } from './engine/input.js'
import { sceneManager } from './engine/sceneManager.js'
import { TitleScene } from './scenes/titleScene.js'

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

const canvasEl = document.getElementById('game-canvas')
if (!canvasEl) throw new Error('Missing #game-canvas element')

const ctx = setupCanvas(canvasEl)
input.init()
sceneManager.push(new TitleScene())

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
