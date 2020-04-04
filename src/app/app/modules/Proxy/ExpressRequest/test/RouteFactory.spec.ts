import "ts-node";
import "mocha";
import { expect } from "chai";
import { TestHelper } from "@tests/ProxyUtils";
import { RouteFactory } from "@app/modules/Proxy/RouteFactory";

const mode: string = "prod";
const testHelper: TestHelper = new TestHelper();


describe("ProxyService", () => {
    let routeFactory: RouteFactory= null;
  beforeEach(function() {
    routeFactory = new RouteFactory(testHelper.routes);
  });
  afterEach(function() {});

  it("Should expand proxy route", ()=>{
    const result = routeFactory.build("listarpaises/wellknownroute/append/to/originalroute");
    expect(result.route).to.be.equals("countries/wellknownroute/append/to/originalroute");
  });
 
});
