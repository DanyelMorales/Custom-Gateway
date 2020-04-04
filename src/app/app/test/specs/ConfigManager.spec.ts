import "ts-node";
import "mocha";
import { expect } from "chai";
import { ConfigManager } from "@utils/ConfigManager";
import { TestHelper } from "@tests/ProxyUtils";

const testHelper: TestHelper = new TestHelper();

describe("ConfigManager", () => {
  let manager: ConfigManager;

  beforeEach(function() {
    manager = new ConfigManager({
      routes: testHelper.constants.routes_test_config,
      microservices: testHelper.constants.microservices_test_config
    });
  });

  afterEach(function() {});

  it("Deberia validar si esta o no cargado algún wrapper", () => {
    expect(manager.isLoaded("routes")).to.be.false;
    expect(manager.isLoaded("routesxxxa")).to.be.false;
  });

  it("Deberia cargar el wrapper", () => {
    expect(manager.loadWrapper("routesxxxx")).to.be.null;
    expect(manager.loadWrapper("routes")).to.not.be.null;
    expect(manager.isLoaded("routes")).to.not.be.false;
  });

  it("Deberia remover el wrapper", () => {
    expect(manager.loadWrapper("routes")).to.not.be.null;
    expect(manager.isLoaded("routes")).to.not.be.false;
    manager.removeWrapper("routes");
    expect(manager.isLoaded("routes")).to.be.false;
  }); 
  
  it("Deberia obtener el wrapper", () => {
    expect(manager.isLoaded("microservices")).to.be.false;
    expect(manager.getWrapper("microservices")).to.not.be.null;
    expect(manager.isLoaded("microservices")).to.not.be.false;
  });
});
