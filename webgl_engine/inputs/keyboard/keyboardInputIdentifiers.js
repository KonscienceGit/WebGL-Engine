import {AbstractInputIdentifier} from "../abstractInputIdentifier.js";

export class KeyboardInputIdentifiers extends AbstractInputIdentifier{
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

export class US_Keyboard {
    static {
        this.q = new KeyboardInputIdentifiers('KeyQ', 'q');
        this.w = new KeyboardInputIdentifiers('KeyW', 'w');
        this.e = new KeyboardInputIdentifiers('KeyE', 'e');
        this.r = new KeyboardInputIdentifiers('KeyR', 'r');
        this.t = new KeyboardInputIdentifiers('KeyT', 't');
        this.y = new KeyboardInputIdentifiers('KeyY', 'y');
        this.u = new KeyboardInputIdentifiers('KeyU', 'u');
        this.i = new KeyboardInputIdentifiers('KeyI', 'i');
        this.o = new KeyboardInputIdentifiers('KeyO', 'o');
        this.p = new KeyboardInputIdentifiers('KeyP', 'p');
        this.a = new KeyboardInputIdentifiers('KeyA', 'a');
        this.s = new KeyboardInputIdentifiers('KeyS', 's');
        this.d = new KeyboardInputIdentifiers('KeyD', 'd');
        this.f = new KeyboardInputIdentifiers('KeyF', 'f');
        this.g = new KeyboardInputIdentifiers('KeyG', 'g');
        this.h = new KeyboardInputIdentifiers('KeyH', 'h');
        this.j = new KeyboardInputIdentifiers('KeyJ', 'j');
        this.k = new KeyboardInputIdentifiers('KeyK', 'k');
        this.l = new KeyboardInputIdentifiers('KeyL', 'l');
        this.z = new KeyboardInputIdentifiers('KeyZ', 'z');
        this.x = new KeyboardInputIdentifiers('KeyX', 'x');
        this.c = new KeyboardInputIdentifiers('KeyC', 'c');
        this.v = new KeyboardInputIdentifiers('KeyV', 'v');
        this.b = new KeyboardInputIdentifiers('KeyB', 'b');
        this.n = new KeyboardInputIdentifiers('KeyN', 'n');
        this.m = new KeyboardInputIdentifiers('KeyM', 'm');

        this.F1 = new KeyboardInputIdentifiers('F1', 'F1');
        this.F2 = new KeyboardInputIdentifiers('F2', 'F2');
        this.F3 = new KeyboardInputIdentifiers('F3', 'F3');
        this.F4 = new KeyboardInputIdentifiers('F4', 'F4');
        this.F5 = new KeyboardInputIdentifiers('F5', 'F5');
        this.F6 = new KeyboardInputIdentifiers('F6', 'F6');
        this.F7 = new KeyboardInputIdentifiers('F7', 'F7');
        this.F8 = new KeyboardInputIdentifiers('F8', 'F8');
        this.F9 = new KeyboardInputIdentifiers('F9', 'F9');
        this.F10 = new KeyboardInputIdentifiers('F10', 'F10');
        this.F11 = new KeyboardInputIdentifiers('F11', 'F11');
        this.F12 = new KeyboardInputIdentifiers('F12', 'F12');

        // Enable at your own risks
        // this.MetaLeft = new KeyboardInputIdentifiers('MetaLeft', 'Meta Left');
        // this.MetaRight = new KeyboardInputIdentifiers('MetaRight', 'Meta Right');
        // this.ContextMenu = new KeyboardInputIdentifiers('ContextMenu', 'Context Menu');
        this.Escape = new KeyboardInputIdentifiers('Escape', 'Escape');

        this.Backquote = new KeyboardInputIdentifiers('Backquote', '`');
        this.Tab = new KeyboardInputIdentifiers('Tab', 'Tab');
        this.CapsLock = new KeyboardInputIdentifiers('CapsLock', 'CapsLock');
        this.ShiftLeft = new KeyboardInputIdentifiers('ShiftLeft', 'Shift');
        this.ShiftRight = new KeyboardInputIdentifiers('ShiftRight', 'Shift Right');
        this.ControlLeft = new KeyboardInputIdentifiers('ControlLeft', 'Control Left');
        this.ControlRight = new KeyboardInputIdentifiers('ControlRight', 'Control Right');
        this.AltLeft = new KeyboardInputIdentifiers('AltLeft', 'Alt Left');
        this.AltRight = new KeyboardInputIdentifiers('AltRight', 'Alt Right');
        this.Space = new KeyboardInputIdentifiers('Space', 'Space');
        this.Enter = new KeyboardInputIdentifiers('Enter', 'Enter');
        this.Backspace = new KeyboardInputIdentifiers('Backspace', 'Backspace');

        this.Digit1 = new KeyboardInputIdentifiers('Digit1', '1');
        this.Digit2 = new KeyboardInputIdentifiers('Digit2', '2');
        this.Digit3 = new KeyboardInputIdentifiers('Digit3', '3');
        this.Digit4 = new KeyboardInputIdentifiers('Digit4', '4');
        this.Digit5 = new KeyboardInputIdentifiers('Digit5', '5');
        this.Digit6 = new KeyboardInputIdentifiers('Digit6', '6');
        this.Digit7 = new KeyboardInputIdentifiers('Digit7', '7');
        this.Digit8 = new KeyboardInputIdentifiers('Digit8', '8');
        this.Digit9 = new KeyboardInputIdentifiers('Digit9', '9');
        this.Digit0 = new KeyboardInputIdentifiers('Digit0', '0');

        this.ArrowLeft = new KeyboardInputIdentifiers('ArrowLeft', 'Arrow Left');
        this.ArrowRight = new KeyboardInputIdentifiers('ArrowRight', 'Arrow Right');
        this.ArrowUp = new KeyboardInputIdentifiers('ArrowUp', 'Arrow Up');
        this.ArrowDown = new KeyboardInputIdentifiers('ArrowDown', 'Arrow Down');

        this.PrintScreen = new KeyboardInputIdentifiers('PrintScreen', 'PrintScreen');
        this.ScrollLock = new KeyboardInputIdentifiers('ScrollLock', 'ScrollLock');
        this.Pause = new KeyboardInputIdentifiers('Pause', 'Pause');

        this.Insert = new KeyboardInputIdentifiers('Insert', 'Insert');
        this.Home = new KeyboardInputIdentifiers('Home', 'Home');
        this.End = new KeyboardInputIdentifiers('End', 'End');
        this.Delete = new KeyboardInputIdentifiers('Delete', 'Delete');
        this.PageUp = new KeyboardInputIdentifiers('PageUp', 'PageUp');
        this.PageDown = new KeyboardInputIdentifiers('PageDown', 'PageDown');

        this.NumLock = new KeyboardInputIdentifiers('NumLock', 'NumLock');
        this.NumpadDivide = new KeyboardInputIdentifiers('NumpadDivide', 'Numpad /');
        this.NumpadMultiply = new KeyboardInputIdentifiers('NumpadMultiply', 'Numpad *');
        this.NumpadSubtract = new KeyboardInputIdentifiers('NumpadSubtract', 'Numpad -');
        this.NumpadAdd = new KeyboardInputIdentifiers('NumpadAdd', 'Numpad +');
        this.NumpadEnter = new KeyboardInputIdentifiers('NumpadEnter', 'Numpad Enter');
        this.NumpadDecimal = new KeyboardInputIdentifiers('NumpadDecimal', 'Numpad .');
        this.Numpad1 = new KeyboardInputIdentifiers('Numpad1', 'Numpad1');
        this.Numpad2 = new KeyboardInputIdentifiers('Numpad2', 'Numpad2');
        this.Numpad3 = new KeyboardInputIdentifiers('Numpad3', 'Numpad3');
        this.Numpad4 = new KeyboardInputIdentifiers('Numpad4', 'Numpad4');
        this.Numpad5 = new KeyboardInputIdentifiers('Numpad5', 'Numpad5');
        this.Numpad6 = new KeyboardInputIdentifiers('Numpad6', 'Numpad6');
        this.Numpad7 = new KeyboardInputIdentifiers('Numpad7', 'Numpad7');
        this.Numpad8 = new KeyboardInputIdentifiers('Numpad8', 'Numpad8');
        this.Numpad9 = new KeyboardInputIdentifiers('Numpad9', 'Numpad9');
        this.Numpad0 = new KeyboardInputIdentifiers('Numpad0', 'Numpad0');

        this.BracketLeft = new KeyboardInputIdentifiers('BracketLeft', '[');
        this.BracketRight = new KeyboardInputIdentifiers('BracketRight', ']');
        this.Semicolon = new KeyboardInputIdentifiers('Semicolon', ';');
        this.Quote = new KeyboardInputIdentifiers('Quote', '\'');
        this.Backslash = new KeyboardInputIdentifiers('Backslash', '\\');
        this.Comma = new KeyboardInputIdentifiers('Comma', ',');
        this.Period = new KeyboardInputIdentifiers('Period', '.');
        this.Slash = new KeyboardInputIdentifiers('Slash', '/');
    }
}

export class FR_Keyboard extends US_Keyboard {
    static {
        // Add/replace AZERTY specific keys
        this.a = new KeyboardInputIdentifiers('KeyQ', 'a');
        this.q = new KeyboardInputIdentifiers('KeyA', 'q');
        this.w = new KeyboardInputIdentifiers('KeyZ', 'w');
        this.z = new KeyboardInputIdentifiers('KeyW', 'z');
        this.m = new KeyboardInputIdentifiers('Semicolon', 'm');
        this.Comma = new KeyboardInputIdentifiers('KeyM', ',');
        this.Semicolon = new KeyboardInputIdentifiers('Comma', ';');
        this.DeuxPoints = new KeyboardInputIdentifiers('Period', ':');
        this.Circonflexe = new KeyboardInputIdentifiers('BracketLeft', '^');
        this.Dollar = new KeyboardInputIdentifiers('BracketRight', '$');
        this.uAccentGrave = new KeyboardInputIdentifiers('Quote', 'ù');
        this.Etoile = new KeyboardInputIdentifiers('Backslash', '*');
        this.Exclamation = new KeyboardInputIdentifiers('Slash', '!');
        this.Exposant2 = new KeyboardInputIdentifiers('Backquote', '²');
    }
}

// Add your own keyboard layouts!
