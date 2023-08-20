class Orrery2DObjectsManager {
    /**
     * @param {Renderer} renderer
     */
    constructor(renderer) {
        this._root = new Entity();
        this.renderer = renderer;

        this.fullscreenButton = new Sprite(renderer, {imagespaths: '../../resources/minesweeper/Fullscreen.png'});

        const sun = new Planet(renderer, 0.5, new Vec4(1, 1, 0, 1));
        const earth = new Planet(renderer, 0.1, new Vec4(0, 0, 1, 1));

        earth.position.setValues(1.5, 0);
        sun.add(earth);

        const moon = new Planet(renderer, 0.04, new Vec4(0.5, 0.5, 0.5, 1));
        moon.position.x = 0.25;
        earth.add(moon);

        this._root.add(sun);
        this._root.add(this.fullscreenButton);

        this.sun = sun;
        this.earth = earth;
    }

    getRoot() {
        return this._root;
    }
}
