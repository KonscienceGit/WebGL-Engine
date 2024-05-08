import {AbstractInputDeviceManager} from "../abstractInputDeviceManager.js";
import {KeyboardKeyInput} from "./keyboardKeyInput.js";
import {ActionType} from "../inputActions.js";

export class KeyboardInputManager extends AbstractInputDeviceManager {
    constructor() {
        super();
        this._keyStates = {};

        const self = this;
        window.onkeydown = function (keyEvent) {
            self.handleKeyEvent(keyEvent, true);
        };
        window.onkeyup = function (keyEvent) {
            self.handleKeyEvent(keyEvent, false);
        };
    }

    /**
     * @param {KeyboardEvent} keyEvent
     * @param {boolean} keyDown if the key is pressed down.
     */
    handleKeyEvent(keyEvent, keyDown) {
        this._keyStates[keyEvent.code] = keyDown;
    }

    /**
     * @param code the code of the key as it appears in KeyEvent.code
     * @returns {boolean} the "pressed state" of the key, (true if the key is down, false if up or not found, which means the key was never pressed.)
     */
    getKeyValue(code){
        return !!this._keyStates[code];
    }

    /**
     * @param keyboardInputIdentifier {KeyboardInputIdentifiers}
     * @param actionType {ActionType}
     * @return {AbstractInput}
     */
    createInput(keyboardInputIdentifier, actionType){
        // Unruly combinations
        if (actionType === ActionType.POSITION || actionType === ActionType.THROTTLE) {
            throw new Error('Error: cannot bind a Button to a ' + actionType + ' action!');
        }
        return new KeyboardKeyInput(this, keyboardInputIdentifier.getCode(), keyboardInputIdentifier.getLocalizedValue());
    }

    postParsingUpdate() {
        // Do nothing
    }
}
