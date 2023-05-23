class KeyboardInputIdentifiers extends AbstractInputIdentifier{
    /**
     * @param {string} code
     * @param {string} localizedValue
     */
    constructor(code, localizedValue) {
            super();
            this._code = code;
        this._localizedValue = localizedValue;
    }

    getCode(){return this._code;}
    getLocalizedValue(){return this._localizedValue;}
}

const US_Keyboard = {
        q : new KeyboardInputIdentifiers('KeyQ', 'q'),
        w : new KeyboardInputIdentifiers('KeyW', 'w'),
        e : new KeyboardInputIdentifiers('KeyE', 'e'),
        r : new KeyboardInputIdentifiers('KeyR', 'r'),
        t : new KeyboardInputIdentifiers('KeyT', 't'),
        y : new KeyboardInputIdentifiers('KeyY', 'y'),
        u : new KeyboardInputIdentifiers('KeyU', 'u'),
        i : new KeyboardInputIdentifiers('KeyI', 'i'),
        o : new KeyboardInputIdentifiers('KeyO', 'o'),
        p : new KeyboardInputIdentifiers('KeyP', 'p'),
        a : new KeyboardInputIdentifiers('KeyA', 'a'),
        s : new KeyboardInputIdentifiers('KeyS', 's'),
        d : new KeyboardInputIdentifiers('KeyD', 'd'),
        f : new KeyboardInputIdentifiers('KeyF', 'f'),
        g : new KeyboardInputIdentifiers('KeyG', 'g'),
        h : new KeyboardInputIdentifiers('KeyH', 'h'),
        j : new KeyboardInputIdentifiers('KeyJ', 'j'),
        k : new KeyboardInputIdentifiers('KeyK', 'k'),
        l : new KeyboardInputIdentifiers('KeyL', 'l'),
        z : new KeyboardInputIdentifiers('KeyZ', 'z'),
        x : new KeyboardInputIdentifiers('KeyX', 'x'),
        c : new KeyboardInputIdentifiers('KeyC', 'c'),
        v : new KeyboardInputIdentifiers('KeyV', 'v'),
        b : new KeyboardInputIdentifiers('KeyB', 'b'),
        n : new KeyboardInputIdentifiers('KeyN', 'n'),
        m : new KeyboardInputIdentifiers('KeyM', 'm'),

        F1 : new KeyboardInputIdentifiers('F1', 'F1'),
        F2 : new KeyboardInputIdentifiers('F2', 'F2'),
        F3 : new KeyboardInputIdentifiers('F3', 'F3'),
        F4 : new KeyboardInputIdentifiers('F4', 'F4'),
        F5 : new KeyboardInputIdentifiers('F5', 'F5'),
        F6 : new KeyboardInputIdentifiers('F6', 'F6'),
        F7 : new KeyboardInputIdentifiers('F7', 'F7'),
        F8 : new KeyboardInputIdentifiers('F8', 'F8'),
        F9 : new KeyboardInputIdentifiers('F9', 'F9'),
        F10 : new KeyboardInputIdentifiers('F10', 'F10'),
        F11 : new KeyboardInputIdentifiers('F11', 'F11'),
        F12 : new KeyboardInputIdentifiers('F12', 'F12'),

        // Enable at your own risks
        // MetaLeft : new KeyboardInputIdentifiers('MetaLeft', 'Meta Left'),
        // MetaRight : new KeyboardInputIdentifiers('MetaRight', 'Meta Right'),
        // ContextMenu : new KeyboardInputIdentifiers('ContextMenu', 'Context Menu'),
        Escape : new KeyboardInputIdentifiers('Escape', 'Escape'),

        Backquote : new KeyboardInputIdentifiers('Backquote', '`'),
        Tab : new KeyboardInputIdentifiers('Tab', 'Tab'),
        CapsLock : new KeyboardInputIdentifiers('CapsLock', 'CapsLock'),
        ShiftLeft : new KeyboardInputIdentifiers('ShiftLeft', 'Shift'),
        ShiftRight : new KeyboardInputIdentifiers('ShiftRight', 'Shift Right'),
        ControlLeft : new KeyboardInputIdentifiers('ControlLeft', 'Control Left'),
        ControlRight : new KeyboardInputIdentifiers('ControlRight', 'Control Right'),
        AltLeft : new KeyboardInputIdentifiers('AltLeft', 'Alt Left'),
        AltRight : new KeyboardInputIdentifiers('AltRight', 'Alt Right'),
        Space : new KeyboardInputIdentifiers('Space', 'Space'),
        Enter : new KeyboardInputIdentifiers('Enter', 'Enter'),
        Backspace : new KeyboardInputIdentifiers('Backspace', 'Backspace'),

        Digit1 : new KeyboardInputIdentifiers('Digit1', '1'),
        Digit2 : new KeyboardInputIdentifiers('Digit2', '2'),
        Digit3 : new KeyboardInputIdentifiers('Digit3', '3'),
        Digit4 : new KeyboardInputIdentifiers('Digit4', '4'),
        Digit5 : new KeyboardInputIdentifiers('Digit5', '5'),
        Digit6 : new KeyboardInputIdentifiers('Digit6', '6'),
        Digit7 : new KeyboardInputIdentifiers('Digit7', '7'),
        Digit8 : new KeyboardInputIdentifiers('Digit8', '8'),
        Digit9 : new KeyboardInputIdentifiers('Digit9', '9'),
        Digit0 : new KeyboardInputIdentifiers('Digit0', '0'),

        ArrowLeft : new KeyboardInputIdentifiers('ArrowLeft', 'Arrow Left'),
        ArrowRight : new KeyboardInputIdentifiers('ArrowRight', 'Arrow Right'),
        ArrowUp : new KeyboardInputIdentifiers('ArrowUp', 'Arrow Up'),
        ArrowDown : new KeyboardInputIdentifiers('ArrowDown', 'Arrow Down'),

        PrintScreen : new KeyboardInputIdentifiers('PrintScreen', 'PrintScreen'),
        ScrollLock : new KeyboardInputIdentifiers('ScrollLock', 'ScrollLock'),
        Pause : new KeyboardInputIdentifiers('Pause', 'Pause'),

        Insert : new KeyboardInputIdentifiers('Insert', 'Insert'),
        Home : new KeyboardInputIdentifiers('Home', 'Home'),
        End : new KeyboardInputIdentifiers('End', 'End'),
        Delete : new KeyboardInputIdentifiers('Delete', 'Delete'),
        PageUp : new KeyboardInputIdentifiers('PageUp', 'PageUp'),
        PageDown : new KeyboardInputIdentifiers('PageDown', 'PageDown'),

        NumLock : new KeyboardInputIdentifiers('NumLock', 'NumLock'),
        NumpadDivide : new KeyboardInputIdentifiers('NumpadDivide', 'Numpad /'),
        NumpadMultiply : new KeyboardInputIdentifiers('NumpadMultiply', 'Numpad *'),
        NumpadSubtract : new KeyboardInputIdentifiers('NumpadSubtract', 'Numpad -'),
        NumpadAdd : new KeyboardInputIdentifiers('NumpadAdd', 'Numpad +'),
        NumpadEnter : new KeyboardInputIdentifiers('NumpadEnter', 'Numpad Enter'),
        NumpadDecimal : new KeyboardInputIdentifiers('NumpadDecimal', 'Numpad .'),
        Numpad1 : new KeyboardInputIdentifiers('Numpad1', 'Numpad1'),
        Numpad2 : new KeyboardInputIdentifiers('Numpad2', 'Numpad2'),
        Numpad3 : new KeyboardInputIdentifiers('Numpad3', 'Numpad3'),
        Numpad4 : new KeyboardInputIdentifiers('Numpad4', 'Numpad4'),
        Numpad5 : new KeyboardInputIdentifiers('Numpad5', 'Numpad5'),
        Numpad6 : new KeyboardInputIdentifiers('Numpad6', 'Numpad6'),
        Numpad7 : new KeyboardInputIdentifiers('Numpad7', 'Numpad7'),
        Numpad8 : new KeyboardInputIdentifiers('Numpad8', 'Numpad8'),
        Numpad9 : new KeyboardInputIdentifiers('Numpad9', 'Numpad9'),
        Numpad0 : new KeyboardInputIdentifiers('Numpad0', 'Numpad0'),

        BracketLeft : new KeyboardInputIdentifiers('BracketLeft', '['),
        BracketRight : new KeyboardInputIdentifiers('BracketRight', ']'),
        Semicolon : new KeyboardInputIdentifiers('Semicolon', ';'),
        Quote : new KeyboardInputIdentifiers('Quote', '\''),
        Backslash : new KeyboardInputIdentifiers('Backslash', '\\'),
        Comma : new KeyboardInputIdentifiers('Comma', ','),
        Period : new KeyboardInputIdentifiers('Period', '.'),
        Slash : new KeyboardInputIdentifiers('Slash', '/')
};
Object.freeze(US_Keyboard);

