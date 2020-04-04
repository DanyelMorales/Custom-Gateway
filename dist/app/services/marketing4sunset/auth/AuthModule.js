"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Authenticator_1 = require("./Authenticator");
const System_1 = require("@app/System");
const AuthHelper = require("@auth/annotated/Auth");
const AuthProfile_1 = require("./AuthProfile");
const AuthRouteGuard_1 = require("./AuthRouteGuard");
const Authorization_1 = require("./Authorization");
const TreeMenuGuard_1 = require("./TreeMenuGuard");
const EventBus_1 = require("@utils/EventBus");
const ProxyEvents_1 = require("@app/modules/Proxy/ProxyEvents");
/**
 * @author Daniel Vera Morales
 */
class AuthModule {
    /**
     * > se añade el authenticador y se activa en el sistema.
     * > se registra el Authorization helper, para verificar permisos
     * @param sm
     */
    serviceManager(sm) {
        this.authFacade = AuthHelper.factory(sm, new Authenticator_1.Authenticator());
        this.authorization = new Authorization_1.Authorization(this.authFacade);
        sm.add(System_1.AppServices.___MENU_TREE_GUARD___, new TreeMenuGuard_1.MenuGuard(this.authFacade));
        sm.get(System_1.AppServices.RouteGuardManager)
            .add(new AuthRouteGuard_1.AuthRouteGuard(this.authorization), 50)
            .add(new AuthRouteGuard_1.AuthRouteMethodGuard(this.authorization), 60);
        EventBus_1.default.addFilter(ProxyEvents_1.ProxyEvents.BEFORE_SEND, (data) => {
            const payload = data["payload"];
            if (payload.headers.hasOwnProperty("authorization") || payload.headers.hasOwnProperty("Authorization")) {
                delete payload.headers["authorization"];
                delete payload.headers["Authorization"];
            }
            return data;
        });
    }
    /**1
     *
     * @param app
     */
    register(app, router) {
        const self = this;
        router.post("/authenticate", function (req, res) {
            const authProfile = new AuthProfile_1.AuthProfile(req);
            self.authFacade
                .asyncAuthenticate(authProfile)
                .then(result => {
                res.json(result);
            })
                .catch(data => {
                res.status(401).json(data);
            });
        });
    }
}
exports.AuthModule = AuthModule;
//# sourceMappingURL=AuthModule.js.map