"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IRouteGuard_1 = require("@mods_/System/model/RouteGuardManager/interfaces/IRouteGuard");
const ValidationGuardOptions_1 = require("@mods_/System/model/RouteGuardManager/interfaces/ValidationGuardOptions");
/**
 * Verifica los permisos de una ruta
 */
class AuthRouteGuard extends IRouteGuard_1.AbstractRouteGuard {
    constructor(authorization) {
        super();
        this.authorization = authorization;
    }
    /**
     * Se verifica que posea los permisos, para ello realiza la verificación
     * de permisos que se posee en la sessión de usuario, sin embargo
     * si se invoca esta ruta y no posee permisos entonces se toma
     * como que es valido.
     *
     * NOTA:
     * Si no requiere protección se evita la verificación, pues
     * es muy probable que no existan permisos contenidos.
     * @param route
     */
    isAllowed(route) {
        if (!route.route.protected) {
            return ValidationGuardOptions_1.GuardOptions.CONTINUE;
        }
        const routePerms = route.route.permission;
        return this.authorization.isAuthorized(route.payload, routePerms);
    }
}
exports.AuthRouteGuard = AuthRouteGuard;
class AuthRouteMethodGuard extends IRouteGuard_1.AbstractRouteGuard {
    constructor(authorization) {
        super();
        this.authorization = authorization;
    }
    /**
     * Si no esta definido los metodos en la ruta
     * o si esta vacío el arreglo de métodos
     * o si se define el flag allowAll como true
     * o si se encuentra el método http entonces es true.
     *
     * de otro modo es false.
     * @param currentMethod
     * @param methods
     */
    isPublicMethodAllowed(currentMethod, methods) {
        if (!methods || (methods.public.length === 0 && !methods.private)) {
            return true;
        }
        if (methods.public.length > 0 &&
            methods.public.indexOf(currentMethod) > -1) {
            return true;
        }
        return false;
    }
    /**
     * verifica los metodos publicos, si no, se verifica los metodos privados.
     *
     * @param route
     */
    isAllowed(route) {
        const currentRoute = route.route;
        const methods = currentRoute.methods;
        const currentMethod = route.payload.getMethod();
        if (this.isPublicMethodAllowed(currentMethod, methods)) {
            return ValidationGuardOptions_1.GuardOptions.CONTINUE;
        }
        const privateMethodPerms = methods.private[currentMethod] || null;
        if (!privateMethodPerms) {
            return ValidationGuardOptions_1.GuardOptions.CONTINUE;
        }
        return this.authorization.isAuthorized(route.payload, privateMethodPerms);
    }
}
exports.AuthRouteMethodGuard = AuthRouteMethodGuard;
//# sourceMappingURL=AuthRouteGuard.js.map