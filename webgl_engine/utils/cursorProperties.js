class CursorProperties extends Entity{
    constructor() {
        super();
        this.visible = true;
        // positions/movmeents in pixel coordinates
        this.screenPos = new Vec2(0, 0);
        this.canvasPos = new Vec2(0, 0);
        this.lastPixelMovement = new Vec2(0,0);

        // positions/movements in world coordinates
        this.screenWorldPos = new Vec2(-10, 0); // the position in the screen in world coordinates.
        this.worldPosOffset = new Vec2(0, 0); // the world position offset. to get the real world coordinates, substract this to screenWorldPos.
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
        this.position.sub(this.worldPosOffset);
        for (let i = 0; i < entities.length; i++) {
            if (this.intersect(entities[i])) {
                this.pickedObject = entities[i];
                break;
            }
        }
        return this.pickedObject;
    }
}
