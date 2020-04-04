"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventBus_1 = require("@utils/EventBus");
const ProxyEvents_1 = require("@app/modules/Proxy/ProxyEvents");
/**
 * Registra una ruta o una aplicación Express para que sea protegida por CORS.
 */
class CORSManager {
    /**
     * Habilita un arreglo de rutas y aplicaciones
     * @param o arreglo a registrar
     * @returns una instancia de CORSManager
     */
    static $enable(o) {
        const corsManager = new CORSManager();
        for (const item of o) {
            corsManager.enable(item);
        }
        return corsManager;
    }
    /**
     * @param o Aplicacion o rutas a registrarse en CORS
     */
    enable(o) {
        o.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, PUT, PATCH, OPTIONS");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, authorization, Access-Control-Request-Headers, Access-Control-Request-Method");
            next();
        });
    }
}
exports.CORSManager = CORSManager;
/**
 * @author Daniel Vera Morales
 */
class CORSModule {
    /**
     * @param sm
     */
    serviceManager(sm) { }
    /**
     *
     * @param app
     */
    register(app, router) {
        const corsManager = new CORSManager();
        corsManager.enable(app);
        corsManager.enable(router);
        // Habilita el método options en cada ruta. 
        EventBus_1.default.addFilter(ProxyEvents_1.ProxyEvents.RAW_ROUTE, (route) => {
            const methods = route.methods;
            if (methods && methods.public) {
                methods.public.push("OPTIONS");
            }
            return route;
        });
    }
}
exports.CORSModule = CORSModule;
//# sourceMappingURL=CORSModule.js.map