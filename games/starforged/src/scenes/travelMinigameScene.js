import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../engine/constants.js'
import { input } from '../engine/input.js'
import { playLaser, playExplosion, playImpact, playBlip } from '../engine/audio.js'
import { t, tf } from '../engine/i18n.js'

const DURATION_MS = 15000
const FADE_MS = 400
// Skipping ahead (B) jumps straight to the start of the fade-out window so
// the full 15s world-transition flavor still plays out, it just gets there
// faster - it never aborts back to the ship menu.
const SKIP_TARGET_MS = DURATION_MS - FADE_MS

const SHIP_SPEED = 0.07 // px/ms
const SHIP_HALF = 6
const LASER_SPEED = 0.16 // px/ms
const ENEMY_BULLET_SPEED = 0.05 // px/ms
const HIT_INVULN_MS = 700
const HIT_FLASH_MS = 250

/**
 * Short flavor minigame played while traveling between worlds: dodge
 * asteroids, shoot a couple of enemy ships, for exactly 15 seconds. Purely
 * cosmetic - however the player does, the world transition always
 * completes and calls `onDone` at the end, same stack convention as
 * BattleScene (this scene decides when it's done; the caller does the
 * actual sceneManager.pop()).
 */
export class TravelMinigameScene {
  enter({ onDone }) {
    this.onDone = onDone
    this.elapsed = 0
    this._finished = false
    this._done = false

    this.ship = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 22, invuln: 0, flash: 0, hits: 0 }
    this.lasers = []
    this.enemyBullets = []
    this.asteroids = []
    this.asteroidTimer = 250

    this.enemies = [
      { x: CANVAS_WIDTH * 0.35, y: 22, vx: 0.015, hp: 3, maxHp: 3, fireTimer: 1200, alive: true },
      { x: CANVAS_WIDTH * 0.68, y: 30, vx: -0.012, hp: 3, maxHp: 3, fireTimer: 2000, alive: true },
    ]

