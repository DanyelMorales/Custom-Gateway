import * as express from "express";
import * as Mods from "@utils/ModuleManager";
import { ServiceManager } from "@servicemanager";
import EventBus from "@utils/EventBus";
import { ProxyEvents } from "@app/modules/Proxy/ProxyEvents";

/**
 * Registra una ruta o una aplicación Express para que sea protegida por CORS.
 */
export class CORSManager {

  /**
   * Habilita un arreglo de rutas y aplicaciones
   * @param o arreglo a registrar
   * @returns una instancia de CORSManager
   */
  static $enable(o: express.Application[] | express.Router[]): CORSManager{
    const corsManager = new CORSManager();
   for(const item of o){
        corsManager.enable(item);
    }
    return corsManager;
  }

  /**
   * @param o Aplicacion o rutas a registrarse en CORS
   */
  enable(o: express.Application | express.Router) {
    o.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, PUT, PATCH, OPTIONS");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, authorization, Access-Control-Request-Headers, Access-Control-Request-Method"
      );
      next();
    });
  }
}

/**
 * @author Daniel Vera Morales
 */
export class CORSModule implements Mods.IModule, Mods.IHttpModule {
  /**
   * @param sm
   */
  serviceManager(sm: ServiceManager<string>): void { }

  /**
   *
   * @param app
   */
  register(app: any, router: any): void {
    const corsManager = new CORSManager();
    corsManager.enable(app);
    corsManager.enable(router);

    // Habilita el método options en cada ruta. 
    EventBus.addFilter(ProxyEvents.RAW_ROUTE, (route) => {
      const methods = route.methods;
      if (methods && methods.public) {
        methods.public.push("OPTIONS");
      }
      return route;
    });
  }
}
