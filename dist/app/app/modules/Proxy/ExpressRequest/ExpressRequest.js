"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * El proposito de esta clase es armar un objeto
 * que simule y actue como un request de Express.
 *
 * @author Daniel Vera Morales
 */
class ExpressRequest {
    constructor(data = null) {
        this._data = {};
        this.dispose();
        if (data !== null) {
            this._data = data;
        }
    }
    addToContainer(index, key, value) {
        const container = typeof this._data[index] === "undefined" ? {} : this._data[index];
        container[key] = value;
        this._data[index] = container;
    }
    /**
     * Añadir cabecera http
     * @param key
     * @param value
     */
    addHeader(key, value) {
        this.addToContainer("headers", key, value);
    }
    /**
     * Añadir una cookie
     * @param key
     * @param value
     */
    addCookie(key, value) {
        this.addToContainer("cookies", key, value);
    }
    /**
     * Añadir un query request
     * @param key
     * @param value
     */
    addQuery(key, value) {
        this.addToContainer("query", key, value);
    }
    /**
     * Añadir valores form request
     * @param key
     * @param value
     */
    addBody(key, value) {
        this.addToContainer("body", key, value);
    }
    dispose() {
        this._data = {
            method: "",
            body: {},
            query: {},
            headers: {},
            cookies: {}
        };
    }
    set method(value) {
        this._data["method"] = value;
    }
    /**
     * Añadir datos al cuerpo del request
     */
    set body(value) {
        this._data["body"] = value;
    }
    set query(value) {
        this._data["query"] = value;
    }
    set headers(value) {
        this._data["headers"] = value;
    }
    set cookies(value) {
        this._data["cookies"] = value;
    }
    build() {
        return this._data;
    }
}
exports.ExpressRequest = ExpressRequest;
//# sourceMappingURL=ExpressRequest.js.map