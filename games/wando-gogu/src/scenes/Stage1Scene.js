import { BaseStageScene } from './BaseStageScene.js'
import { createStage1Textures } from '../sprites/stage1.js'
import { ScoutPod, CliffTurret } from '../entities/enemies/Stage1Enemies.js'
import { Boss1 } from '../entities/bosses/Boss1.js'
import { WIDTH } from '../config.js'

// Dustrim Canyons. See .scratch/wando-gogu-xwing-shooter/issues/02-stages.md and 06-enemies.md.
export class Stage1Scene extends BaseStageScene {
  constructor() {
    super('Stage1', 1)
  }

  getBackgroundColor() {
    return 0xdba866
  }

  getStageName() {
    return 'Stage 1: Dustrim Canyons'
  }

  createStageTextures(scene) {
    createStage1Textures(scene)
  }

  getWaveSchedule() {
    const spawnScout = (x) => (scene) => {
      const pod = new ScoutPod(scene, x, -20, (bx, by, vx, vy) =>
        scene.fireEnemyBullet(bx, by, vx, vy)
      )
      scene.enemies.add(pod)
    }
    const spawnTurret = (x) => (scene) => {
      const turret = new CliffTurret(
        scene,
        x,
        150,
        (bx, by, vx, vy) => scene.fireEnemyBullet(bx, by, vx, vy),
        scene.player
      )
      scene.enemies.add(turret)
    }

    return [
      { delay: 500, spawn: spawnScout(150) },
      { delay: 1200, spawn: spawnScout(330) },
      { delay: 3500, spawn: spawnScout(100) },
      { delay: 4200, spawn: spawnScout(380) },
      { delay: 6000, spawn: spawnTurret(30) },
      { delay: 8000, spawn: spawnTurret(WIDTH - 30) },
      { delay: 9500, spawn: spawnScout(150) },
      { delay: 10200, spawn: spawnScout(330) },
      { delay: 11000, spawn: spawnScout(240) },
    ]
  }

  createBoss(scene, onFire) {
    return new Boss1(scene, onFire)
  }
}
