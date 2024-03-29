class GameBindingsDefinitions extends BindingGroup{
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

    initActions() {
        const validateMenuAction = new ButtonInputAction(GameInputActions.MENU_VALID_SELECTION,true);
        validateMenuAction.addInput(this._gamepadManager.createControllerInput(XboxGamePadInputs.BUTTON_A, validateMenuAction.getType()));
        validateMenuAction.addInput(this._keyboardManager.createControllerInput(US_Keyboard.Space, validateMenuAction.getType()));
        validateMenuAction.addInput(this._keyboardManager.createControllerInput(US_Keyboard.Enter, validateMenuAction.getType()));
        validateMenuAction.addInput(this._mouseManager.createMouseButtonInput(MouseInputIdentifier.BUTTON_LEFT));
        this._menuGroup.addAction(validateMenuAction);

        const returnToMainMenuAction = new ButtonInputAction(GameInputActions.MENU_RETURN_TO_MAIN,true);
        returnToMainMenuAction.addInput(this._gamepadManager.createControllerInput(XboxGamePadInputs.BUTTON_START, returnToMainMenuAction.getType()));
        returnToMainMenuAction.addInput(this._keyboardManager.createControllerInput(US_Keyboard.Escape, returnToMainMenuAction.getType()));
        this._gameplayGroup.addAction(returnToMainMenuAction);

        const fireShipAction = new ButtonInputAction(GameInputActions.SHIP_FIRE,false);
        fireShipAction.addInput(this._gamepadManager.createControllerInput(XboxGamePadInputs.BUTTON_A, fireShipAction.getType()));
        fireShipAction.addInput(this._keyboardManager.createControllerInput(US_Keyboard.Space, validateMenuAction.getType()));
        fireShipAction.addInput(this._mouseManager.createMouseButtonInput(MouseInputIdentifier.BUTTON_LEFT));
        this._gameplayGroup.addAction(fireShipAction);

        const moveShipLeftAction = new AxisInputAction(GameInputActions.SHIP_LEFT);
        moveShipLeftAction.addInput(this._gamepadManager.createControllerInput(XboxGamePadInputs.BUTTON_CROSS_LEFT, moveShipLeftAction.getType()));
        moveShipLeftAction.addInput(this._gamepadManager.createControllerInput(XboxGamePadInputs.AXIS_LEFTAXIS_LEFT, moveShipLeftAction.getType()));
        moveShipLeftAction.addInput(this._keyboardManager.createControllerInput(US_Keyboard.ArrowLeft, moveShipLeftAction.getType()));
        this._gameplayGroup.addAction(moveShipLeftAction);

        const moveShipRightAction = new AxisInputAction(GameInputActions.SHIP_RIGHT);
        moveShipRightAction.addInput(this._gamepadManager.createControllerInput(XboxGamePadInputs.BUTTON_CROSS_RIGHT, moveShipRightAction.getType()));
        moveShipRightAction.addInput(this._gamepadManager.createControllerInput(XboxGamePadInputs.AXIS_LEFTAXIS_RIGHT, moveShipRightAction.getType()));
        moveShipRightAction.addInput(this._keyboardManager.createControllerInput(US_Keyboard.ArrowRight, moveShipRightAction.getType()));
        this._gameplayGroup.addAction(moveShipRightAction);

        const moveShipToCursorAction = new PositionInputAction(GameInputActions.SHIP_MOVE_TO_CURSOR);
        moveShipToCursorAction.addInput(this._mouseManager.createMouseMoveInput());
        this._gameplayGroup.addAction(moveShipToCursorAction);
    }
}
