"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("ts-node");
require("mocha");
const DelegationHelper_1 = require("@proxy/ExpressRequest/DelegationHelper");
const _system_1 = require("@system");
const SystemGlobalxxx = require("@annotated/SystemGlobal");
describe("ProxyService", () => {
    beforeEach(function () { });
    afterEach(function () { });
    it("Deberia delegar asincronamente la petición", done => {
        _system_1.Globals.bootstrap({
            ConfigManager: {
                routes: "routes",
                microservices: "microservices",
                declarations: "declarations"
            },
            globals: SystemGlobalxxx.build({
                pathToRoot: __dirname + "/../../../../"
            })
        });
        const delegator = new DelegationHelper_1.DelegationHelper();
        delegator.onResult(container => {
            console.log(container);
            done();
        });
        delegator.onError(error => {
            console.log(error);
            done();
        });
        delegator.filterResult(container => {
            return container;
        });
        const payload = delegator.expressRequest({
            method: "GET"
        });
        delegator.delegate("USER_AUTHENTICATION", payload.build(), false);
    });
});
//# sourceMappingURL=ExpressProxyService.spec.js.map