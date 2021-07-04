class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return new Vec2(this.x, this.y);
    }

    set(otherVec) {
        this.x = otherVec.x;
        this.y = otherVec.y;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
    }

    distance(anotherVec2) {
        let dx = this.x - anotherVec2.x;
        let dy = this.y - anotherVec2.y;
        return Math.sqrt(dx * dx + dy * dy);
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

    set(otherVec) {
        super.set(otherVec);
        this.z = otherVec.z;
    }

    add(v) {
        super.add(v);
        this.z += v.z;
    }

    distance(anotherVec3) {
        let dx = this.x - anotherVec3.x;
        let dy = this.y - anotherVec3.y;
        let dz = this.z - anotherVec3.z;
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

    set(otherVec) {
        super.set(otherVec);
        this.w = otherVec.w;
    }

    add(v) {
        super.add(v);
        this.w += v.w;
    }
}