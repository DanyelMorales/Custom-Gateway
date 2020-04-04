"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RouteRegister_1 = require("@utils/RouteRegister");
/**
 *   Implementación predeterminada de un registro de rutas.
 */
class HttpRouteRegister {
    static registerHttpRouter(router, routes) {
        if (routes == null || routes.length === 0) {
            return;
        }
        const routeRegister = new HttpRouteRegister();
        for (const aRoute of routes) {
            routeRegister.register(aRoute, router);
        }
    }
    /**
     * Construye una función wrapper para hacer interfaz con la clase
     * que se ha construido.
     */
    register(aRoute, router) {
        const routeType = RouteRegister_1.RouteType[aRoute.getType()].toLowerCase();
        const theRoute = aRoute.getRoute();
        if (typeof router[routeType] === "undefined") {
            throw new Error("METHOD NOT FOUND:" + routeType);
        }
        const theFunction = router[routeType];
        theFunction.call(router, theRoute, (req, res, next) => {
            aRoute.invoke(req, res, next);
        });
    }
}
exports.HttpRouteRegister = HttpRouteRegister;
class SimpleRouteRegister {
    static _single(route, router, app) {
        return SimpleRouteRegister.instance().register(route, router, app);
    }
    static _all(routes, router, app) {
        return SimpleRouteRegister.instance().registerAll(routes, router, app);
    }
    static instance() {
        return new SimpleRouteRegister();
    }
    register(route, router, app) {
        const fn = router.call(router, route.value);
        if (route.hasName()) {
            app.use(route.name, fn);
        }
        else {
            app.use(fn);
        }
        return fn;
    }
    registerAll(container, router, app) {
        container.container.forEach(element => {
            this.register(element, router, app);
        });
        return router;
    }
}
exports.SimpleRouteRegister = SimpleRouteRegister;
//# sourceMappingURL=RouteStrategy.js.map