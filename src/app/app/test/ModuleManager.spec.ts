import "ts-node";
import "mocha";
import { expect } from "chai";
import * as express from "express";
import * as register from "@utils/RouteRegister";
import * as fakeRoute from "./FakeRoute";
import * as FakeMod from "./FakeMod";
import { ModuleManager } from "@utils/ModuleManager";
import { JSONType } from "app/utilities/JSONUtils";
import { Globals } from "@system";

describe("ModuleManager", () => {
  // let modManager = null;

  beforeEach(function() {
    /*const data = {
      expressApp: express(),
      service_manager: Globals.bootstrap({}),
      expressRouter: express.Router()
    };*/
    //   modManager = new ModuleManager(data);
  });

  afterEach(function() {});

  it("Suscribir modulo", () => {
    // modManager.add(new FakeMod.FakeMod());
  });
});
