"use strict";

import * as bodyParser from "body-parser";
import * as express from "express";
import * as path from "path";
import * as voltux from "@utils/ModuleManager";
import { Globals } from "@system";
import { JSONType } from "app/utilities/JSONUtils";

/**
 * The server.
 *
 * @class Server
 */
export abstract class Server {
  protected moduleData: voltux.AppData;
  protected _voltuxModules: voltux.ModuleManager;
  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor(appData: any) {
    Globals.bootstrap(appData);
    const service_manager = Globals.bootstrap(appData).serviceManager;

    this.moduleData = {
      expressApp: express(),
      service_manager: service_manager,
      expressRouter: express.Router({ mergeParams: true })
    };
    this._voltuxModules = new voltux.ModuleManager(this.moduleData);
  }

  /**
   *
   */
  get myExpress(): express.Application {
    return this.moduleData.expressApp;
  }

  /**
   *
   */
  initialize() {
    this._voltuxModules.subscribe(this.getModules());
  }

  /**
   *
   */
  abstract getModules(): voltux.IModule[];
}
