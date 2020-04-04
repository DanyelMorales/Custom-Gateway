"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("ts-node");
require("mocha");
const chai_1 = require("chai");
const ProxyUtils_1 = require("@tests/ProxyUtils");
const Interpolator_1 = require("@app/utilities/Interpolator");
const mode = "prod";
const testHelper = new ProxyUtils_1.TestHelper();
describe("Interpolator", () => {
    let interpolator = null;
    beforeEach(function () {
        interpolator = new Interpolator_1.Interpolator("/");
    });
    afterEach(function () { });
    // wellknownroute/append/to/originalroute
    it("Should expand proxy route", () => {
        const result = interpolator.eval("listarpaises/wellknownroute/append/to/originalroute");
        chai_1.expect(interpolator.expand("countries")).to.be.equals("countries/wellknownroute/append/to/originalroute");
    });
});
//# sourceMappingURL=interpolator.spec.js.map