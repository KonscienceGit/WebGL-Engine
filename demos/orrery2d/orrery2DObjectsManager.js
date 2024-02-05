class Orrery2DObjectsManager {
    /**
     * @param {Renderer} renderer
     */
    constructor(renderer) {
        const systemMap = SolarSystem.getMap();
        const systemData = SolarSystem.getData();

        this._root = new Entity();
        this._scale = 1;
        this._scaleArray = [];
        this.renderer = renderer;

        const gravityCenter = new Entity();
        this.createSystemParse(systemMap, gravityCenter, systemData);

        this.fullscreenButton = new Sprite({imagespaths: '../../resources/minesweeper/Fullscreen.png'});
        this.fullscreenButton.name = "FSButton";

        const sun = new PlanetShape(0.01, new Vec4(1, 1, 0, 1), 'sun');
        const earth = new PlanetShape(0.1, new Vec4(0, 0, 1, 1), 'earth');

        const testData = SolarSystem.getTest();
        const testBody = new StellarBody(testData);
        this._root.add(testBody);

        earth.position.setValues(1.5, 0);
        sun.add(earth);

        const moon = new PlanetShape(0.04, new Vec4(0.5, 0.5, 0.5, 1), 'moon');
        moon.position.x = 0.25;
        earth.add(moon);

        this._root.add(sun);
        this._root.add(this.fullscreenButton);

        this.sun = sun;
        this.earth = earth;
    }

    /**
     * @param {object} parentMapNode
     * @param {Entity} parentEntity
     * @param {object} data
     */
    createSystemParse(parentMapNode, parentEntity, data) {
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

    makeBodyFromData(data) {
        return new Entity();
    }

    getRoot() {
        return this._root;
    }

    getScale() {
        return this._scale;
    }

    setScale(scale) {
        this._scale = scale;
        this._scaleArray.forEach((node) => node.scale.setValues(scale, scale));
    }
}
