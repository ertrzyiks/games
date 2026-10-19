/**
 * Simple stack-based scene manager.
 * A scene is any object implementing: enter(params), exit(), update(dt), draw(ctx)
 * Only the top of the stack receives update/draw calls.
 */
class SceneManager {
  constructor() {
    this.stack = []
  }

  push(scene, params) {
    scene.enter(params)
    this.stack.push(scene)
  }

  pop(params) {
    const scene = this.stack.pop()
    if (scene) scene.exit()
    const top = this.current()
    if (top && top.resume) top.resume(params)
  }

  replace(scene, params) {
    while (this.stack.length) {
      const old = this.stack.pop()
      old.exit()
    }
    this.push(scene, params)
  }

  current() {
    return this.stack[this.stack.length - 1]
  }

  update(dt) {
    const scene = this.current()
    if (scene) scene.update(dt)
  }

  draw(ctx) {
    const scene = this.current()
    if (scene) scene.draw(ctx)
  }
}

export const sceneManager = new SceneManager()
