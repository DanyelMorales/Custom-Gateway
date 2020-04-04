"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IRouteGuard_1 = require("@mods_/System/model/RouteGuardManager/interfaces/IRouteGuard");
const ValidationGuardOptions_1 = require("@mods_/System/model/RouteGuardManager/interfaces/ValidationGuardOptions");
/**
 *@author Daniel Vera Morales
 */
class PublicRouteGuard extends IRouteGuard_1.AbstractRouteGuard {
    constructor() {
        super();
        this.FILTER_NO_PROTECTED = "FILTER_NO_PROTECTED";
        this.FOR_NO_PROTECTED_GUARDS = ValidationGuardOptions_1.GuardOptions.ACCEPT;
    }
    /**
     * Verifica si posee el flag "allowedAll" y si es true o false, dependiendo
     * de la respuesta se genera una opcion. Si no se encuentra,
     * verifica si una ruta esta permitida sin necesidad de otras verificaciones.
     * Para ello, se verifica el metodo http que se requiere validar.
     *
     * @param route
     */
    isAllowed(route) {
        const actions = route.route.methods;
        const currentMethod = route.payload.getMethod();
        this.reset();
        if (!this.isSourceValid(route)) {
            this._messages.push("NOT VALID SOURCE");
            return ValidationGuardOptions_1.GuardOptions.DIE;
        }
        const isAllowedAll = this.isAllowedAll(actions);
        if (isAllowedAll === 1 || isAllowedAll === 0) {
            return isAllowedAll === 1 ? ValidationGuardOptions_1.GuardOptions.ACCEPT : ValidationGuardOptions_1.GuardOptions.DIE;
        }
        if (!this.isMethodValid(currentMethod, actions)) {
            this._messages.push(`METHOD ${currentMethod} IS NOT VALID`);
            return ValidationGuardOptions_1.GuardOptions.DIE;
        }
        if (!route.route.protected) {
            return this.applyFilter(this.FILTER_NO_PROTECTED, this.FOR_NO_PROTECTED_GUARDS);
        }
        return ValidationGuardOptions_1.GuardOptions.CONTINUE;
    }
    isAllowedAll(methods) {
        if (!methods || typeof methods.allowAll === 'undefined') {
            return -1;
        }
        return (methods.allowAll === true) ? 1 : 0;
    }
    /**
     * Determina si la solicitud proviene de una fuente valida:
     *
     * - Si viene de la web y se esperaba que venga de la web, se retorna true.
     * - Si actualmente no viene de la web y se esperaba que si, se retorna true
     * - de otro modo se retorna false.
     * @param wrapper
     */
    isSourceValid(wrapper) {
        const expected = wrapper.route.webInvokation;
        const current = wrapper.webInvokation;
        if (expected === current || (current === false && expected === true)) {
            return true;
        }
        return false;
    }
    /**
     * We check only public methods
     *
     * @param currentMethod
     * @param methods
     */
    isMethodValid(currentMethod, methods) {
        if (!methods || methods.public.length === 0) {
            return true;
        }
        methods.public.map(function (x) {
            return x.toUpperCase();
        });
        return methods.public.indexOf(currentMethod.toUpperCase()) > -1;
    }
}
exports.PublicRouteGuard = PublicRouteGuard;
//# sourceMappingURL=PublicRouteGuard.js.map