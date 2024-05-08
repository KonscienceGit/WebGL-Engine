import {Sprite} from "../../../webgl_engine/graphics/renderables/sprites/sprite.js";

const PRECISION = 32;

function makeIndices() {
    // For PRECISION triangles in the circle, there are PRECISION points on the circle, plus one point in the center.
    // vertice 0 is center
    // vertice 1 is first circle point
    // vertice PRECISION is the last circle point
    const idxs = new Uint8Array(3 * PRECISION);
    for (let i = 0; i < PRECISION - 1; i++) {
        const index = 3 * i;
        idxs[index] = 0;
        idxs[index + 1] = i + 1;
        idxs[index + 2] = i + 2;
    }
    // last triangle made by last circle point and first circle point
    const lastIndex = (PRECISION - 1) * 3;
    idxs[lastIndex] = 0;
    idxs[lastIndex + 1] = PRECISION;
    idxs[lastIndex + 2] = 1;
    return idxs;
}

const PLANET_INDICES = makeIndices();

export class PlanetShape extends Sprite {
    /**
     * @param {number} radius
     * @param {Vec4} color
     * @param {string} name
     */
    constructor(radius, color, name) {
        super({
            color: color,
            name: name
        });
        this.setIndices(PLANET_INDICES);
        this.generateVertices(radius);
    }

    // TODO make custom class and shader

    /**
     * Generate the planet vertex data.
     * @param {number} radius
     */
    generateVertices(radius) {
        const nbVerts = PRECISION + 1;
        const nbValues = nbVerts * 4; // X, Y, U, V (todo: remove UV)
        const verts = new Float32Array(nbValues);
        const u = 0;
        const v = 0;
        // Center
        verts[0] = 0;
        verts[1] = 0;
        verts[2] = u;
        verts[3] = v;
        const piIncr = (2 * Math.PI) / PRECISION;
        for (let i = 0; i < PRECISION; i++) {
            const angle = i * piIncr;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const pos = 4 + i * 4;
            verts[pos] = x;
            verts[pos + 1] = y;
            verts[pos + 2] = u;
            verts[pos + 3] = v;
        }
        this.setVertices(verts);
    }
}
