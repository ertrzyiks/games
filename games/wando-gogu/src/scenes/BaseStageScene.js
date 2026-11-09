import Phaser from 'phaser'
import { WIDTH, HEIGHT } from '../config.js'
import { createCommonTextures } from '../sprites/common.js'
import { Player } from '../entities/Player.js'
import { GoguButton } from '../entities/GoguButton.js'
import {
  createPowerUpGroup,
  maybeDropPowerUp,
  despawnOffscreen,
  applyPowerUp,
} from '../entities/PowerUps.js'
import { setLastCompletedStage } from '../save.js'

const NUDGE_RADIUS = 90
const WAVE_RADIUS = 160
const POST_WAVE_BUFFER_MS = 3000

// Shared scene machinery every stage builds on: background, player, Gogu
// button, bullets, enemy waves, power-ups, boss hand-off, lives/game-over,
// and the stage-clear -> save -> next-stage flow. A concrete stage (see
// Stage1Scene.js) supplies: key, stageNumber, bgColor, a texture creator,
// a wave schedule, and a boss factory.
export class BaseStageScene extends Phaser.Scene {
  constructor(key, stageNumber) {
    super(key)
    this.stageNumber = stageNumber
  }

  // -- overridden by concrete stages --
  createStageTextures(_scene) {}
  getBackgroundColor() {
    return 0x202020
  }
  getWaveSchedule() {
    return []
  }
  createBoss(_scene, _onFire) {
    return null
  }
  getStageName() {
    return `Stage ${this.stageNumber}`
  }

  create() {
    this.cameras.main.setBackgroundColor(this.getBackgroundColor())
    createCommonTextures(this)
    this.createStageTextures(this)

    this.playerBullets = this.physics.add.group()
    this.enemyBullets = this.physics.add.group()
    this.enemies = this.physics.add.group()
    this.powerups = createPowerUpGroup(this)
    this.boss = null
    this.bossSpawned = false
    this.allWavesDispatched = false
    this.gameEnded = false

    this.player = new Player(
      this,
      (x, y) => this._fireFromPlayer(x, y),
      (x, y) => this._forceNudge(x, y),
      (x, y) => this._forceWave(x, y),
      (fatal) => this._onPlayerHit(fatal)
    )
    this.goguButton = new GoguButton(this, this.player)

    this._buildHud()
    this._wireCollisions()
    this._scheduleWaves()
  }

