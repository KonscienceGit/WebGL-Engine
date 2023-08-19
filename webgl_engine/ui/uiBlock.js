/**
 * UI block used to design UI spaces
 */
class UIBlock {
    /**
     * @param {Vec2} size the relative size of this block represented by scalar (1 for 100% of parent size, 0.5 for 50% and so on).
     */
    constructor(size) {
        /**
         * @type {Set<UIBlock>}
         */
        this._children = new Set();
        this._relativePosition = new Vec2(0, 0);
        this._relativeSize = size.clone();
        this._onUpdate = null;
        this._tmpSize = new Vec2();
        this._tmpPos = new Vec2();
    }

    addBlock(block) {
        this._children.add(block);
    }

    removeBlock(block) {
        this._children.delete(block);
    }

    setMarginLeft(margin) {
        this._relativePosition.x = -0.5 + margin + this._relativeSize.x / 2;
    }

    setMarginRight(margin) {
        this._relativePosition.x = 0.5 - margin - this._relativeSize.x / 2;
    }

    setHorizontalPos(pos) {
        this._relativePosition.x = pos;
    }

    setMarginTop(margin) {
        this._relativePosition.y = 0.5 - margin - this._relativeSize.y / 2;
    }

    setMarginBottom(margin) {
        this._relativePosition.y = -0.5 + margin + this._relativeSize.y / 2;
    }

    setVerticalPos(pos) {
        this._relativePosition.y = pos;
    }

    update(parentSize, parentPosition, args) {
        const size = this._tmpSize;
        size.copy(parentSize).mul(this._relativeSize);
        const pos = this._tmpPos;
        pos.copy(parentSize).mul(this._relativePosition).add(parentPosition);
        if (this._onUpdate != null) this._onUpdate(size, pos, args);
        if (this._children.size > 0) {
            this._children.forEach((block) => {
                block.update(size, pos, args);
            })
        }
    }

    /**
     * Set the callback which will be used upon update of this block.
     * Callback signature is
     *   callback ({Vec2} size, {Vec2} position, {any} args) => void
     * Where
     * -size is the absolute size of the block, computed by taking all parents into account
     * -position is the absolute position of the block, computed by taking all parents into account
     * -args are additional arguments that can be set by the user when calling for .update()
     * @param {Function} callback the callback
     */
    setOnUpdateCallback(callback) {
        this._onUpdate = callback;
    }

    dispose() {
        // to implement if necessary
    }
}