const FR_Keyboard = Object.assign({}, US_Keyboard);
// Add/replace AZERTY specific keys
FR_Keyboard.a = new KeyboardInputIdentifiers('KeyQ', 'a');
FR_Keyboard.q = new KeyboardInputIdentifiers('KeyA', 'q');
FR_Keyboard.w = new KeyboardInputIdentifiers('KeyZ', 'w');
FR_Keyboard.z = new KeyboardInputIdentifiers('KeyW', 'z');
FR_Keyboard.m = new KeyboardInputIdentifiers('Semicolon', 'm');
FR_Keyboard.Comma = new KeyboardInputIdentifiers('KeyM', ',');
FR_Keyboard.Semicolon = new KeyboardInputIdentifiers('Comma', ';');
FR_Keyboard.DeuxPoints = new KeyboardInputIdentifiers('Period', ':');
FR_Keyboard.Circonflexe = new KeyboardInputIdentifiers('BracketLeft', '^');
FR_Keyboard.Dollar = new KeyboardInputIdentifiers('BracketRight', '$');
FR_Keyboard.uAccentGrave = new KeyboardInputIdentifiers('Quote', 'ù');
FR_Keyboard.Etoile = new KeyboardInputIdentifiers('Backslash', '*');
FR_Keyboard.Exclamation = new KeyboardInputIdentifiers('Slash', '!');
FR_Keyboard.Exposant2 = new KeyboardInputIdentifiers('Backquote', '²');
Object.freeze(FR_Keyboard);

// Add your own keyboard layouts!
