/**
 * A 3x3 matrix meant to represent 2D operations:
 * X/Y translations,
 * X/Y scaling
 * rotation on the XY plane ("Z" axis)
 */
class Matrix3 {
    constructor() {
        this.m = new Float32Array(9);
        this.m[0] = 1;
        this.m[4] = 1;
        this.m[8] = 1;
    }

    makeIdentity() {
        const m = this.m;
        m[0] = 1;
        m[1] = 0;
        m[2] = 0;
        m[3] = 0;
        m[4] = 1;
        m[5] = 0;
        m[6] = 0;
        m[7] = 0;
        m[8] = 1;
    }

    /**
     * Compute the SRT (Scale Rotation Translation) matrix (previous matrix transformations will not be taken into account).
     * @param {Vec2} s scale
     * @param {number} r rotation
     * @param {Vec2} t translation
     */
    makeSRT(s, r, t) {
        const m = this.m;
        // Identity + scale
        m[0] = s.x;
        m[1] = 0;
        m[2] = 0;
        m[3] = 0;
        m[4] = s.y;
        m[5] = 0;
        m[6] = 0;
        m[7] = 0;
        m[8] = 1;

        // Rotation
        const cos = Math.cos(r);
        const sin = Math.sin(r);
        m[0] *= cos;
        m[1] *= -sin;
        m[3] *= sin;
        m[4] *= cos;
        //
        // Translation
        m[2] += t.x;
        m[5] += t.y;
    }

    /**
     * Transform an empty matrix (or identity matrix) into a rotation matrix.
     * Translation terms of the matrix will not be updated, do keep in mind.
     * @param {number} r rotation angle in radian, rotate counter-clockwise.
     */
    makeRotation(r) {
        // cos * x | -sin * y |    0
        // sin * x |  cos * y |    0
        //    0    |     0    |    1
        const cos = Math.cos(r);
        const sin = Math.sin(r);
        const m = this.m;
        m[0] = cos;
        m[1] = -sin;
        m[2] = 0;
        m[3] = sin;
        m[4] = cos;
        m[5] = 0;
        m[6] = 0;
        m[7] = 0;
        m[8] = 1;
    }

    /**
     * @param {number} x
     * @param {number} y
     */
    makeTranslation(x, y) {
        // 1 | 0 | x
        // 0 | 1 | y
        // 0 | 0 | 1
        this.m[2] = x;
        this.m[5] = y;
    }

    /**
     * @param {number} x
     * @param {number} y
     */
    makeScale(x, y) {
        // x | 0 | 0
        // 0 | y | 0
        // 0 | 0 | 1
        this.m[0] = x;
        this.m[4] = y;
    }

    /**
     * @returns {Matrix3}
     */
    clone() {
        const newMat = new Matrix3();
        newMat.copy(this);
        return newMat;
    }

    /**
     * @param {Matrix3} other
     */
    copy(other) {
        const o = other.m;
        const m = this.m;
        for (let i = 0; i < 9; i++) m[i] = o[i];
    }
}
