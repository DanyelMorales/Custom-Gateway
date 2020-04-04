"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("ts-node");
require("mocha");
const chai_1 = require("chai");
const FakeGuard_1 = require("./FakeGuard");
const ValidationGuardOptions_1 = require("../../RouteGuardManager/interfaces/ValidationGuardOptions");
const RouteGuardManager_1 = require("./../RouteGuardManager");
const ProxyUtils_1 = require("@tests/ProxyUtils");
const testHelper = new ProxyUtils_1.TestHelper();
describe("ProxyService", () => {
    let rgm;
    beforeEach(function () {
        rgm = new RouteGuardManager_1.RouteGuardManager();
    });
    afterEach(function () { });
    it("deberia verificar que sea permitido", () => {
        rgm.add(new FakeGuard_1.FakeGuard(ValidationGuardOptions_1.GuardOptions.CONTINUE));
        rgm.add(new FakeGuard_1.FakeGuard(ValidationGuardOptions_1.GuardOptions.CONTINUE));
        rgm.add(new FakeGuard_1.FakeGuard(ValidationGuardOptions_1.GuardOptions.CONTINUE));
        rgm.add(new FakeGuard_1.FakeGuard(ValidationGuardOptions_1.GuardOptions.ACCEPT));
        chai_1.expect(rgm.isAllowed("any")).to.be.true;
    });
    it("deberia verificar que no es permitido", () => {
        rgm.add(new FakeGuard_1.FakeGuard(ValidationGuardOptions_1.GuardOptions.CONTINUE));
        rgm.add(new FakeGuard_1.FakeGuard(ValidationGuardOptions_1.GuardOptions.CONTINUE));
        rgm.add(new FakeGuard_1.FakeGuard(ValidationGuardOptions_1.GuardOptions.CONTINUE));
        rgm.add(new FakeGuard_1.FakeGuard(ValidationGuardOptions_1.GuardOptions.DIE));
        chai_1.expect(rgm.isAllowed("any")).to.be.false;
    });
    it("deberia verificar que no es permitido pues no se encontraron validadores", () => {
        rgm.add(new FakeGuard_1.FakeGuard(ValidationGuardOptions_1.GuardOptions.CONTINUE));
        rgm.add(new FakeGuard_1.FakeGuard(ValidationGuardOptions_1.GuardOptions.CONTINUE));
        rgm.add(new FakeGuard_1.FakeGuard(ValidationGuardOptions_1.GuardOptions.CONTINUE));
        rgm.add(new FakeGuard_1.FakeGuard(ValidationGuardOptions_1.GuardOptions.CONTINUE));
        chai_1.expect(rgm.isAllowed("any")).to.be.false;
    });
});
//# sourceMappingURL=RouteGuardManager.spec.js.map