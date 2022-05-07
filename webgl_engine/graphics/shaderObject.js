class ShaderObject{
    /**
     * @param {String} name this Shader name
     * @param {String} vertexCode the vertex shader source code
     * @param {String} fragmentCode the fragment shader source code
     * @param {String} createdBy the renderable object class name that first created this shader.
     */
    constructor(name, vertexCode, fragmentCode, createdBy) {
        this.name = name;
        this.vertexCode = vertexCode;
        this.fragmentCode = fragmentCode;
        this.creatorName = createdBy;
        this.userNames = []; // The other objects using this shader.
        this.webglShaderProgram = null;
    }

    isThisMe(name, vertexCode, fragmentCode){
        return (
            StringUtils.areEquals(this.name, name) &&
            StringUtils.areEquals(this.vertexCode, vertexCode) &&
            StringUtils.areEquals(this.fragmentCode, fragmentCode)
        )
    }

    registerUser(userName){
        for (let i = 0; i < this.userNames.length; i++){
            if (StringUtils.areEquals(userName, this.userNames[i])) return;
        }
        this.userNames.push(userName);
    }
}