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
const Proxy = require("./GenericProxy");
const sm = require("@annotated/ServiceManager");
const _system_1 = require("@system");
const ActionFIlter_1 = require("@utils/ActionFIlter");
const System_1 = require("@/System");
const Proxy_1 = require("@app/logger/Proxy");
const Route_1 = require("@app/dto/Route");
const ProxyEvents_1 = require("@app/modules/Proxy/ProxyEvents");
/**
 * @author Daniel Vera Morales
 */
let ProxyService = ProxyService_1 = class ProxyService extends ActionFIlter_1.ActionFilter {
    /**
     * @param payloadFactory
     */
    constructor(payloadFactory) {
        super();
        this.payloadFactory = payloadFactory;
        this.logger = new Proxy_1.SecurityServiceLogger(this);
    }
    /**
     * Delega una petición request a una ruta de un microservicio
     * @param endpoint Ruta que se desea utilizar como punto de delegación
     * @param request petición de Express a ser reenviado
     * @param callback retrollamada para procesar los resultados del proxy
     */
    delegate(endpoint, request) {
        try {
            const data = this.applyFilter(ProxyService_1.FILTER_DECORATED_WRAPPER, this.wrappPayload(endpoint, request));
            this.delegateWrapper(endpoint, data);
        }
        catch (e) {
            this.theError(ProxyService_1.DELEGATION_ERROR, e, 409, endpoint);
        }
    }
    /**
     * @param endpoint
     * @param data
     */
    delegateWrapper(endpoint, data) {
        const that = this;
        this.RouteGuardManager.removeAllListeners();
        this.RouteGuardManager.once(this.RouteGuardManager.ON_ALLOWED, ($ev) => {
            that.emit(ProxyService_1.ON_BEFORE_REQUEST, data.decorated, endpoint);
            data.sender.send(data.decorated, that.buildResponse(endpoint));
        });
        this.RouteGuardManager.once(this.RouteGuardManager.ON_NOT_ALLOWED, ($ev) => {
            that.theError(ProxyService_1.REQUEST_ERROR, "NOT ALLOWED", 401, endpoint, $ev[2]);
        });
        this.RouteGuardManager.isAllowed(data);
    }
    /**
     * @param type
     * @param data
     */
    theError(type, reason, status, endpoint, data = []) {
        const json = new Route_1.EndpointError(true, type, endpoint, reason, status, data);
        this.emit(ProxyService_1.ON_ERROR, json, endpoint, status);
    }
    /**
     * @param endpoint
     * @param request
     */
    wrappPayload(endpoint, request) {
        const route = this.RouteFactory.build(endpoint);
        const payload = this.payloadFactory.build(request, route);
        const sender = this.ProxyFacade.getProxySender();
        const decoratedPayload = sender.decoratePackage(payload);
        const wrapper = new Proxy.PayloadWrapper();
        wrapper.decorated = decoratedPayload;
        wrapper.payload = System_1.EventBus.applyFilter(ProxyEvents_1.ProxyEvents.RAW_PAYLOAD, payload);
        wrapper.route = System_1.EventBus.applyFilter(ProxyEvents_1.ProxyEvents.RAW_ROUTE, route);
        wrapper.sender = sender;
        return wrapper;
    }
    buildResponse(endpoint) {
        const that = this;
        return (error, response, body) => {
            const responseContainer = that.applyFilter(ProxyService_1.FILTER_IS_ERROR, new Route_1.ResponseContainer(error, response, body));
            if (!responseContainer.error) {
                that.emit(ProxyService_1.ON_REQUEST_RESULT, responseContainer, endpoint);
                return;
            }
            that.theError(ProxyService_1.CONNECTION_REFUSED, "ERROR", 409, responseContainer.error);
        };
    }
};
ProxyService.ON_REQUEST_RESULT = "REMOTE_REQUEST_RESULT";
ProxyService.ON_ERROR = "ON_ERROR";
ProxyService.ON_BEFORE_REQUEST = "BEFORE_REMOTE_REQUEST";
ProxyService.REQUEST_ERROR = "REMOTE REQUEST DENIED";
ProxyService.DELEGATION_ERROR = "DELEGATION ERROR";
ProxyService.CONNECTION_REFUSED = "CONNECTION REFUSED";
ProxyService.FILTER_DECORATED_WRAPPER = "FILTER_DECORATED_WRAPPER";
ProxyService.FILTER_IS_ERROR = "FILTER_IS_ERROR";
ProxyService = ProxyService_1 = __decorate([
    sm.Services(_system_1.AppServices.RouteFactory, _system_1.AppServices.RouteGuardManager, _system_1.AppServices.ProxyFacade),
    __metadata("design:paramtypes", [Object])
], ProxyService);
exports.ProxyService = ProxyService;
var ProxyService_1;
//# sourceMappingURL=ProxyService.js.map