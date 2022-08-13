class GraphInputsManager extends GeneralInputManager{
    constructor(renderer) {
        super(renderer);
        this.initActions();
    }

    initActions() {
        this.createButtonAction(GraphActions.LEFT_CLICK,true);
        this.addInputToAction(GraphActions.LEFT_CLICK, XboxGamePadInputs.BUTTON_A);
        this.addInputToAction(GraphActions.LEFT_CLICK, US_Keyboard.Enter);
        this.addInputToAction(GraphActions.LEFT_CLICK, Mouse_Identifiers.BUTTON_LEFT);

        this.createPositionAction(GraphActions.CURSOR_MOVE);
        this.addInputToAction(GraphActions.CURSOR_MOVE, Mouse_Identifiers.MOVE_CURSOR);

        this.createAxisAction(GraphActions.MOUSEWHEEL_MOVE_UP);
        this.addInputToAction(GraphActions.MOUSEWHEEL_MOVE_UP, Mouse_Identifiers.WHEEL_1_UP);
        this.createAxisAction(GraphActions.MOUSEWHEEL_MOVE_DOWN);
        this.addInputToAction(GraphActions.MOUSEWHEEL_MOVE_DOWN, Mouse_Identifiers.WHEEL_1_DOWN);
    }
}
