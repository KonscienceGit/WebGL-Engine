class ScoreCounter extends MultiSprite {
    constructor(renderer, pixelPerfectTool) {
        super(renderer, "resources/numbers/", Sprite.generateFileNameList(11, ".png"));
        this._score = 0;
        this._moveSpeed = 100; // pixel per seconds
        this._scoreFeedbackInstances = [];
        /** @type {EntityProperties[]} */
        this._scoreCounterInstances = [];
        this._digitCount = 5;
        this._pixelPerfectTool = pixelPerfectTool;
    }

    setScore(score) {
        this._score = score;
    }

    getScore() {
        return this._score;
    }

    imageLoaded() {
        super.imageLoaded();
        this.resetPosition();
    }

    resetPosition() {
        this._pixelPerfectTool.setTopLeftPixelPostition(
            this,
            40 + this._entityProperties.renderSizeXY.x / 2,
            30 + this._entityProperties.renderSizeXY.y / 2
        );
    }

    /** @param { WebGL2RenderingContext} gl */
    draw(gl) {
        if (!this.isVisible()) {
            return;
        }

        if (this._scoreCounterInstances.length === 0) {
            for (let i = 0; i < this._digitCount; i++) {
                this._scoreCounterInstances.push(this.createNewInstance());
            }
        }

        const increment = this._entityProperties.renderSizeXY.x;
        //Reset base position
        this.getRenderPosition().x = this.getReferencePosition().x + 4 * increment;

        const numberToDisplay = this.getDigits(this._score);
        for (let i = 0; i < this._digitCount; i++) {
            this._scoreCounterInstances[i].textureLayer = numberToDisplay[i];
            this._scoreCounterInstances[i].position.set(this.getRenderPosition());
            this.getRenderPosition().moveLeft(increment);
        }

        //Combine all instances array for drawing.
        this.setInstances(this._scoreCounterInstances.concat(this._scoreFeedbackInstances));
        super.draw(gl);
    }

    /**
     * @param {EntityProperties} entityItem
     * @param {number} score
     */
    createScoreFeedbackAt(entityItem, score) {
        this._score += score;
        const pos = entityItem.position.clone();
        const scale = 0.4 + score / 75.;
        const scaleVec = new Vec2(scale, scale);
        const offset = this.getEntityProperties().renderSizeXY.x * scale;
        const digits = this.getDigits(score);
        const digitsCount = digits.length;
        const plus = this.createNewInstance();
        plus.textureLayer = 10; // plus sign
        plus.scale.set(scaleVec);
        pos.moveRight(digitsCount * offset / 2);
        for (let i = 0; i < digitsCount; i++) {
            const nextDigit = this.createNewInstance();
            nextDigit.textureLayer = digits[i];
            nextDigit.position.set(pos);
            nextDigit.scale.set(scaleVec);
            this._scoreFeedbackInstances.push(nextDigit);
            pos.moveLeft(offset);
        }
        plus.position.set(pos);
        this._scoreFeedbackInstances.push(plus);
    }

    updateSprite(delta) {
        super.updateSprite(delta);
        let instanceToKeep = [];
        this._scoreFeedbackInstances.forEach(entity => {
            entity.position.moveUp(delta * this._moveSpeed);
            if (entity.timeAlive < 1) {
                instanceToKeep.push(entity);
            }
        });
        this._scoreFeedbackInstances = instanceToKeep;
    }

    getDigits(score) {
        let remainder = score;
        let digits = [];
        while (remainder >= 1) {
            let ten = Math.floor(remainder / 10);
            let numberWithoutLastDigit = ten;
            ten *= 10;
            digits.push(remainder - ten);
            remainder = numberWithoutLastDigit;
        }
        return digits;
    }

    releaseFeedbackInstances() {
        this._scoreFeedbackInstances = [];
    }
}