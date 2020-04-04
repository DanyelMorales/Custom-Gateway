import * as RouteRegister from "@utils/RouteRegister";
import { IRouteRegister, RouteType, IComplexRoute } from "@utils/RouteRegister";
import { ProxyService } from "@proxy/ProxyService";
import { Log } from "@root/SystemLog";
import sm = require("@annotated/ServiceManager");
import { AppServices } from "@system";
import { PayloadFactory } from "@proxy/ExpressRequest/Express";
import * as express from "express";
import { ActionFilter } from "@utils/ActionFIlter";
import * as path from "path";
/**
 *
 */
class ProxyRouteEventHandler {
  private responseObj: any;
  private log: Log.Message = Log.Message.instance();

  constructor(private proxyService: ProxyService) {
    this.attachEventsForRequest();
  }

  /**
   *
   * @param responseObj
   */
  update(responseObj: any) {
    this.responseObj = responseObj;
  }

  /**
   *
   */
  private attachEventsForRequest() {
    this.proxyService.on(
      ProxyService.ON_REQUEST_RESULT,
      this.onRequestResult.bind(this)
    );
    this.proxyService.on(ProxyService.ON_ERROR, json => {
      this.responseObj.status(json.status).send(json);
    });
  }

  private onRequestResult(json) {
    if (typeof json.response["headers"]["content-type"] !== "undefined") {
      this.responseObj.set(
        "Content-Type",
        json.response.headers["content-type"]
      );
    }
    this.responseObj.status(json.response.statusCode).send(json.body);
  }
}

/**
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 */
@sm.Services(AppServices.PayloadFactory)
export class ProxyRoute extends ActionFilter
  implements RouteRegister.IComplexRoute {
  static readonly CLEAN_ROUTE: string = "CLEAN_ROUTE";

  private route: string;
  private responseObj: any;
  private PayloadFactory: PayloadFactory;

  /**
   * Construye una instancia del proxy route
   * @param route ruta de exposición
   * @param regex expresión regular usada para limpiar el path original
   */
  static build(route: string, regex: any): ProxyRoute {
    const proxyRoute: ProxyRoute = new ProxyRoute(route);
    proxyRoute.addFilter(ProxyRoute.CLEAN_ROUTE, currentPath => {
      return currentPath.replace(regex, "");
    });
    return proxyRoute;
  }

  /**
   * usar decorador para crear proxyservice
   */
  private constructor(theRoute: string) {
    super();
    this.route = theRoute;
  }

  /**
   *
   */
  getType(): RouteRegister.RouteType {
    return RouteRegister.RouteType.ALL;
  }

  /**
   *
   */
  invoke(req: any, res: any, next: any) {
    const proxyService = new ProxyService(this.PayloadFactory);
    const eventHandler = new ProxyRouteEventHandler(proxyService);
    eventHandler.update(res);
    const endpoint = this.applyFilter(ProxyRoute.CLEAN_ROUTE, req.path);
    proxyService.delegate(endpoint, req);
  }

  /**
   *
   */
  getRoute(): string {
    return this.route;
  }
}
