const KEY_MAP = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  KeyW: 'up',
  KeyS: 'down',
  KeyA: 'left',
  KeyD: 'right',
  KeyZ: 'a',
  Enter: 'a',
  KeyX: 'b',
  Escape: 'b',
}

class Input {
  constructor() {
    this.down = new Set()
    this.pressedThisFrame = new Set()
    // Accumulated between frames by event handlers, so a press is never
    // missed even if the key goes down and up again within one frame.
    this._pendingPresses = new Set()
  }

  init() {
    window.addEventListener('keydown', (e) => {
      const action = KEY_MAP[e.code]
      if (!action) return
      e.preventDefault()
      this._press(action)
    })
    window.addEventListener('keyup', (e) => {
      const action = KEY_MAP[e.code]
      if (!action) return
      this.down.delete(action)
    })

    document.querySelectorAll('#touch-controls [data-dir]').forEach((btn) => {
      this._bindTouchButton(btn, btn.dataset.dir)
    })
    document.querySelectorAll('#touch-controls [data-action]').forEach((btn) => {
      this._bindTouchButton(btn, btn.dataset.action)
    })
  }

  _press(action) {
    if (!this.down.has(action)) this._pendingPresses.add(action)
    this.down.add(action)
  }

  _bindTouchButton(btn, action) {
    const press = (e) => {
      e.preventDefault()
      this._press(action)
    }
    const release = (e) => {
      e.preventDefault()
      this.down.delete(action)
    }
    btn.addEventListener('pointerdown', press)
    btn.addEventListener('pointerup', release)
    btn.addEventListener('pointerleave', release)
    btn.addEventListener('pointercancel', release)
  }

  // call once per frame, before scene update, to latch this frame's "just pressed" edges
  update() {
    this.pressedThisFrame = this._pendingPresses
    this._pendingPresses = new Set()
  }

  isDown(action) {
    return this.down.has(action)
  }

  wasPressed(action) {
    return this.pressedThisFrame.has(action)
  }
}

export const input = new Input()
