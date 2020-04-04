import * as express from "express";
import * as Mods from "@utils/ModuleManager";
import { FakeRoute } from "./FakeRoute";
import * as RouteMod from "@utils/RouteRegister";
import { ServiceManager } from "@servicemanager";
/**
 *
 */
export class FakeMod implements Mods.IModule {
  constructor() {}

  serviceManager(sm: ServiceManager<string>): void {}
  getRouter(): express.Router {
    return null;
  }

  getRoutes(): RouteMod.IComplexRoute[] {
    return [new FakeRoute()];
  }

  register(app: any) {}
}
