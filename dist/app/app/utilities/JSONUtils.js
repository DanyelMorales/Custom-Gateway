"use strict";
/**
 * Anotación que carga un archivo JSON y lo coloca en el target
 *
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 * @fileToRead Nombre del archivo que desea ser cargado, sin la extensión json
 * @whereToSet nombre de la variable donde será colocado el contenido del archivo
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Se cargan las dependencias del sistema
 */
const fs = require("fs");
// const pathToRoot = __dirname + "/../";
const events_1 = require("events");
__export(require("./IJsonType"));
class JsonUtils {
    static extractJSONFromMethod(context, originalMethod, path) {
        const jsonValue = originalMethod.apply(context, arguments);
        const wrapper = new JsonWrapper(jsonValue);
        return wrapper.readCycl(path);
    }
}
exports.JsonUtils = JsonUtils;
/**
 * Wrapper de lecturas JSON
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 */
class JsonWrapper extends events_1.EventEmitter {
    /**
     * @param json contenido json
     */
    constructor(json) {
        super();
        this.json = json;
    }
    set jsonObj(value) {
        this.json = value;
    }
    /**
     * Busca dentro de una cadena de llaves, utilizando cada llave una version dentro de una pila de datos.
     */
    readCycl(needlesPath, version = null, haystack = false) {
        const needles = needlesPath.split(">");
        for (const needle of needles) {
            haystack = this.read(needle, version, haystack);
        }
        return haystack;
    }
    /**
     * Busca una llave de una pila de datos, si no se asigna datos entonces se utiliza el pasado como
     * argumento a la clase.
     *
     * @param needle
     * @param version
     * @param haystack
     */
    read(needle, version = null, haystack = false) {
        if (!haystack) {
            haystack = this.json;
        }
        return this.seek(needle, version, haystack);
    }
    toJSON() {
        return this.json;
    }
    get haystack() {
        return this.json;
    }
    /**
     * @param needle   que se va a buscar
     * @param version   que version se va a buscar
     * @param haystack de donde se va a buscar
     *
     * @return si existe la version se retorna, si no se retorna sin version
     */
    seek(needle, version = "", haystack) {
        this.emit(JsonWrapper.ON_BEFORE_SEEKING, needle, version);
        if (typeof haystack[needle] === "undefined") {
            this.emit(JsonWrapper.ON_NOT_FOUND_SEEKING, needle);
            return;
        }
        const newhaystack = haystack[needle];
        if (typeof newhaystack[version] === "undefined") {
            this.emit(JsonWrapper.ON_VERSION_NOT_FOUND_SEEKING, needle, version);
            return newhaystack;
        }
        const result = newhaystack[version];
        if (typeof result === "object") {
            result["parent"] = version;
            result["needle"] = needle;
            this.decorateMatch(newhaystack, result, "common");
        }
        this.emit(JsonWrapper.ON_RESULT_SEEKING, needle, version, result);
        return result;
    }
    findParentCycl(needlesPath, haystack = null) {
        haystack = haystack === null ? this.json : haystack;
        const needles = needlesPath.split(">");
        for (const needle of needles) {
            haystack = this.findParent(needle, haystack);
        }
        return haystack;
    }
    findParent(needle, haystack = null) {
        haystack = haystack === null ? this.json : haystack;
        for (const index in haystack) {
            if (index === needle) {
                return haystack[index];
            }
        }
        return haystack;
    }
    decorateMatch(haystack, match, needle) {
        if (typeof haystack[needle] !== "undefined") {
            match[needle] = haystack[needle];
        }
        return match;
    }
    findByAttrIM(attr, haystack = null) {
        haystack = haystack === null ? this.json : haystack;
        const result = new JsonResult();
        for (const index in haystack) {
            if (typeof haystack[index] === "undefined" ||
                typeof haystack[index][attr] === "undefined") {
                continue;
            }
            const currentMatch = Object.assign({}, haystack[index]);
            const attrMatched = Object.assign({}, currentMatch[attr]);
            attrMatched["parent"] = index;
            attrMatched["name"] = attr;
            result.haystack = currentMatch;
            result.result = attrMatched;
            result.isFound = true;
            result.name = attr;
            result.parent = index;
            break;
        }
        return result;
    }
    /**
     * @deprecated
     * @param attr
     * @param haystack
     */
    findByAttr(attr, haystack = null) {
        haystack = haystack === null ? this.json : haystack;
        for (const index in haystack) {
            if (typeof haystack[index] === "undefined" ||
                typeof haystack[index][attr] === "undefined") {
                continue;
            }
            const currentHaystack = haystack[index];
            const currentMatch = currentHaystack[attr];
            currentMatch["parent"] = index;
            currentMatch["name"] = attr;
            return currentMatch;
        }
        return haystack;
    }
}
JsonWrapper.ON_NOT_FOUND_SEEKING = "SEEKING@RESULT_NOT_FOUND";
JsonWrapper.ON_VERSION_NOT_FOUND_SEEKING = "SEEKING@VERSION_NOT_FOUND";
JsonWrapper.ON_BEFORE_SEEKING = "SEEKING@BEFORE_SEEKING";
JsonWrapper.ON_RESULT_SEEKING = "SEEKING@RESULT_FOUND";
exports.JsonWrapper = JsonWrapper;
class JsonResult {
    constructor() {
        this._isFound = false;
    }
    get result() {
        return this._result;
    }
    set result(v) {
        this._result = v;
    }
    get isFound() {
        return this._isFound;
    }
    set isFound(v) {
        this._isFound = v;
    }
    get parent() {
        return this._parent;
    }
    set parent(v) {
        this._parent = v;
    }
    get haystack() {
        return this._haystack;
    }
    set haystack(v) {
        this._haystack = v;
    }
    get name() {
        return this._name;
    }
    set name(v) {
        this._name = v;
    }
}
exports.JsonResult = JsonResult;
/**
 * Lector de archivos json
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 */
class JsonReader {
    /**
     * @param fileToRead archivo que se cargará
     * @param useReader true si se necesita un wrapper o false de lo contrario.
     */
    constructor(fileToRead, useReader = false) {
        this.fileToRead = fileToRead;
        this.useReader = useReader;
        this.extension = ".json";
        this.formatFileName();
    }
    formatFileName() {
        this.fileName = this.fileToRead + this.extension;
    }
    /**
     * Leer archivo
     */
    readFile() {
        const json = JSON.parse(fs.readFileSync(this.fileName, "utf8"));
        if (this.useReader) {
            return new JsonWrapper(json);
        }
        return json;
    }
    get dataSource() {
        return this.fileToRead;
    }
    set dataSource(data) {
        this.fileToRead = data;
        this.formatFileName();
    }
}
exports.JsonReader = JsonReader;
//# sourceMappingURL=JSONUtils.js.map