/**
 * Define an object that can be rendered by the Renderer, and loaded by the LoadingManager.
 */
class AbstractRenderable{
    constructor() {
        this._isVisible = false;
    }

    /**
     * @abstract
     * Return whether this object has been loaded or not.
     * When used in a LoadingManager, the Loading processus will not continue until the object is loaded.
     * (usefull if this object's constructor can return before it's ressources has finished loading, like files or asynchronous processing.)
     *
     * @returns {boolean}
     */
    isLoaded(){
        ConsoleUtils.nonImplementedError();
        return false;
    }

    /**
     * Return if this object is visible or not.
     * Not-visible objects are not rendered by the renderer.
     * @returns {boolean}
     */
    isVisible() {
        return this._isVisible;
    }

    /**
     * Set wether this object is visible or not.
     * @param {boolean} visible
     */
    setVisible(visible) {
        this._isVisible = visible;
    }
}