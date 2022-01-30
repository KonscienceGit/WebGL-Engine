class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return new Vec2(this.x, this.y);
    }

    copy(otherVec) {
        this.x = otherVec.x;
        this.y = otherVec.y;
    }

    setValues(x, y){
        this.x = x;
        this.y = y;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
    }

    equals(anotherVec2) {
        return (this.x === anotherVec2.x && this.y === anotherVec2.y);
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

    copy(otherVec) {
        super.copy(otherVec);
        this.z = otherVec.z;
    }

    setValues(x, y, z){
        super.setValues(x, y);
        this.z = z;
    }

    add(v) {
        super.add(v);
        this.z += v.z;
    }

    equals(anotherVec3) {
        return (super.equals(anotherVec3) && this.z === anotherVec3.z);
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

    copy(anotherVec4) {
        super.copy(anotherVec4);
        this.w = anotherVec4.w;
    }

    setValues(x, y, z, w){
        super.setValues(x, y, z);
        this.w = w;
    }

    add(v) {
        super.add(v);
        this.w += v.w;
    }

    equals(anotherVec4) {
        return (super.equals(anotherVec4) && this.w === anotherVec4.w);
    }
}