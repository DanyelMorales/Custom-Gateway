"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author Daniel Vera Morales
 */
const Auth_1 = require("@auth/Auth");
const events_1 = require("events");
const EventBus_1 = require("@utils/EventBus");
const Events_1 = require("../Events");
class AuthenticatorFacade extends events_1.EventEmitter {
    constructor(tokenizer, thirdPartyAuth) {
        super();
        this.tokenizer = tokenizer;
        this.thirdPartyAuth = thirdPartyAuth;
        this.ON_AUTHENTICATION = "1";
        this.ON_BAD_AUTHENTICATION = "2";
        this.ON_BAD_TOKEN = "3";
        this.ON_AUTHENTICATOR_ERROR = "4";
        this.ON_ALREADY_AUTHENTICATED = "5";
        this.on(this.ON_AUTHENTICATOR_ERROR, (who, what) => {
            EventBus_1.default.emit(Events_1.AUTH_EVENTS.ON_AUTH_ERROR, who, what);
        });
    }
    /**
     * Detecta tokens barear
     * @param authorizationHeader
     */
    getToken(authorizationHeader) {
        if (!authorizationHeader || authorizationHeader === "") {
            throw {
                msg: "[credentials_required] Authentication is mandatory"
            };
        }
        const parts = authorizationHeader.split(" ");
        if (parts.length !== 2) {
            throw { msg: "[bad_format] Format must be: <type> <credentials>" };
        }
        const scheme = parts[0];
        const credentials = parts[1];
        if (/^Bearer$/i.test(scheme)) {
            return credentials;
        }
        throw { msg: "[credentials_bad_scheme] Authentication type not allowed" };
    }
    /**
     * Verifica si existe las cabeceras de authorizacion
     * @param resource
     */
    isAuthenticated(authorizationHeader) {
        try {
            const result = this.tokenizer.verify(this.getToken(authorizationHeader));
            return result;
        }
        catch (obj) {
            this.emit(this.ON_AUTHENTICATOR_ERROR, "Error: [not_a_user] Authentication failed", obj.msg);
        }
    }
    /**
     *
     * @param resource
     */
    authenticate(resource) {
        const result = this.thirdPartyAuth.authenticate(resource);
        return this.evalAutheResult(resource, result);
    }
    evalAutheResult(resource, result) {
        if (!result) {
            this.emit(this.ON_AUTHENTICATOR_ERROR, resource, "Error: [not_a_user] Authentication failed");
            return null;
        }
        const signedResult = new Auth_1.AuthTokenContainer(this.tokenizer.sign(result));
        this.emit(this.ON_AUTHENTICATION, resource, signedResult);
        return signedResult;
    }
    /**
     * Realiza la autenticación de forma asincrona
     *
     * @param resource
     * @param cb
     */
    asyncAuthenticate(resource) {
        const self = this;
        return new Promise((resolve, reject) => {
            self.on(self.ON_AUTHENTICATOR_ERROR, (endpoint, msg) => {
                reject(endpoint);
            });
            self.thirdPartyAuth
                .asyncAuthenticate(resource)
                .then(res => {
                return self.evalAutheResult(resource, res);
            })
                .then(result => {
                resolve(result);
            })
                .catch(err => {
                reject(err);
            });
        });
    }
    getPayload(authorizationHeader) {
        if (this.isAuthenticated(authorizationHeader)) {
            return this.tokenizer.decode(this.getToken(authorizationHeader));
        }
        return null;
    }
}
exports.AuthenticatorFacade = AuthenticatorFacade;
//# sourceMappingURL=AuthenticatorFacade.js.map