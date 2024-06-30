import {Entity} from "./entity.js";
import {Vec2} from "./math/vectors.js";

export class CursorProperties extends Entity {
    constructor() {
        super();
        this.visible = true; // TODO Because it inherit entity, is it still necessary?
        // positions/movements in pixel coordinates
        this.screenPos = new Vec2(0, 0);
        this.canvasPos = new Vec2(0, 0);
        this.devicePos = new Vec2(-10, 0); // the position in device coordinates [-1, 1].
        this.lastPixelMovement = new Vec2(0, 0);

        // TODO remove: positions/movements in world coordinates
        // this.screenWorldPos = new Vec2(-10, 0); // the position in the screen in world coordinates.
        // this.worldPosOffset = new Vec2(0, 0); // the world position offset. to get the real world coordinates, substract this to screenWorldPos.
        // this.screenSpaceCursorPos = new Entity().copy(this);

        // this.pickedObject = null;
    }

    /**
     * Will use boundingBox calculations to seek entities at cursor position.
     * Entities are parsed in the given order (meaning if two entity overlay under the cursor, the first in the list is returned), only one picked entity by picking result.
     * @param {Entity[]|Entity} entities the entity array to pick from.
     * @returns {null|Entity} the entity below this cursor, null if not applicable.
     */
    pick(entities) {
        console.warn('CursorProperties.pick() is deprecated, need to be fixed.');
        return null;
        // this.pickedObject = null;
        // if (entities == null) return null;
        // const entityArray = Array.isArray(entities) ? entities : [entities];
        // this.position.copy(this.screenWorldPos);
        // this.position.sub(this.worldPosOffset);
        // this.screenSpaceCursorPos.position.copy(this.devicePos);
        // for (let i = 0; i < entityArray.length; i++) {
        //     const entity = entityArray[i];
        //     if (this.intersect(entity)) {
        //         this.pickedObject = entity;
        //         break;
        //     }
        // }
        // return this.pickedObject;
    }
}
