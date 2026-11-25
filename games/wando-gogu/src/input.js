import { STEER_MAX_RADIUS_PX } from './config.js'

function clamp(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v))
}

// Piloting controls (2026-11-25 — see
// .scratch/wando-gogu-arts/issues/06-controls-camera.md): a whole-screen
// drag steers like a flight stick (horizontal = yaw/turn, vertical =
// pitch/climb-dive), released = fly straight. Keyboard/WASD mirrors it for
// desktop dev/testing. Movement is otherwise always forward (see
// Hero.flyForward) — this module only ever reports a steer vector.
export function createSteeringController(renderer) {
  const dom = renderer.domElement
  let dragging = false
  let originX = 0
  let originY = 0
  let touchSteer = { x: 0, y: 0 }
  const heldKeys = new Set()

  dom.addEventListener('pointerdown', (e) => {
    dragging = true
    originX = e.clientX
    originY = e.clientY
    touchSteer = { x: 0, y: 0 }
  })
  dom.addEventListener('pointermove', (e) => {
    if (!dragging) return
    const dx = e.clientX - originX
    const dy = e.clientY - originY
    touchSteer = {
      x: clamp(dx / STEER_MAX_RADIUS_PX, -1, 1),
      y: clamp(-dy / STEER_MAX_RADIUS_PX, -1, 1),
    }
  })
  window.addEventListener('pointerup', () => {
    dragging = false
    touchSteer = { x: 0, y: 0 }
  })

  window.addEventListener('keydown', (e) => heldKeys.add(e.key.toLowerCase()))
  window.addEventListener('keyup', (e) => heldKeys.delete(e.key.toLowerCase()))

  function keyboardSteer() {
    let x = 0
    let y = 0
    if (heldKeys.has('arrowleft') || heldKeys.has('a')) x -= 1
    if (heldKeys.has('arrowright') || heldKeys.has('d')) x += 1
    if (heldKeys.has('arrowup') || heldKeys.has('w')) y += 1
    if (heldKeys.has('arrowdown') || heldKeys.has('s')) y -= 1
    return { x, y }
  }

  return {
    getSteer() {
      return dragging ? touchSteer : keyboardSteer()
    },
  }
}
