import * as express from "express";
import * as Mods from "@utils/ModuleManager";
import { SimpleRoute } from "@utils/RouteRegister";
import { SimpleRouteRegister } from "@utils/RouteStrategy";
import sm = require("@annotated/ServiceManager");
import { AppServices } from "@system";
import { Log } from "@root/SystemLog";
import { ServiceManager } from "@servicemanager";
import { IGlobalFieldContainer } from "@app/SystemGlobal";

export class AssetsModule implements Mods.IModule, Mods.IHttpModule {
  private environmentData: IGlobalFieldContainer;
  private log: Log.Message = Log.Message.instance();

  register(app: any): void {
    this.log
      .is()
      .success()
      .action(Log.MessageAction.USER_SYS_ACTION)
      .printf(this.environmentData.front, "Assets", "Initializing");
    const route = new SimpleRoute(this.environmentData.front);
    const router = express.static;
    SimpleRouteRegister._single(route, router, app);
  }

  serviceManager(serviceManager: ServiceManager<string>): void {
    this.environmentData = serviceManager.get(
      AppServices.SystemEnvironmentData
    );
  }
}
