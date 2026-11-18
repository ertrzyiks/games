import Phaser from 'phaser'
import { HEIGHT } from '../config.js'

// See .scratch/wando-gogu-xwing-shooter/issues/05-powerups.md: three types,
// drop-based (~1/6 of enemy kills) plus a few floating freely between waves,
// run-scoped only, despawn if they scroll off the bottom uncollected.
const DROP_CHANCE = 1 / 6
const FALL_SPEED = 90
const TYPES = ['twin', 'shield', 'meter']
const TEXTURE_BY_TYPE = {
  twin: 'powerup-twin',
  shield: 'powerup-shield',
  meter: 'powerup-meter',
}

export function createPowerUpGroup(scene) {
  return scene.physics.add.group()
}

export function maybeDropPowerUp(scene, group, x, y) {
  if (Math.random() > DROP_CHANCE) return
  const type = Phaser.Utils.Array.GetRandom(TYPES)
  spawnPowerUp(scene, group, x, y, type)
}

export function spawnPowerUp(scene, group, x, y, type) {
  const sprite = group.create(x, y, TEXTURE_BY_TYPE[type])
  sprite.powerUpType = type
  sprite.body.setVelocityY(FALL_SPEED)
  sprite.body.setAllowGravity(false)
}

export function despawnOffscreen(group) {
  group.children.forEach((child) => {
    if (child.y > HEIGHT + 40) child.destroy()
  })
}

export function applyPowerUp(player, type) {
  if (type === 'twin') player.upgradeWeapon()
  else if (type === 'shield') player.grantShield()
  else if (type === 'meter') player.addWaveCharge(35)
}
