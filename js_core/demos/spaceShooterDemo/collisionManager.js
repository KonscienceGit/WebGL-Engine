class CollisionManager {
    /**
     * @param {GameObjectsManager} objectManager
     * @param {GameState} gameState
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
        this._oneMeter = 0.05 * this._spaceCraft.renderSizeXY.y;// 1 meter size, in pixels

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
        this._aliens.release();
        this._aliensMissiles.setVisible(false);
        this._aliensMissiles.release();
        this._playerMissiles.setVisible(false);
        this._playerMissiles.release();
    }

    /**
     * @param {MultiSprite} objects
     * @param {boolean} reachBottomHurt
     * @param {number} delta
     */
    updatePhysics(objects, delta, reachBottomHurt) {
        let objectStayOnScreen = [];
        objects.getInstances().forEach(object => {
            this.applyMovement(object, delta);
            // this.applyGravity(fallingEntity, delta);
            // this.applyAirDrag(fallingEntity, delta);

            const moveDown = object.translationSpeed.y < 0;

            //touch bottom
            if (moveDown && object.position.y >= this._screenBottomY - object.renderSizeXY.y) {
                objectStayOnScreen.push(object);
            } else if (reachBottomHurt) {
                this._spaceCraft.looseOneLife();
            }

            //touch top
            if (!moveDown && object.position.y <= this._screenTopY + object.renderSizeXY.y) {
                objectStayOnScreen.push(object);
            }

            //touch right
            if(object.position.x > this._screenLimitX){
                object.position.x = this._screenLimitX;
                object.translationSpeed.x *= -1;
            }

            //touch left
            if(object.position.x < -this._screenLimitX){
                object.position.x = -this._screenLimitX;
                object.translationSpeed.x *= -1;
            }
        });
        objects.setInstances(objectStayOnScreen);
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
        let objectStayOnScreen = [];
        objects.getInstances().forEach(object => {
            if (this._spaceCraft.intersect(object)) {
                this._spaceCraft.looseOneLife();
            } else {
                objectStayOnScreen.push(object);
            }
        });
        objects.setInstances(objectStayOnScreen);
    }

    updatePlayerMissilesCollisions() {
        let missiles = this._playerMissiles.getInstances().slice();
        let aliens = this._aliens.getInstances().slice();
        for (let m = 0; m < this._playerMissiles.getInstances().length; m++) {
            if (missiles[m] === undefined) continue;
            for (let a = 0; a < this._aliens.getInstances().length; a++) {
                if (aliens[a] === undefined) continue;
                if (missiles[m].intersect(aliens[a])) {
                    this._scoreCounter.createScoreFeedbackAt(aliens[a], 10);
                    delete missiles[m];
                    delete aliens[a];
                    break;
                }
            }
        }
        let missilesLeft = [];
        missiles.forEach(m => {
            if (m !== undefined) missilesLeft.push(m);
        });
        let aliensLeft = [];
        aliens.forEach(a => {
            if (a !== undefined) aliensLeft.push(a);
        });

        this._playerMissiles.setInstances(missilesLeft);
        this._aliens.setInstances(aliensLeft);
    }
}