class LoadingManager {
    /**
     * Call the given callback function when all of the nodes in the given array are finished loading.
     * @param {Array.<Sprite>} spriteArray array of objects that possess a .isLoaded() method.
     * @param callback the callback function.
     */
    static callbackWhenLoaded(spriteArray, callback) {
        let nbNode = spriteArray.length;
        let loadedCount = 0;

        setTimeout(function () {
            for (let i = 0; i < nbNode; i++) {
                if (spriteArray[i].isLoaded()) {
                    loadedCount++;
                }
            }

            if (loadedCount === nbNode) {
                callback();
            } else {
                LoadingManager.callbackWhenLoaded(spriteArray, callback);
            }
        }, 10);

    }
}