import {AbstractInputIdentifier} from "../abstractInputIdentifier.js";
import {MouseButton, MouseInputType, MouseWheel} from "./mouseInputs.js";

export class MouseInputIdentifiers extends AbstractInputIdentifier{
    static {
        this.BUTTON_LEFT = new MouseInputIdentifiers(MouseInputType.BUTTON, MouseButton.LEFT, 'Mouse button left');
        this.BUTTON_MIDDLE = new MouseInputIdentifiers(MouseInputType.BUTTON, MouseButton.MIDDLE, 'Mouse button middle');
        this.BUTTON_RIGHT = new MouseInputIdentifiers(MouseInputType.BUTTON, MouseButton.RIGHT, 'Mouse button right');
        this.BUTTON_THUMB_1 = new MouseInputIdentifiers(MouseInputType.BUTTON, MouseButton.THUMB_1, 'Mouse thumb button 1');
        this.BUTTON_THUMB_2 = new MouseInputIdentifiers(MouseInputType.BUTTON, MouseButton.THUMB_2, 'Mouse thumb button 2');
        this.WHEEL_1_UP = new MouseInputIdentifiers(MouseInputType.WHEEL, MouseWheel.WHEEL_1_UP, 'Mouse wheel up (forward)');
        this.WHEEL_1_DOWN = new MouseInputIdentifiers(MouseInputType.WHEEL, MouseWheel.WHEEL_1_DOWN, 'Mouse wheel down (backward)');
        // if I can find a mouse with multiple wheels...
        this.CURSOR_POSITION = new MouseInputIdentifiers(MouseInputType.CURSOR_POSITION, null, 'Mouse cursor movement');
    }

    /**
     * @param {MouseInputType} type if button, wheel, movement
     * @param {MouseButton | MouseWheel | null} number button or wheel number if applicable
     * @param {string} localizedName
     */
    constructor(type, number, localizedName) {
        super();
        this._type = type;
        this._number = number;
        this._localizedName = localizedName;
    }

    getInputType(){return this._type;}
    getNumber(){return this._number;}
    getLocalizedName(){return this._localizedName;}
}
