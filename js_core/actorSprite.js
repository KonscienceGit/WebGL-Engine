class ActorSprite extends AnimatedSprite {
    constructor(gl, canvas, imageLoc) {
        super(gl, canvas, imageLoc);
        this.lastDirection = 1;
        this.speed = 1.5;
    }

    update(delta) {
        let pos = this.position.x;
        this.position.y = -1 + this.referenceScale.y;

        //animate character flipping when changing direction
        let targetVal = -this.lastDirection * this.referenceScale.x;
        if (this.scale.x < targetVal && targetVal > 0) {
            this.scale.x += 2 * delta;
        } else if (this.scale.x < targetVal && targetVal < 0) {
            this.scale.x = targetVal;//reset
        } else if (this.scale.x > targetVal && targetVal < 0) {
            this.scale.x -= 2 * delta;
        } else if (this.scale.x > targetVal && targetVal > 0) {
            this.scale.x = targetVal;//reset
        }

        //move character based on last value of movingDir
        if (this.movingDir === 0)
            return;
        pos += delta * this.movingDir * this.speed;
        //Wrap around edges
        if (pos > 1.25) {
            pos = -1.25;
        } else if (pos < -1.25) {
            pos = 1.25;
        }
        this.position.x = pos;
    }

    move(direction) {
        this.movingDir = direction;
        if (direction !== 0) {
            this.lastDirection = direction;
        }
    }
}