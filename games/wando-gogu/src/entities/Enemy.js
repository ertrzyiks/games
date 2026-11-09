import Phaser from 'phaser'

// Shared base for every enemy type across all three stages. Subclasses set
// `this.hp` and override `update`/`fire` for their own movement/attack pattern
// (see .scratch/wando-gogu-xwing-shooter/issues/06-enemies.md).
export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, hp) {
    super(scene, x, y, texture)
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.hp = hp
    this.body.setAllowGravity(false)
  }

  damage(amount) {
    this.hp -= amount
    if (this.hp <= 0) {
      this.onKilled?.(this)
      this.destroy()
      return true
    }
    return false
  }
}
