// @formatter:off
const MAP = {
    'SOL': {
        'MERCURY': {},
        'VENUS': {},
        'TERRA': {
            'LUNA': {}
        },
        'MARS': {},
        'JUPITER': {},
        'SATURN': {
            'SATURNRINGS': {}
        },
            'URANUS': {},
        'NEPTUNE': {}
    }
};
// @formatter:on

const DATA_OLD = {
    /** Name used in the MAP */
    indexName: ['SOL', 'MERCURY', 'VENUS', 'TERRA', 'MARS', 'JUPITER', 'SATURN', 'URANUS', 'NEPTUNE', 'LUNA', 'SATURNRINGS'],
    /** Name used in the view */
    formattedName: ['Sol', 'Mercury', 'Venus', 'Terra', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Luna', 'Saturn Rings'],
    /** Body radius in km */
    bodyRadius: [695700.0, 2439.7, 6051.8, 6371.0, 3389.5, 69911.0, 58232.0, 25362.0, 24622.0, 1737.1, 62117.0],
    /** Body inner radius in km (for belts) */
    ringInnerRadius: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 74658.0],
    /** Longitude of the ascending node of the orbit in degree */
    ascendingNode: [0.0, 48.331, 76.680, -11.26064, 49.558, 100.464, 113.665, 74.006, 131.784, 0.0, 0.0],
    /** Orbital Inclination, relative to the invariable plane (the system barycenter), excepted for satellites where it's relative to the parent's ecliptic */
    orbitalIncli: [0.0, 6.34, 2.19, 1.57, 1.67, 0.32, 0.93, 1.02, 0.72, 5.145, 0.0],
    /** Argument of Periapsis */
    argumPeriapsis: [0.0, 29.124, 54.884, 114.20783, 286.502, 273.867, 339.392, 96.998857, 276.336, 0.0, 0.0],
    /** Sidereal Orbital period in days */
    orbitalPeriod: [1.0, 87.9691, 224.701, 365.256363004, 686.971, 4332.59, 10759.22, 30688.5, 60182.0, 27.321661, 1.0],
    /** Eccentricity of the elliptical orbit */
    eccentricity: [0.0, 0.205630, 0.006772, 0.0167086, 0.0934, 0.0489, 0.0565, 0.046381, 0.009456, 0.0549, 0.0],
    /** Axial tilt of the body in degree, relative to its orbit plane */
    axialTilt: [7.25, 0.034, 177.36, 23.4392811, 25.15, 3.13, 26.73, 97.77, 28.32, 6.687, 26.73],
    /** Sidereal Rotation period */
    rotationPeriod: [25.05, 58.646, 243.025, 0.99726968, 1.025957, 0.4135416667, 0.439583, 0.71833, 0.6713, 27.321661, 0.439583],
    /** RGB color  */
    color: [[1.0, 1.0, 0.1], [0.6, 0.6, 0.6], [0.95, 0.81, 0.44], [0.0, 0.3, 1.0], [1.0, 0.51, 0.33], [1.0, 0.7, 0.4], [1.0, 0.88, 0.53], [0.8, 1.0, 1.0], [0.28, 0.4, 1.0], [0.5, 0.5, 0.5], [1.0, 0.88, 0.53]],
    /** The type of celestial object, 0 is the skybox, 1 is a star, 2 is a planet, 3 is an asteroid belt */
    bodyType: [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3]
};

