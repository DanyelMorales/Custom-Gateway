import * as express from "express";
import * as Mods from "@utils/ModuleManager";
import { ProxyCollection } from "./routes/Proxy";
import { HttpRouteRegister } from "@utils/RouteStrategy";
import * as RouteRegister from "@utils/RouteRegister";
import { SimpleRouteContainer } from "@utils/RouteRegister";
import { ServiceManager } from "@servicemanager";
const bodyParser = require("body-parser");

/**
 * Módulo de sistema que carga las operaciones del servidor.
 *
 * @author Daniel Vera Morales
 */
export class SystemModule implements Mods.IModule, Mods.IHttpModule {
  /**
   * - Proxy Route
   */
  private getRoutes(): RouteRegister.IComplexRoute[] {
    return [ProxyCollection.instance().webProxy];
  }

  register(app: any, router: any) {
    const thirdPartyRouter = express.Router();

    HttpRouteRegister.registerHttpRouter(thirdPartyRouter, this.getRoutes());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(thirdPartyRouter);
    app.use("/api", router);
  }

  serviceManager(sm: ServiceManager<string>): void { }
}
