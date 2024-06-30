/**
 * A 3x3 matrix meant to represent 2D operations:
 * X/Y translations,
 * X/Y scaling
 * rotation on the XY plane ("Z" axis)
 */
export class Matrix3 {
    constructor() {
        this.m = new Float32Array(9);
        this.m[0] = 1; // Float array is initialized to 0
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
     * Reset this matrix and set its SRT (Scale Rotation Translation) components.<br>
     * This method is faster than multiplying separately scale, rotation and translation matrices.
     * @param {Vec2} s scale
     * @param {number} r rotation
     * @param {Vec2} t translation
     */
    makeSRT(s, r, t) {
        this.makeIdentity();
        this.setSRT(s, r, t);
    }

    /**
     * Set the SRT (Scale Rotation Translation) matrix components.<br>
     * The matrix last row will be left unchanged, please make sure it was 0, 0, 1, or use makeSRT() instead.<br>
     * This method is much faster than multiplying separately scale, rotation and translation matrices.
     * @param {Vec2} s scale
     * @param {number} r rotation
     * @param {Vec2} t translation
     */
    setSRT(s, r, t) {
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
        // m[6] = 0;
        // m[7] = 0;
        // m[8] = 1;
    }

    /**
     * Transform this matrix into a rotation matrix.<br>
     * @param {number} r rotation angle in radian, rotate counter-clockwise.
     */
    makeRotation(r) {
        this.makeIdentity();
        this.setRotation(r);
    }

    /**
     * Set the rotation components of this matrix.<br>
     * Scale and previous rotation are overwritten, but not translations.<br>
     * Please use makeRotation() to reset the entire matrix before applying the rotation.
     * @param {number} r rotation angle in radian, rotate counter-clockwise.
     */
    setRotation(r) {
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
     * Reset this matrix as an identity matrix, then apply the given x/y translation.
     * @param {number} x
     * @param {number} y
     */
    makeTranslation(x, y) {
        this.makeIdentity();
        this.setTranslation(x, y);
    }

    /**
     * @param {number} x
     * @param {number} y
     */
    setTranslation(x, y) {
        // 1 | 0 | x
        // 0 | 1 | y
        // 0 | 0 | 1
        this.m[2] = x;
        this.m[5] = y;
    }

    /**
     * Reset this matrix as an identity matrix, then apply the given x/y scale.
     * @param {number} x
     * @param {number} y
     */
    makeScale(x, y) {
       this.makeIdentity();
       this.setScale(x, y);
    }

    /**
     * Modify the scale component of this matrix.<br>
     * Does NOT reset the matrix, only modify the scale component. For this, use makeScale() instead.
     * @param {number} x
     * @param {number} y
     */
    setScale(x, y) {
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
