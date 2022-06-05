class ScoreCounter extends MultiSprite {
    constructor(renderer, resourcePath, pixelPerfectTool) {
        const numPathes = [];
        for (let i = 0; i < 11; i++) {
            numPathes.push(resourcePath + i + '.png');
        }
        super(renderer, numPathes);
        this._score = 0;
        this._moveSpeed = 100; // pixel per seconds
        this._scoreFeedbackInstances = [];
        /** @type {Entity[]} */
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
        this._pixelPerfectTool.setTopLeftWorldPosition(
            this,
            40 + this.size.x / 2,
            30 + this.size.y / 2
        );
    }

    draw(renderer) {
        if (this._scoreCounterInstances.length === 0) {
            for (let i = 0; i < this._digitCount; i++) {
                this._scoreCounterInstances.push(this.createNewInstance());
            }
        }

        const increment = this.size.x;
        //Reset base position
        this.getRenderPosition().x = this.getReferencePosition().x + 4 * increment;

        const numberToDisplay = this.getDigits(this._score);
        for (let i = 0; i < this._digitCount; i++) {
            this._scoreCounterInstances[i].textureLayer = numberToDisplay[i];
            this._scoreCounterInstances[i].position.copy(this.getRenderPosition());
            this.getRenderPosition().moveLeft(increment);
        }

        //Combine all instances array for drawing.
        this.setInstances(this._scoreCounterInstances.concat(this._scoreFeedbackInstances));
        super.draw(renderer);
    }

    /**
     * @param {Entity} entityItem
     * @param {number} score
     */
    createScoreFeedbackAt(entityItem, score) {
        this._score += score;
        const pos = entityItem.position.clone();
        const scale = 0.4 + score / 75.;
        const scaleVec = new Vec2(scale, scale);
        const offset = this.size.x * scale;
        const digits = this.getDigits(score);
        const digitsCount = digits.length;
        const plus = this.createNewInstance();
        plus.textureLayer = 10; // plus sign
        plus.scale.copy(scaleVec);
        pos.moveRight(digitsCount * offset / 2);
        for (let i = 0; i < digitsCount; i++) {
            const nextDigit = this.createNewInstance();
            nextDigit.textureLayer = digits[i];
            nextDigit.position.copy(pos);
            nextDigit.scale.copy(scaleVec);
            this._scoreFeedbackInstances.push(nextDigit);
            pos.moveLeft(offset);
        }
        plus.position.copy(pos);
        this._scoreFeedbackInstances.push(plus);
    }

    updateEntity(delta) {
        super.updateEntity(delta);
        let instanceToKeep = [];
        const now = performance.now();
        this._scoreFeedbackInstances.forEach(entity => {
            entity.position.moveUp(delta * this._moveSpeed);
            if (now - entity.creationTime < 1000) {
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