    this.stars = Array.from({ length: 24 }, () => ({
      x: Math.random() * CANVAS_WIDTH,
      y: Math.random() * CANVAS_HEIGHT,
      speed: 0.01 + Math.random() * 0.03,
    }))
  }

  exit() {}

  update(dt) {
    if (this._done) return

    this.elapsed += dt

    if (input.wasPressed('b') && this.elapsed < SKIP_TARGET_MS) {
      this.elapsed = SKIP_TARGET_MS
    }

    if (this.elapsed >= DURATION_MS) {
      this.elapsed = DURATION_MS
      if (!this._finished) {
        // Let one fully-black frame actually render before popping, so the
        // fade-out doesn't get cut short by an instant callback.
        this._finished = true
      } else {
        this._done = true
        if (this.onDone) this.onDone()
      }
      return
    }

    this._updateStars(dt)
    this._updateShip(dt)
    this._updateLasers(dt)
    this._updateAsteroids(dt)
    this._updateEnemies(dt)
    this._updateEnemyBullets(dt)
  }

  _updateStars(dt) {
    for (const star of this.stars) {
      star.y += star.speed * dt
      if (star.y > CANVAS_HEIGHT) {
        star.y = 0
        star.x = Math.random() * CANVAS_WIDTH
      }
    }
  }

  _updateShip(dt) {
    const ship = this.ship
    if (input.isDown('left')) ship.x -= SHIP_SPEED * dt
    if (input.isDown('right')) ship.x += SHIP_SPEED * dt
    if (input.isDown('up')) ship.y -= SHIP_SPEED * dt
    if (input.isDown('down')) ship.y += SHIP_SPEED * dt
    ship.x = Math.min(CANVAS_WIDTH - SHIP_HALF, Math.max(SHIP_HALF, ship.x))
    ship.y = Math.min(CANVAS_HEIGHT - SHIP_HALF, Math.max(SHIP_HALF, ship.y))

    if (ship.invuln > 0) ship.invuln = Math.max(0, ship.invuln - dt)
    if (ship.flash > 0) ship.flash = Math.max(0, ship.flash - dt)

    if (input.wasPressed('a')) {
      this.lasers.push({ x: ship.x, y: ship.y - SHIP_HALF })
      playLaser()
    }
  }

  _updateLasers(dt) {
    this.lasers = this.lasers.filter((laser) => {
      laser.y -= LASER_SPEED * dt
      if (laser.y < -10) return false

      for (const enemy of this.enemies) {
        if (!enemy.alive) continue
        if (this._dist(laser.x, laser.y, enemy.x, enemy.y) <= 8) {
          enemy.hp -= 1
          if (enemy.hp <= 0) {
            enemy.alive = false
            playExplosion()
          } else {
            playBlip()
          }
          return false
        }
      }

      for (const asteroid of this.asteroids) {
        if (asteroid.dead) continue
        if (this._dist(laser.x, laser.y, asteroid.x, asteroid.y) <= asteroid.r + 2) {
          asteroid.dead = true
          playExplosion()
          return false
        }
      }

      return true
    })
    this.asteroids = this.asteroids.filter((a) => !a.dead)
  }

  _updateAsteroids(dt) {
    this.asteroidTimer -= dt
    if (this.asteroidTimer <= 0) {
      this._spawnAsteroid()
      this.asteroidTimer = 450 + Math.random() * 350
    }

    this.asteroids = this.asteroids.filter((a) => {
      a.x += a.vx * dt
      a.y += a.vy * dt
      if (a.x < -24 || a.x > CANVAS_WIDTH + 24 || a.y < -24 || a.y > CANVAS_HEIGHT + 24) return false

      if (this.ship.invuln <= 0 && this._dist(a.x, a.y, this.ship.x, this.ship.y) <= a.r + SHIP_HALF - 2) {
        this._hitShip()
        return false
      }
      return true
    })
  }

  _spawnAsteroid() {
    const edge = ['top', 'left', 'right'][Math.floor(Math.random() * 3)]
    const r = 4 + Math.random() * 5
    const speed = 0.02 + Math.random() * 0.03
    let x, y, vx, vy
    if (edge === 'top') {
      x = Math.random() * CANVAS_WIDTH
      y = -r
      vx = (Math.random() - 0.5) * 0.03
      vy = speed
    } else if (edge === 'left') {
      x = -r
      y = Math.random() * CANVAS_HEIGHT * 0.8
      vx = speed
      vy = (Math.random() - 0.3) * 0.03
    } else {
      x = CANVAS_WIDTH + r
      y = Math.random() * CANVAS_HEIGHT * 0.8
      vx = -speed
      vy = (Math.random() - 0.3) * 0.03
    }
    this.asteroids.push({ x, y, vx, vy, r })
  }

  _updateEnemies(dt) {
    for (const enemy of this.enemies) {
      if (!enemy.alive) continue
      enemy.x += enemy.vx * dt
      if (enemy.x < 14 || enemy.x > CANVAS_WIDTH - 14) enemy.vx *= -1

      enemy.fireTimer -= dt
      if (enemy.fireTimer <= 0) {
        this.enemyBullets.push({ x: enemy.x, y: enemy.y + 6, vy: ENEMY_BULLET_SPEED })
        enemy.fireTimer = 1600 + Math.random() * 1400
      }
    }
  }

  _updateEnemyBullets(dt) {
    this.enemyBullets = this.enemyBullets.filter((b) => {
      b.y += b.vy * dt
      if (b.y > CANVAS_HEIGHT + 10) return false
      if (this.ship.invuln <= 0 && this._dist(b.x, b.y, this.ship.x, this.ship.y) <= SHIP_HALF) {
        this._hitShip()
        return false
      }
      return true
    })
  }

  _hitShip() {
    this.ship.hits += 1
    this.ship.invuln = HIT_INVULN_MS
    this.ship.flash = HIT_FLASH_MS
    playImpact()
  }

  _dist(x1, y1, x2, y2) {
    return Math.hypot(x1 - x2, y1 - y2)
  }

  draw(ctx) {
    ctx.fillStyle = '#05060c'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    ctx.fillStyle = '#3a3f5c'
    for (const star of this.stars) {
      ctx.fillRect(star.x, star.y, 1, 1)
    }

    for (const asteroid of this.asteroids) this._drawAsteroid(ctx, asteroid)
    for (const enemy of this.enemies) this._drawEnemy(ctx, enemy)

    ctx.fillStyle = '#f4d35b'
    for (const laser of this.lasers) ctx.fillRect(laser.x - 1, laser.y - 4, 2, 6)

    ctx.fillStyle = '#e05bd3'
    for (const bullet of this.enemyBullets) ctx.fillRect(bullet.x - 1, bullet.y - 3, 2, 5)

    this._drawShip(ctx)
    this._drawHud(ctx)
    this._drawFade(ctx)
  }

  _drawShip(ctx) {
    const ship = this.ship
    // Flicker while invulnerable right after a hit, so the hit reads
    // clearly without blocking the transition or gameplay.
    if (ship.invuln > 0 && Math.floor(ship.invuln / 80) % 2 === 0) return

    ctx.fillStyle = ship.flash > 0 ? '#ff6b5e' : '#7fe7ff'
    ctx.beginPath()
    ctx.moveTo(ship.x, ship.y - SHIP_HALF)
    ctx.lineTo(ship.x - SHIP_HALF, ship.y + SHIP_HALF)
    ctx.lineTo(ship.x + SHIP_HALF, ship.y + SHIP_HALF)
    ctx.closePath()
    ctx.fill()
  }

  _drawEnemy(ctx, enemy) {
    if (!enemy.alive) return
    ctx.fillStyle = '#e0564b'
    ctx.beginPath()
    ctx.moveTo(enemy.x, enemy.y + 6)
    ctx.lineTo(enemy.x - 6, enemy.y - 6)
    ctx.lineTo(enemy.x + 6, enemy.y - 6)
    ctx.closePath()
    ctx.fill()

    const pipW = 3
    const totalW = enemy.maxHp * (pipW + 1) - 1
    for (let i = 0; i < enemy.maxHp; i++) {
      ctx.fillStyle = i < enemy.hp ? '#5bd17a' : '#2a2d36'
      ctx.fillRect(enemy.x - totalW / 2 + i * (pipW + 1), enemy.y - 11, pipW, 2)
    }
  }

  _drawAsteroid(ctx, asteroid) {
    ctx.fillStyle = '#8a8370'
    ctx.beginPath()
    ctx.arc(asteroid.x, asteroid.y, asteroid.r, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#4f4b3f'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  _drawHud(ctx) {
    ctx.font = '7px Consolas, Menlo, monospace'
    ctx.fillStyle = '#9ba1b4'
    ctx.fillText(t('Asteroid run!'), 4, 10)

    const secondsLeft = Math.max(0, Math.ceil((DURATION_MS - this.elapsed) / 1000))
    ctx.font = '6px Consolas, Menlo, monospace'
    ctx.fillStyle = '#52586a'
    ctx.fillText(tf('{s}s left', { s: secondsLeft }), CANVAS_WIDTH - 36, 10)
  }

  _drawFade(ctx) {
    let alpha = 0
    if (this.elapsed < FADE_MS) {
      alpha = 1 - this.elapsed / FADE_MS
    } else if (this.elapsed > DURATION_MS - FADE_MS) {
      alpha = Math.min(1, (this.elapsed - (DURATION_MS - FADE_MS)) / FADE_MS)
    }
    if (alpha <= 0) return
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  }
}
