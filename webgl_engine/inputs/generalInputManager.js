class GeneralInputManager extends BindingGroup{
    /**
     * @param {Renderer} renderer, necessary to create the MouseInputs if required.
     */
    constructor(renderer) {
        super();
        this._renderer = renderer;
        this._keyboardManager = null;
        this._gamepadManager = null;
        this._mouseManager = null;
    }

    /**
     * @param {string} actionName
     * @param {boolean} onclick
     */
    createButtonAction(actionName, onclick) {
        this.addAction(new ButtonInputAction(actionName, onclick));
    }

    /**
     * @param {string} actionName
     */
    createPositionAction(actionName) {
        this.addAction(new PositionInputAction(actionName));
    }

    /**
     * @param {string} actionName
     */
    createAxisAction(actionName) {
        this.addAction(new AxisInputAction(actionName));
    }

    /**
     *
     * @param {AbstractInputIdentifier} inputIdentifier
     * @param actionName
     */
    addInputToAction(actionName, inputIdentifier) {
        const action = this.getActionByName(actionName);
        if (action == null) {
            console.warn('Warning:  action ' + actionName + ' does not exist.');
            return;
        }
        try {
            let input = null;
            if (inputIdentifier instanceof GamepadInputIdentifier) {
                input = this.getGamepadInputManager().createInput(inputIdentifier, action.getType());
            } else if (inputIdentifier instanceof KeyboardInputIdentifiers) {
                input = this.getKeyboardInputManager().createInput(inputIdentifier, action.getType());
            } else if (inputIdentifier instanceof MouseInputIdentifiers) {
                input = this.getMouseInputManager().createInput(inputIdentifier, action.getType());
            }  else {
                console.error('Unknown input identifier!');
                return;
            }
            action.addInput(input);
        } catch (error) {
            console.error(error);
        }
    }

    addCallbackToAction(actionName, callback) {
        const action = this.getActionByName(actionName);
        if (action == null) {
            console.warn('Warning:  action ' + actionName + ' does not exist.');
            return;
        }
        action.addActionCallback(callback);
    }

    /**
     * Parse the bindings of each actions, and trigger the associated callbacks.
     * @param {number} delta the time in seconds since the last update.
     */
    parseBindings(delta){
        super.parseBindings(delta)
        if (this._keyboardManager) this._keyboardManager.postParsingUpdate();
        if (this._gamepadManager) this._gamepadManager.postParsingUpdate();
        if (this._mouseManager) this._mouseManager.postParsingUpdate();
    }

    /**
     * @returns {GamepadInputManager}
     */
    getGamepadInputManager(){
        if (!this._gamepadManager) this._gamepadManager = new GamepadInputManager();
        return this._gamepadManager;
    }

    /**
     * @returns {MouseInputManager}
     */
    getMouseInputManager(){
        if (!this._mouseManager) this._mouseManager = new MouseInputManager(this._renderer);
        return this._mouseManager;
    }

    /**
     * @returns {KeyboardInputManager}
     */
    getKeyboardInputManager(){
        if (!this._keyboardManager) this._keyboardManager = new KeyboardInputManager();
        return this._keyboardManager;
    }
}