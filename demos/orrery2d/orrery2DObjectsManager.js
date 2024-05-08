import {SolarSystem} from "./data/solarSystem.js";
import {Entity} from "../../webgl_engine/utils/entity.js";
import {StellarBody} from "./stellarBody.js";

export class Orrery2DObjectsManager {
    /**
     * Load the solar system and add it to the given Entity node.
     * @param {Entity} root
     */
    static loadSolarSystem(root) {
        const systemMap = SolarSystem.getMap();
        const systemData = SolarSystem.getData();
        const gravityCenter = new Entity();
        this.createSystemParse(systemMap, gravityCenter, systemData);
        root.add(gravityCenter);
    }

    /**
     * @private
     * @param {object} parentMapNode
     * @param {Entity} parentEntity
     * @param {object} data
     */
    static createSystemParse(parentMapNode, parentEntity, data) {
        for (const subName in parentMapNode) {
            const subData = data[subName];
            if (subData == null) {
                console.log('Error, missing body data for name', subName);
                return;
            }
            const subEntity = new StellarBody(subData, true);
            if (parentEntity instanceof StellarBody) {
                parentEntity.addToOrbit(subEntity);
            } else {
                parentEntity.add(subEntity);
            }
            const subMapNode = parentMapNode[subName];
            if (typeof subMapNode === 'object') {
                this.createSystemParse(subMapNode, subEntity, data);
            }
        }
    }
}
