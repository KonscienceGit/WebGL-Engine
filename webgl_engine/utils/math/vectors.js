export class Vec2 {
    constructor(x, y) {
        this.x = x == null ? 0 : x;
        this.y = y == null ? 0 : y;
    }

    clone() {
        return new Vec2(this.x, this.y);
    }

    copy(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    setValues(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    mul(v) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    }

    mulScalar(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }

    /**
     * Divide this vector by the given vector
     */
    div(v) {
        this.x /= v.x;
        this.y /= v.y;
        return this;
    }

    divScalar(s) {
        this.x /= s;
        this.y /= s;
        return this;
    }

    equals(v) {
        return (this.x === v.x && this.y === v.y);
    }

    distanceSquared(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return dx * dx + dy * dy;
    }

    distance(v) {
        return Math.sqrt(this.distanceSquared(v));
    }

    toArray(a) {
        a[0] = this.x;
        a[1] = this.y;
        return a;
    }

    moveLeft(d) {
        this.x -= d;
        return this;
    }

    moveRight(d) {
        this.x += d;
        return this;
    }

    moveUp(d) {
        this.y += d;
        return this;
    }

    moveDown(d) {
        this.y -= d;
        return this;
    }

    lerp(v1, v2, p) {
        this.x = v1.x * (1 - p) + v2.x * p;
        this.y = v1.y * (1 - p) + v2.y * p;
        return this;
    }
}

export class Vec3 {
    constructor(x, y, z) {
        this.x = x == null ? 0 : x;
        this.y = y == null ? 0 : y;
        this.z = z == null ? 0 : z;
    }

    clone() {
        return new Vec3(this.x, this.y, this.z);
    }

    copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }

    setValues(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    equals(v) {
        return (this.x === v.x && this.y === v.y && this.z === v.z);
    }

    distanceSquared(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        const dz = this.z - v.z;
        return dx * dx + dy * dy + dz * dz;
    }

    distance(v) {
        return Math.sqrt(this.distanceSquared(v));
    }

    toArray(a) {
        a[0] = this.x;
        a[1] = this.y;
        a[2] = this.z;
        return a;
    }

    lerp(v1, v2, p) {
        this.x = v1.x * (1 - p) + v2.x * p;
        this.y = v1.y * (1 - p) + v2.y * p;
        this.z = v1.z * (1 - p) + v2.z * p;
        return this;
    }
}

export class Vec4 {
    constructor(x, y, z, w) {
        this.x = x == null ? 0 : x;
        this.y = y == null ? 0 : y;
        this.z = z == null ? 0 : z;
        this.w = w == null ? 0 : w;
    }

    clone() {
        return new Vec4(this.x, this.y, this.z, this.w);
    }

    copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = v.w;
        return this;
    }

    setValues(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        return this;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        this.w += v.w;
        return this;
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        this.w -= v.w;
        return this;
    }

    equals(v) {
        return (this.x === v.x && this.y === v.y && this.w === v.w);
    }

    toArray(a) {
        a[0] = this.x;
        a[1] = this.y;
        a[2] = this.z;
        a[3] = this.w;
        return a;
    }

    fromArray(a) {
        this.x = a[0];
        this.y = a[1];
        this.z = a[2];
        this.w = a[3];
        return this;
    }

    lerp(v1, v2, p) {
        this.x = v1.x * (1 - p) + v2.x * p;
        this.y = v1.y * (1 - p) + v2.y * p;
        this.z = v1.z * (1 - p) + v2.z * p;
        this.w = v1.w * (1 - p) + v2.w * p;
        return this;
    }
}
