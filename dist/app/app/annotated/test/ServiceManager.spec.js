"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("ts-node");
require("mocha");
const chai_1 = require("chai");
const _system_1 = require("@system");
const ProxyUtils_1 = require("@tests/ProxyUtils");
const SystemGlobal = require("@annotated/SystemGlobal");
_system_1.Globals.bootstrap({
    ConfigManager: {
        routes: "routes",
        microservices: "microservices",
        declarations: "declarations"
    },
    globals: {
        pathToRoot: __dirname + "/../../../../../"
    }
});
const FakeClass_1 = require("./fake/FakeClass");
describe("ServiceManagerAnotation", () => {
    let fakeobj;
    const testUtil = new ProxyUtils_1.TestHelper();
    const testCfgMan = function () { };
    beforeEach(function () {
        fakeobj = new FakeClass_1.FakeClass();
    });
    afterEach(function () { });
    it("Deberia cargar el sm desde una anotacion", () => {
        const cfgmanager = fakeobj.getSM().get(_system_1.AppServices.ConfigManager);
        chai_1.expect(cfgmanager).to.not.be.null;
        cfgmanager.removeAll();
        chai_1.expect(cfgmanager.isLoaded("microservices")).to.be.false;
        chai_1.expect(cfgmanager.getWrapper("microservices")).to.not.be.null;
        chai_1.expect(cfgmanager.isLoaded("microservices")).to.not.be.false;
    });
    it("Deberia cargar un solo servicio", () => {
        const cfgmanager = fakeobj.getCfgManager();
        chai_1.expect(cfgmanager).to.not.be.null;
        cfgmanager.removeAll();
        chai_1.expect(cfgmanager.isLoaded("routes")).to.be.false;
        chai_1.expect(cfgmanager.getWrapper("routes")).to.not.be.null;
        chai_1.expect(cfgmanager.isLoaded("routes")).to.not.be.false;
    });
    it("Deberia cargar multiples servicios", () => {
        const cfgmanager = fakeobj.configmanagerobj;
        const helloworld = fakeobj.helloworldobj;
        chai_1.expect(cfgmanager).to.not.be.null;
        cfgmanager.removeAll();
        chai_1.expect(cfgmanager.isLoaded("routes")).to.be.false;
        chai_1.expect(cfgmanager.getWrapper("routes")).to.not.be.null;
        chai_1.expect(cfgmanager.isLoaded("routes")).to.not.be.false;
        chai_1.expect(helloworld).to.not.be.null;
        chai_1.expect(helloworld).to.be.equals("HELLO WORLD");
    });
    it("Deberia invocar un servicio desde un proveedor", () => {
        //
        //   AppServices.DECLARATIONS_MIDDLEWARE
        const sm = fakeobj.getSM();
        //  console.log(sm.get(AppServices.ConfigManager));
    });
});
//# sourceMappingURL=ServiceManager.spec.js.map