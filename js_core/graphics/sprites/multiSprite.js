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

    draw(gl) {
        if (!this.isVisible()) {
            return;
        }
        this.setupContext(gl);
        this._spriteInstances.forEach(instance => {
            if (instance.isVisible) {
                this.setupInstanceUniforms(gl, instance);
                gl.drawArrays(gl.TRIANGLES, 0, 6);
            }
        });

        super.restoreContext(gl);
    }

    /**
     * @param {number} delta
     */
    updateSprite(delta) {
        super.updateSprite(delta);
        this._spriteInstances.forEach(entity => entity.timeAlive += delta);
    }

    setupAttribs(gl) {
        super.setupAttribs(gl);
        gl.uniform2fv(this._canvasDimensionsUniform, [this._canvasDim.x, this._canvasDim.y]);
    }

    /**
     * @param {WebGL2RenderingContext} gl
     * @param {EntityProperties} instance
     */
    setupInstanceUniforms(gl, instance) {
        gl.uniform2fv(this._spriteDimensionsUniform, [instance.renderSizeXY.x, instance.renderSizeXY.y]);
        gl.uniform2fv(this._scaleUniform, [instance.scale.x, instance.scale.y]);
        gl.uniform2fv(this._positionUniform, [instance.position.x, instance.position.y]);
        gl.uniform1f(this._rotationUniform, instance.rotation);
        gl.uniform1i(this._textureLayerUniform, instance.textureLayer);
    }

    /**
     * @param {Array.<EntityProperties>}instancesArray
     */
    setInstances(instancesArray) {
        this._spriteInstances = instancesArray;
    }

    /**
     * @param {EntityProperties}instance
     */
    addInstance(instance) {
        this._spriteInstances.push(instance);
    }

    /**
     * @return {Array.<EntityProperties>}
     */
    getInstances() {
        return this._spriteInstances;
    }

    /**
     * @returns {EntityProperties}
     */
    createNewInstance() {
        const newInstance = this._entityProperties.clone();
        newInstance.isVisible = true;
        return newInstance;
    }

    release() {
        this._spriteInstances = [];
    }
}