const MovingObject = require("./moving_object");
const Util = require("./util");
const Coin = require('./coin');

class Ship extends MovingObject {
  constructor(options) {
    options.color = options.color || '#fff',
    options.radius = Ship.RADIUS,
    options.vel = options.vel || [0, -2];
    super(options);

    this.path = [];
    this.counter = 0;
  }

  draw(ctx, ogShip = true) {
    if (ogShip) {
      let dashes = this.path.slice(Math.max(this.path.length - 50, 1));
      dashes = dashes.filter((x, idx) => { return x.vissible; });
      dashes.forEach((point, idx) => {
        ctx.fillStyle = `#000`;
        ctx.globalAlpha = (idx) / dashes.length;
        ctx.beginPath();
        ctx.moveTo(...point.pos);
        ctx.lineTo(point.pos[0] + point.vel[0], point.pos[1] + point.vel[1] );
        ctx.stroke();
      });
    }

    super.draw(ctx);
  }

  move(timeDelta) {
    if (this.counter === 5) {
      this.path.push({pos: this.pos,
                      vel:this.vel,
                      vissible: true});
      this.counter = 0;
    } else {
      this.path.push({pos: this.pos,
                      vel:this.vel,
                      vissible: false});
      this.counter++;
    }
    super.move(timeDelta);
  }

  changeDirection(delta) {
    this.vel = Util.rotate(this.vel, delta);
  }

  collideWith(object) {
    if (object instanceof Coin ) {
      this.game.pathPos = this.path.length - 1;
      this.game.remove(object);
    } else {
      this.game.over = true;
    }
  }

}

Ship.RADIUS = 10;
module.exports = Ship;
