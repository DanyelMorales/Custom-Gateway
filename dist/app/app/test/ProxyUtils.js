"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProxyFacade_1 = require("@proxy/ProxyFacade");
const JSONUtils_1 = require("@utils/JSONUtils");
const JSONUtils_2 = require("@utils/JSONUtils");
const routes_test_config = __dirname + "/../annotated/test/config";
const microservices_test_config = __dirname + "/../modules/Proxy/test/config";
const currentmode = "dev";
const currentMSPath = "microservices>API1_DROPWIZARD";
const routeName = "listarpaises";
const SystemGlobal = require("@annotated/SystemGlobal");
class TestHelper extends ProxyFacade_1.ProxyFacade {
    constructor() {
        super();
        this.request = {
            body: {},
            method: "GET",
            query: {},
            baseUrl: "http://127.0.0.1/proxy/listarpaises",
            cookies: {}
        };
    }
    buildRequest(index, value) {
        this.request[index] = value;
        return this.request;
    }
    get expressReq() {
        return this.request;
    }
    get routes() {
        const reader = new JSONUtils_1.JsonReader(routes_test_config, true);
        return reader.readFile();
    }
    get microservices() {
        const reader = new JSONUtils_1.JsonReader(microservices_test_config, true);
        return reader.readFile();
    }
    get appConfig() {
        const jsonx = {
            ConfigManager: {
                routes: routes_test_config,
                microservices: microservices_test_config
            }
        };
        return new JSONUtils_2.JSONType(jsonx);
    }
    get constants() {
        return {
            routes_test_config: routes_test_config,
            microservices_test_config: microservices_test_config,
            currentmode: currentmode,
            currentMSPath: currentMSPath,
            routeName: routeName
        };
    }
}
exports.TestHelper = TestHelper;
//# sourceMappingURL=ProxyUtils.js.map