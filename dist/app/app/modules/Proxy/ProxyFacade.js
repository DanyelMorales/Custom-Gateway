"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express_1 = require("@proxy/ExpressRequest/Express");
const Microservice_1 = require("@proxy/Microservice");
const JSONUtils_1 = require("@utils/JSONUtils");
const RouteFactory_1 = require("@proxy/RouteFactory");
/**
 * Operaciones comunes para proxy
 *
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 */
class ProxyFacade {
    /**
     * Carga un wrapper a partir de un path de configuración
     * @param configPath
     */
    getWrapper(configPath) {
        const reader = new JSONUtils_1.JsonReader(configPath, true);
        return reader.readFile();
    }
    /**
     * Producde una isntancia de ProxySender
     */
    getProxySender() {
        return new Express_1.ProxySender();
    }
    /**
     * Genera un proxyhelper al ejecutar la función anonima. Requiere de un payload.
     */
    getProxyHelper() {
        return payload => {
            return Express_1.ProxyHelper.decoratePackage(payload);
        };
    }
    /**
     * Produce una ruta a partir de un wrapper y un indice de lectura.
     *
     * @param configWrapper
     * @param index
     */
    getRoute(configWrapper, index) {
        const route = new RouteFactory_1.RouteFactory(configWrapper);
        return route.build(index);
    }
    /**
     * Crea un payload a partir de un modo de operación, una configuración wrapeada
     * un request de servidor y una ruta.
     *
     * @param mode
     * @param configWrapper
     * @param req
     * @param route
     */
    getPayload(mode, configWrapper, req, route) {
        const factory = new Express_1.PayloadFactory(mode, configWrapper);
        return factory.build(req, route);
    }
    /**
     * Crea un microservicio a partir de un wrapper de configuracion, un modo y
     * un apiname.
     *
     * @param configWrapper
     * @param mode
     * @param apiname
     */
    getMicroservice(configWrapper, mode, apiname) {
        const factory = new Microservice_1.MicroserviceFactory(configWrapper, mode, apiname);
        return factory.build();
    }
}
exports.ProxyFacade = ProxyFacade;
//# sourceMappingURL=ProxyFacade.js.map