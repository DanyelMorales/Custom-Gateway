import {EventBus} from "@app/utilities";
import {ProxyEvents} from "@proxy/ProxyEvents";
import {_Array_, serializeHTTPJSON} from "@utils/Extends";

const httpMethodsWithNoBody = ["get", "options"];

/**
 * Aplica una serie de estrategias para normalizar
 * el cuerpo de una petición.
 */
export function normalizeHttpBody(body: any, type: string): any {
    if (typeof body == "object" && Object.keys(body).length === 0) {
        return null;
    }
    switch (type) {
        case "application/json":
            return JSON.stringify(body);
        case "application/x-www-form-urlencoded":
            return serializeHTTPJSON(body);
        default:
            return body;
    }
}

/**
 * - Elimina el accept-encoding para evitar que se codifique la respuesta.
 * - Normaliza el cuerpo de la petición dependiendo del content-type
 * @param shallow
 * @param payload
 */
export function normalizeHeaderDependency(shallow, payload) {
    if (!_Array_.contains(shallow.method.toLowerCase(), httpMethodsWithNoBody)) {
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

/**
 * Agrega la petición de filtrado cuando ocurra la creación de un shallow
 */
EventBus.addFilter(ProxyEvents.NORMALIZE_PAYLOAD, (shallow, payload) => {
    if (shallow["headers"]) {
        shallow = normalizeHeaderDependency(shallow, payload);
    }
    return shallow;
});