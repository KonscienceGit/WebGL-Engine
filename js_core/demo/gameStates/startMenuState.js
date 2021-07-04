class StartMenuState extends AbstractState {
    constructor(objectManager, gameStateManager) {
        super(gameStateManager);

        this._slideIn = true;
        this._slideInState = 0;

        this._startSlideOut = false;
        this._slideOutState = 1.0;

        this._selectedNone = "none";
        this._selectedMenu = this._selectedNone;
        this._menuSelected = "selected";
        this._growingAnimationState = 0.0;
        this._canvasDim = objectManager.getSpaceCraft()._canvasDim.clone();
        this._cursor = new EntityProperties();

        this._pressToPlayButton = objectManager.getPlayButton();
        this._logoTitleSprite = objectManager.getLogoTitle();
        this._translucentOverlay = objectManager.getTranslucentOverlay();

        this._logoTitleSprite.setPosition(0, 300);
        this._pressToPlayButton.setPosition(0, 0);

        //move before slideIn
        this._pressToPlayButton.getRenderPosition().moveLeft(this._canvasDim.y);
        this._logoTitleSprite.getRenderPosition().moveUp(this._canvasDim.y);

        this._pressToPlayButton.setVisible(true);
        this._logoTitleSprite.setVisible(true);
        this._translucentOverlay.setVisible(true);
        this.setSelectedMenu(this._menuSelected);
    }

    getNextState() {
        return "GameState";
    }

    fireInputAction(action, options) {
        switch (action) {
            case InputActions.CURSOR_AT:
                this.selectMenuWithCursor(options);
                break;
            case InputActions.CLICK_AT:
                this.selectMenuWithCursor(options);
                this.fireInputAction(InputActions.ACTION);
                break;
            case InputActions.ACTION:
                if (this._selectedMenu !== this._selectedNone) {
                    this._startSlideOut = true;
                }
                break;
            default:
        }
    }

    updateState(delta) {
        super.updateState(delta);
        if (this._slideIn) {
            this.slideIn(delta);
            return;
        }

        if (this._startSlideOut) {
            this.updateFadeOut(delta);
            return;
        }

        if (this._selectedMenu !== this._selectedNone) {
            this.updateMenuAnimation(delta);
        }
    }

    updateMenuAnimation(delta) {
        this._growingAnimationState += 2 * delta;
        if (this._growingAnimationState >= 3.14) {
            this._growingAnimationState = 0.0;
        }
        let grow = 1.0 + 0.1 * Math.sin(this._growingAnimationState);
        let selectedMenu = this.getSelectedMenuSprite();
        if(selectedMenu != null) selectedMenu.setScale(grow, grow);
    }

    getSelectedMenuSprite() {
        if (this._selectedMenu === this._menuSelected) {
            return this._pressToPlayButton;
        } else {
            return null;
        }
    }

    setSelectedMenu(menu) {
        if (this._selectedMenu !== menu) {
            this._pressToPlayButton.setScale(1, 1);
            this._selectedMenu = menu;
            this._growingAnimationState = 0.0;
        }
    }

    // noinspection DuplicatedCode
    slideIn(delta) {
        this._slideInState += delta;
        let slideFactor = delta;
        if (this._slideInState >= 1) {
            slideFactor -= this._slideInState - 1;
            this._slideIn = false;
            this._slideInState = 1;
        }
        let slideIn = this._canvasDim.y * slideFactor;
        this._pressToPlayButton.getRenderPosition().moveRight(slideIn);
        this._logoTitleSprite.getRenderPosition().moveDown(slideIn);
    }

    updateFadeOut(delta) {
        this._slideOutState -= delta;
        let slideOutFactor = delta;
        if (this._slideOutState <= 0) {
            slideOutFactor += this._slideOutState;
            this._goToNextState = true;
        }
        let slideOut = this._canvasDim.y * slideOutFactor;
        this._translucentOverlay.setOpacity(this._slideOutState);
        this._pressToPlayButton.getRenderPosition().moveLeft(slideOut);
        this._logoTitleSprite.getRenderPosition().moveUp(slideOut);
    }

    finish() {
        this._pressToPlayButton.setVisible(false);
        this._logoTitleSprite.setVisible(false);
        this._translucentOverlay.setVisible(false);
    }

    selectMenuWithCursor(coords) {
        if (this._startSlideOut) return;
        this._cursor.position.x = coords[0];
        this._cursor.position.y = coords[1];
        if (this._cursor.intersect(this._pressToPlayButton.getEntityProperties())) {
            this.setSelectedMenu(this._menuSelected);
        } else {
            this.setSelectedMenu(this._selectedNone);
        }
    }
}