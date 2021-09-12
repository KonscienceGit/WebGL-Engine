class SsdBindings extends BindingGroup{
    constructor(keyboardManager, gamepadManager, mouseManager) {
        super("Controls", true, true);
        this._keyboardManager = keyboardManager;
        this._gamepadManager = gamepadManager;
        this._mouseManager = mouseManager;

        this._menuGroup = new BindingGroup("Menu", true, true);
        this.addSubGroup(this._menuGroup);
        this._gameplayGroup = new BindingGroup("Gameplay", true, true);
        this.addSubGroup(this._gameplayGroup);

        this.initActions();
    }
    parseBindings(delta) {
        this._gamepadManager.scangamepads();
        return super.parseBindings(delta);
    }

    switchToMenuMode(){
        this._gameplayGroup.setEnabled(false);
        this._menuGroup.setEnabled(true);
    }

    switchToGameplayMode(){
        this._menuGroup.setEnabled(false);
        this._gameplayGroup.setEnabled(true);
    }

    /** @return {KeyboardInputManager} */
    getKeyboardManager(){
        return this._keyboardManager;
    }

    /** @return {GamepadInputManager} */
    getGamepadManager(){
        return this._gamepadManager;
    }

    /** @return {MouseInputManager} */
    getMouseManager(){
        return this._mouseManager;
    }

    initActions() {
        const validateMenuAction = new ButtonInputAction(GameInputActions.MENU_VALID_SELECTION,true);
        validateMenuAction.addInput(this._gamepadManager.createControllerInput(XboxGamePadInputs.BUTTON_A));
        this._menuGroup.addAction(validateMenuAction);

        const returnToMainMenuAction = new ButtonInputAction(GameInputActions.MENU_RETURN_TO_MAIN,true);
        returnToMainMenuAction.addInput(this._gamepadManager.createControllerInput(XboxGamePadInputs.BUTTON_START));
        this._menuGroup.addAction(returnToMainMenuAction);

        const fireShipAction = new ButtonInputAction(GameInputActions.SHIP_FIRE,false);
        fireShipAction.addInput(this._gamepadManager.createControllerInput(XboxGamePadInputs.BUTTON_A));
        this._gameplayGroup.addAction(fireShipAction);

        const moveShipLeftAction = new ButtonInputAction(GameInputActions.SHIP_LEFT,false);
        moveShipLeftAction.addInput(this._gamepadManager.createControllerInput(XboxGamePadInputs.BUTTON_CROSS_LEFT));
        this._gameplayGroup.addAction(moveShipLeftAction);

        const moveShipRightAction = new ButtonInputAction(GameInputActions.SHIP_RIGHT,false);
        moveShipRightAction.addInput(this._gamepadManager.createControllerInput(XboxGamePadInputs.BUTTON_CROSS_RIGHT));
        this._gameplayGroup.addAction(moveShipRightAction);

        // TODO this is not the right input action (need a cursor/touch type action)
        const moveShipToCursorAction = new ButtonInputAction(GameInputActions.SHIP_TO_CURSOR,false);
        // moveShipToCursorAction.addInput(this.leMouseManager.createMouseOrSomethingInput(Mouse and touch actions));
        this._gameplayGroup.addAction(moveShipToCursorAction);

        //TODO add other actions and inputs
    }
}