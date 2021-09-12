class GameState extends AbstractState {
    constructor(objectManager, gameBindings) {
        super();
        this._gameOverState = null;
        this._escapeState = null;
        this._physicStuffManager = new CollisionManager(objectManager, this);

        this._aliensSprites = objectManager.getAliens();
        this._aliensMissilesSprites = objectManager.getAliensMissiles();
        this._playerMissilesSprites = objectManager.getPlayerMissiles();
        this._spaceCraft = objectManager.getSpaceCraft();
        this._scoreCounter = objectManager.getScoreCounter();
        this._lifeCounter = objectManager.getLifeCounter();

        this._canvasDimRef = objectManager.getSpaceCraft()._canvasDim;

        this._deltaBetweenPlayerCanFire = 0.16;
        this._baseDifficulty = 0.7;

        // Set animations duration
        this.setAnimateInLength(1.0);
        this.setAnimateOutLength(0.0);// No animation

        // Bind closure context
        this.fireShipCallback = this.fireShipCallback.bind(this);
        this.moveShipLeftCallback = this.moveShipLeftCallback.bind(this);
        this.moveShipRightCallback = this.moveShipRightCallback.bind(this);
        this.moveShipToCursorCallback = this.moveShipToCursorCallback.bind(this);
        this.returnToMainMenuCallback = this.returnToMainMenuCallback.bind(this);

        this.registerBindings(gameBindings);
    }

    start(){
        this._moveLeft = false;
        this._moveRight = false;
        this._moveToCursor = false;
        this._moveToOrigin = 0;
        this._moveToDestination = 0;

        this._gameOver = false;
        this._XSpawnMargin = 100 + this._aliensSprites.getEntityProperties().renderSizeXY.x / 2;
        this._XSpawnRange = this._canvasDimRef.x - 2 * this._XSpawnMargin;

        this._spaceCraft.setLifeCount(3);
        this._spaceCraft.resetPosition();

        this._timeSinceLastPlayerMissile = 0;
        this._guiShift = this._canvasDimRef.x / 2;

        this._difficulty = this._baseDifficulty;
        this._scoreCounter.setScore(0);
        this._scoreCounter.resetPosition();
        this._scoreCounter.getReferencePosition().moveLeft(this._guiShift);

        this._lifeCounter.resetPosition();
        this._lifeCounter.setLifeCount(this._spaceCraft.getLifeCount());
        this._lifeCounter.getReferencePosition().moveRight(this._guiShift);

        this._aliensSprites.setVisible(true);
        this._aliensMissilesSprites.setVisible(true);
        this._playerMissilesSprites.setVisible(true);
        this._spaceCraft.setVisible(true);
        this._scoreCounter.setVisible(true);
        this._lifeCounter.setVisible(true);
    }

    finish() {
        this._physicStuffManager.release();
        this._aliensSprites.setVisible(false);
        this._aliensMissilesSprites.setVisible(false);
        this._playerMissilesSprites.setVisible(false);
        this._spaceCraft.setVisible(false);
        this._scoreCounter.setVisible(this._gameOver);
        this._lifeCounter.setVisible(false);

        this._scoreCounter.releaseFeedbackInstances();
    }

    setEscapeState(escapeState){
        this._escapeState = escapeState;
    }

    setGameOverState(gameOverState){
        this._gameOverState = gameOverState;
    }

    // fireInputAction(action, options) {// TODO remove, deprecated
    //     switch (action) {
    //         case GameInputActions.LEFT_HOLD:
    //             this._moveLeft = true;
    //             this._moveRight = false;
    //             this._moveToCursor = false;
    //             break;
    //         case GameInputActions.RIGHT_HOLD:
    //             this._moveRight = true;
    //             this._moveLeft = false;
    //             this._moveToCursor = false;
    //             break;
    //         case GameInputActions.CURSOR_AT:
    //             this.moveTo(options);
    //             break;
    //         case GameInputActions.CLICK_AT:
    //             this.moveTo(options);
    //             this.firePlayerMissile();
    //             break;
    //         case GameInputActions.ACTION:
    //         case GameInputActions.ACTION_HOLD:
    //             this.firePlayerMissile();
    //             break;
    //         case GameInputActions.RETURN:
    //             this.setReadyForNextState();
    //             break;
    //         default:
    //             break;
    //     }
    // }

    getNextState() {
        if(this._gameOver){
            return this._gameOverState;
        } else {
            return this._escapeState;
        }
    }

    mainLoop(delta) {
        this._timeSinceLastPlayerMissile += delta;
        this.spawnAliens();
        this.spawnMissiles();

        this._physicStuffManager.update(delta);
        this._lifeCounter.setLifeCount(this._spaceCraft.getLifeCount());
        if (this._spaceCraft.getLifeCount() <= 0) {
            this._gameOver = true;
            this.setReadyForNextState();
        }
        this.moveCraft(delta);
        this.consumeMovementEvents();
        this._difficulty = this._baseDifficulty + this._scoreCounter.getScore() / 100;
    }

    craftDirection() {
        if (this._moveLeft) {
            return -1;
        } else if (this._moveRight) {
            return 1;
        } else {
            return 0;
        }
    }

    moveTo(coords) {
        this._moveToOrigin = this._spaceCraft.getEntityProperties().position.x;
        this._moveToDestination = coords[0];
        const distance = this._moveToOrigin - this._moveToDestination;
        if (Math.abs(distance) >= 3)
            this._moveToCursor = true;
    }

    //Animate craft and score counter to slide into the game screen
    animateIn(delta, animationState) {
        if (this._spaceCraft.getRenderPosition().x > 0) {
            this._spaceCraft.moveAndAnimate(delta, -1);
        } else {
            this._spaceCraft.moveAndAnimate(0, 0);
        }
        const slideIn = this._guiShift * delta;
        this._scoreCounter.getReferencePosition().moveRight(slideIn);
        this._lifeCounter.getReferencePosition().moveLeft(slideIn);
    }

    animateOut(delta, animationState) {/* Nothing to animate */}

    spawnAliens() {
        const relativeThreat = this._aliensSprites.getInstances().length;
        if (relativeThreat < this._difficulty) {
            let alienType = Math.floor(Math.random() * this._aliensSprites.getImageCount());
            if(alienType === this._aliensSprites.getImageCount()) alienType--;
            const alien = this._aliensSprites.createNewInstance();
            this._aliensSprites.addInstance(alien);
            this.setRandomSpawnPosition(alien);
            alien.translationSpeed.y = -100;
            alien.translationSpeed.x =  (Math.random() - 0.5) * 100;
            alien.textureLayer = alienType;
        }
    }

    spawnMissiles() {
        const relativeThreat = this._aliensMissilesSprites.getInstances().length;
        if (relativeThreat < this._difficulty &&  this._aliensSprites.getInstances().length > 0) {
            const alien = this.getRandomAlien();

            const missile = this._aliensMissilesSprites.createNewInstance();
            this._aliensMissilesSprites.addInstance(missile);
            missile.position = alien.position.clone();
            missile.radius = 0; //smaller hit chance
            missile.translationSpeed.y = alien.translationSpeed.y -100;
        }
    }

    getRandomAlien(){
        const nbAlien = this._aliensSprites.getInstances().length;
        const i = Math.round(Math.random() * (nbAlien - 1));
        return this._aliensSprites.getInstances()[i];
    }

    setRandomSpawnPosition(entity) {
        entity.position.x = Math.random() * this._XSpawnRange - this._XSpawnRange / 2;
        entity.position.y = (this._canvasDimRef.y + entity.renderSizeXY.y) / 2;
    }

    consumeMovementEvents() {
        this._moveRight = false;
        this._moveLeft = false;
    }

    moveCraft(delta) {
        const distance = this._moveToOrigin - this._moveToDestination;
        if (this._moveToCursor) {
            const direction = distance > 0;
            this._moveLeft = direction;
            this._moveRight = !direction;
        }

        this._spaceCraft.updateSpaceCraft(delta, this.craftDirection());
        this._moveToOrigin = this._spaceCraft.getEntityProperties().position.x;

        if (this._moveToCursor) {
            const newDistance = this._moveToOrigin - this._moveToDestination;
            if (Math.abs(newDistance) < 1 || (distance * newDistance) < 0) {
                this._spaceCraft.getEntityProperties().position.x = this._moveToDestination;
                this._moveLeft = false;
                this._moveRight = false;
                this._moveToCursor = false;
            }
        }
    }

    firePlayerMissile() {
        if (this._timeSinceLastPlayerMissile < this._deltaBetweenPlayerCanFire) return;
        const missile = this._playerMissilesSprites.createNewInstance();
        this._playerMissilesSprites.addInstance(missile);
        missile.position = this._spaceCraft.getEntityProperties().position.clone();
        missile.radius = 0; //smaller hit chance
        missile.translationSpeed.y = 500;
        this._timeSinceLastPlayerMissile = 0;
    }

    fireShipCallback(){
        if(this.isInMainLoop()){
            this.firePlayerMissile();
        }
    }

    moveShipLeftCallback(){
        if(this.isInMainLoop()){
            this._moveLeft = true;
            this._moveRight = false;
            this._moveToCursor = false;
        }
    }

    moveShipRightCallback(){
        if(this.isInMainLoop()){
            this._moveLeft = false;
            this._moveRight = true;
            this._moveToCursor = false;
        }
    }

    moveShipToCursorCallback(){
        if(this.isInMainLoop()){
            // TODO implement mouse cursor binding input
            this.moveTo(options);
        }
    }

    returnToMainMenuCallback(){
        if(this.isInMainLoop()){
            this.setReadyForNextState();
        }
    }

    registerBindings(gameBindings){
        const self = this;
        const fireShip = gameBindings.getActionByName(GameInputActions.SHIP_FIRE);
        fireShip.addActionCallback(self.fireShipCallback);

        const moveLeft = gameBindings.getActionByName(GameInputActions.SHIP_LEFT);
        moveLeft.addActionCallback(self.moveShipLeftCallback);

        const moveRight = gameBindings.getActionByName(GameInputActions.SHIP_RIGHT);
        moveRight.addActionCallback(self.moveShipRightCallback);

        const moveToCursor = gameBindings.getActionByName(GameInputActions.SHIP_TO_CURSOR);
        moveToCursor.addActionCallback(self.moveShipToCursorCallback);

        const returnToMainMenu = gameBindings.getActionByName(GameInputActions.MENU_RETURN_TO_MAIN);
        returnToMainMenu.addActionCallback(self.returnToMainMenuCallback);

        //TODO do all other bindings
    }
}