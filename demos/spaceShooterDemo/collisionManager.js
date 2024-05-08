export class CollisionManager {
    /**
     * @param {SpaceShooterObjectsManager} objectManager
     * @param {MainGameState} gameState
     * @param {Vec2} screenSize
     */
    constructor(objectManager, gameState, screenSize) {
        this._aliens = objectManager.getAliens();
        this._aliensMissiles = objectManager.getAliensMissiles();
        this._playerMissiles = objectManager.getPlayerMissiles();
        this._spaceCraft = objectManager.getSpaceCraft();
        this._scoreCounter = objectManager.getScoreCounter();

        this._gravity = 0.;
        this._airDensity = 0.;
        this._oneMeter = 0.05 * this._spaceCraft.size.y;// 1 meter size, in pixels

        this._screenBottomY = -0.5 * screenSize.y;
        this._screenTopY = 0.5 * screenSize.y;
        this._screenLimitX = 0.5 * screenSize.x;
    }

    update(delta) {
        this.updatePhysics(this._aliens, delta, true);
        this.updatePhysics(this._aliensMissiles, delta, false);
        this.updatePhysics(this._playerMissiles, delta, false);
        this.updatePlayerCollisions(this._aliens);
        this.updatePlayerCollisions(this._aliensMissiles);
        this.updatePlayerMissilesCollisions();
    }

    release() {
        this._aliens.setVisible(false);
        this._aliens.childrenNodes = [];
        this._aliensMissiles.setVisible(false);
        this._aliensMissiles.childrenNodes = [];
        this._playerMissiles.setVisible(false);
        this._playerMissiles.childrenNodes = [];
    }

    /**
     * @param {Entity} objects
     * @param {boolean} reachBottomHurt
     * @param {number} delta
     */
    updatePhysics(objects, delta, reachBottomHurt) {
        const objectStayOnScreen = [];
        objects.childrenNodes.forEach(object => {
            this.applyMovement(object, delta);
            const moveDown = object.translationSpeed.y < 0;

            //touch bottom
            if (moveDown && object.position.y >= this._screenBottomY - object.size.y) {
                objectStayOnScreen.push(object);
            } else if (reachBottomHurt) {
                this._spaceCraft.looseOneLife();
            }

            //touch top
            if (!moveDown && object.position.y <= this._screenTopY + object.size.y) {
                objectStayOnScreen.push(object);
            }

            //touch right
            if (object.position.x > this._screenLimitX) {
                object.position.x = this._screenLimitX;
                object.translationSpeed.x *= -1;
            }

            //touch left
            if (object.position.x < -this._screenLimitX) {
                object.position.x = -this._screenLimitX;
                object.translationSpeed.x *= -1;
            }
        });
        objects.childrenNodes = objectStayOnScreen;
    }

    applyMovement(entity, delta) {
        entity.rotation += delta * entity.rotationSpeed;
        entity.position.x += delta * entity.translationSpeed.x;
        entity.position.y += delta * entity.translationSpeed.y;
    }

    applyGravity(entity, delta) {
        entity.translationSpeed.y -= delta * this._gravity * this._oneMeter;
    }

    applyAirDrag(entity, delta) {
        entity.translationSpeed.x = this.getNewSpeedAfterAirDrag(entity, delta, entity.translationSpeed.x);
        entity.translationSpeed.y = this.getNewSpeedAfterAirDrag(entity, delta, entity.translationSpeed.y);
    }

    getNewSpeedAfterAirDrag(entity, delta, speedValue) {
        // drag = relativeSurface * speed² / (2 * density)
        const sign = speedValue > 0 ? 1 : -1;
        const absSpeed = Math.abs(speedValue);
        const normalizedSpeed = absSpeed / this._oneMeter;
        const airDrag = this._oneMeter * this._airDensity * entity.relativeSurface * normalizedSpeed * normalizedSpeed / (2 * entity.density);
        if (airDrag > absSpeed) return 0;
        return sign * (absSpeed - airDrag);
    }

    updatePlayerCollisions(objects) {
        const objectStayOnScreen = [];
        objects.childrenNodes.forEach(object => {
            if (this._spaceCraft.intersect(object)) {
                this._spaceCraft.looseOneLife();
            } else {
                objectStayOnScreen.push(object);
            }
        });
        objects.childrenNodes = objectStayOnScreen;
    }

    updatePlayerMissilesCollisions() {
        const missiles = this._playerMissiles.childrenNodes.slice();
        const aliens = this._aliens.childrenNodes.slice();
        for (let m = 0; m < this._playerMissiles.childrenNodes.length; m++) {
            if (missiles[m] === undefined) continue;
            for (let a = 0; a < this._aliens.childrenNodes.length; a++) {
                if (aliens[a] === undefined) continue;
                if (missiles[m].intersect(aliens[a])) {
                    this._scoreCounter.createScoreFeedbackAt(aliens[a], 10);
                    delete missiles[m];
                    delete aliens[a];
                    break;
                }
            }
        }
        const missilesLeft = [];
        missiles.forEach(m => missilesLeft.push(m));
        const aliensLeft = [];
        aliens.forEach(a => aliensLeft.push(a));

        this._playerMissiles.childrenNodes = missilesLeft;
        this._aliens.childrenNodes = aliensLeft;
    }
}
