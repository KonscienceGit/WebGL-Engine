export class StringUtils{
    constructor() {
    }

    /**
     * @param {string|String} str1
     * @param {string|String} str2
     */
    static areEquals(str1, str2){
        if (str1.length !== str2.length) return false;
        return str1.localeCompare(str2) === 0;
    }
}