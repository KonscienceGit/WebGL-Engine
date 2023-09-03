class StellarBody extends Entity {
    /**
     * @param {Renderer} renderer
     * @param {object} data
     */
    constructor(renderer, data) {
        super();
        /** @type {string} */
        this._indexName = data.indexName;
        /** @type {string} */
        this._formattedName = data.formattedName;
        /** @type {number} */
        this._bodyRadius = data.bodyRadius;
        /** @type {number} */
        this._ringInnerRadius = data.ringInnerRadius;
        /** @type {number} */
        this._semiMajorAxis = data.semiMajorAxis;
        /** @type {number} */
        this._ascendingNode = data.ascendingNode;
        /** @type {number} */
        this._orbitalIncli = data.orbitalIncli;
        /** @type {number} */
        this._argumPeriapsis = data.argumPeriapsis;
        /** @type {number} */
        this._orbitalPeriod = data.orbitalPeriod;
        /** @type {number} */
        this._eccentricity = data.eccentricity;
        /** @type {number} */
        this._axialTilt = data.axialTilt;
        /** @type {number} */
        this._rotationPeriod = data.rotationPeriod;
        /** @type {number[]} */
        this._color = data.color;
        /** @type {string} */
        this._bodyType = data.bodyType;

        this._semiMinorAxis = this._semiMajorAxis * Math.sqrt(1 - this._eccentricity * this._eccentricity);

        this._orbit = 0;
        const color = new Vec4(this._color[0], this._color[1], this._color[2], 1);
        this._body = new PlanetShape(renderer, this._bodyRadius, color);
        this._testRED = new PlanetShape(renderer, this._bodyRadius / 2, new Vec4(0.75, 0, 0, 1));
        this._testGREEN = new PlanetShape(renderer, this._bodyRadius / 2, new Vec4(0, 0.75, 0, 1));
        this._testBLUE = new PlanetShape(renderer, this._bodyRadius / 2.5, new Vec4(0, 0, 1, 1));
        this._eccentricLine = new Line(renderer, [0, 0], [-1, 1], new Vec4(0.75, 0, 0, 1));
        this.add(this._eccentricLine);
        this.add(this._body);
        this.add(this._testRED);
        this.add(this._testGREEN);
        this.add(this._testBLUE);
        this.updateOrbit();
        this.add(this.makeEccentricAnomalyCircle(renderer, 50));
        this.add(this.makeOrbitEllipse(renderer, 50));
    }

    makeEccentricAnomalyCircle(renderer, nbPts) {
        const x = [];
        const y = [];
        const offset = this._eccentricity * this._semiMajorAxis;
        for (let i = 0; i <= nbPts; i++) {
            const a = i * 2 * Math.PI / nbPts;
            x.push(Math.cos(a) - offset);
            y.push(Math.sin(a));
        }
        return new Line(renderer, x, y, new Vec4(1, 0, 0, 1));
    }

    makeOrbitEllipse(renderer, nbPts) {
        const x = [];
        const y = [];
        for (let i = 0; i <= nbPts; i++) {
            const angle = i * 2 * Math.PI / nbPts;
            x.push(this._semiMajorAxis * (Math.cos(angle) - this._eccentricity));
            y.push(this._semiMajorAxis * Math.sqrt(1 - this._eccentricity * this._eccentricity) * Math.sin(angle));
        }
        return new Line(renderer, x, y, new Vec4(0, 1, 0, 1));
    }

    updateEntity(delta) {
        super.updateEntity(delta);
        this._orbit += delta / this._orbitalPeriod;
        if (this._orbit >= 1) this._orbit--;
        this.updateOrbit();
    }

    sind(d) {
        return Math.sin(Math.PI * d / 180);
    }

    cosd(d) {
        return Math.cos(Math.PI * d / 180);
    }

    atand(n) {
        return Math.atan(n) * 180 / Math.PI;
    }

    tand(d) {
        return Math.tan(Math.PI * d / 180);
    }

    updateOrbit() {
        // TODO read http://www.braeunig.us/space/orbmech.htm#motions
        const meanAnomaly = this._orbit * 2 * Math.PI;
        const eccentricAnomaly = this.newtonItEccentricAnomaly(meanAnomaly, 40);
        // const eccentricAnomaly = this.eccentricAproxA(meanAnomaly);
        // const eccentricAnomaly = this.eccentricAproxB(meanAnomaly);
        const trueAnomaly = this.getTrueAnomalyA(eccentricAnomaly);
        this.visualizeEccentricAno(eccentricAnomaly);
        this.keplerOrbitPosition(trueAnomaly, this._testGREEN);
        // this.thanksSpaceStackExchangeOrbit(trueAnomaly);
        // Compare mean anomaly to true anomaly on the same orbit
        // this.keplerOrbitPosition(meanAnomaly, this._testBLUE);
    }

    /**
     * Newton's fixed point iterative approximation of eccentric anomaly
     * https://en.wikipedia.org/wiki/Kepler%27s_equation#Fixed-point_iteration
     * @param ma mean anomaly
     * @param n number of iteration
     * @returns {number} eccentric anomaly
     */
    newtonItEccentricAnomaly(ma, n) {
        const e = this._eccentricity;
        let ea = ma;
        for (let i = 0; i < n; i++) {
            ea = ma + e * Math.sin(ea);
        }
        return ea;
    }

    /**
     * https://en.wikipedia.org/wiki/True_anomaly#From_the_eccentric_anomaly
     * @param {number} ea eccentric anomaly (deg)
     */
    getTrueAnomalyA(ea) {
        const beta = this._eccentricity / (1 + Math.sqrt(1 - this._eccentricity * this._eccentricity));
        return ea + 2 * Math.atan((beta * Math.sin(ea) / (1 - beta * Math.cos(ea))));
    }

    /**
     * Compute the distance from the focal object and the orbiting body, then use the true anomaly to get X/Y positions.
     * https://en.wikipedia.org/wiki/True_anomaly#Radius_from_true_anomaly
     * @param {number} f true anomaly (deg)
     */
    keplerOrbitPosition(f, object) {
        const numerator = this._semiMajorAxis * (1 - this._eccentricity * this._eccentricity);
        const cos = Math.cos(f);
        const denominator = 1 + this._eccentricity * cos;
        const trueRadius = numerator / denominator;
        object.position.x = trueRadius * cos;
        object.position.y = trueRadius * Math.sin(f);
    }

    visualizeEccentricAno(ea) {
        const offset = this._eccentricity * this._semiMajorAxis;
        this._testRED.position.x = this._semiMajorAxis * Math.cos(ea) - offset;
        this._eccentricLine.position.x = this._testRED.position.x;
        this._testRED.position.y = this._semiMajorAxis * Math.sin(ea);
    }

    /**
     * Thanks chatGPt for pointing it to me, i just missed it on wikipedia
     * https://en.wikipedia.org/wiki/True_anomaly#From_the_eccentric_anomaly
     * @param ma
     * @returns {number}
     */
    getTrueAnomalyB(ma) {
        const e = this._eccentricity;
        const tanHalfNu = Math.sqrt((1 + e) / (1 - e)) * Math.tan(ma / 2);
        return 2 * Math.atan(tanHalfNu)
    }

    /**
     * ??
     * https://space.stackexchange.com/questions/52090/how-can-i-calculate-the-future-position-of-a-satellite-orbiting-a-central-body-a
     */
    thanksSpaceStackExchangeOrbit(ea) {
        this._testBLUE.position.x = this._semiMajorAxis * (this.cosd(ea) - this._eccentricity);
        this._testBLUE.position.y = this._semiMinorAxis * this.sind(ea);
    }

    /**
     * https://space.stackexchange.com/a/55358
     * @param ma mean anomaly, in DEGREE !
     * @returns {number} supposedly eccentric anomaly
     */
    eccentricAproxA(ma) {
        const e = this._eccentricity;
        return ma +
            (e - (1 / 8) * e * e * e) * this.sind(ma) +
            ((1 / 2) * e * e) * this.sind(2 * ma) +
            ((3 / 8) * e * e * e) * this.sind(3 * ma);
    }

    /**
     * @param ma mean anomaly, in DEGREE !
     * @returns {number} supposedly eccentric anomaly
     */
    eccentricAproxB(ma) {
        const e = this._eccentricity;
        const i0 = ma;
        const i1 = (2 * e - (1 / 4) * e * e * e) * this.sind(ma);
        const i2 = (5 / 4) * e * e * this.sind(2 * ma);
        const i3 = (13 / 12) * e * e * e * this.sind(3 * ma);
        return i0 + i1 + i2 + i3;
    }
}
