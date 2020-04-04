"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("ts-node");
require("mocha");
const chai_1 = require("chai");
const System_1 = require("@root/System");
const ProxyUtils_1 = require("@tests/ProxyUtils");
const _system_1 = require("@system");
const testHelper = new ProxyUtils_1.TestHelper();
describe("Global", () => {
    beforeEach(function () { });
    afterEach(function () { });
    it("Deberia retornar el nombre en string del enumerador", () => {
        chai_1.expect(_system_1.AppServices.ConfigManager).to.be.equals("ConfigManager");
        chai_1.expect(_system_1.AppServices[_system_1.AppServices.ConfigManager]).to.be.equals("ConfigManager");
    });
    it("Deberia retornar una sola instancia del singleton", () => {
        const ins1 = System_1.ServiceBootstrap.instance(testHelper.appConfig);
        const ins2 = System_1.ServiceBootstrap.instance(testHelper.appConfig);
        const ins3 = System_1.ServiceBootstrap.instance(testHelper.appConfig);
        chai_1.expect(ins1)
            .to.be.equals(ins2)
            .to.be.equals(ins3);
    });
    it("Deberia retornar siempre el mismo servicemanager", () => {
        const ins1 = System_1.ServiceBootstrap.instance(testHelper.appConfig);
        const sm1 = ins1.serviceManager;
        const sm2 = ins1.serviceManager;
        const sm3 = ins1.serviceManager;
        chai_1.expect(sm1)
            .to.be.equals(sm2)
            .to.be.equals(sm3);
    });
    it("Deberia cargar una configuracion utilizando el sm", () => {
        const ins1 = System_1.ServiceBootstrap.instance(testHelper.appConfig);
        const configmanager = ins1.serviceManager.get(_system_1.AppServices.ConfigManager);
        chai_1.expect(configmanager).to.not.be.null;
        chai_1.expect(configmanager.loadWrapper("routes")).to.not.be.null;
        chai_1.expect(configmanager.isLoaded("routes")).to.not.be.false;
    });
});
//# sourceMappingURL=Global.spec.js.map