import { CONST } from '../const/const';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'BootScene'
    });
  }

  preload(): void {
    this.load.bitmapFont(
      'asteroidFont',
      './assets/font/asteroidFont.png',
      './assets/font/asteroidFont.fnt'
    );
  }

  create(): void {
    // reset score, highscore and player lives
    if (CONST.SCORE > CONST.HIGHSCORE) {
      CONST.HIGHSCORE = CONST.SCORE;
    }
    CONST.SCORE = 0;
    CONST.LIVES = 3;
    // this.scene.start('MainMenuScene');
    this.scene.start('GameScene');
  }
}
