"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("ts-node");
require("mocha");
const chai_1 = require("chai");
const ConfigManager_1 = require("@utils/ConfigManager");
const ProxyUtils_1 = require("@tests/ProxyUtils");
const testHelper = new ProxyUtils_1.TestHelper();
describe("ConfigManager", () => {
    let manager;
    beforeEach(function () {
        manager = new ConfigManager_1.ConfigManager({
            routes: testHelper.constants.routes_test_config,
            microservices: testHelper.constants.microservices_test_config
        });
    });
    afterEach(function () { });
    it("Deberia validar si esta o no cargado algún wrapper", () => {
        chai_1.expect(manager.isLoaded("routes")).to.be.false;
        chai_1.expect(manager.isLoaded("routesxxxa")).to.be.false;
    });
    it("Deberia cargar el wrapper", () => {
        chai_1.expect(manager.loadWrapper("routesxxxx")).to.be.null;
        chai_1.expect(manager.loadWrapper("routes")).to.not.be.null;
        chai_1.expect(manager.isLoaded("routes")).to.not.be.false;
    });
    it("Deberia remover el wrapper", () => {
        chai_1.expect(manager.loadWrapper("routes")).to.not.be.null;
        chai_1.expect(manager.isLoaded("routes")).to.not.be.false;
        manager.removeWrapper("routes");
        chai_1.expect(manager.isLoaded("routes")).to.be.false;
    });
    it("Deberia obtener el wrapper", () => {
        chai_1.expect(manager.isLoaded("microservices")).to.be.false;
        chai_1.expect(manager.getWrapper("microservices")).to.not.be.null;
        chai_1.expect(manager.isLoaded("microservices")).to.not.be.false;
    });
});
//# sourceMappingURL=ConfigManager.spec.js.map