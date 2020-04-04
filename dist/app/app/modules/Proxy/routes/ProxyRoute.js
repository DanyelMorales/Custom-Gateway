"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const RouteRegister = require("@utils/RouteRegister");
const ProxyService_1 = require("@proxy/ProxyService");
const SystemLog_1 = require("@root/SystemLog");
const sm = require("@annotated/ServiceManager");
const _system_1 = require("@system");
const ActionFIlter_1 = require("@utils/ActionFIlter");
/**
 *
 */
class ProxyRouteEventHandler {
    constructor(proxyService) {
        this.proxyService = proxyService;
        this.log = SystemLog_1.Log.Message.instance();
        this.attachEventsForRequest();
    }
    /**
     *
     * @param responseObj
     */
    update(responseObj) {
        this.responseObj = responseObj;
    }
    /**
     *
     */
    attachEventsForRequest() {
        this.proxyService.on(ProxyService_1.ProxyService.ON_REQUEST_RESULT, this.onRequestResult.bind(this));
        this.proxyService.on(ProxyService_1.ProxyService.ON_ERROR, json => {
            this.responseObj.status(json.status).send(json);
        });
    }
    onRequestResult(json) {
        if (typeof json.response["headers"]["content-type"] !== "undefined") {
            this.responseObj.set("Content-Type", json.response.headers["content-type"]);
        }
        this.responseObj.status(json.response.statusCode).send(json.body);
    }
}
/**
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 */
let ProxyRoute = ProxyRoute_1 = class ProxyRoute extends ActionFIlter_1.ActionFilter {
    /**
     * usar decorador para crear proxyservice
     */
    constructor(theRoute) {
        super();
        this.route = theRoute;
    }
    /**
     * Construye una instancia del proxy route
     * @param route ruta de exposición
     * @param regex expresión regular usada para limpiar el path original
     */
    static build(route, regex) {
        const proxyRoute = new ProxyRoute_1(route);
        proxyRoute.addFilter(ProxyRoute_1.CLEAN_ROUTE, currentPath => {
            return currentPath.replace(regex, "");
        });
        return proxyRoute;
    }
    /**
     *
     */
    getType() {
        return RouteRegister.RouteType.ALL;
    }
    /**
     *
     */
    invoke(req, res, next) {
        const proxyService = new ProxyService_1.ProxyService(this.PayloadFactory);
        const eventHandler = new ProxyRouteEventHandler(proxyService);
        eventHandler.update(res);
        const endpoint = this.applyFilter(ProxyRoute_1.CLEAN_ROUTE, req.path);
        proxyService.delegate(endpoint, req);
    }
    /**
     *
     */
    getRoute() {
        return this.route;
    }
};
ProxyRoute.CLEAN_ROUTE = "CLEAN_ROUTE";
ProxyRoute = ProxyRoute_1 = __decorate([
    sm.Services(_system_1.AppServices.PayloadFactory),
    __metadata("design:paramtypes", [String])
], ProxyRoute);
exports.ProxyRoute = ProxyRoute;
var ProxyRoute_1;
//# sourceMappingURL=ProxyRoute.js.map