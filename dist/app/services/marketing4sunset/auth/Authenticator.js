"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractAuthenticator_1 = require("@auth/AbstractAuthenticator");
const DelegationHelper_1 = require("@proxy/ExpressRequest/DelegationHelper");
/**
 *  @author Daniel Vera Morales
 */
class Authenticator extends AbstractAuthenticator_1.AbstractAsyncAuthenticator {
    constructor() {
        super(...arguments);
        this.END_POINT = "USER_AUTHENTICATION";
        this._delegator = new DelegationHelper_1.DelegationHelper();
    }
    /**
     * Se genera un objeto de express que actua como payload para
     * la delegación de servicios. Se configura para utilizar
     * el método HTTP "POST" y se delega indicando al delegador que
     * la petición deberá ser desde un medio interno (no web).
     */
    sendPayload(resource) {
        const authData = resource.authData;
        const payload = this._delegator.expressRequest({
            method: "POST",
            body: authData.formData,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": authData.length
            }
        });
        this._delegator.delegate(this.END_POINT, payload.build(), false);
    }
    /**
     * @param response
     */
    getObjectResponse(container) {
        const body = container.body;
        const data = JSON.parse(body);
        return {
            userId: data["email"],
            user: data["usuario"],
            name: data["nombre"],
            iss: true,
            permission: data["permisos"],
            data: {
                telefono: data["telefono"],
                extension: data["extension"]
            }
        };
    }
    /**
     *
     * @param container
     */
    isValidResult(container) {
        if (container.error) {
            return container;
        }
        const body = container.body;
        const data = JSON.parse(body);
        if (data === null ||
            container.response.statusCode !== 200 ||
            typeof data["email"] === "undefined" ||
            typeof data["nombre"] === "undefined" ||
            typeof data["usuario"] === "undefined" ||
            typeof data["permisos"] === "undefined" ||
            typeof data["extension"] === "undefined" ||
            typeof data["telefono"] === "undefined") {
            container.error = true;
            container.response.statusCode = 412;
        }
        return container;
    }
    /**
     *
     */
    delegator() {
        return this._delegator;
    }
}
exports.Authenticator = Authenticator;
//# sourceMappingURL=Authenticator.js.map