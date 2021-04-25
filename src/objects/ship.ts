import { Bullet } from './bullet';
import { CONST } from '../const/const';
import { IGraphicsConstructor } from '../interfaces/graphics.interface';

export class Ship extends Phaser.GameObjects.Graphics {
  body: Phaser.Physics.Arcade.Body;

  private velocity: Phaser.Math.Vector2;
  private cursors: any;
  private bullets: Bullet[];
  private shootKey: Phaser.Input.Keyboard.Key;
  private isShooting: boolean;

  public getBullets(): Bullet[] {
    return this.bullets;
  }

  public getBody(): any {
    return this.body;
  }

  constructor(aParams: IGraphicsConstructor) {
    super(aParams.scene, aParams.options);

    // variables
    this.bullets = [];
    this.isShooting = false;

    // init ship
    this.initShip();

    // input
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.shootKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // physics
    this.scene.physics.world.enable(this);
    this.body.allowGravity = false;
    this.body.setSize(CONST.SHIP_SIZE * 2, CONST.SHIP_SIZE * 2);
    this.body.setOffset(-CONST.SHIP_SIZE, -CONST.SHIP_SIZE);
    this.rotation = Math.PI / 2;

    this.scene.add.existing(this);
  }

  private initShip(): void {
    // define ship properties
    this.x = this.scene.sys.canvas.width / 4;
    this.y = this.scene.sys.canvas.height / 2;
    this.velocity = new Phaser.Math.Vector2(0, 0);

    // define ship graphics and draw it
    this.lineStyle(1, 0xffffff);

    this.strokeTriangle(
      -CONST.SHIP_SIZE,
      CONST.SHIP_SIZE,
      CONST.SHIP_SIZE,
      CONST.SHIP_SIZE,
      0,
      -CONST.SHIP_SIZE
    );
  }

  update(): void {
    if (this.active) {
      this.handleInput();
    }
    this.applyForces();
    this.updateBullets();
  }

  private handleInput(): void {
    if (this.cursors.up.isDown) {
      this.boost(new Phaser.Math.Vector2(0, -1));
    }
    if (this.cursors.down.isDown) {
      this.boost(new Phaser.Math.Vector2(0, 1));
    }
    if (this.cursors.left.isDown) {
      this.boost(new Phaser.Math.Vector2(-1, 0));
    }
    if (this.cursors.right.isDown) {
      this.boost(new Phaser.Math.Vector2(1, 0));
    }


    if (this.shootKey.isDown && !this.isShooting) {
      this.shoot();
      this.isShooting = true;
    }

    if (this.shootKey.isUp) {
      this.isShooting = false;
    }
  }

  private boost(force: Phaser.Math.Vector2): void {
    // create the force in the correct direction
    // reduce the force and apply it to the velocit y
    force.scale(0.3);
    this.velocity.add(force);
  }
  private applyForces(): void {
    if ((this.x + this.velocity.x > 0) && (this.x + this.velocity.x < this.scene.sys.canvas.width)){
      this.x += this.velocity.x;
    }
    if ((this.y + this.velocity.y > 0) && (this.y + this.velocity.y < this.scene.sys.canvas.height)) {
      this.y += this.velocity.y;
    }
    // reduce the velocity
    this.velocity.scale(0.98);
  }

  private shoot(): void {
    this.bullets.push(
      new Bullet({
        scene: this.scene,
        velocity: new Phaser.Math.Vector2(10, 0),
        options: {
          x: this.x,
          y: this.y
        }
      })
    );
  }

  private updateBullets(): void {
    for (let i = 0; i < this.bullets.length; i++) {
      if (this.bullets[i].active) {
        this.bullets[i].update();
      } else {
        this.bullets[i].destroy();
        this.bullets.splice(i, 1);
      }
    }
  }
}
