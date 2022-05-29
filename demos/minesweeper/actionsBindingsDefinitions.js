class ActionsBindingsDefinitions extends BindingGroup{
    constructor(keyboardManager, gamepadManager, mouseManager) {
        super("Controls", true, true);
        this._keyboardManager = keyboardManager;
        this._gamepadManager = gamepadManager;
        this._mouseManager = mouseManager;

        this.initActions();
    }

    initActions() {
        const leftClickAction = new ButtonInputAction(GameInputActions.LEFT_CLICK,true);
        leftClickAction.addInput(this._gamepadManager.createControllerInput(XboxGamePadInputs.BUTTON_A, leftClickAction.getType()));
        leftClickAction.addInput(this._keyboardManager.createControllerInput(US_Keyboard.Enter, leftClickAction.getType()));
        leftClickAction.addInput(this._mouseManager.createMouseButtonInput(MouseInputIdentifier.BUTTON_LEFT));
        this.addAction(leftClickAction);

        const cursorMoveAction = new PositionInputAction(GameInputActions.CURSOR_AT);
        cursorMoveAction.addInput(this._mouseManager.createMouseMoveInput());
        this.addAction(cursorMoveAction);
    }
}
