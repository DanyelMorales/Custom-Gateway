"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _system_1 = require("@system");
const Interpolator_1 = require("@utils/Interpolator");
class RouteServiceProvider {
    get iCanDelegate() {
        return [_system_1.AppServices.RouteFactory];
    }
    delegate(name, sm) {
        const configManager = sm.get(_system_1.AppServices.ConfigManager);
        return new RouteFactory(configManager.getWrapper("routes"));
    }
}
exports.RouteServiceProvider = RouteServiceProvider;
class RouteFactory {
    constructor(routesWrapper) {
        this.routesWrapper = routesWrapper;
        this.E_NOT_FOUND = "NOT FOUND ENDPOINT";
        this.haystack = this.routesWrapper.readCycl("routes");
        this.interpolator = new Interpolator_1.Interpolator("/");
    }
    build(endpoint) {
        const endpointParts = this.interpolator.eval(endpoint);
        const result = this.routesWrapper.findByAttrIM(endpointParts.shift(), this.haystack);
        if (!result.isFound) {
            throw new RouteException(this.E_NOT_FOUND, result);
        }
        result.result.route = this.interpolator.expand(result.result.route);
        return new Route(result.result);
    }
    get containerWrapper() {
        return this.routesWrapper;
    }
}
exports.RouteFactory = RouteFactory;
/**
 *
 */
class Route {
    constructor(data) {
        this.data = data;
        this.I_PROTECTED = "protected";
        this.I_ROUTE = "route";
        this.I_ACTIONS = "methods";
        this.I_NAME = "name";
        this.I_PARENT = "parent";
        this.I_WEB_INVOKATION = "web_invokation";
        this.I_PERMISSIONS = "permission";
    }
    get webInvokation() {
        const invokation = this.getKey(this.I_WEB_INVOKATION);
        return invokation === null ? true : invokation;
    }
    get protected() {
        return this.getKey(this.I_PROTECTED) || false;
    }
    get route() {
        return this.getKey(this.I_ROUTE);
    }
    get methods() {
        return this.getKey(this.I_ACTIONS) || null;
    }
    set methods(methods) {
        this.data[this.I_ACTIONS] = methods;
    }
    get alias() {
        return this.getKey(this.I_NAME);
    }
    get parent() {
        return this.getKey(this.I_PARENT);
    }
    getKey(key) {
        if (typeof this.data[key] === "undefined") {
            return null;
        }
        return this.data[key];
    }
    get permission() {
        return this.data["permission"] || [];
    }
}
exports.Route = Route;
/**
 * Routing excepcion
 */
class RouteException extends Error {
    constructor(message, data) {
        super(message);
        this.data = data;
    }
}
exports.RouteException = RouteException;
//# sourceMappingURL=RouteFactory.js.map