// indexName       Name used in the MAP
// formattedName   Name used in the view
// bodyRadius      Body radius in km
// ringInnerRadius Body inner radius in km (for belts)
// semiMajorAxis   Average distance from orbited body (average orbit radius) in km
// ascendingNode   Longitude of the ascending node of the orbit in degree
// orbitalIncli    Orbital Inclination, relative to the invariable plane (the system barycenter), excepted for satellites where it's relative to the parent's ecliptic
// argumPeriapsis  Argument of Periapsis
// orbitalPeriod   Sidereal Orbital period in days
// eccentricity    Eccentricity of the elliptical orbit
// axialTilt       Axial tilt of the body in degree, relative to its orbit plane
// rotationPeriod  Sidereal Rotation period
// color           RGB color
// bodyType        The type of celestial object, 0 is the skybox, 1 is a star, 2 is a planet, 3 is an asteroid belt
const DATA = {
    SOL: {
        indexName: 'SOL',
        formattedName: 'Sol',
        bodyRadius: 695700,
        ringInnerRadius: 0,
        semiMajorAxis: 0,
        ascendingNode: 0,
        orbitalIncli: 0,
        argumPeriapsis: 0,
        orbitalPeriod: 1,
        eccentricity: 0,
        axialTilt: 7.25,
        rotationPeriod: 25.05,
        color: [1, 1, 0.1],
        bodyType: 'star'
    },
    MERCURY: {
        indexName: 'MERCURY',
        formattedName: 'Mercury',
        bodyRadius: 2439.7,
        ringInnerRadius: 0,
        semiMajorAxis: 57.9 * 1e6,
        ascendingNode: 48.331,
        orbitalIncli: 6.34,
        argumPeriapsis: 29.124,
        orbitalPeriod: 87.9691,
        eccentricity: 0.20563,
        axialTilt: 0.034,
        rotationPeriod: 58.646,
        color: [0.6, 0.6, 0.6],
        bodyType: 'planet'
    },
    VENUS: {
        indexName: 'VENUS',
        formattedName: 'Venus',
        bodyRadius: 6051.8,
        ringInnerRadius: 0,
        semiMajorAxis: 108.2 * 1e6,
        ascendingNode: 76.68,
        orbitalIncli: 2.19,
        argumPeriapsis: 54.884,
        orbitalPeriod: 224.701,
        eccentricity: 0.006772,
        axialTilt: 177.36,
        rotationPeriod: 243.025,
        color: [0.95, 0.81, 0.44],
        bodyType: 'planet'
    },
    TERRA: {
        indexName: 'TERRA',
        formattedName: 'Terra',
        bodyRadius: 6371,
        ringInnerRadius: 0,
        semiMajorAxis: 149.6 * 1e6,
        ascendingNode: -11.26064,
        orbitalIncli: 1.57,
        argumPeriapsis: 114.20783,
        orbitalPeriod: 365.256363004,
        eccentricity: 0.0167086,
        axialTilt: 23.4392811,
        rotationPeriod: 0.99726968,
        color: [0, 0.3, 1],
        bodyType: 'planet'
    },
    LUNA: {
        indexName: 'LUNA',
        formattedName: 'Luna',
        bodyRadius: 1737.1,
        ringInnerRadius: 0,
        semiMajorAxis: 0.384 * 1e6,
        ascendingNode: 0,
        orbitalIncli: 5.145,
        argumPeriapsis: 0,
        orbitalPeriod: 27.321661,
        eccentricity: 0.0549,
        axialTilt: 6.687,
        rotationPeriod: 27.321661,
        color: [0.5, 0.5, 0.5],
        bodyType: 'planet'
    },
    MARS: {
        indexName: 'MARS',
        formattedName: 'Mars',
        bodyRadius: 3389.5,
        ringInnerRadius: 0,
        semiMajorAxis: 228 * 1e6,
        ascendingNode: 49.558,
        orbitalIncli: 1.67,
        argumPeriapsis: 286.502,
        orbitalPeriod: 686.971,
        eccentricity: 0.0934,
        axialTilt: 25.15,
        rotationPeriod: 1.025957,
        color: [1, 0.51, 0.33],
        bodyType: 'planet'
    },
    JUPITER: {
        indexName: 'JUPITER',
        formattedName: 'Jupiter',
        bodyRadius: 69911,
        ringInnerRadius: 0,
        semiMajorAxis: 778.5 * 1e6,
        ascendingNode: 100.464,
        orbitalIncli: 0.32,
        argumPeriapsis: 273.867,
        orbitalPeriod: 4332.59,
        eccentricity: 0.0489,
        axialTilt: 3.13,
        rotationPeriod: 0.4135416667,
        color: [1, 0.7, 0.4],
        bodyType: 'planet'
    },
    SATURN: {
        indexName: 'SATURN',
        formattedName: 'Saturn',
        bodyRadius: 58232,
        ringInnerRadius: 0,
        semiMajorAxis: 1432 * 1e6,
        ascendingNode: 113.665,
        orbitalIncli: 0.93,
        argumPeriapsis: 339.392,
        orbitalPeriod: 10759.22,
        eccentricity: 0.0565,
        axialTilt: 26.73,
        rotationPeriod: 0.439583,
        color: [1, 0.88, 0.53],
        bodyType: 'planet'
    },
    SATURNRINGS: {
        indexName: 'SATURNRINGS',
        formattedName: 'Saturn Rings',
        // TODO need visual representation
        // bodyRadius: 62117,
        bodyRadius: 621,
        ringInnerRadius: 74658,
        semiMajorAxis: 0,
        ascendingNode: 0,
        orbitalIncli: 0,
        argumPeriapsis: 0,
        orbitalPeriod: 1,
        eccentricity: 0,
        axialTilt: 26.73,
        rotationPeriod: 0.439583,
        color: [1, 0.88, 0.53],
        bodyType: 'belt'
    },
    URANUS: {
        indexName: 'URANUS',
        formattedName: 'Uranus',
        bodyRadius: 25362,
        ringInnerRadius: 0,
        semiMajorAxis: 2867 * 1e6,
        ascendingNode: 74.006,
        orbitalIncli: 1.02,
        argumPeriapsis: 96.998857,
        orbitalPeriod: 30688.5,
        eccentricity: 0.046381,
        axialTilt: 97.77,
        rotationPeriod: 0.71833,
        color: [0.8, 1, 1],
        bodyType: 'planet'
    },
    NEPTUNE: {
        indexName: 'NEPTUNE',
        formattedName: 'Neptune',
        bodyRadius: 24622,
        ringInnerRadius: 0,
        semiMajorAxis: 4515 * 1e6,
        ascendingNode: 131.784,
        orbitalIncli: 0.72,
        argumPeriapsis: 276.336,
        orbitalPeriod: 60182,
        eccentricity: 0.009456,
        axialTilt: 28.32,
        rotationPeriod: 0.6713,
        color: [0.28, 0.4, 1],
        bodyType: 'planet'
    },

};

export class SolarSystem {
    static getMap() {
        return MAP;
    }

    static getData() {
        return DATA;
    }
}
