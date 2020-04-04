import "ts-node";
import "mocha";
import { expect } from "chai";
import { DelegationHelper } from "@proxy/ExpressRequest/DelegationHelper";
import { Globals, AppServices } from "@system";
const SystemGlobalxxx = require("@annotated/SystemGlobal");

describe("ProxyService", () => {
  beforeEach(function() {});
  afterEach(function() {});

  it("Deberia delegar asincronamente la petición", done => {
    Globals.bootstrap({
      ConfigManager: {
        routes: "routes",
        microservices: "microservices",
        declarations: "declarations"
      },
      globals: SystemGlobalxxx.build({
        pathToRoot: __dirname + "/../../../../"
      })
    });
    const delegator = new DelegationHelper();
    delegator.onResult(container => {
      console.log(container);
      done();
    });
    delegator.onError(error => {
      console.log(error);
      done();
    });
    delegator.filterResult(container => {
      return container;
    });
    const payload = delegator.expressRequest({
      method: "GET"
    });
    delegator.delegate("USER_AUTHENTICATION", payload.build(), false);
  });
});
