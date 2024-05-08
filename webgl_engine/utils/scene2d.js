/**
 * A scene is a combination of a scenegraph and a camera.
 * It serves mainly as a convenience tool to manage multiple scenes/camera angles more easily.
 * A scene can be rendered in a renderer.
 * renderer.setScene(scene) will set the scene active, and
 */
export class Scene2D {
    /**
     * Scene constructor.
     * Root entity and Camera
     * @param {Entity} root the Entity2D
     * @param {Camera2D} camera the camera2D
     */
    constructor(root, camera) {
        this._root = root;
        this._camera = camera;
    }

    /**
     * @param {Camera2D} camera the camera2D
     */
    setCamera(camera) {
        this._camera = camera;
    }

    getCamera() {
        return this._camera;
    }

    /**
     * @param {Entity} root the Entity2D
     */
    setRoot(root) {
        this._root = root;
    }

    getRoot() {
        return this._root
    }
}
