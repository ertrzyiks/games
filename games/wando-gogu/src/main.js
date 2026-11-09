import Phaser from 'phaser'
import { WIDTH, HEIGHT } from './config.js'
import { BootScene } from './scenes/BootScene.js'
import { StageSelectScene } from './scenes/StageSelectScene.js'
import { Stage1Scene } from './scenes/Stage1Scene.js'
import { Stage2Scene } from './scenes/Stage2Scene.js'
import { Stage3Scene } from './scenes/Stage3Scene.js'

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-container',
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  scene: [BootScene, StageSelectScene, Stage1Scene, Stage2Scene, Stage3Scene],
})
