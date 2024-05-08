import {ShadersUtil} from "../shadersUtil.js";
import {Entity} from "../../utils/entity.js";

const LINE_VERTEX_SHADER = ShadersUtil.SHADER_HEADER +
    'uniform mat3 modelWorld;' +
    'uniform mat3 viewProj;' +
    'in vec2 vertCoords;' +

    'void main(void) {' +
    // Transform Vec2 to Vec3, then
    // convert from [-0.5, 0.5] to [-1, 1] space
    '    vec3 pos = vec3(vertCoords, 1.) * modelWorld * viewProj * 2.;' +
    '    gl_Position = vec4(pos.xy, 0., 1.);' +
    '}';

const LINE_FRAGMENT_SHADER = ShadersUtil.SHADER_HEADER +
    'uniform vec4 color;' +
    'out vec4 outColor;' +

    'void main(void) {' +
    '    outColor = color;' +
    '}';

/**
 * Can be animated by storing multiple images.
 */
export class Line extends Entity {
    /**
     * @param {number[]} x positions
     * @param {number[]} y positions
     * @param {Vec4} colorVec4
     */
    constructor(x, y, colorVec4) {
        super();
        this._shaderName = 'Line';
        this._initialized = false;
        this.setVisible(true);
        this._updateVBO = false;
        const pts = [];
        for (let i = 0; i < x.length; i++) {
            pts.push(x[i], y[i]);
        }
        this._vertices = new Float32Array(pts);
        this._nbPts = this._vertices.length / 2;

        this.color.copy(colorVec4);

        this._uniFp2 = new Float32Array(2);
        this._uniFp4 = new Float32Array(4);
    }

    initGraphics(renderer) {
        // Shaders, get attributes and uniforms handles
        const gl = renderer.getGLContext();
        const shaderUtils = renderer.getShaderUtils();
        this._program = shaderUtils.getOrCreateShader(gl, this._shaderName, LINE_VERTEX_SHADER, LINE_FRAGMENT_SHADER, this.constructor.name);
        gl.useProgram(this._program);
        this._coordAttrib = gl.getAttribLocation(this._program, "vertCoords");
        this._textCoordAttrib = gl.getAttribLocation(this._program, "textCoordinates");

        this._scaleUniform = gl.getUniformLocation(this._program, "scale");
        this._positionUniform = gl.getUniformLocation(this._program, "position");
        this._rotationUniform = gl.getUniformLocation(this._program, "rotation");
        this._colorUniform = gl.getUniformLocation(this._program, "color");

        this._modelWorldMatUniform = gl.getUniformLocation(this._program, "modelWorld");
        this._viewProjMatUniform = gl.getUniformLocation(this._program, "viewProj");

        // VAO setup
        this._vao = gl.createVertexArray();
        gl.bindVertexArray(this._vao);

        this._vertex_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertex_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this._vertices, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this._coordAttrib);
        const fp32Bytes = 4;
        const vertexCoord = 2;
        const stride = vertexCoord * fp32Bytes;
        gl.vertexAttribPointer(this._coordAttrib, 2, gl.FLOAT, false, stride, 0);
    }

    draw(renderer) {
        if (!this._initialized) {
            this._initialized = true;
            this.initGraphics(renderer);
        }
        const gl = renderer.getGLContext();
        this.setupContext(renderer);
        gl.drawArrays(gl.LINE_STRIP, 0, this._nbPts);
        this.restoreContext(gl);
        super.draw(renderer);
    }

    /**
     * @protected
     * @param {Renderer} renderer
     */
    setupContext(renderer) {
        const gl = renderer.getGLContext();
        gl.bindVertexArray(this._vao);
        gl.useProgram(this._program);
        this.setupUniforms(gl, this);
        renderer.getCamera().setViewProjectionUniform(gl, this._viewProjMatUniform);
    }

    /**
     * For debug purpose. Can be disabled if the scene renders correctly without it.
     * @param {WebGL2RenderingContext} gl
     */
    restoreContext(gl) {
        // gl.bindVertexArray(null);
    }

    /**
     * @protected
     * @param {WebGL2RenderingContext} gl
     * @param {Entity} entity
     */
    setupUniforms(gl, entity) {
        gl.uniformMatrix3fv(this._modelWorldMatUniform, false, entity.modelWorldMat.m);
        gl.uniform4fv(this._colorUniform, entity.color.toArray(this._uniFp4));
    }
}
