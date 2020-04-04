"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Simula el MAP de java para abstraer cualquier objeto JSON.
 *
 * Wrapper para JSON
 */
class JSONType {
    constructor(customdata = {}) {
        this.customdata = customdata;
        this.data = {};
        this.data = customdata;
    }
    getAll() {
        return this.data;
    }
    /**
     * Agrega un nuevo indice al mapa
     * @param key
     * @param value
     */
    put(key, value) {
        this.data[key] = value;
    }
    /**
     * Remover un indice del mapa
     * @param key
     */
    remove(key) {
        delete this.data[key];
    }
    /**
     * Vacía todos los indices del mapa
     */
    removeAll() {
        delete this.data;
        this.data = {};
    }
    /**
     * Retornar un indice del mapa
     * @param key
     */
    get(key, exceptional = false) {
        if (typeof this.data[key] === "undefined") {
            if (exceptional) {
                throw Error("Key not found in configuration: " + key);
            }
            return null;
        }
        return this.data[key];
    }
    fetch(key, fallback) {
        return this.get(key) || fallback;
    }
    defget(key) {
        return this.get(key) || key;
    }
    /**
     * Agrega indices obteniendolos de un objeto json
     * @param json
     */
    putAll(json) {
        for (const index in json) {
            if (json[index] !== null) {
                this.put(index, json[index]);
            }
        }
    }
    /**
 * Verifica si existe un indice en el mapa
 * @param key
 */
    has(key) {
        return typeof this.data[key] === "undefined" ? false : true;
    }
}
exports.JSONType = JSONType;
//# sourceMappingURL=IJsonType.js.map