class KeyboardInputIdentifier{
    /**
     * @param {string} code
     * @param {string} localizedValue
     */
    constructor(code, localizedValue) {
        this._code = code;
        this._localizedValue = localizedValue;
    }

    getCode(){return this._code;}
    getLocalizedValue(){return this._localizedValue;}
}

const US_Keyboard = Object.freeze({
        q : new KeyboardInputIdentifier('KeyQ', 'q'),
        w : new KeyboardInputIdentifier('KeyW', 'w'),
        e : new KeyboardInputIdentifier('KeyE', 'e'),
        r : new KeyboardInputIdentifier('KeyR', 'r'),
        t : new KeyboardInputIdentifier('KeyT', 't'),
        y : new KeyboardInputIdentifier('KeyY', 'y'),
        u : new KeyboardInputIdentifier('KeyU', 'u'),
        i : new KeyboardInputIdentifier('KeyI', 'i'),
        o : new KeyboardInputIdentifier('KeyO', 'o'),
        p : new KeyboardInputIdentifier('KeyP', 'p'),
        a : new KeyboardInputIdentifier('KeyA', 'a'),
        s : new KeyboardInputIdentifier('KeyS', 's'),
        d : new KeyboardInputIdentifier('KeyD', 'd'),
        f : new KeyboardInputIdentifier('KeyF', 'f'),
        g : new KeyboardInputIdentifier('KeyG', 'g'),
        h : new KeyboardInputIdentifier('KeyH', 'h'),
        j : new KeyboardInputIdentifier('KeyJ', 'j'),
        k : new KeyboardInputIdentifier('KeyK', 'k'),
        l : new KeyboardInputIdentifier('KeyL', 'l'),
        z : new KeyboardInputIdentifier('KeyZ', 'z'),
        x : new KeyboardInputIdentifier('KeyX', 'x'),
        c : new KeyboardInputIdentifier('KeyC', 'c'),
        v : new KeyboardInputIdentifier('KeyV', 'v'),
        b : new KeyboardInputIdentifier('KeyB', 'b'),
        n : new KeyboardInputIdentifier('KeyN', 'n'),
        m : new KeyboardInputIdentifier('KeyM', 'm'),
        F1 : new KeyboardInputIdentifier('F1', 'F1'),
        F2 : new KeyboardInputIdentifier('F2', 'F2'),
        F3 : new KeyboardInputIdentifier('F3', 'F3'),
        F4 : new KeyboardInputIdentifier('F4', 'F4'),
        F5 : new KeyboardInputIdentifier('F5', 'F5'),
        F6 : new KeyboardInputIdentifier('F6', 'F6'),
        F7 : new KeyboardInputIdentifier('F7', 'F7'),
        F8 : new KeyboardInputIdentifier('F8', 'F8'),
        F9 : new KeyboardInputIdentifier('F9', 'F9'),
        F10 : new KeyboardInputIdentifier('F10', 'F10'),
        F11 : new KeyboardInputIdentifier('F11', 'F11'),
        F12 : new KeyboardInputIdentifier('F12', 'F12'),

        // Enable at your own risks
        // MetaLeft : new KeyboardInputIdentifier('MetaLeft', 'Meta Left'),
        // MetaRight : new KeyboardInputIdentifier('MetaRight', 'Meta Right'),
        // ContextMenu : new KeyboardInputIdentifier('ContextMenu', 'Context Menu'),
        Escape : new KeyboardInputIdentifier('Escape', 'Escape'),

        Backquote : new KeyboardInputIdentifier('Backquote', 'Backquote'),
        Tab : new KeyboardInputIdentifier('Tab', 'Tab'),
        CapsLock : new KeyboardInputIdentifier('CapsLock', 'CapsLock'),
        ShiftLeft : new KeyboardInputIdentifier('ShiftLeft', 'Shift'),
        ShiftRight : new KeyboardInputIdentifier('ShiftRight', 'Shift Right'),
        ControlLeft : new KeyboardInputIdentifier('ControlLeft', 'Control Left'),
        ControlRight : new KeyboardInputIdentifier('ControlRight', 'Control Right'),
        AltLeft : new KeyboardInputIdentifier('AltLeft', 'Alt Left'),
        AltRight : new KeyboardInputIdentifier('AltRight', 'Alt Right'),
        Space : new KeyboardInputIdentifier('Space', 'Space'),
        Enter : new KeyboardInputIdentifier('Enter', 'Enter'),
        Backspace : new KeyboardInputIdentifier('Backspace', 'Backspace'),

        Digit1 : new KeyboardInputIdentifier('Digit1', '1'),
        Digit2 : new KeyboardInputIdentifier('Digit2', '2'),
        Digit3 : new KeyboardInputIdentifier('Digit3', '3'),
        Digit4 : new KeyboardInputIdentifier('Digit4', '4'),
        Digit5 : new KeyboardInputIdentifier('Digit5', '5'),
        Digit6 : new KeyboardInputIdentifier('Digit6', '6'),
        Digit7 : new KeyboardInputIdentifier('Digit7', '7'),
        Digit8 : new KeyboardInputIdentifier('Digit8', '8'),
        Digit9 : new KeyboardInputIdentifier('Digit9', '9'),
        Digit0 : new KeyboardInputIdentifier('Digit0', '0'),

        ArrowLeft : new KeyboardInputIdentifier('ArrowLeft', 'Arrow Left'),
        ArrowRight : new KeyboardInputIdentifier('ArrowRight', 'Arrow Right'),
        ArrowUp : new KeyboardInputIdentifier('ArrowUp', 'Arrow Up'),
        ArrowDown : new KeyboardInputIdentifier('ArrowDown', 'Arrow Down'),

        PrintScreen : new KeyboardInputIdentifier('PrintScreen', 'PrintScreen'),
        ScrollLock : new KeyboardInputIdentifier('ScrollLock', 'ScrollLock'),
        Pause : new KeyboardInputIdentifier('Pause', 'Pause'),

        Insert : new KeyboardInputIdentifier('Insert', 'Insert'),
        Home : new KeyboardInputIdentifier('Home', 'Home'),
        End : new KeyboardInputIdentifier('End', 'End'),
        Delete : new KeyboardInputIdentifier('Delete', 'Delete'),
        PageUp : new KeyboardInputIdentifier('PageUp', 'PageUp'),
        PageDown : new KeyboardInputIdentifier('PageDown', 'PageDown'),

        NumLock : new KeyboardInputIdentifier('NumLock', 'NumLock'),
        NumpadDivide : new KeyboardInputIdentifier('NumpadDivide', 'Numpad Divide'),
        NumpadMultiply : new KeyboardInputIdentifier('NumpadMultiply', 'Numpad Multiply'),
        NumpadSubtract : new KeyboardInputIdentifier('NumpadSubtract', 'Numpad Subtract'),
        NumpadAdd : new KeyboardInputIdentifier('NumpadAdd', 'Numpad Add'),
        NumpadEnter : new KeyboardInputIdentifier('NumpadEnter', 'Numpad Enter'),
        NumpadDecimal : new KeyboardInputIdentifier('NumpadDecimal', 'Numpad Decimal'),
        Numpad1 : new KeyboardInputIdentifier('Numpad1', 'Numpad1'),
        Numpad2 : new KeyboardInputIdentifier('Numpad2', 'Numpad2'),
        Numpad3 : new KeyboardInputIdentifier('Numpad3', 'Numpad3'),
        Numpad4 : new KeyboardInputIdentifier('Numpad4', 'Numpad4'),
        Numpad5 : new KeyboardInputIdentifier('Numpad5', 'Numpad5'),
        Numpad6 : new KeyboardInputIdentifier('Numpad6', 'Numpad6'),
        Numpad7 : new KeyboardInputIdentifier('Numpad7', 'Numpad7'),
        Numpad8 : new KeyboardInputIdentifier('Numpad8', 'Numpad8'),
        Numpad9 : new KeyboardInputIdentifier('Numpad9', 'Numpad9'),
        Numpad0 : new KeyboardInputIdentifier('Numpad0', 'Numpad0'),

        BracketLeft : new KeyboardInputIdentifier('BracketLeft', 'Bracket Left'),
        BracketRight : new KeyboardInputIdentifier('BracketRight', 'Bracket Right'),
        Semicolon : new KeyboardInputIdentifier('Semicolon', 'Semicolon'),
        Quote : new KeyboardInputIdentifier('Quote', 'Quote'),
        Backslash : new KeyboardInputIdentifier('Backslash', 'Backslash'),
        Comma : new KeyboardInputIdentifier('Comma', 'Comma'),
        Period : new KeyboardInputIdentifier('Period', 'Period'),
        Slash : new KeyboardInputIdentifier('Slash', 'Slash')
});