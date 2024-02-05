class StellarBody extends Entity {
    /**
     * @param {object} data
     */
    constructor(data) {
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
        this._body = new PlanetShape(this._bodyRadius, color, this._formattedName);

        this.add(this._body);
        this.updateOrbit();
        // Debug visualization
        // this._eccentricLine = new Line([0, 0], [-1, 1], new Vec4(0.75, 0, 0, 1));
        // this.add(this._eccentricLine);
        // this.add(this.makeEccentricAnomalyCircle(renderer, 50));
        this.add(this.makeOrbitEllipse(50, color));
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
        return new Line(x, y, new Vec4(1, 0, 0, 1));
    }

    /**
     * Create the orbit line ellipse for visualization.
     * @param nbPts {number}
     * @param color {Vec4}
     * @returns {Line}
     */
    makeOrbitEllipse(nbPts, color) {
        const x = [];
        const y = [];
        for (let i = 0; i <= nbPts; i++) {
            const angle = i * 2 * Math.PI / nbPts;
            x.push(this._semiMajorAxis * (Math.cos(angle) - this._eccentricity));
            y.push(this._semiMajorAxis * Math.sqrt(1 - this._eccentricity * this._eccentricity) * Math.sin(angle));
        }
        return new Line(x, y, color);
    }

    updateEntity(delta) {
        super.updateEntity(delta);
        this._orbit += delta / this._orbitalPeriod;
        if (this._orbit >= 1) this._orbit--;
        this.updateOrbit();
    }

    /**
     * Reminder:
     *
     * Mean Anomaly: the body orbit position in radian, from 0 to 2 * PI.
     * It represent the body progression along its orbit, and is linear, no matter the eccentricity.
     *
     * Eccentric Anomaly: the angle of the body projected onto the auxillary circle.
     *
     * True anomaly: the angle of the body position on its orbit, using the focal object as the center or the angle measurement.
     */
    updateOrbit() {
        // TODO read http://www.braeunig.us/space/orbmech.htm#motions
        const meanAnomaly = this._orbit * 2 * Math.PI;
        const eccentricAnomaly = this.newtonItEccentricAnomaly(meanAnomaly, 3);
        // Simplest/fastest way if the true anomaly is not needed.
        this.keplerOrbitPositionEA(eccentricAnomaly, this._body);
        // const trueAnomaly = this.getTrueAnomalyA(eccentricAnomaly);
        // this.keplerOrbitPositionTA(trueAnomaly, this._testBLUE);
    }

    /**
     * Compute the approximate eccentric anomaly from the given mean anomaly and eccentricity.
     * This version uses Newton's fixed point iterative method.
     * https://en.wikipedia.org/wiki/Kepler%27s_equation#Fixed-point_iteration
     * @param ma mean anomaly, in radian.
     * @param n number of iteration
     * @returns {number} eccentric anomaly, in radian.
     */
    newtonItEccentricAnomaly(ma, n) {
        // TODO evaluate how the iteration count affect accuracy
        const e = this._eccentricity;
        let ea = ma;
        for (let i = 0; i < n; i++) {
            ea = ma + e * Math.sin(ea);
        }
        return ea;
    }

    /**
     * Compute the true anomaly, from the given eccentric anomaly and body eccentricity.
     * https://en.wikipedia.org/wiki/True_anomaly#From_the_eccentric_anomaly
     * @param {number} ea eccentric anomaly, in radian.
     * @returns the true anomaly, in radian.
     */
    getTrueAnomalyA(ea) {
        const e = this._eccentricity;
        const beta = e / (1 + Math.sqrt(1 - e * e));
        return ea + 2 * Math.atan((beta * Math.sin(ea) / (1 - beta * Math.cos(ea))));
    }

    /**
     * Compute the true anomaly, from the given eccentric anomaly and body eccentricity.
     * Difference from getTrueAnomalyA is of FP64 accuracy error (1^10-16)
     * https://en.wikipedia.org/wiki/True_anomaly#From_the_eccentric_anomaly
     * @param {number} ea eccentric anomaly, in radian.
     * @returns the true anomaly, in radian.
     */
    getTrueAnomalyB(ea) {
        // TODO test perf diff between method A and B
        const e = this._eccentricity;
        const tanHalfNu = Math.sqrt((1 + e) / (1 - e)) * Math.tan(ea / 2);
        return 2 * Math.atan(tanHalfNu)
    }

    /**
     * Compute the distance from the focal object and the orbiting body, then use the true anomaly to get X/Y positions.
     * https://en.wikipedia.org/wiki/True_anomaly#Radius_from_true_anomaly
     * @param {number} ta true anomaly, in radian.
     * @param body {PlanetShape} the body to apply the transformation on.
     */
    keplerOrbitPositionTA(ta, body) {
        const numerator = this._semiMajorAxis * (1 - this._eccentricity * this._eccentricity);
        const cos = Math.cos(ta);
        const denominator = 1 + this._eccentricity * cos;
        const trueRadius = numerator / denominator;
        body.position.x = trueRadius * cos;
        body.position.y = trueRadius * Math.sin(ta);
    }

    /**
     * Compute the x/y position based on the given eccentric anomaly.
     * This method uses the simplified Kepler method.
     * Measured precision difference to keplerOrbitPositionA is 1.33^10-15 (ie: 0.2 millimeter on the scale of earth's orbit.) Not sure which is the more accurate, this is probably a float accuracy error.
     * https://space.stackexchange.com/questions/52090/how-can-i-calculate-the-future-position-of-a-satellite-orbiting-a-central-body-a
     * @param ea {number} eccentric anomaly, in radian.
     * @param body {PlanetShape} the body to apply the transformation on.
     */
    keplerOrbitPositionEA(ea, body) {
        body.position.x = this._semiMajorAxis * (Math.cos(ea) - this._eccentricity);
        body.position.y = this._semiMinorAxis * Math.sin(ea);
    }

    /**
     * Visualize the given angle on a circular orbit, for debugging purpose.
     * @param angle {number} angle, in radian.
     * @param body {PlanetShape} the body to apply the transformation on.
     */
    visualizeAngle(angle, body) {
        const offset = this._eccentricity * this._semiMajorAxis;
        body.position.x = this._semiMajorAxis * Math.cos(angle) - offset;
        body.position.y = this._semiMajorAxis * Math.sin(angle);
    }
}
