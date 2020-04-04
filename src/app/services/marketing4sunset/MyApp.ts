import * as App from "@app/AbstractApp";
import * as voltux from "@utils/ModuleManager";
import * as auth from "./auth/AuthModule";
import * as system from "@mods_/System/SystemModule";
import { AssetsModule } from "@mods_/Assets/AssetsModule";
import { BlockModule } from "@mods_/Assets/BlockModule";
import { CORSModule } from "./other/CORSModule";
import env from "./../../bin/EnvyHelper";
import { Environment } from "./../../bin/Environments";

/**
 * Normalize a port into a number, string, or false.
 */
export class MyApp extends App.Server {
  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): App.Server {
    return new MyApp();
  }

  constructor() {
    super({
      ConfigManager: {
        routes: "routes",
        microservices: "microservices",
        declarations: "declarations",
        "menu-tree": "menu-tree"
      },
      globals: {
        pathToRoot: __dirname + "/../../../../"
      }
    });
  }

  /**
   *  modulos que se van a cargar al sistema
   */
  getModules(): voltux.IModule[] {
    const _mods_ = [
      new system.SystemModule(),
      new AssetsModule(),
      new auth.AuthModule(),
      new BlockModule()
    ];
    return this.addDevMods(_mods_);
  }

  private addDevMods(mods) {
    const helper = new env();
    if (helper.isEnvy(Environment.DEVELOPMENT)) {
      mods.unshift(new CORSModule());
    }
    return mods;
  }
}

/**
 * New typescript file
 */
module.exports = MyApp;
