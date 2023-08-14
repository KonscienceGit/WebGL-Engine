class LoadingManager {
    /**
     * Call the given callback function when all of the nodes in the given array are finished loading.
     * @param {Array.<Entity>|Entity} scene entity, array of entities, or a scene of objects that need to be loaded before some action.
     * @param {function} callback the callback function when all given entities finished loading.
     * @param {(loaded: number, total: number) => void} [onProgress] the callback function when some additional entity have been loaded. function signature is<br> (loaded: number, total: number) => void
     */
    static callbackWhenLoaded(scene, callback, onProgress) {
        let entitiesArray;
        if (scene instanceof Entity) {
            entitiesArray = scene.getAllNodes();
        } else if (Array.isArray(scene)) {
            entitiesArray = scene;
        } else {
            console.warn('Error: ' + scene + ' is not an netity, array of entity or a Scene.');
            return;
        }
        // TODO if scene instanceof Scene

        this.#checkLoading(entitiesArray, callback, 0, onProgress);
    }

    /**
     * Internal loading check method.
     * @param {Array.<Entity>} entities entity, array of entities, or a scene of objects that need to be loaded before some action.
     * @param {function} callback the callback function when all given entities finished loading.
     * @param {number} previousLoaded the previously loaded number of entities, will call onProgress if this number increase.
     * @param {function} [onProgress] the callback function when some additional entity have been loaded.
     */
    static #checkLoading(entities, callback, previousLoaded, onProgress) {
        const nbNode = entities.length;
        let loadedCount = 0;

        setTimeout(function () {
            for (let i = 0; i < nbNode; i++) {
                if (entities[i].isLoaded()) loadedCount++;
            }

            if (loadedCount === nbNode) {
                callback();
            } else if (loadedCount > previousLoaded && onProgress != null) {
                onProgress();
            } else {
                LoadingManager.#checkLoading(entities, callback, loadedCount, onProgress);
            }
        }, 10);
    }
}
