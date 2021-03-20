class ActorSprite extends AnimatedSprite {
    constructor(gl, canvas, imagePath, fileExtension, imageCount) {
        super(gl, canvas, imagePath, fileExtension, imageCount);
        this.lastDirection = 1;
        this.speed = 1.5;
        this.animationPos = 0.0;
        this.animationSpeed = 8;
    }

    update(delta) {
        this.updateActorFlippingAnimation(delta);
        this.updateAnimationLayer(delta);
        this.updateActorPosition(delta);
    }

    //move the actor on the given direction (used by inputListener only!
    move(direction) {
        this.movingDir = direction;
        if (direction !== 0) {
            this.lastDirection = direction;
        }
    }

    //animate character flipping when changing direction (private)
    updateActorFlippingAnimation(delta) {
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
    }

    //move actor based on last value of movingDir (private)
    updateAnimationLayer(delta) {
        if (this.movingDir === 0) {
            this.setTextureLayer(0);
            return;
        }
        let firstAnimationFrame = 1;
        let lastAnimationFrame = this.getImageCount() - 1;
        this.setTextureLayer(firstAnimationFrame + Math.floor(this.animationPos));
        this.animationPos += delta * this.animationSpeed;
        if (this.animationPos >= lastAnimationFrame) {
            this.animationPos = 0.0;
        }
    }

    //update Actor position on screen (private)
    updateActorPosition(delta) {
        this.position.y = -1 + this.referenceScale.y;

        if (this.movingDir === 0) {
            return;
        }
        this.position.x += delta * this.movingDir * this.speed;
        //Wrap around edges
        if (this.position.x > 1.25) {
            this.position.x = -1.25;
        } else if (this.position.x < -1.25) {
            this.position.x = 1.25;
        }
    }
}