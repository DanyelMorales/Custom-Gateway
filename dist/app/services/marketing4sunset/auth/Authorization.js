"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Auth_1 = require("@auth/Auth");
const events_1 = require("events");
const JSONUtils_1 = require("@utils/JSONUtils");
const ValidationGuardOptions_1 = require("@mods_/System/model/RouteGuardManager/interfaces/ValidationGuardOptions");
/**
 *@author Daniel Vera Morales
 */
class Authorization extends events_1.EventEmitter {
    constructor(facade) {
        super();
        this.facade = facade;
    }
    /**
     * @param resource
     */
    isAuthorized(payload, expectedPerms) {
        // si la ruta no tiene permiso
        if (expectedPerms === null || expectedPerms.length === 0) {
            return ValidationGuardOptions_1.GuardOptions.CONTINUE;
        }
        const profile = this.extractUserPayload(payload);
        const userPerms = profile.get("permission");
        if (userPerms === null || userPerms.length === 0) {
            // NO PERMITAS QUE CONTINUE
            return ValidationGuardOptions_1.GuardOptions.DIE;
        }
        // si posee el permiso se acepta
        for (const perm of expectedPerms) {
            if (userPerms.indexOf(perm) > -1) {
                return ValidationGuardOptions_1.GuardOptions.ACCEPT;
            }
        }
        // de otro modo se asesina la verificacion
        return ValidationGuardOptions_1.GuardOptions.DIE;
    }
    /**
     * @param resource
     */
    extractUserPayload(payload) {
        const authorizationHeader = payload.getHeaders(Auth_1.AuthHeader.AUTHORIZATION);
        const profile = this.facade.getPayload(authorizationHeader);
        return new JSONUtils_1.JSONType(profile || {});
    }
}
exports.Authorization = Authorization;
//# sourceMappingURL=Authorization.js.map