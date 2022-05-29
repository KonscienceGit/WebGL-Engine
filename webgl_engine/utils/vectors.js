class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return new Vec2(this.x, this.y);
    }

    copy(v2) {
        this.x = v2.x;
        this.y = v2.y;
    }

    setValues(x, y){
        this.x = x;
        this.y = y;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
    }

    equals(v2) {
        return (this.x === v2.x && this.y === v2.y);
    }

    distance(v2) {
        return Math.sqrt(this.distanceSquared(v2));
    }

    /**
     * Faster for computing intersections
     * @param v2
     * @returns {number}
     */
    distanceSquared(v2) {
        const dx = this.x - v2.x;
        const dy = this.y - v2.y;
        return dx * dx + dy * dy;
    }

    moveLeft(movement) {
        this.x -= movement;
    }

    moveRight(movement) {
        this.x += movement;
    }

    moveUp(movement) {
        this.y += movement;
    }

    moveDown(movement) {
        this.y -= movement;
    }
}

class Vec3 extends Vec2 {
    constructor(x, y, z) {
        super(x, y);
        this.z = z;
    }

    clone() {
        return new Vec3(this.x, this.y, this.z);
    }

    copy(v3) {
        super.copy(v3);
        this.z = v3.z;
    }

    setValues(x, y, z){
        super.setValues(x, y);
        this.z = z;
    }

    add(v) {
        super.add(v);
        this.z += v.z;
    }

    equals(v3) {
        return (super.equals(v3) && this.z === v3.z);
    }

    distance(v3) {
        let dx = this.x - v3.x;
        let dy = this.y - v3.y;
        let dz = this.z - v3.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
}

class Vec4 extends Vec3 {
    constructor(x, y, z, w) {
        super(x, y, z);
        this.w = w;
    }

    clone() {
        return new Vec4(this.x, this.y, this.z, this.w);
    }

    copy(v4) {
        super.copy(v4);
        this.w = v4.w;
    }

    setValues(x, y, z, w){
        super.setValues(x, y, z);
        this.w = w;
    }

    add(v) {
        super.add(v);
        this.w += v.w;
    }

    equals(v4) {
        return (super.equals(v4) && this.w === v4.w);
    }
}
