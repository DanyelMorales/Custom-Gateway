"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("ts-node");
require("mocha");
const chai_1 = require("chai");
const ProxyUtils_1 = require("@tests/ProxyUtils");
const RouteFactory_1 = require("@app/modules/Proxy/RouteFactory");
const mode = "prod";
const testHelper = new ProxyUtils_1.TestHelper();
describe("ProxyService", () => {
    let routeFactory = null;
    beforeEach(function () {
        routeFactory = new RouteFactory_1.RouteFactory(testHelper.routes);
    });
    afterEach(function () { });
    it("Should expand proxy route", () => {
        const result = routeFactory.build("listarpaises/wellknownroute/append/to/originalroute");
        chai_1.expect(result.route).to.be.equals("countries/wellknownroute/append/to/originalroute");
    });
});
//# sourceMappingURL=RouteFactory.spec.js.map