"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Proxy_1 = require("./routes/Proxy");
const RouteStrategy_1 = require("@utils/RouteStrategy");
const bodyParser = require("body-parser");
/**
 * Módulo de sistema que carga las operaciones del servidor.
 *
 * @author Daniel Vera Morales
 */
class SystemModule {
    /**
     * - Proxy Route
     */
    getRoutes() {
        return [Proxy_1.ProxyCollection.instance().webProxy];
    }
    register(app, router) {
        const thirdPartyRouter = express.Router();
        RouteStrategy_1.HttpRouteRegister.registerHttpRouter(thirdPartyRouter, this.getRoutes());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(thirdPartyRouter);
        app.use("/api", router);
    }
    serviceManager(sm) { }
}
exports.SystemModule = SystemModule;
//# sourceMappingURL=SystemModule.js.map