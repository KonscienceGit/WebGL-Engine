const GameInputActions = Object.freeze({
    // General / commons
    CURSOR_AT: Symbol("cursorat"),

    // Gameplay
    SHIP_LEFT:  "Move ship left",
    SHIP_RIGHT:  "Move ship right",
    SHIP_FIRE:  "Fire ship cannon",
    SHIP_TO_CURSOR: "Move ship toward cursor position",
    //Menus
    MENU_RETURN_TO_MAIN: "Return to the main menu",
    MENU_VALID_SELECTION: "Valid the selected menu",

    // TODO Old inputs
    RETURN: Symbol("return"),
    ACTION:   Symbol("action"),
    ACTION_HOLD:   Symbol("actionhold"),
    LEFT:  Symbol("left"),
    RIGHT: Symbol("right"),
    LEFT_HOLD:  Symbol("lefthold"),
    RIGHT_HOLD: Symbol("righthold"),
    CLICK_AT: Symbol("clickat")
});
