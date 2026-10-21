import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../engine/constants.js'
import { input } from '../engine/input.js'
import { playLaser, playExplosion, playImpact, playBlip } from '../engine/audio.js'
import { t, tf } from '../engine/i18n.js'

const FADE_MS = 400

const SHIP_SPEED = 0.07 // px/ms
const SHIP_HALF = 6
const LASER_SPEED = 0.16 // px/ms
const ENEMY_BULLET_SPEED = 0.05 // px/ms
const HIT_INVULN_MS = 700
const HIT_FLASH_MS = 250
const WEAPON_LOCK_MS = 500

const ASTEROID_TOTAL = 12

// Movement patterns, not just stats, are what make the 5 extra types read
// as different hazards rather than recolored fighters: patrol/bounce2d
// pace back and forth, vbounce bobs vertically, track chases the ship's x,
// still never moves at all.
const ENEMY_TYPES = {
  fighter: { hp: 3, r: 6, color: '#e0564b', move: 'patrol', speed: 0.014, fireMin: 1600, fireMax: 3000 },
  drone: { hp: 2, r: 5, color: '#8fd9c4', move: 'vbounce', speed: 0.02, fireMin: 2600, fireMax: 4200 },
  bomber: { hp: 5, r: 8, color: '#c97fe0', move: 'patrol', speed: 0.008, fireMin: 2200, fireMax: 3400, spread: true },
  turret: { hp: 4, r: 6, color: '#e0c25b', move: 'still', speed: 0, fireMin: 1000, fireMax: 1800 },
  interceptor: { hp: 2, r: 5, color: '#5ba8e0', move: 'bounce2d', speed: 0.03, fireMin: 1800, fireMax: 2800 },
  seeker: { hp: 3, r: 6, color: '#e08a5b', move: 'track', speed: 0.02, fireMin: 1800, fireMax: 2600 },
}

/**
 * Short flavor minigame played while traveling between worlds: dodge
 * asteroids, shoot down enemy ships. Purely cosmetic - however the player
 * does, the world transition always completes and calls `onDone` once
 * every hazard is cleared, same stack convention as BattleScene (this
 * scene decides when it's done; the caller does the actual
 * sceneManager.pop()). B instantly clears whatever's left so the player
 * can skip ahead without the transition ever aborting back to the ship
 * menu.
 */
export class TravelMinigameScene {
  enter({ onDone }) {
    this.onDone = onDone
    this.elapsed = 0
    this.victory = false
    this.fadeOutElapsed = 0
    this._finished = false
    this._done = false

    this.ship = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 22, invuln: 0, flash: 0, weaponLocked: 0, hits: 0 }
    this.lasers = []
    this.enemyBullets = []

    this.asteroids = []
    this.asteroidsSpawned = 0
    this.asteroidTimer = 250

    this.enemies = [
      this._makeEnemy('fighter', CANVAS_WIDTH * 0.35, 22),
      this._makeEnemy('fighter', CANVAS_WIDTH * 0.68, 30),
    ]
    this.enemies[1].vx = -this.enemies[1].vx

    // The 5 new types trickle in one at a time (shuffled order, randomized
    // gap between each) instead of landing together in one batch.
    this.enemySpawnQueue = this._shuffle([
      { type: 'drone', y: 18 },
      { type: 'bomber', y: 26 },
      { type: 'turret', y: 16 },
      { type: 'interceptor', y: 24 },
      { type: 'seeker', y: 20 },
    ])
    this.enemySpawnTimer = 4000 + Math.random() * 2000

