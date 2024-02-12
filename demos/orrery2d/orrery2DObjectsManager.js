class Orrery2DObjectsManager {
    /**
     * Load the solar system and add it to the given Entity node.
     * @param {Entity} root
     */
    static loadSolarSystem(root) {
        const systemMap = SolarSystem.getMap();
        const systemData = SolarSystem.getData();
        const gravityCenter = new Entity();
        this.createSystemParse(systemMap, gravityCenter, systemData);

        const sun = new PlanetShape(0.01, new Vec4(1, 1, 0, 1), 'sun');
        root.add(sun);
        const earth = new PlanetShape(0.1, new Vec4(0, 0, 1, 1), 'earth');

        const testData = SolarSystem.getTest();
        const testBody = new StellarBody(testData);
        root.add(testBody);

        earth.position.setValues(1.5, 0);
        sun.add(earth);

        const moon = new PlanetShape(0.04, new Vec4(0.5, 0.5, 0.5, 1), 'moon');
        moon.position.x = 0.25;
        earth.add(moon);

        this.sun = sun;
        this.earth = earth;
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
            const subEntity = this.makeBodyFromData(subData);
            parentEntity.add(subEntity);
            const subMapNode = parentMapNode[subName];
            if (typeof subMapNode === 'object') {
                this.createSystemParse(subMapNode, subEntity, data);
            }
        }
    }

    /**
     * @private
     * @param data
     * @returns {Entity}
     */
    static makeBodyFromData(data) {
        return new Entity();
    }
}
