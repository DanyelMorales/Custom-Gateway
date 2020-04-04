import "ts-node";
import "mocha";
import { expect } from "chai";
import { GuardOptions } from "@mods_/System/model/RouteGuardManager/interfaces/ValidationGuardOptions";
import { PublicRouteGuard } from "@guards/PublicRouteGuard";
import { TestData } from "./FakePayload";
const routeGuard = new PublicRouteGuard();
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
  beforeEach(function() {});
  afterEach(function() {});
  it("Deberia permitir la ruta si no posee acciones definidas", () => {
    // con acciones vacias en la ruta
    const data = TestData.data(datajson);
    data.fakepayload.method = "POST";
    data.route.webInvokation = true;
    expect(routeGuard.isAllowed(data.route)).to.be.equals(GuardOptions.ACCEPT);
  });
  it("Deberia denegar la ruta si no existe en las acciones de la ruta", () => {
    methods.public = ["GET", "PUT"];
    datajson["methods"] = methods;
    const data = TestData.data(datajson);
    // deberia fallar
    data.fakepayload.method = "POST";
    data.route.webInvokation = true;
    expect(routeGuard.isAllowed(data.route)).to.be.equals(GuardOptions.DIE);
  });
  it("Deberia permitir la ruta pues el método es permitido", () => {
    methods.public = ["GET", "PUT"];
    datajson["methods"] = methods;
    const data = TestData.data(datajson);
    data.fakepayload.method = "PUT";
    data.route.webInvokation = true;
    expect(routeGuard.isAllowed(data.route)).to.be.equals(GuardOptions.ACCEPT);
  });
  it("Deberia lanzar continue si  posee protección", () => {
    methods.public = ["GET", "PUT"];
    datajson["methods"] = methods;
    datajson["protected"] = true;
    const data = TestData.data(datajson);
    data.fakepayload.method = "PUT";
    data.route.webInvokation = true;
    expect(routeGuard.isAllowed(data.route)).to.be.equals(
      GuardOptions.CONTINUE
    );
  });
  it("Deberia permitir si no posee proteccion", () => {
    methods.public = ["GET", "PUT"];
    datajson["methods"] = methods;
    datajson["protected"] = false;
    const data = TestData.data(datajson);
    data.fakepayload.method = "PUT";
    data.route.webInvokation = true;
    expect(routeGuard.isAllowed(data.route)).to.be.equals(GuardOptions.ACCEPT);
  });

  it("Deberia permitir si webinvokation es false", () => {
    methods.public = ["GET", "PUT"];
    datajson["methods"] = methods;
    datajson["protected"] = false;
    datajson["web_invokation"] = false;
    const data = TestData.data(datajson);
    data.fakepayload.method = "PUT";
    data.route.webInvokation = true;
    expect(routeGuard.isAllowed(data.route)).to.be.equals(GuardOptions.DIE);
  });

  it("Deberia permitir si webinvokation es true", () => {
    methods.public = ["GET", "PUT"];
    datajson["methods"] = methods;
    datajson["protected"] = false;
    datajson["web_invokation"] = false;
    const data = TestData.data(datajson);
    data.fakepayload.method = "PUT";
    data.route.webInvokation = true;
    expect(routeGuard.isAllowed(data.route)).to.be.equals(GuardOptions.DIE);
  });

  it("Deberia permitir si webinvokation es true true", () => {
    methods.public = ["GET", "PUT"];
    datajson["methods"] = methods;
    datajson["protected"] = false;
    datajson["web_invokation"] = true;
    const data = TestData.data(datajson);
    data.fakepayload.method = "PUT";
    data.route.webInvokation = true;
    expect(routeGuard.isAllowed(data.route)).to.be.equals(GuardOptions.ACCEPT);
  });
});
