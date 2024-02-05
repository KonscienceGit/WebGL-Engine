class MultiSprite extends Sprite {
    /**
     * Can render multiple similar sprites (of same image size) with reduced overhead. Useful for particles.
     * Currently achieved by updating the basic uniforms between each render but only setting/binding a texture2D_array once for all sprites.
     * @param {options} options the sprite options.
     * @param {string[]|string} [options.imagespaths] the path (or array of pathes) to the images to loaf in the sprites.
     * @param {Vec4} [options.color] the sprite color, if not using an image (or the image is not found.)
     */
    constructor(options) {
        super(options);
    }

    draw(renderer) {
        this.initGraphics(renderer);
        const gl = renderer.getGLContext();
        this.setupContext(renderer);
        this.childrenNodes.forEach(instance => {
            if (instance.isVisible()) {
                this.setupUniforms(gl, instance);
                gl.drawArrays(gl.TRIANGLES, 0, 6);
            }
        });
        super.restoreContext(gl);
    }

    /**
     * Create a sub sprite to render.
     * By default, the created subsprite entity is added to the multsprite childs to render, set to false to allow for custom behaviors.
     * A subsprite is basically a regular entity and can be created manually.
     * @param {boolean} [addToChildren=true] true to automatically add the subsprite to this MultiSprite childs for render.
     * @returns {Entity}
     */
    createSubSprite(addToChildren) {
        const newChild = new Entity();
        if (addToChildren) this.add(newChild);
        return newChild;
    }
}
