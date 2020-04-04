"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("@app/utilities");
const ProxyEvents_1 = require("@proxy/ProxyEvents");
const Extends_1 = require("@utils/Extends");
const httpMethodsWithNoBody = ["get", "options"];
/**
 * Aplica una serie de estrategias para normalizar
 * el cuerpo de una petición.
 */
function normalizeHttpBody(body, type) {
    if (typeof body == "object" && Object.keys(body).length === 0) {
        return null;
    }
    switch (type) {
        case "application/json":
            return JSON.stringify(body);
        case "application/x-www-form-urlencoded":
            return Extends_1.serializeHTTPJSON(body);
        default:
            return body;
    }
}
exports.normalizeHttpBody = normalizeHttpBody;
/**
 * - Elimina el accept-encoding para evitar que se codifique la respuesta.
 * - Normaliza el cuerpo de la petición dependiendo del content-type
 * @param shallow
 * @param payload
 */
function normalizeHeaderDependency(shallow, payload) {
    if (!Extends_1._Array_.contains(shallow.method.toLowerCase(), httpMethodsWithNoBody)) {
        const bodyType = shallow["headers"]["content-type"] || null;
        const body = normalizeHttpBody(payload.getBody(), bodyType);
        if (body) {
            shallow["body"] = body;
        }
    }
    if (shallow["headers"]["accept-encoding"]) {
        delete shallow["headers"]["accept-encoding"];
    }
    return shallow;
}
exports.normalizeHeaderDependency = normalizeHeaderDependency;
/**
 * Agrega la petición de filtrado cuando ocurra la creación de un shallow
 */
utilities_1.EventBus.addFilter(ProxyEvents_1.ProxyEvents.NORMALIZE_PAYLOAD, (shallow, payload) => {
    if (shallow["headers"]) {
        shallow = normalizeHeaderDependency(shallow, payload);
    }
    return shallow;
});
//# sourceMappingURL=ProxyHeaderFilter.js.map