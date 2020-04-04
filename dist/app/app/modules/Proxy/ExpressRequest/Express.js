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
require("@proxy/Filters/ProxyHeaderFilter");
const url = require("url");
const ProxyFacade_1 = require("@proxy/ProxyFacade");
const Remote = require("@proxy/Decorators/Remote");
const _system_1 = require("@system");
const utilities_1 = require("@app/utilities");
const ProxyEvents_1 = require("@app/modules/Proxy/ProxyEvents");
const rtrim = require("rtrim");
const THE_ENDPOINT = "the_endpoint";
class PayloadFactoryProvider {
    constructor(runningMode) {
        this.runningMode = runningMode;
    }
    get iCanDelegate() {
        return [_system_1.AppServices.PayloadFactory];
    }
    delegate(name, context) {
        const microserviceWrapper = context.get(_system_1.AppServices.MICROSERVICES_MIDDLEWARE);
        const payloadFactory = new PayloadFactory(this.runningMode, microserviceWrapper);
        return payloadFactory;
    }
}
exports.PayloadFactoryProvider = PayloadFactoryProvider;
/**
 *
 */
class PayloadFactory {
    constructor(mode, microserviceWrapper) {
        this.mode = mode;
        this.microserviceWrapper = microserviceWrapper;
        this.facade = new ProxyFacade_1.ProxyFacade();
    }
    build(req, route) {
        const apiname = "microservices>" + route.parent;
        return new Payload(req, route, this.facade.getMicroservice(this.microserviceWrapper, this.mode, apiname));
    }
}
exports.PayloadFactory = PayloadFactory;
class BasePayload {
    constructor(expressData) {
        this.expressData = expressData;
    }
    getHeaders(key = null) {
        if (key === null) {
            return this.expressData.headers;
        }
        const keys = [key, key.charAt(0).toLocaleLowerCase() + key.slice(1)];
        for (const header of keys) {
            if (typeof this.expressData.headers[header] !== "undefined") {
                return this.expressData.headers[header];
            }
        }
        return null;
    }
    set data(value) {
        this.expressData = value;
    }
}
exports.BasePayload = BasePayload;
/**
 *
 */
class Payload extends BasePayload {
    constructor(_expressData, route, microservice) {
        super(_expressData);
        this._expressData = _expressData;
        this.route = route;
        this.microservice = microservice;
    }
    getMethod() {
        return this.expressData.method;
    }
    getBody() {
        return this.expressData.body;
    }
    getParams() {
        if (!this.expressData.originalUrl) {
            return "";
        }
        const params = this.expressData.originalUrl.split("?");
        if (!params || params.length === 0) {
            return "";
        }
        params.shift();
        return params.join("?");
    }
    getURI() {
        return this.microservice.getKey("url");
    }
    getPath() {
        const path = rtrim(this.microservice.getPath(), "/");
        const routestr = rtrim(this.route.route, "/");
        return path + "/" + routestr;
    }
    getURL() {
        const params = this.getParams();
        const urlstr = rtrim(this.getURI(), "/") + "/" + this.getPath() + (params ? "?" + params : "");
        return url.parse(urlstr);
    }
    getAPIName() {
        return this.route.parent;
    }
    getCookies() {
        return this.expressData.cookies;
    }
    getMicroservice() {
        return this.microservice;
    }
    getAuth() {
        return this.microservice.getAuth();
    }
}
exports.Payload = Payload;
class ProxySender {
    decoratePackage(payload) {
        return ProxyHelper.decoratePackage(payload);
    }
    /**
     * Carga un Microservicio utilizando el enpoint hijo.
     * Luego se generan paquetes de envio base y se realiza el procesamiento.
     * @param callback
     */
    send(payload, callback) {
        if (typeof payload["decorated"] === "undefined" ||
            payload["decorated"] === false) {
            payload = this.decoratePackage(payload);
        }
        return {
            payload: payload,
            emitter: callback
        };
    }
}
__decorate([
    Remote.request(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Payload, Function]),
    __metadata("design:returntype", void 0)
], ProxySender.prototype, "send", null);
exports.ProxySender = ProxySender;
class ProxyHelper {
    /**
     * decorar basado en el tipo de metodo
     */
    static decoratePackage(payload) {
        let shallow = {
            decorated: true,
            params: payload.getParams(),
            method: payload.getMethod(),
            auth: payload.getAuth(),
            uri: payload.getURL(),
            uristr: url.format(payload.getURL()),
            headers: payload.getHeaders()
        };
        shallow = utilities_1.EventBus.applyFilter(ProxyEvents_1.ProxyEvents.NORMALIZE_PAYLOAD, shallow, payload);
        return shallow;
    }
}
exports.ProxyHelper = ProxyHelper;
//# sourceMappingURL=Express.js.map