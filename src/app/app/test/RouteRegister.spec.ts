import "ts-node";
import "mocha";
import { expect } from "chai";
import * as express from "express";
import * as register from "@utils/RouteRegister";
import * as fakeRoute from "./FakeRoute";
import { ProxyRoute } from "@proxy/routes/ProxyRoute";
import { HttpRouteRegister } from "@utils/RouteStrategy";

describe("RouteRegister", () => {
  let myroute = null;
  let router = null;

  beforeEach(function() {
    router = express.Router();
    myroute = new fakeRoute.FakeRoute();
  });

  afterEach(function() {});

  it("Enrutar por nombre", () => {
    expect(router["all"]).to.not.be.undefined;
    HttpRouteRegister.registerHttpRouter(router, [myroute]);

    for (const route of router.stack) {
      expect(route.route.path).to.equal(myroute.getRoute());
    }
  });
});
