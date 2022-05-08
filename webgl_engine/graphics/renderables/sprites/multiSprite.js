class MultiSprite extends Sprite {
    /**
     * Can render multiple similar sprites (of same image size) with reduced overhead. Useful for particles.
     * Currently achieved by updating the basic uniforms between each render but only setting/binding a texture2D_array once for all sprites.
     * Todo: implement/convert to instanced rendering.
     * @param {Renderer} renderer
     * @param {String[]|String} imagesPaths the path (or array of pathes) to the images to loaf in the sprites.
     */
    constructor(renderer, imagesPaths) {
        super(renderer, imagesPaths);
        this._spriteInstances = []; // TODO use childnodes as the sprites instances
    }

    draw(renderer) {
        const gl = renderer.getGLContext();
        this.setupContext(renderer);
        this._spriteInstances.forEach(instance => {
            if (instance.isVisible) {
                this.setupInstanceUniforms(gl, instance);
                gl.drawArrays(gl.TRIANGLES, 0, 6);
            }
        });

        super.restoreContext(gl);
    }

    /**
     * @param {WebGL2RenderingContext} gl
     * @param {Entity} instance
     */
    setupInstanceUniforms(gl, instance) {
        gl.uniform2fv(this._spriteDimensionsUniform, [instance.renderSizeXY.x, instance.renderSizeXY.y]);
        gl.uniform2fv(this._scaleUniform, [instance.scale.x, instance.scale.y]);
        gl.uniform2fv(this._positionUniform, [instance.position.x, instance.position.y]);
        gl.uniform1f(this._rotationUniform, instance.rotation);
        gl.uniform1i(this._textureLayerUniform, instance.textureLayer);
    }

    /**
     * @param {Entity[]}instancesArray
     */
    setInstances(instancesArray) {
        this._spriteInstances = instancesArray;
    }

    /**
     * @param {Entity}instance
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

    release() {
        this._spriteInstances = [];
    }
}
