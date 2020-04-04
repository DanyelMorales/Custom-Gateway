"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("ts-node");
require("mocha");
const chai_1 = require("chai");
const ValidationGuardOptions_1 = require("@mods_/System/model/RouteGuardManager/interfaces/ValidationGuardOptions");
const PublicRouteGuard_1 = require("@guards/PublicRouteGuard");
const FakePayload_1 = require("./FakePayload");
const routeGuard = new PublicRouteGuard_1.PublicRouteGuard();
const datajson = {
    protected: false,
    route: null,
    actions: [],
    name: "",
    parent: ""
};
const methods = {
    private: {},
    public: ["POST", "PUT"]
};
describe("PublicRouteGuard", () => {
    beforeEach(function () { });
    afterEach(function () { });
    it("Deberia permitir la ruta si no posee acciones definidas", () => {
        // con acciones vacias en la ruta
        const data = FakePayload_1.TestData.data(datajson);
        data.fakepayload.method = "POST";
        data.route.webInvokation = true;
        chai_1.expect(routeGuard.isAllowed(data.route)).to.be.equals(ValidationGuardOptions_1.GuardOptions.ACCEPT);
    });
    it("Deberia denegar la ruta si no existe en las acciones de la ruta", () => {
        methods.public = ["GET", "PUT"];
        datajson["methods"] = methods;
        const data = FakePayload_1.TestData.data(datajson);
        // deberia fallar
        data.fakepayload.method = "POST";
        data.route.webInvokation = true;
        chai_1.expect(routeGuard.isAllowed(data.route)).to.be.equals(ValidationGuardOptions_1.GuardOptions.DIE);
    });
    it("Deberia permitir la ruta pues el método es permitido", () => {
        methods.public = ["GET", "PUT"];
        datajson["methods"] = methods;
        const data = FakePayload_1.TestData.data(datajson);
        data.fakepayload.method = "PUT";
        data.route.webInvokation = true;
        chai_1.expect(routeGuard.isAllowed(data.route)).to.be.equals(ValidationGuardOptions_1.GuardOptions.ACCEPT);
    });
    it("Deberia lanzar continue si  posee protección", () => {
        methods.public = ["GET", "PUT"];
        datajson["methods"] = methods;
        datajson["protected"] = true;
        const data = FakePayload_1.TestData.data(datajson);
        data.fakepayload.method = "PUT";
        data.route.webInvokation = true;
        chai_1.expect(routeGuard.isAllowed(data.route)).to.be.equals(ValidationGuardOptions_1.GuardOptions.CONTINUE);
    });
    it("Deberia permitir si no posee proteccion", () => {
        methods.public = ["GET", "PUT"];
        datajson["methods"] = methods;
        datajson["protected"] = false;
        const data = FakePayload_1.TestData.data(datajson);
        data.fakepayload.method = "PUT";
        data.route.webInvokation = true;
        chai_1.expect(routeGuard.isAllowed(data.route)).to.be.equals(ValidationGuardOptions_1.GuardOptions.ACCEPT);
    });
    it("Deberia permitir si webinvokation es false", () => {
        methods.public = ["GET", "PUT"];
        datajson["methods"] = methods;
        datajson["protected"] = false;
        datajson["web_invokation"] = false;
        const data = FakePayload_1.TestData.data(datajson);
        data.fakepayload.method = "PUT";
        data.route.webInvokation = true;
        chai_1.expect(routeGuard.isAllowed(data.route)).to.be.equals(ValidationGuardOptions_1.GuardOptions.DIE);
    });
    it("Deberia permitir si webinvokation es true", () => {
        methods.public = ["GET", "PUT"];
        datajson["methods"] = methods;
        datajson["protected"] = false;
        datajson["web_invokation"] = false;
        const data = FakePayload_1.TestData.data(datajson);
        data.fakepayload.method = "PUT";
        data.route.webInvokation = true;
        chai_1.expect(routeGuard.isAllowed(data.route)).to.be.equals(ValidationGuardOptions_1.GuardOptions.DIE);
    });
    it("Deberia permitir si webinvokation es true true", () => {
        methods.public = ["GET", "PUT"];
        datajson["methods"] = methods;
        datajson["protected"] = false;
        datajson["web_invokation"] = true;
        const data = FakePayload_1.TestData.data(datajson);
        data.fakepayload.method = "PUT";
        data.route.webInvokation = true;
        chai_1.expect(routeGuard.isAllowed(data.route)).to.be.equals(ValidationGuardOptions_1.GuardOptions.ACCEPT);
    });
});
//# sourceMappingURL=PublicRouteGuard.spec.js.map