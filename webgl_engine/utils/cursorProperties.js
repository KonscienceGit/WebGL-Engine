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
        this.devicePos = new Vec2(-10, 0); // the position in device coordinates [-0.5 : 0.5].
        this.worldPosOffset = new Vec2(0, 0); // the world position offset. to get the real world coordinates, substract this to screenWorldPos.
        this.pickedObject = null;

        this.screenSpaceCursorPos = new Entity().copy(this);
    }

    /**
     * Will use boundingBox calculations to seek entities at cursor position.
     * Entities are parsed in the given order (meaning if two entity overlay under the cursor, the first in the list is returned), only one picked entity by picking result.
     * @param {Entity[]|Entity} entities the entity array to pick from.
     * @returns {null|Entity} the entity below this cursor, null if not applicable.
     */
    pick(entities) {
        this.pickedObject = null;
        if (entities == null) return null;
        if (entities.length == null) entities = [entities];
        this.position.copy(this.screenWorldPos);
        this.position.sub(this.worldPosOffset);
        this.screenSpaceCursorPos.position.copy(this.devicePos);
        for (let i = 0; i < entities.length; i++) {
            const inDevice = (entities[i] instanceof Sprite && entities[i].isPositionInDevice());
            const cursor = inDevice ? this.screenSpaceCursorPos : this;
            if (cursor.intersect(entities[i])) {
                this.pickedObject = entities[i];
                break;
            }
        }
        return this.pickedObject;
    }
}
