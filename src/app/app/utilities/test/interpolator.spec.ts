import "ts-node";
import "mocha";
import { expect } from "chai";
import { TestHelper } from "@tests/ProxyUtils";
import { Interpolator } from "@app/utilities/Interpolator";

const mode: string = "prod";
const testHelper: TestHelper = new TestHelper();


describe("Interpolator", () => {
    let interpolator: Interpolator= null;
  beforeEach(function() {
    interpolator = new Interpolator("/");
  });
  afterEach(function() {});
 // wellknownroute/append/to/originalroute
  it("Should expand proxy route", ()=>{
    const result = interpolator.eval("listarpaises/wellknownroute/append/to/originalroute");
    expect(interpolator.expand("countries")).to.be.equals("countries/wellknownroute/append/to/originalroute");
  });
 
});
