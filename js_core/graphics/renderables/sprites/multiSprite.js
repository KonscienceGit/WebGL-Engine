class MultiSprite extends Sprite {
    /**
     * @param {Renderer} renderer
     * @param {String} imageFolder
     * @param {String[]} imagesNames
     */
    constructor(renderer, imageFolder, imagesNames) {
        super(renderer, imageFolder, imagesNames);
        this._spriteInstances = [];
    }

    draw(renderer) {
        if (!this.visible) {
            return;
        }
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