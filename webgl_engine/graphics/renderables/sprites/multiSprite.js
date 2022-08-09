class MultiSprite extends Sprite {
    /**
     * Can render multiple similar sprites (of same image size) with reduced overhead. Useful for particles.
     * Currently achieved by updating the basic uniforms between each render but only setting/binding a texture2D_array once for all sprites.
     * @param {Renderer} renderer
     * @param {options} options the sprite options.
     * @param {string[]|string} [options.imagespaths] the path (or array of pathes) to the images to loaf in the sprites.
     * @param {Vec4} [options.color] the sprite color, if not using an image (or the image is not found.)
     */
    constructor(renderer, options) {
        super(renderer, options);
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
     * @param {boolean} addToIntances true to automatically add to this MultiSprite instances.
     * @returns {Entity}
     */
    createNewInstance(addToIntances) {
        const newInstance = new Entity().copy(this);
        newInstance.visible = true;
        if (addToIntances) this.addInstance(newInstance);
        return newInstance;
    }
}
