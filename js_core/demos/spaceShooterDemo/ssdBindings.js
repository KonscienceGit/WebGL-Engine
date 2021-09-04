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
        const validateMenuAction = new BasicInputAction(GameInputActions.MENU_VALID_SELECTION, true, true);

        validateMenuAction.addInput(this._gamepadManager.createControllerInput(XboxGamePadInputs.BUTTON_A));

        //TODO add other inputs
        this._menuGroup.addAction(validateMenuAction);

        //TODO add other actions and inputs
    }
}