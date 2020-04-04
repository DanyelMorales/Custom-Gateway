import "ts-node";
import "mocha";
import { expect } from "chai";
import { ServiceBootstrap } from "@root/System";
import { TestHelper } from "@tests/ProxyUtils";
import { JSONType } from "@utils/JSONUtils";
import { AppServices } from "@system";

const testHelper: TestHelper = new TestHelper();

describe("Global", () => {
  beforeEach(function() {});

  afterEach(function() {});

  it("Deberia retornar el nombre en string del enumerador", () => {
    expect(AppServices.ConfigManager).to.be.equals("ConfigManager");
    expect(AppServices[AppServices.ConfigManager]).to.be.equals(
      "ConfigManager"
    );
  });

  it("Deberia retornar una sola instancia del singleton", () => {
    const ins1 = ServiceBootstrap.instance(testHelper.appConfig);
    const ins2 = ServiceBootstrap.instance(testHelper.appConfig);
    const ins3 = ServiceBootstrap.instance(testHelper.appConfig);
    expect(ins1)
      .to.be.equals(ins2)
      .to.be.equals(ins3);
  });

  it("Deberia retornar siempre el mismo servicemanager", () => {
    const ins1 = ServiceBootstrap.instance(testHelper.appConfig);
    const sm1 = ins1.serviceManager;
    const sm2 = ins1.serviceManager;
    const sm3 = ins1.serviceManager;
    expect(sm1)
      .to.be.equals(sm2)
      .to.be.equals(sm3);
  });

  it("Deberia cargar una configuracion utilizando el sm", () => {
    const ins1 = ServiceBootstrap.instance(testHelper.appConfig);
    const configmanager = ins1.serviceManager.get(AppServices.ConfigManager);
    expect(configmanager).to.not.be.null;
    expect(configmanager.loadWrapper("routes")).to.not.be.null;
    expect(configmanager.isLoaded("routes")).to.not.be.false;
  });
});
