"use strict";
/**
 * Colección de interfaces, enumeradores y clases para la resolución de rutas.
 * @author Daniel Vera Morales
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *  Tipos de rutas soportados por el sistema
 */
var RouteType;
(function (RouteType) {
    RouteType[RouteType["ALL"] = 0] = "ALL";
    RouteType[RouteType["GET"] = 1] = "GET";
    RouteType[RouteType["POST"] = 2] = "POST";
    RouteType[RouteType["PUT"] = 3] = "PUT";
    RouteType[RouteType["PATCH"] = 4] = "PATCH";
    RouteType[RouteType["DELETE"] = 5] = "DELETE";
})(RouteType = exports.RouteType || (exports.RouteType = {}));
/**
 * Defines a simple route containing value and name
 */
class SimpleRoute {
    constructor(value, name = null) {
        this.value = value;
        this.name = name;
    }
    hasName() {
        return !(this.name === null);
    }
}
exports.SimpleRoute = SimpleRoute;
/**
 * Contenedor de rutas para assets
 */
class SimpleRouteContainer {
    constructor() {
        this.container = [];
    }
    build(value, name = null) {
        this.add(new SimpleRoute(value, name));
        return this;
    }
    add(route) {
        this.container.push(route);
        return this;
    }
    remove(route) {
        const index = this.container.indexOf(route);
        delete this.container[index];
        return this;
    }
    get(index) {
        return this.container[index];
    }
    getContainer() {
        return this.container;
    }
}
exports.SimpleRouteContainer = SimpleRouteContainer;
//# sourceMappingURL=RouteRegister.js.map