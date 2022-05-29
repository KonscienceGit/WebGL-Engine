class GraphicCursor extends Entity {
    constructor(renderer, cursorProperty) {
        super();
        this._cursorProperty = cursorProperty;
        const path = '../../resources/cursorparrot/';
        const filePathes = [];
        for (let i = 0; i < 10; i++) {
            filePathes.push(path + i + '.png');
        }
        this._body = new Sprite(renderer, filePathes);
        this._initCursorImage = true;
        this._anim = 0;
    }

    draw(renderer) {
        if (this._initCursorImage && this._body.isLoaded()) {
            this._initCursorImage = false
            const size = renderer.getCamera().getScreenWorldSize().y / 20;
            this._body.renderSizeXY.setValues(size, size);
            this._body.visible = true;
        }
        if (this._cursorProperty.isOutside) return;
        this._body.position.copy(this._cursorProperty.screenWorldPos);
        this._body.position.x += this._body.renderSizeXY.x / 2;
        this._body.position.y -= this._body.renderSizeXY.y / 2;
        this._body.draw(renderer);
    }

    updateEntity(delta){
        this._anim += delta * 30;
        if (this._anim >= 10) this._anim = 0;
        this._body.textureLayer = Math.floor(this._anim);
    }
}
