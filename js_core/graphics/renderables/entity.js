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
        this.scale = new Vec2(1., 1.); // TODO upgrade to vec3
        this.rotation = 0.;
        this.position = new Vec2(0, 0);

        // Render properties // TODO Sprite only
        this.renderSizeXY = new Vec2(1, 1);
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
        this.animationState = 0;
        this.value = null;
    }

    /**
     * @param {Entity} entity
     * @returns {boolean}
     */
    intersect(entity) {
        if (!this.visible) {
            return false;
        }
        if (entity.isRound && this.isRound) {
            const minDistance = this.radius + entity.radius;
            return (Math.abs(this.position.y - entity.position.y) < minDistance && Math.abs(this.position.x - entity.position.x) < minDistance);
        } else {
            //TODO intersect rectangles, or round/rectangle combination
            return false;
        }
    }

    /**
     * @param toCopy the entity to copy the properties of.
     * @returns {Entity}
     */
    copy(toCopy) {
        this.scale.copy(toCopy.scale);
        this.rotation = toCopy.rotation; // TODO 3D rotation, vec3 or quaternion?
        this.position.copy(toCopy.position);

        this.renderSizeXY.copy(toCopy.renderSizeXY); // TODO Texture only
        this.textureLayer = toCopy.textureLayer;

        this.physicSizeXY.copy(toCopy.physicSizeXY); // TODO create boundingBox
        this.isRound = toCopy.isRound;
        this.radius = toCopy.radius; // TODO create boundingSphere
        this.translationSpeed.copy(toCopy.translationSpeed);
        this.rotationSpeed = toCopy.rotationSpeed; // TODO vec3 or quaternion (in units per seconds)
        this.density = toCopy.density;
        this.relativeSurface = toCopy.relativeSurface;

        this.animationState = toCopy.animationState;
        this.value = toCopy.value; // Value might be an object reference!
        return this;
    }

    /**
     * Return if this object has been loaded or not.
     * When used in a LoadingManager, the Loading process will not continue until the object is loaded.
     * (useful if this object's constructor can return before it's resources has finished loading, like files or asynchronous processing.)
     * Set this.loaded to false first if your entity must perform asynchronous work after constructor call, before being usable in the game.
     *
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