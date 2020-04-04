"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("ts-node");
require("mocha");
const chai_1 = require("chai");
const express = require("express");
const fakeRoute = require("./FakeRoute");
const RouteStrategy_1 = require("@utils/RouteStrategy");
describe("RouteRegister", () => {
    let myroute = null;
    let router = null;
    beforeEach(function () {
        router = express.Router();
        myroute = new fakeRoute.FakeRoute();
    });
    afterEach(function () { });
    it("Enrutar por nombre", () => {
        chai_1.expect(router["all"]).to.not.be.undefined;
        RouteStrategy_1.HttpRouteRegister.registerHttpRouter(router, [myroute]);
        for (const route of router.stack) {
            chai_1.expect(route.route.path).to.equal(myroute.getRoute());
        }
    });
});
//# sourceMappingURL=RouteRegister.spec.js.map