  _buildHud() {
    this.livesText = this.add
      .text(12, 10, '', { fontFamily: 'sans-serif', fontSize: '18px', color: '#fff' })
      .setScrollFactor(0)
    this.add
      .text(WIDTH - 12, 10, this.getStageName(), {
        fontFamily: 'sans-serif',
        fontSize: '14px',
        color: '#fff',
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
    this.bossHpBar = this.add.graphics().setScrollFactor(0)
  }

  _wireCollisions() {
    this.physics.add.overlap(this.playerBullets, this.enemies, (bullet, enemy) => {
      bullet.destroy()
      const killed = enemy.damage(1)
      if (killed) {
        this.player.onEnemyKilled()
        maybeDropPowerUp(this, this.powerups, enemy.x, enemy.y)
      }
    })

    this.physics.add.overlap(this.enemyBullets, this.player, (_player, bullet) => {
      bullet.destroy()
      this.player.takeHit()
    })

    this.physics.add.overlap(this.enemies, this.player, (_player, enemy) => {
      if (this.player.takeHit()) {
        enemy.damage(1)
      }
    })

    this.physics.add.overlap(this.player, this.powerups, (_player, pickup) => {
      applyPowerUp(this.player, pickup.powerUpType)
      pickup.destroy()
    })
  }

  _fireFromPlayer(x, y) {
    const b = this.playerBullets.create(x, y, 'bullet-player')
    b.body.setAllowGravity(false)
    b.body.setVelocityY(-420)
  }

  fireEnemyBullet(x, y, vx, vy) {
    const b = this.enemyBullets.create(x, y, 'bullet-enemy')
    b.body.setAllowGravity(false)
    b.body.setVelocity(vx, vy)
  }

  _forceNudge(x, y) {
    this._nudgeActiveAt = { x, y }
  }

  _forceWave(x, y) {
    this.enemies.children.each((enemy) => {
      if (Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y) <= WAVE_RADIUS) {
        enemy.damage(999)
      }
    })
    this.enemyBullets.children.each((bullet) => {
      if (Phaser.Math.Distance.Between(x, y, bullet.x, bullet.y) <= WAVE_RADIUS) {
        bullet.destroy()
      }
    })
    this.events.emit('forcewave', { x, y, radius: WAVE_RADIUS })
  }

  _onPlayerHit(fatal) {
    this._showPoof(this.player.x, this.player.y)
    if (fatal) {
      this.gameEnded = true
      const overlay = this.add
        .text(WIDTH / 2, HEIGHT / 2, 'GAME OVER', {
          fontFamily: 'sans-serif',
          fontSize: '40px',
          color: '#ff5a5a',
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
      this.time.delayedCall(1600, () => {
        overlay.destroy()
        this.scene.restart()
      })
    }
  }

  _showPoof(x, y) {
    const poof = this.add.image(x, y, 'poof').setAlpha(0.8)
    this.tweens.add({
      targets: poof,
      scale: 2.2,
      alpha: 0,
      duration: 350,
      onComplete: () => poof.destroy(),
    })
  }

  _scheduleWaves() {
    const schedule = this.getWaveSchedule()
    let maxDelay = 0
    schedule.forEach((wave) => {
      maxDelay = Math.max(maxDelay, wave.delay)
      this.time.delayedCall(wave.delay, () => {
        if (!this.gameEnded) wave.spawn(this)
      })
    })
    this.time.delayedCall(maxDelay + POST_WAVE_BUFFER_MS, () => {
      this.allWavesDispatched = true
    })
  }

  _spawnBoss() {
    this.bossSpawned = true
    this.boss = this.createBoss(this, (x, y, vx, vy) => this.fireEnemyBullet(x, y, vx, vy))
    if (!this.boss) return
    this.bossMaxHp = this.boss.hp
    this.physics.add.overlap(this.playerBullets, this.boss, (bullet, boss) => {
      bullet.destroy()
      boss.damage(1)
    })
    this.physics.add.overlap(this.boss, this.player, () => {
      this.player.takeHit()
    })
  }

  _stageCleared() {
    this.gameEnded = true
    setLastCompletedStage(this.stageNumber)
    const overlay = this.add
      .text(WIDTH / 2, HEIGHT / 2, `${this.getStageName()} CLEAR!`, {
        fontFamily: 'sans-serif',
        fontSize: '32px',
        color: '#5ad1ff',
        align: 'center',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
    this.time.delayedCall(2000, () => {
      overlay.destroy()
      const nextKey = this.getNextSceneKey()
      this.scene.start(nextKey)
    })
  }

  getNextSceneKey() {
    if (this.stageNumber >= 3) return 'StageSelect'
    return `Stage${this.stageNumber + 1}`
  }

  update(time, delta) {
    if (this.gameEnded) return

    this.goguButton.update()
    despawnOffscreen(this.powerups)

    if (this._nudgeActiveAt && this.player.isNudgeActive()) {
      this.enemyBullets.children.each((bullet) => {
        if (
          Phaser.Math.Distance.Between(this.player.x, this.player.y, bullet.x, bullet.y) <=
          NUDGE_RADIUS
        ) {
          bullet.destroy()
        }
      })
    } else {
      this._nudgeActiveAt = null
    }

    this.playerBullets.children.each((b) => {
      if (b.y < -20) b.destroy()
    })
    this.enemyBullets.children.each((b) => {
      if (b.y > HEIGHT + 20) b.destroy()
    })
    this.enemies.children.each((e) => {
      if (e.y > HEIGHT + 40) e.destroy()
    })

    if (this.boss && this.boss.active) {
      this._drawBossHp()
    } else if (this.boss && !this.boss.active) {
      this.boss = null
      this.bossHpBar.clear()
      this._stageCleared()
    } else if (this.allWavesDispatched && !this.bossSpawned && this.enemies.countActive(true) === 0) {
      this._spawnBoss()
    }

    this.livesText.setText(`Lives: ${this.player.lives}`)
  }

  _drawBossHp() {
    this.bossHpBar.clear()
    const frac = Math.max(0, this.boss.hp / this.bossMaxHp)
    this.bossHpBar.fillStyle(0x333333, 1)
    this.bossHpBar.fillRect(WIDTH / 2 - 100, 36, 200, 10)
    this.bossHpBar.fillStyle(0xff5a5a, 1)
    this.bossHpBar.fillRect(WIDTH / 2 - 100, 36, 200 * frac, 10)
  }
}
