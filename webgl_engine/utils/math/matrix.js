/**
 * A 3x3 matrix meant to represent 2D operations:
 * X/Y translations,
 * X/Y scaling
 * rotation on the XY plane ("Z" axis)
 */
export class Matrix3 {
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
     * Make sure the matrix last row is 0, 0, 1 if using this manually, they are ignored to save on operations.
     * @param {Vec2} s scale
     * @param {number} r rotation
     * @param {Vec2} t translation
     */
    makeSRT(s, r, t) {
        const m = this.m;
        const cos = Math.cos(r);
        const sin = Math.sin(r);
        // Manually premultiply scale before rotation to save operations
        m[0] = s.x * cos;
        m[1] = s.y * -sin;
        m[2] = t.x; // translation
        m[3] = s.x * sin;
        m[4] = s.y * cos;
        m[5] = t.y; // translation
        // Save on (generally) unsed calculations
        // m[6] = 0;
        // m[7] = 0;
        // m[8] = 1;
    }

    /**
     * Transform an empty matrix (or identity matrix) into a rotation matrix.
     * Translation terms of the matrix will not be updated, do keep in mind.
     * @param {number} r rotation angle in radian, rotate counter-clockwise.
     */
    makeRotation(r) {
        // cos  | -sin  |   0
        // sin  |  cos  |   0
        //  0   |   0   |   1
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

    //    0 | 1 | 2
    //    3 | 4 | 5
    //    6 | 7 | 8

    /**
     * Set this matrix to be the product of the multiplication of this matrix and the parameter matrix.
     * This matrix being A, parameter matrix being B, this matrix will become the result matrix C such as:
     * A . B = C
     * @param {Matrix3} matB the parameter matrix
     */
    multiply(matB) {
        this.multMat(this, matB, this);
    }

    preMultiply(matB) {
        this.multMat(matB, this, this);
    }

    /**
     * Multiply matrices such that
     * A.B = C
     * Result is stored in C
     * @param {Matrix3} A
     * @param {Matrix3} B
     * @param {Matrix3} C
     */
    multMat(A, B, C) {
        const a = A.m;
        const b = B.m;
        const c = C.m;
        const v11 = a[0] * b[0] + a[1] * b[3] + a[2] * b[6];
        const v12 = a[0] * b[1] + a[1] * b[4] + a[2] * b[7];
        const v13 = a[0] * b[2] + a[1] * b[5] + a[2] * b[8];
        const v21 = a[3] * b[0] + a[4] * b[3] + a[5] * b[6];
        const v22 = a[3] * b[1] + a[4] * b[4] + a[5] * b[7];
        const v23 = a[3] * b[2] + a[4] * b[5] + a[5] * b[8];
        const v31 = a[6] * b[0] + a[7] * b[3] + a[8] * b[6];
        const v32 = a[6] * b[1] + a[7] * b[4] + a[8] * b[7];
        const v33 = a[6] * b[2] + a[7] * b[5] + a[8] * b[8];
        c[0] = v11;
        c[1] = v12;
        c[2] = v13;
        c[3] = v21;
        c[4] = v22;
        c[5] = v23;
        c[6] = v31;
        c[7] = v32;
        c[8] = v33;
    }

    /**
     * Apply this transformation to a point.
     * @param {Vec2} pt
     */
    applyToPosition(pt) {
        const m = this.m;
        const x = pt.x;
        const y = pt.y;
        pt.x = x * m[0] + y * m[1] + m[2];
        pt.y = x * m[3] + y * m[4] + m[5];
    }
}
