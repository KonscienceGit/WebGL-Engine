// see http://luser.github.io/gamepadtest/
// noinspection JSUnusedGlobalSymbols // broken inspection
class GamepadInputManager extends AbstractInputDeviceManager {
    constructor() {
        super();
        this._isSecureContext = window.isSecureContext;
        this._controllers = [];
        this._globalDeadZone = [0.2, 1.0];
        this._lastTime = performance.now();
        if (!this._isSecureContext) {
            console.log('This web page context is not "secure" (https), gamepads will be disabled.');
            return;
        }// require secure https for gamepads
        const haveEvents = 'GamepadEvent' in window;
        const haveWebkitEvents = 'WebKitGamepadEvent' in window;
        this.connectHandler = this.connectHandler.bind(this);
        this.disconnectHandler = this.disconnectHandler.bind(this);

        if (haveEvents) {
            window.addEventListener("gamepadconnected", this.connectHandler);
            window.addEventListener("gamepaddisconnected", this.disconnectHandler);
        } else if (haveWebkitEvents) {
            window.addEventListener("webkitgamepadconnected", this.connectHandler);
            window.addEventListener("webkitgamepaddisconnected", this.disconnectHandler);
        }
    }

    /**
     * @param {GamepadInputIdentifier} controllerIdentifier
     * @param {ActionType} actionType
     * @return {AbstractInput}
     */
    createInput(controllerIdentifier, actionType){
        // Unruly combinations
        if(controllerIdentifier.getInputType() === GAMEPAD_BUTTON && (
            actionType === ActionType.POSITION ||
            actionType === ActionType.THROTTLE
        )){
            throw new Error('Error: cannot bind a Button to a ' + actionType + ' action!');
        }

        if(controllerIdentifier.getInputType() === GAMEPAD_BUTTON){
            return new GamepadButtonInput(this, controllerIdentifier.getType(), controllerIdentifier.getInputNumber());
        } else if (controllerIdentifier.getInputType() === GAMEPAD_AXIS) {
            return new GamepadAxisInput(this, controllerIdentifier.getType(), controllerIdentifier.getInputNumber(), controllerIdentifier.getAxisDirection());
        }
        throw new Error('Unknown controller identifier!');
    }

    /**
     * @param {String} controllerType
     * @return {null|Gamepad}
     */
    getControllerByType(controllerType){
        this.scanGamepads();
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
    getControllerByIndex(index){
        this.scanGamepads();
        if (this._controllers[index] && this._controllers[index].connected){
            return this._controllers[index];
        }
        return null;
    }

    /**
     * @return {null|Gamepad}
     */
    getController(){
        this.scanGamepads();
        for (let i = 0; i < this._controllers.length; i++){
            if (this._controllers[i] && this._controllers[i].connected){
                return this._controllers[i];
            }
        }
        return null;
    }

    /**@param {number} start the value above which input is recognized as different from 0.
     * @param {number} end the value below which the input is recognized as different from 1. */
    setDefaultDeadZone(start, end){
        this._globalDeadZone[0] = start;
        this._globalDeadZone[1] = end;
    }

    getDefaultDeadZone(){
        return this._globalDeadZone;
    }

    scanGamepads() {
        if (!this._isSecureContext) return;
        const now = performance.now();
        const sinceLastTime = now - this._lastTime;
        if (sinceLastTime > 15){
            this._lastTime = now;
            return;
        }

        const gamepads = navigator.getGamepads();
        for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i] && (gamepads[i].index in this._controllers)) {
                this._controllers[gamepads[i].index] = gamepads[i];
            }
        }
    }

    /**
     * @param {GamepadEvent} gamepadEvent
     */
    connectHandler(gamepadEvent) {
        this._controllers[gamepadEvent.gamepad.index] = gamepadEvent.gamepad;
    }

    /**
     * @param {GamepadEvent} gamepadEvent
     */
    disconnectHandler(gamepadEvent) {
        delete this._controllers[gamepadEvent.gamepad.index];
    }

    postParsingUpdate() {
        // Do nothing
    }
}
