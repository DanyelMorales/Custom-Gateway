"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSONUtils_1 = require("@utils/JSONUtils");
const events_1 = require("events");
class ActionFilter extends events_1.EventEmitter {
    constructor() {
        super();
        this.filters = new JSONUtils_1.JSONType();
    }
    addFilter(key, value) {
        this.filters.put(key, value);
        return this;
    }
    /**
     *
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
        this.emit(key, result);
        return result;
    }
}
exports.ActionFilter = ActionFilter;
//# sourceMappingURL=ActionFIlter.js.map