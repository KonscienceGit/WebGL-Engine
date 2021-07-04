class EntityProperties {
    constructor() {
        // SRT (scale, rotation, translation)
        this.scale = new Vec2(1., 1.);
        this.rotation = 0.;
        this.position = new Vec2(0, 0);

        // Render properties
        this.renderSizeXY = new Vec2(1, 1);
        this.isVisible = true;
        this.textureLayer = 0;

        // Physics properties
        this.physicSizeXY = new Vec2(1, 1);
        this.radius = 0;
        this.isRound = true;
        this.translationSpeed = new Vec2(0., 0.);
        this.rotationSpeed = 0.;
        this.density = 1.; // 1 is water density
        this.relativeSurface = 1.; // 1 is a perfectly smooth round shape, more is more surface = more drag

        // Misc
        this.timeAlive = 0.;
        this.animationState = 0;
        this.value = null;
    }

    /**
     * @returns {EntityProperties}
     */
    clone() {
        let newClone = new EntityProperties();
        newClone.scale.set(this.scale);
        newClone.rotation = this.rotation;
        newClone.position.set(this.position);

        newClone.renderSizeXY.set(this.renderSizeXY);
        newClone.isVisible = this.isVisible;
        newClone.textureLayer = this.textureLayer;

        newClone.physicSizeXY.set(this.physicSizeXY);
        newClone.isRound = this.isRound;
        newClone.radius = this.radius;
        newClone.translationSpeed.set(this.translationSpeed);
        newClone.rotationSpeed = this.rotationSpeed;
        newClone.density = this.density;
        newClone.relativeSurface = this.relativeSurface;

        newClone.animationState = this.animationState;
        newClone.value = this.value; // Value might be an object reference!

        return newClone;
    }

    /**
     * @param {EntityProperties} anotherItem
     * @returns {boolean}
     */
    intersect(anotherItem) {
        if (!this.isVisible) {
            return false;
        }
        if (anotherItem.isRound && this.isRound) {
            const minDistance = this.radius + anotherItem.radius;
            return (Math.abs(this.position.y - anotherItem.position.y) < minDistance && Math.abs(this.position.x - anotherItem.position.x) < minDistance);
        } else {
            //TODO intersect rectangles, or round/rectangle combination
            return false;
        }
    }
}
