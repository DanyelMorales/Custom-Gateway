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
const sm = require("@annotated/ServiceManager");
const _system_1 = require("@system");
const ProxyService_1 = require("@proxy/ProxyService");
const ExpressRequest_1 = require("./ExpressRequest");
/**
 * Facilita el uso del proxy en express
 *
 * @author Daniel Vera Morales
 */
let DelegationHelper = class DelegationHelper {
    constructor() {
        this._proxyService = new ProxyService_1.ProxyService(this.PayloadFactory);
    }
    /**
     * Delega una petición simulando una petición Express, especificando si
     * la petición viene desde un cliente web o no (petición interna).
     * @param endpoint
     * @param request
     * @param fromWeb
     */
    delegate(endpoint, request, fromWeb = true) {
        this._proxyService.addFilter(ProxyService_1.ProxyService.FILTER_DECORATED_WRAPPER, wrapper => {
            wrapper.webInvokation = fromWeb;
            return wrapper;
        });
        this._proxyService.delegate(endpoint, request);
    }
    /**
     * @returns un nuevo request tipo express, listo para ser usado
     * @param data datos de inicialización
     */
    expressRequest(data = null) {
        return new ExpressRequest_1.ExpressRequest(data);
    }
    /**
     *  @returns instancia del servicio de proxy
     */
    get proxyService() {
        return this._proxyService;
    }
    /**
     * suscribe un callback si existe respuesta por parte del
     * servidor remoto.
     *
     * @param cb
     */
    onResult(cb) {
        this.proxyService.on(ProxyService_1.ProxyService.ON_REQUEST_RESULT, cb);
    }
    /**
     * Si ocurre algún tipo de error se ejecuta el cb
     *
     * @param cb
     */
    onError(cb) {
        this.proxyService.on(ProxyService_1.ProxyService.ON_ERROR, cb);
    }
    filterResult(cb) {
        this.proxyService.addFilter(ProxyService_1.ProxyService.FILTER_IS_ERROR, cb);
    }
};
DelegationHelper = __decorate([
    sm.Services(_system_1.AppServices.PayloadFactory),
    __metadata("design:paramtypes", [])
], DelegationHelper);
exports.DelegationHelper = DelegationHelper;
//# sourceMappingURL=DelegationHelper.js.map