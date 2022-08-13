class MouseInputIdentifiers extends AbstractInputIdentifier{
    // Input types
    static INPUT_BUTTON = 0;
    static INPUT_WHEEL = 1;
    static INPUT_MOVE = 2;

    /**
     * @param {number} type if button, wheel, movement
     * @param {number} number button or wheel number if applicable
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

const Mouse_Identifiers = {
    BUTTON_LEFT : new MouseInputIdentifiers(MouseInputIdentifiers.INPUT_BUTTON, 0, 'Mouse button left'),
    BUTTON_MIDDLE: new MouseInputIdentifiers(MouseInputIdentifiers.INPUT_BUTTON, 1, 'Mouse button middle'),
    BUTTON_RIGHT: new MouseInputIdentifiers(MouseInputIdentifiers.INPUT_BUTTON, 2, 'Mouse button right'),
    BUTTON_THUMB_1: new MouseInputIdentifiers(MouseInputIdentifiers.INPUT_BUTTON, 3, 'Mouse thumb button 1'),
    BUTTON_THUMB_2: new MouseInputIdentifiers(MouseInputIdentifiers.INPUT_BUTTON, 4, 'Mouse thumb button 2'),
    WHEEL_1_UP: new MouseInputIdentifiers(MouseInputIdentifiers.INPUT_WHEEL, 1, 'Mouse wheel up (forward)'),
    WHEEL_1_DOWN: new MouseInputIdentifiers(MouseInputIdentifiers.INPUT_WHEEL, -1, 'Mouse wheel down (backward)'),
    // if I can find a mouse with multiple wheels...
    MOVE_CURSOR: new MouseInputIdentifiers(MouseInputIdentifiers.INPUT_MOVE, 0, 'Mouse cursor movement'),
};
Object.freeze(US_Keyboard);
