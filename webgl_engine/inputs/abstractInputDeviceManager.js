import {ConsoleUtils} from "../utils/consoleUtils.js";

export class AbstractInputDeviceManager {
    constructor() {
    }

    /**
     * Perform necessary operations after finishing parsing. (like setting the mousewheel state back to 0)
     * @abstract
     */
    postParsingUpdate(){
        ConsoleUtils.nonImplementedError();
    }
}
