import "ts-node";
import "mocha";
import { expect } from "chai";
import { Globals, AppServices, ServiceManagerMiddleware } from "@system";
import { TestHelper } from "@tests/ProxyUtils";

const SystemGlobal = require("@annotated/SystemGlobal");
Globals.bootstrap({
  ConfigManager: {
    routes: "routes",
    microservices: "microservices",
    declarations: "declarations"
  },
  globals: {
    pathToRoot: __dirname + "/../../../../../"
  }
});
import { FakeClass } from "./fake/FakeClass";
import { ISuperServiceManager } from "@utils/ServiceManager";
describe("ServiceManagerAnotation", () => {
  let fakeobj;
  const testUtil = new TestHelper();
  const testCfgMan = function() {};

  beforeEach(function() {
    fakeobj = new FakeClass();
  });
  afterEach(function() {});

  it("Deberia cargar el sm desde una anotacion", () => {
    const cfgmanager = fakeobj.getSM().get(AppServices.ConfigManager);
    expect(cfgmanager).to.not.be.null;
    cfgmanager.removeAll();
    expect(cfgmanager.isLoaded("microservices")).to.be.false;
    expect(cfgmanager.getWrapper("microservices")).to.not.be.null;
    expect(cfgmanager.isLoaded("microservices")).to.not.be.false;
  });

  it("Deberia cargar un solo servicio", () => {
    const cfgmanager = fakeobj.getCfgManager();
    expect(cfgmanager).to.not.be.null;
    cfgmanager.removeAll();
    expect(cfgmanager.isLoaded("routes")).to.be.false;
    expect(cfgmanager.getWrapper("routes")).to.not.be.null;
    expect(cfgmanager.isLoaded("routes")).to.not.be.false;
  });

  it("Deberia cargar multiples servicios", () => {
    const cfgmanager = fakeobj.configmanagerobj;
    const helloworld = fakeobj.helloworldobj;
    expect(cfgmanager).to.not.be.null;
    cfgmanager.removeAll();
    expect(cfgmanager.isLoaded("routes")).to.be.false;
    expect(cfgmanager.getWrapper("routes")).to.not.be.null;
    expect(cfgmanager.isLoaded("routes")).to.not.be.false;

    expect(helloworld).to.not.be.null;
    expect(helloworld).to.be.equals("HELLO WORLD");
  });

  it("Deberia invocar un servicio desde un proveedor", () => {
    //
    //   AppServices.DECLARATIONS_MIDDLEWARE
    const sm: ISuperServiceManager<string> = fakeobj.getSM();
    //  console.log(sm.get(AppServices.ConfigManager));
  });
});
