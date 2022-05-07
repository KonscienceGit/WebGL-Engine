class GameBindingsDefinitions extends BindingGroup{
    constructor(keyboardManager, gamepadManager, mouseManager) {
        super("Controls", true, true);
        this._keyboardManager = keyboardManager;
        this._gamepadManager = gamepadManager;
        this._mouseManager = mouseManager;

        this.initActions();
    }

    initActions() {
        // TODO
    }
}