    this.stars = Array.from({ length: 24 }, () => ({
      x: Math.random() * CANVAS_WIDTH,
      y: Math.random() * CANVAS_HEIGHT,
      speed: 0.01 + Math.random() * 0.03,
    }))
  }

  exit() {}

  _shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  _makeEnemy(type, x, y) {
    const def = ENEMY_TYPES[type]
    return {
      type,
      x,
      y,
      vx: def.move === 'still' ? 0 : def.speed,
      vy: def.move === 'vbounce' || def.move === 'bounce2d' ? def.speed : 0,
      r: def.r,
      color: def.color,
      move: def.move,
      spread: def.spread,
      hp: def.hp,
      maxHp: def.hp,
      fireTimer: def.fireMin + Math.random() * (def.fireMax - def.fireMin),
      alive: true,
    }
  }

  update(dt) {
    if (this._done) return

    this.elapsed += dt

    if (input.wasPressed('b') && !this.victory) this._clearRemainingHazards()

    this._updateStars(dt)
    this._updateShip(dt)
    this._updateLasers(dt)
    this._updateAsteroids(dt)
    this._updateEnemySpawns(dt)
    this._updateEnemies(dt)
    this._updateEnemyBullets(dt)

    if (!this.victory && this._allClear()) {
      this.victory = true
      this.fadeOutElapsed = 0
    }

    if (this.victory) {
      this.fadeOutElapsed += dt
      if (this.fadeOutElapsed >= FADE_MS) {
        if (!this._finished) {
          // Let one fully-black frame actually render before popping, so
          // the fade-out doesn't get cut short by an instant callback.
          this._finished = true
        } else {
          this._done = true
          if (this.onDone) this.onDone()
        }
      }
    }
  }

  _allClear() {
    return (
      this.asteroidsSpawned >= ASTEROID_TOTAL &&
      this.asteroids.length === 0 &&
      this.enemySpawnQueue.length === 0 &&
      this.enemies.every((e) => !e.alive)
    )
  }

  _clearRemainingHazards() {
    this.asteroids = []
    this.asteroidsSpawned = ASTEROID_TOTAL
    this.enemySpawnQueue = []
    for (const enemy of this.enemies) enemy.alive = false
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
    if (ship.weaponLocked > 0) ship.weaponLocked = Math.max(0, ship.weaponLocked - dt)

    if (input.wasPressed('a') && ship.weaponLocked <= 0) {
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
        if (this._dist(laser.x, laser.y, enemy.x, enemy.y) <= enemy.r + 2) {
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
    if (this.asteroidsSpawned < ASTEROID_TOTAL) {
      this.asteroidTimer -= dt
      if (this.asteroidTimer <= 0) {
        this._spawnAsteroid()
        this.asteroidsSpawned += 1
        this.asteroidTimer = 450 + Math.random() * 350
      }
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

  _updateEnemySpawns(dt) {
    if (this.enemySpawnQueue.length === 0) return
    this.enemySpawnTimer -= dt
    if (this.enemySpawnTimer <= 0) {
      const next = this.enemySpawnQueue.shift()
      const x = CANVAS_WIDTH * (0.25 + Math.random() * 0.5)
      this.enemies.push(this._makeEnemy(next.type, x, next.y))
      this.enemySpawnTimer = 4000 + Math.random() * 3000
    }
  }

  _updateEnemies(dt) {
    for (const enemy of this.enemies) {
      if (!enemy.alive) continue
      this._moveEnemy(enemy, dt)

      enemy.fireTimer -= dt
      if (enemy.fireTimer <= 0) {
        this._enemyFire(enemy)
        const def = ENEMY_TYPES[enemy.type]
        enemy.fireTimer = def.fireMin + Math.random() * (def.fireMax - def.fireMin)
      }
    }
  }

  _moveEnemy(enemy, dt) {
    switch (enemy.move) {
      case 'patrol':
        enemy.x += enemy.vx * dt
        if (enemy.x < 14 || enemy.x > CANVAS_WIDTH - 14) enemy.vx *= -1
        break
      case 'vbounce':
        enemy.y += enemy.vy * dt
        if (enemy.y < 14 || enemy.y > 56) enemy.vy *= -1
        break
      case 'bounce2d':
        enemy.x += enemy.vx * dt
        enemy.y += enemy.vy * dt
        if (enemy.x < 14 || enemy.x > CANVAS_WIDTH - 14) enemy.vx *= -1
        if (enemy.y < 14 || enemy.y > 56) enemy.vy *= -1
        break
      case 'track': {
        const def = ENEMY_TYPES.seeker
        enemy.vx = enemy.x < this.ship.x ? def.speed : -def.speed
        enemy.x = Math.min(CANVAS_WIDTH - 14, Math.max(14, enemy.x + enemy.vx * dt))
        break
      }
      case 'still':
      default:
        break
    }
  }

  _enemyFire(enemy) {
    if (enemy.spread) {
      this.enemyBullets.push({ x: enemy.x, y: enemy.y + 6, vx: -0.025, vy: ENEMY_BULLET_SPEED })
      this.enemyBullets.push({ x: enemy.x, y: enemy.y + 6, vx: 0.025, vy: ENEMY_BULLET_SPEED })
    } else {
      this.enemyBullets.push({ x: enemy.x, y: enemy.y + 6, vx: 0, vy: ENEMY_BULLET_SPEED })
    }
  }

  _updateEnemyBullets(dt) {
    this.enemyBullets = this.enemyBullets.filter((b) => {
      b.x += b.vx * dt
      b.y += b.vy * dt
      if (b.y > CANVAS_HEIGHT + 10 || b.x < -10 || b.x > CANVAS_WIDTH + 10) return false
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
    this.ship.weaponLocked = WEAPON_LOCK_MS
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
    const r = enemy.r
    ctx.fillStyle = enemy.color

    if (enemy.move === 'vbounce') {
      ctx.beginPath()
      ctx.moveTo(enemy.x, enemy.y - r)
      ctx.lineTo(enemy.x + r, enemy.y)
      ctx.lineTo(enemy.x, enemy.y + r)
      ctx.lineTo(enemy.x - r, enemy.y)
      ctx.closePath()
      ctx.fill()
    } else if (enemy.move === 'still') {
      ctx.fillRect(enemy.x - r, enemy.y - r, r * 2, r * 2)
    } else {
      ctx.beginPath()
      ctx.moveTo(enemy.x, enemy.y + r)
      ctx.lineTo(enemy.x - r, enemy.y - r)
      ctx.lineTo(enemy.x + r, enemy.y - r)
      ctx.closePath()
      ctx.fill()
    }

    const pipW = 3
    const totalW = enemy.maxHp * (pipW + 1) - 1
    for (let i = 0; i < enemy.maxHp; i++) {
      ctx.fillStyle = i < enemy.hp ? '#5bd17a' : '#2a2d36'
      ctx.fillRect(enemy.x - totalW / 2 + i * (pipW + 1), enemy.y - r - 5, pipW, 2)
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

    const remaining =
      ASTEROID_TOTAL - this.asteroidsSpawned +
      this.asteroids.length +
      this.enemySpawnQueue.length +
      this.enemies.filter((e) => e.alive).length
    ctx.font = '6px Consolas, Menlo, monospace'
    ctx.fillStyle = '#52586a'
    ctx.fillText(tf('Remaining: {n}', { n: remaining }), CANVAS_WIDTH - 50, 10)
  }

  _drawFade(ctx) {
    let alpha = 0
    if (this.elapsed < FADE_MS) {
      alpha = 1 - this.elapsed / FADE_MS
    } else if (this.victory) {
      alpha = Math.min(1, this.fadeOutElapsed / FADE_MS)
    }
    if (alpha <= 0) return
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  }
}
