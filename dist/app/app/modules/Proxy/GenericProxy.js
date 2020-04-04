"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
class PayloadWrapper {
    constructor() {
        this._isWebInvokation = true;
    }
    get webInvokation() {
        return this._isWebInvokation;
    }
    set webInvokation(value) {
        this._isWebInvokation = value;
    }
    get decorated() {
        return this._decorated;
    }
    set decorated(v) {
        this._decorated = v;
    }
    get sender() {
        return this._sender;
    }
    set sender(v) {
        this._sender = v;
    }
    get route() {
        return this._route;
    }
    set route(v) {
        this._route = v;
    }
    get payload() {
        return this._payload;
    }
    set payload(v) {
        this._payload = v;
    }
}
exports.PayloadWrapper = PayloadWrapper;
//# sourceMappingURL=GenericProxy.js.map