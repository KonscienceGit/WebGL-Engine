class MultiSprite extends Sprite {
    /**
     * Can render multiple similar sprites (of same image size) with reduced overhead. Useful for particles.
     * Currently achieved by updating the basic uniforms between each render but only setting/binding a texture2D_array once for all sprites.
     * @param {Renderer} renderer
     * @param {String[]|String} imagesPaths the path (or array of pathes) to the images to loaf in the sprites.
     */
    constructor(renderer, imagesPaths) {
        super(renderer, imagesPaths);
        this._spriteInstances = [];
    }

    draw(renderer) {
        const gl = renderer.getGLContext();
        this.setupContext(renderer);
        this._spriteInstances.forEach(instance => {
            if (instance.isVisible()) {
                this.setupUniforms(gl, instance);
                gl.drawArrays(gl.TRIANGLES, 0, 6);
            }
        });

        super.restoreContext(gl);
    }

    /**
     * @param {Entity[]} instancesArray
     */
    setInstances(instancesArray) {
        this._spriteInstances = instancesArray;
    }

    /**
     * @param {Entity} instance
     */
    addInstance(instance) {
        this._spriteInstances.push(instance);
    }

    /**
     * @return {Entity[]}
     */
    getInstances() {
        return this._spriteInstances;
    }

    /**
     * @returns {Entity}
     */
    createNewInstance() {
        const newInstance = new Entity().copy(this);
        newInstance.visible = true;
        return newInstance;
    }
}
