class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return new Vec2(this.x, this.y);
    }

    copy(v) {
        this.x = v.x;
        this.y = v.y;
    }

    setValues(x, y){
        this.x = x;
        this.y = y;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
    }

    equals(v) {
        return (this.x === v.x && this.y === v.y);
    }

    /**
     * Faster for computing intersections
     * @param v
     * @returns {number}
     */
    distanceSquared(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return dx * dx + dy * dy;
    }

    distance(v) {
        return Math.sqrt(this.distanceSquared(v));
    }

    getArray(a) {
        a[0] = this.x;
        a[1] = this.y;
        return a;
    }

    moveLeft(d) {
        this.x -= d;
    }

    moveRight(d) {
        this.x += d;
    }

    moveUp(d) {
        this.y += d;
    }

    moveDown(d) {
        this.y -= d;
    }
}

class Vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    clone() {
        return new Vec3(this.x, this.y, this.z);
    }

    copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
    }

    setValues(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
    }

    equals(v) {
        return (this.x === v.x && this.y === v.y && this.z === v.z);
    }

    distanceSquared(v) {
        let dx = this.x - v.x;
        let dy = this.y - v.y;
        let dz = this.z - v.z;
        return dx * dx + dy * dy + dz * dz;
    }

    distance(v) {
        return Math.sqrt(this.distanceSquared(v));
    }

    getArray(a) {
        a[0] = this.x;
        a[1] = this.y;
        a[2] = this.z;
        return a;
    }
}

class Vec4 {
    constructor(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    clone() {
        return new Vec4(this.x, this.y, this.z, this.w);
    }

    copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = v.w;
    }

    setValues(x, y, z, w){
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        this.w += v.w;
    }

    equals(v) {
        return (this.x === v.x && this.y === v.y && this.w === v.w);
    }

    getArray(a) {
        a[0] = this.x;
        a[1] = this.y;
        a[2] = this.z;
        a[3] = this.w;
        return a;
    }
}
