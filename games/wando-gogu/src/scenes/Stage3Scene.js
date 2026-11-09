import { BaseStageScene } from './BaseStageScene.js'
import { createStage3Textures } from '../sprites/stage3.js'
import { ScavengerDrone, SalvageBot } from '../entities/enemies/Stage3Enemies.js'
import { Boss3 } from '../entities/bosses/Boss3.js'
import { WIDTH } from '../config.js'

// Scrapfleet Graveyard — final stage. See
// .scratch/wando-gogu-xwing-shooter/issues/02-stages.md and 06-enemies.md.
export class Stage3Scene extends BaseStageScene {
  constructor() {
    super('Stage3', 3)
  }

  getBackgroundColor() {
    return 0x2a2a38
  }

  getStageName() {
    return 'Stage 3: Scrapfleet Graveyard'
  }

  createStageTextures(scene) {
    createStage3Textures(scene)
  }

  getWaveSchedule() {
    const spawnSwarm = (centerX, count) => (scene) => {
      for (let i = 0; i < count; i++) {
        const spread = (i - (count - 1) / 2) * 48
        const x = Math.min(WIDTH - 40, Math.max(40, centerX + spread))
        const drone = new ScavengerDrone(scene, x, -20 - i * 16)
        scene.enemies.add(drone)
      }
    }
    const spawnBot = (x) => (scene) => {
      const bot = new SalvageBot(
        scene,
        x,
        -30,
        (bx, by, vx, vy) => scene.fireEnemyBullet(bx, by, vx, vy),
        scene.player
      )
      scene.enemies.add(bot)
    }

    // Densest, fastest stage of the three: dense Scavenger Drone swarms
    // interleaved with occasional tanky Salvage Bots, escalating right up
    // to the boss hand-off.
    return [
      { delay: 400, spawn: spawnSwarm(120, 4) },
      { delay: 1600, spawn: spawnSwarm(360, 4) },
      { delay: 3200, spawn: spawnBot(90) },
      { delay: 3600, spawn: spawnSwarm(240, 5) },
      { delay: 5200, spawn: spawnBot(WIDTH - 90) },
      { delay: 5600, spawn: spawnSwarm(150, 5) },
      { delay: 7000, spawn: spawnSwarm(330, 5) },
      { delay: 8200, spawn: spawnBot(240) },
      { delay: 8600, spawn: spawnSwarm(90, 6) },
      { delay: 9000, spawn: spawnSwarm(390, 6) },
      { delay: 10400, spawn: spawnBot(130) },
      { delay: 10600, spawn: spawnBot(350) },
      { delay: 11200, spawn: spawnSwarm(240, 6) },
      { delay: 12600, spawn: spawnSwarm(140, 6) },
      { delay: 12800, spawn: spawnSwarm(340, 6) },
    ]
  }

  createBoss(scene, onFire) {
    return new Boss3(scene, onFire)
  }
}
