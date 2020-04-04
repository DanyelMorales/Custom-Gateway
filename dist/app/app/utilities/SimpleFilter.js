"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IJsonType_1 = require("./IJsonType");
/**
 * Filtra un resultado de modo que se pueda modificar.
 */
class SimpleFilter {
    constructor() {
        this.filters = new IJsonType_1.JSONType();
    }
    /**
     * Agrega un nuevo filtro basado en lambdas de tipo T
     * @param key
     * @param value
     */
    addFilter(key, value) {
        this.filters.put(key, value);
        return this;
    }
    addFilterGuard(key, value) {
        this.addFilter(key, value);
        return this;
    }
    /**
     * @param key
     * @param data indice 0 deberia ser el principal dato a retornar, el resto son opciones
     * @returns indice 0 del arreglo de argumentos que se ha pasado,
     * si no existe filtro alguno
     */
    applyFilter(key, ...data) {
        if (!this.filters.has(key)) {
            return data[0];
        }
        const fx = this.filters.get(key);
        const result = fx.apply(fx, data);
        if (!result) {
            return data[0];
        }
        return result;
    }
    /**
     * Siempre retorna un booleano
     * @param key filtro a ejecutar
     * @param data  datos a evaluar
     */
    applyGuard(key, ...data) {
        return this.applyFilter(key, data);
    }
}
exports.SimpleFilter = SimpleFilter;
//# sourceMappingURL=SimpleFilter.js.map