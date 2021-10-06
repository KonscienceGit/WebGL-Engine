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
        this._globalDeadZone = [0.2, 1.0];
        this._lastTime = performance.now();

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
     * @param {ActionType} actionType
     * @return {AbstractInput}
     */
    createControllerInput(controllerIdentifer, actionType){
        // Unruly combinations
        if(controllerIdentifer.getInputType() === GAMEPAD_BUTTON && (
            actionType === ActionType.POSITION ||
            actionType === ActionType.THROTTLE
        )){
            throw new Error('Error: cannot bind a Button to a ' + actionType + ' action!');
        }

        if(controllerIdentifer.getInputType() === GAMEPAD_BUTTON){
            return new GamepadButtonInput(this, controllerIdentifer.getType(), controllerIdentifer.getInputNumber());
        } else if (controllerIdentifer.getInputType() === GAMEPAD_AXIS) {
            return new GamepadAxisInput(this, controllerIdentifer.getType(), controllerIdentifer.getInputNumber());
        }
        throw new Error('Unknown controller identifier!');
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
    getControllerByIndex(index){
        this.scangamepads();
        if (this._controllers[index] && this._controllers[index].connected){
            return this._controllers[index];
        }
        return null;
    }

    /**
     * @return {null|Gamepad}
     */
    getController(){
        this.scangamepads();
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

    scangamepads() {
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
    connecthandler(gamepadEvent) {
        this._controllers[gamepadEvent.gamepad.index] = gamepadEvent.gamepad;
    }

    /**
     * @param {GamepadEvent} gamepadEvent
     */
    disconnecthandler(gamepadEvent) {
        delete this._controllers[gamepadEvent.gamepad.index];
    }
}

