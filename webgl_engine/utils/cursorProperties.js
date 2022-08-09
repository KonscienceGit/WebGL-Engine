class CursorProperties extends Entity{
    constructor() {
        super();
        this.visible = true;
        this.screenPos = new Vec2(0, 0);
        this.canvasPos = new Vec2(0, 0);
        this.screenWorldPos = new Vec2(-10, 0);
        this.lastMovement = new Vec2(0,0);
        this.isOutside = false;
        this.pickedObject = null;
    }

    /**
     * Will use boundingBox calculations to seek entities at cursor position.
     * Entities are parsed in the given order (meaning if two entity overlay under the cursor, the first in the list is returned), only one picked entity by picking result.
     * @param {Entity[]|Entity} entities the entity array to pick from.
     * @returns {null|Entity} the entity below this cursor, null if not applicable.
     */
    pick(entities) {
        this.pickedObject = null;
        if (!entities) return null;
        if (!entities.length) entities = [entities];
        this.position.copy(this.screenWorldPos);
        for (let i = 0; i < entities.length; i++) {
            if (this.intersect(entities[i])) {
                this.pickedObject = entities[i];
                break;
            }
        }
        return this.pickedObject;
    }
}
