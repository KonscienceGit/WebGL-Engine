import {Vec2, Vec4} from "./math/vectors.js";
import {Matrix3} from "./math/matrix.js";

const __tmpV2 = new Vec2(0, 0);
const __tmpPosA = new Vec2(0, 0);
const __tmpPosB = new Vec2(0, 0);

/**
 * Basic Node of the 2D Scene graph.
 * Can be updated in the render loop, manipulated in 2D space (SRT transformations), and loaded by the LoadingManager.
 */
export class Entity {
    constructor() {
        this.name = null;
        this.visible = true;
        this.loaded = true;
        this.creationTime = performance.now();
        /**
         * @type {Entity[]}
         */
        this.childrenNodes = [];

        // SRT (scale, rotation, translation)
        this.scale = new Vec2(1, 1);
        this.rotation = 0;
        this.position = new Vec2(0, 0);
        this.modelWorldMat = new Matrix3();
        this.localMat = new Matrix3();

        // Render properties
        // TODO move color and size to class that can use them
        this.size = new Vec2(1, 1);
        this.color = new Vec4(1, 1, 1, 1);

        // Physics properties
        // TODO move to physics class once it is done
        this.radius = 0;
        this.isRound = true;
        /**
         * @type {Record<string, any>}
         */
        this.customData = {};
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
        return this;
    }

    /**
     * Update this entity, its matrix and all its child entities if they are updatable.
     * @param {number} delta the time delta (in seconds) since the last frame.
     * @param {Matrix3} patrix the parent entity matrix ot update this entity world matrix.
     */
    update(delta, patrix) {
        this.localMat.makeSRT(this.scale, this.rotation, this.position);
        this.modelWorldMat.copy(this.localMat);
        this.modelWorldMat.preMultiply(patrix);
        if (this.childrenNodes) {
            for (let i = 0; i < this.childrenNodes.length; i++) {
                this.childrenNodes[i].update(delta, this.modelWorldMat);
            }
        }
    }

    /**
     * Return this object's position in world coordinates.
     * @param {Vec2} target
     */
    getWorldPosition(target) {
        target.x = this.modelWorldMat.m[2];
        target.y = this.modelWorldMat.m[5];
    }

    /**
     * Draw this entity and all its child entities if they are visible.
     * @param {Renderer} renderer
     */
    draw(renderer) {
        if (this.childrenNodes) {
            for (let i = 0; i < this.childrenNodes.length; i++) {
                const node = this.childrenNodes[i];
                if (node.isVisible()) node.draw(renderer);
            }
        }
    }

    /**
     * Return all entities contained in this entity, including nested ones.
     * @param {Entity[]} [target]
     */
    getAllNodes(target) {
        const t = target == null ? [] : target;
        t.push(this);
        this.childrenNodes.forEach((node) => node.getAllNodes(t));
        return t;
    }

    /**
     * Add the given entity as a children to this entity.
     * @param {Entity} entity
     */
    add(entity) {
        const nodes = this.childrenNodes;
        const nb = nodes.length;
        for (let i = 0; i < nb; i++) {
            if (nodes[i] === entity) return;
        }
        nodes.push(entity);
    }

    /**
     * Remove the given entity from the children of this entity, if it is present.
     * @param {Entity} entity
     */
    remove(entity) {
        let pos = -1;
        const nodes = this.childrenNodes;
        const nb = nodes.length;
        for (let i = 0; i < nb; i++) {
            if (nodes[i] === entity) {
                pos = i;
                break;
            }
        }
        if (pos === -1) return;
        this.childrenNodes = nodes.splice(pos, 1);
    }

    // TODO move all intersection code to dedicated class, such as Physics (isPickable, isCollidable, isPhysics ...)
    // this.translationSpeed = new Vec2(0, 0);
    // this.rotationSpeed = 0;
    // this.density = 1; // 1 is water density
    // this.relativeSurface = 1.; // 1 is a perfectly smooth round shape, >1 is more surface = more drag
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
        // Apply transformations, they'll be up-to-date compared to the previous render (for the parent transformations at least)
        __tmpPosA.copy(r1.position);
        r1.modelWorldMat.applyToPosition(__tmpPosA);
        __tmpPosB.copy(r2.position);
        r2.modelWorldMat.applyToPosition(__tmpPosB);
        let dist = r1.radius * r1.scale.x + r2.radius * r2.scale.x; // only use x since we assume the scale is uniform. For non-uniform sphere (ellipses) collision... well that won't work.
        dist *= dist;
        let dX = __tmpPosA.x - __tmpPosB.x;
        dX *= dX;
        // if (dX >= dist) return false;
        let dY = __tmpPosA.y - __tmpPosB.y;
        dY *= dY;
        if (dX + dY < 150) {
            console.log(Math.round(Math.sqrt(dX + dY)));
        }
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
    isLoaded() {
        return this.loaded;
    }

    /**
     * Set if this object has been loaded or not.
     * @param {boolean} bool
     */
    setLoaded(bool) {
        this.loaded = bool;
    }

    /**
     * Return if this entity is visible or not.
     * Not-visible objects are not rendered.
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
}
