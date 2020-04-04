"use strict";
const JSONUtils_1 = require("@utils/JSONUtils");
/***
 * Anotación para lecturas de JSON
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 */
class JsonAnnotated {
    /**
     *
     * @param whereToSet variable donde se almacenará la lectura del json
     * @param reader lector de json files
     */
    constructor(whereToSet, reader, opts = null) {
        this.whereToSet = whereToSet;
        this.reader = reader;
        this.opts = opts;
    }
    /**
     * Helper para ejecución desde un metodo
     */
    method(target, propertyKey, descriptor) {
        target[this.whereToSet] = this.reader.readFile();
    }
    /**
     * Helper de ejecución desde una clase
     */
    clazz(constructor) {
        constructor.prototype[this.whereToSet] = this.reader.readFile();
    }
    /**
     * Lee una configuracion, busca un indice en cadena con una version y lo coloca en una variable.
     */
    clazzChain(constructor) {
        const wrapper = this.reader.readFile();
        const results = this.readCycl(wrapper, constructor.prototype);
        if (!results) {
            return;
        }
        constructor.prototype[this.whereToSet] = results;
    }
    readCycl(wrapper, context = false) {
        if (this.opts == null || wrapper === null) {
            return false;
        }
        const readFromvar = typeof this.opts["var"] !== 'undefined' && this.opts["var"] === true;
        let path = this.opts["path"];
        let version = this.opts["version"];
        if (path === null || version === null || (readFromvar && !context)) {
            return false;
        }
        if (readFromvar) {
            path = context[path];
            version = context[version];
        }
        return wrapper.readCycl(path, version);
    }
    /**
     * Lee el archivo desde un atributo en la clase objetivo.
     * El archivo leeido se coloca en el reader y se invoca una invocacion
     * clazzchain.
     */
    dataFromAttr(target, key) {
        let value = target[key];
        const self = this;
        const myreader = this.reader;
        const getter = function () {
            return value;
        };
        const setter = function (newVal) {
            myreader.dataSource = newVal;
            const wrapper = myreader.readFile();
            const results = self.readCycl(wrapper, this);
            value = (results) ? results : wrapper;
        };
        if (delete target[key]) {
            Object.defineProperty(target, key, {
                get: getter,
                set: setter,
                enumerable: true,
                configurable: true
            });
        }
    }
}
const annotation = (fileToRead, whereToSet, useReader = false) => {
    const reader = new JSONUtils_1.JsonReader(fileToRead, useReader);
    const obj = new JsonAnnotated(whereToSet, reader);
    return obj.clazz.bind(obj);
};
const annotation_find = (fileToRead, whereToSet, path, mode) => {
    const reader = new JSONUtils_1.JsonReader(fileToRead, true);
    const obj = new JsonAnnotated(whereToSet, reader, [path, mode]);
    return obj.clazzChain.bind(obj);
};
const annotation_invoke = (useReader = false, opts = null) => {
    const reader = new JSONUtils_1.JsonReader(null, useReader);
    const obj = opts == null ? new JsonAnnotated(null, reader) : new JsonAnnotated(null, reader, opts);
    return obj.dataFromAttr.bind(obj);
};
const methodInvokation = (path) => {
    return (target, propertyKey, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = function () {
            return JSONUtils_1.JsonUtils.extractJSONFromMethod(this, originalMethod, path);
        };
    };
};
module.exports = {
    GJSON: annotation_find,
    JSON: annotation,
    TAKE_AS_NAME: annotation_invoke,
    JsonAnnotated: JsonAnnotated,
    JsonReader: JSONUtils_1.JsonReader,
    JsonWrapper: JSONUtils_1.JsonWrapper,
    MethodExtract: methodInvokation
};
//# sourceMappingURL=JSON.js.map