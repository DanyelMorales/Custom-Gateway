/**
 * Colección de interfaces, enumeradores y clases para la resolución de modulos.
 * @author Daniel Vera Morales
 */
import * as express from "express";
import * as RouteMod from "@utils/RouteRegister";
import { ServiceManager } from "@servicemanager";
import { JSONType } from "@utils/JSONUtils";

export interface AppData {
  expressApp: express.Application;
  service_manager: any;
  expressRouter: express.Router;
}

/**
 *  Rol con operaciones para un administrador de modulos
 *
 */
export interface IModuleManager {
  /**
   * Agregar un router al sistema
   * @router a anadir al sistema
   */
  add(_module: IModule | IHttpModule): void;

  /**
   * Suscribe un nuevo modulo en el sistema.
   * @_module colección de modulos que serán suscritos.
   */
  subscribe(_module: IModule[] | IHttpModule[]): void;
}

/**
 *  Modulo con operaciones para el manejo de rutas y otras actividades.
 */
export interface IModule {
  serviceManager(sm: ServiceManager<string>): void;
}

export interface IHttpModule {
  register(app: any, router?: any): void;
}

/**
 * Implementación predeterminada de un administrador de modulos
 * en el sistema.
 */
export class ModuleManager implements IModuleManager {
  private systemData: JSONType<string, any>;
  private app: express.Application;
  private router: express.Router;

  /**
   * @app Aplicación de express que será configurado
   */
  constructor(systemData: AppData) {
    this.systemData = new JSONType<string, any>(systemData);
    this.app = this.systemData.get("expressApp");
    this.router = this.systemData.get("expressRouter");
  }

  /**
   * @see IModuleManager#subscribe
   */
  subscribe(_module: IModule[] | IHttpModule[]): void {
    for (const _mod of _module) {
      this.add(_mod);
    }
  }

  /**
   * @see IModuleManager#add
   */
  add(_module: IModule | IHttpModule): void {
    (<IModule>_module).serviceManager(this.systemData.get("service_manager"));
    if ((<IHttpModule>_module).register) {
      (<IHttpModule>_module).register(this.app, this.router);
    }
  }

  register(type: any, routes: any[]) {}
}
