const __tmpV2 = new Vec2(0, 0);
/**
 * Define an object that can be rendered by the Renderer, and loaded by the LoadingManager.
 */
class Entity {
    constructor() {
        this.visible = false;
        this.loaded = true;
        this.hasPhysics = false;
        this.updatable = false;
        this.creationTime = performance.now();
        this.childrenNodes = [];

        // import from entityProperties.js
        // SRT (scale, rotation, translation)
        this.scale = new Vec2(1., 1.);
        this.rotation = 0.;
        this.position = new Vec2(0, 0);

        // Render properties
        this.size = new Vec2(1, 1);
        this.textureLayer = 0;
        this.color = new Vec4(1,1,1,1);

        // Physics properties
        this.radius = 0;
        this.isRound = true;
        this.translationSpeed = new Vec2(0., 0.);
        this.rotationSpeed = 0.;
        this.density = 1.; // 1 is water density
        this.relativeSurface = 1.; // 1 is a perfectly smooth round shape, >1 is more surface = more drag

        // Misc
        this.animationState = 0;
        this.value = null;
    }

    /**
     * @param toCopy the entity to copy the properties of.
     * @returns {Entity}
     */
    copy(toCopy) {
        this.visible = toCopy.visible;
        this.scale.copy(toCopy.scale);
        this.rotation = toCopy.rotation;
        this.position.copy(toCopy.position);

        this.size.copy(toCopy.size);
        this.textureLayer = toCopy.textureLayer;
        // Define the color values/multipliers of the entity.
        // When used as base color,range is 0-1,
        // When used as multiplier it can be above 1 (resulting color is fragment color (texture or vertex) * color
        this.color.copy(toCopy.color);

        this.isRound = toCopy.isRound;
        this.radius = toCopy.radius;
        this.translationSpeed.copy(toCopy.translationSpeed);
        this.rotationSpeed = toCopy.rotationSpeed;
        this.density = toCopy.density;
        this.relativeSurface = toCopy.relativeSurface;

        this.animationState = toCopy.animationState;
        this.value = toCopy.value; // Value might be an object reference!
        return this;
    }

    /**
     * @param {Entity} entity
     * @returns {boolean}
     */
    intersect(entity) {
        if (!this.visible || !entity.visible) return false;
        if (entity.isRound && this.isRound) {
            return this.intersectRounds(entity, this);
        } else if (entity.isRound && !this.isRound) {
            return this.intersectRoundWithRect(entity, this);
        } else if (!entity.isRound && this.isRound) {
            return this.intersectRoundWithRect(this, entity);
        } else {
            return this.intersectRects(this, entity);
        }
    }

    intersectRounds(r1, r2) {
        let dist = r1.radius + r2.radius;
        dist *= dist;
        let dX = r1.position.x - r2.position.x;
        dX *= dX;
        if (dX >= dist) return false;
        let dY = r1.position.y - r2.position.y;
        dY *= dY;
        return (dX + dY) < dist;
    }

    intersectRoundWithRect(round, rect) {
        const sizeRectX = rect.size.x * 0.5;
        const distX = Math.abs(round.position.x - rect.position.x);
        if (distX >= (sizeRectX + round.radius)) return false;
        const sizeRectY = rect.size.y * 0.5;
        const distY = Math.abs(round.position.y - rect.position.y);
        if (distY >= (sizeRectY + round.radius)) return false;
        if (round.radius === 0 || distX < sizeRectX || distY < sizeRectY) return true;
        // Compute intersection with corners
        const r2 = round.radius * round.radius;
        __tmpV2.setValues(rect.position.x + rect.size.x / 2, rect.position.y + rect.size.y / 2);
        if (__tmpV2.distanceSquared(round.position) < r2) return true;
        __tmpV2.x = rect.position.x - rect.size.x / 2;
        if (__tmpV2.distanceSquared(round.position) < r2) return true;
        __tmpV2.y = rect.position.y - rect.size.y / 2;
        if (__tmpV2.distanceSquared(round.position) < r2) return true;
        __tmpV2.x = rect.position.x + rect.size.x / 2;
        return __tmpV2.distanceSquared(round.position) < r2;
    }

    intersectRects(r1, r2) {
        const distX = r1.size.x + r2.size.x;
        const dX = Math.abs(r1.position.x - r2.position.x);
        if (dX >= distX) return false;
        const distY = r1.size.y + r2.size.y;
        const dY = Math.abs(r1.position.y - r2.position.y);
        return (dY < distY);
    }

    /**
     * Return if this object has been loaded or not.
     * When used in a LoadingManager, the Loading process will not continue until the object is loaded.
     * (useful if this object's constructor can return before it's resources has finished loading, like files or asynchronous processing.)
     * Set this.loaded to false first if your entity must perform asynchronous work after constructor call, before being usable in the game.
     * @returns {boolean}
     */
    isLoaded(){
        return this.loaded;
    }

    /**
     * Set if this object has been loaded or not.
     * @param {boolean} bool
     */
    setLoaded(bool){
        this.loaded = bool;
    }

    /**
     * Update this entity and all its child entities if they are updatable.
     * This method is to be called each frame.
     * @param {number} delta the time delta (in seconds) since the last frame.
     */
    updateEntity(delta){
        if (this.childrenNodes) {
            for(let i = 0; i < this.childrenNodes.length; i++) {
                if (this.childrenNodes[i].isUpdatable()) this.childrenNodes[i].updateEntity(delta);
            }
        }
    }

    /**
     * Draw this entity and all its child entities if they are visible.
     * @param {Renderer} renderer
     */
    draw(renderer) {
        if (this.childrenNodes) {
            for(let i = 0; i < this.childrenNodes.length; i++) {
                if (this.childrenNodes[i].isVisible()) this.childrenNodes[i].draw(renderer);
            }
        }
    }

    /**
     * Render this entity (if applicable) for picking purposes.
     * @param {Renderer} renderer the offscreen renderer which will render this entity for picking.
     * @param {number} id the id to assign to this entity in picking process.
     */
    drawForPicking(renderer, id){}

    /**
     * Return if this entity is visible or not.
     * Not-visible objects are not rendered, .
     * @returns {boolean}
     */
    isVisible() {
        return this.visible;
    }

    /**
     * Set if this object is visible or not.
     * @param {boolean} isVisible
     */
    setVisible(isVisible) {
        this.visible = isVisible;
    }

    /**
     * Return if this entity have physics properties or not.
     * @returns {boolean}
     */
    isPhysics() {
        return this.hasPhysics;
    }

    /**
     * Set if this entity have physics properties or not.
     * @param {boolean} canCollide
     */
    setPhysics(canCollide) {
        this.hasPhysics = canCollide;
    }

    /**
     * Return if this entity can be updated each frame.
     * Updatable entities are updated via the overrideable updateEntity() method.
     * @returns {boolean}
     */
    isUpdatable() {
        return this.updatable;
    }

    /**
     * Set if this entity can collide with others or not.
     * @param {boolean} canUpdate
     */
    setUpdatable(canUpdate) {
        this.updatable = canUpdate;
    }
}
