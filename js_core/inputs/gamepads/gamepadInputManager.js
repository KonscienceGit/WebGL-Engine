// see http://luser.github.io/gamepadtest/
// noinspection JSUnusedGlobalSymbols // broken inspection
class GamepadInputManager extends AbstractInputManager {
    constructor() {
        super();
        const haveEvents = 'GamepadEvent' in window;
        const haveWebkitEvents = 'WebKitGamepadEvent' in window;
        this.connecthandler = this.connecthandler.bind(this);
        this.disconnecthandler = this.disconnecthandler.bind(this);
        this._controllers = [];

        if (haveEvents) {
            window.addEventListener("gamepadconnected", this.connecthandler);
            window.addEventListener("gamepaddisconnected", this.disconnecthandler);
        } else if (haveWebkitEvents) {
            window.addEventListener("webkitgamepadconnected", this.connecthandler);
            window.addEventListener("webkitgamepaddisconnected", this.disconnecthandler);
        }
    }

    /**
     * @param {GamepadInputIdentifier} controllerIdentifer
     * @return {AbstractInput}
     */
    createControllerInput(controllerIdentifer){
        if(controllerIdentifer.getInputType() === GAMEPAD_BUTTON){
            return new GamepadButtonInput(this, controllerIdentifer.getType(), controllerIdentifer.getInputNumber());
        } else {
            // TODO make GamepadAxisInput
            return null;
        }
    }

    /**
     * @param {String} controllerType
     * @return {null|Gamepad}
     */
    getControllerByType(controllerType){
        this.scangamepads();
        for (let i = 0; i < this._controllers.length; i++){
            if(!this._controllers[i] || !this._controllers[i].connected) continue;
            if (this._controllers[i].id.toLowerCase().includes(controllerType.toLowerCase())){
                return this._controllers[i];
            }
        }
        return null;
    }

    /**
     * @return {null|Gamepad}
     */
    getController(){
        this.scangamepads();
        for (let i = 0; i < this._controllers.length; i++){
            if (this._controllers[i]){
                return this._controllers[i];
            }
        }
        return null;
    }

    /**
     * @deprecated
     * @return {boolean}
     */
    parseInputs() {
        super.parseInputs();
        return false;
    }

    /**
     * @deprecated
     * @param stateManager
     */
    updateStates(stateManager) {
        super.updateStates(stateManager);
    }

    scangamepads() {
        console.log('scan');
        const time = performance.now();
        let skipScan = true;
        if (this._timeLastScan) {
            const timeSinceLastScan = time - this._timeLastScan;
            if(timeSinceLastScan > 1000) {
                skipScan = false;
                this._timeLastScan = time;
            }
        } else {
            this._timeLastScan = time;
        }
        if(skipScan) return;

        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i] && (gamepads[i].index in this._controllers)) {
                this._controllers[gamepads[i].index] = gamepads[i];
            }
        }
    }

    /**
     * @deprecated
     * @param {Gamepad} gamepad
     * @returns {boolean}
     */
    parseGamepadInputs(gamepad) {
        return false;
    }

    /**
     * @param {GamepadEvent} gamepadEvent
     */
    connecthandler(gamepadEvent) {
        this._controllers[gamepadEvent.gamepad.index] = gamepadEvent.gamepad;
        this.parseInputs();
    }

    /**
     * @param {GamepadEvent} gamepadEvent
     */
    disconnecthandler(gamepadEvent) {
        delete this._controllers[gamepadEvent.gamepad.index];
    }
}

