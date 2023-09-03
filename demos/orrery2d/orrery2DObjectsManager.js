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

        this.fullscreenButton = new Sprite(renderer, {imagespaths: '../../resources/minesweeper/Fullscreen.png'});

        const sun = new PlanetShape(renderer, 0.01, new Vec4(1, 1, 0, 1));
        const earth = new PlanetShape(renderer, 0.1, new Vec4(0, 0, 1, 1));

        const testData = SolarSystem.getTest();
        const testBody = new StellarBody(renderer, testData);
        // const testOrbitLine = this.orbitCalculus(testData.semiMajorAxis, testData.eccentricity, 10, renderer);
        this._root.add(testBody);
        // this._root.add(testOrbitLine);

        const nbPts = 100;
        // this._root.add(this.orbitCalculus(1, 0.8244, nbPts, renderer));
        // this._root.add(this.makeunitCircle(renderer, nbPts));
        // this._root.add(this.keplerOrbit(1, 0.8244, nbPts, renderer));

        earth.position.setValues(1.5, 0);
        // sun.add(earth);

        const moon = new PlanetShape(renderer, 0.04, new Vec4(0.5, 0.5, 0.5, 1));
        moon.position.x = 0.25;
        // earth.add(moon);

        this._root.add(sun);
        this._root.add(this.fullscreenButton);

        this.sun = sun;
        this.earth = earth;
    }

    makeunitCircle(renderer, nbPts) {
        const x = [];
        const y = [];
        for (let i = 0; i <= nbPts; i++) {
            const a = i * 2 * Math.PI / nbPts;
            x.push(Math.cos(a));
            y.push(Math.sin(a));
        }
        return new Line(renderer, x, y, new Vec4(1, 0, 0, 1));
    }

    orbitCalculus(radius, eccentricity, nbPts, renderer) {
        const x = [];
        const y = [];
        for (let i = 0; i <= nbPts; i++) {
            const angle = i * 2 * Math.PI / nbPts;
            x.push(radius * (Math.cos(angle) - eccentricity));
            y.push(radius * Math.sqrt(1 - eccentricity * eccentricity) * Math.sin(angle));
        }
        return new Line(renderer, x, y, new Vec4(0, 1, 0, 1));
    }

    keplerOrbit(radius, eccentricity, nbPts, renderer) {
        const x = [];
        const y = [];
        const numerator = radius * (1 - eccentricity * eccentricity);
        for (let i = 0; i <= nbPts; i++) {
            const angle = i * 2 * Math.PI / nbPts;
            const cos = Math.cos(angle);
            const denominator = 1 + eccentricity * cos;
            const trueRadius = numerator / denominator;
            x.push(trueRadius * cos);
            y.push(trueRadius * Math.sin(angle));
        }
        return new Line(renderer, x, y, new Vec4(0, 0, 1, 1));
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
