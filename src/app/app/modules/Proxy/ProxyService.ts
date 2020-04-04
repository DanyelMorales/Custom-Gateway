import * as Proxy from "./GenericProxy";
import { ProxyFacade } from "@proxy/ProxyFacade";
import sm = require("@annotated/ServiceManager");
import { AppServices } from "@system";
import { ServiceManager } from "@utils/ServiceManager";
import { ActionFilter } from "@utils/ActionFIlter";
import { RouteFactory } from "@proxy/RouteFactory";
import { RouteGuardManager, EventBus } from "@/System";
import { EventEmitter } from "events";
import { SecurityServiceLogger } from "@app/logger/Proxy";
import { EndpointError, ResponseContainer } from "@app/dto/Route";
import { ProxyEvents } from "@app/modules/Proxy/ProxyEvents";

/**
 * @author Daniel Vera Morales
 */
@sm.Services(
  AppServices.RouteFactory,
  AppServices.RouteGuardManager,
  AppServices.ProxyFacade
)
export class ProxyService extends ActionFilter implements Proxy.IProxy {
  static readonly ON_REQUEST_RESULT: string = "REMOTE_REQUEST_RESULT";
  static readonly ON_ERROR: string = "ON_ERROR";
  static readonly ON_BEFORE_REQUEST: string = "BEFORE_REMOTE_REQUEST";
  static readonly REQUEST_ERROR: string = "REMOTE REQUEST DENIED";
  static readonly DELEGATION_ERROR: string = "DELEGATION ERROR";
  static readonly CONNECTION_REFUSED: string = "CONNECTION REFUSED";
  static readonly FILTER_DECORATED_WRAPPER: string = "FILTER_DECORATED_WRAPPER";
  static readonly FILTER_IS_ERROR: string = "FILTER_IS_ERROR";

  private RouteGuardManager: RouteGuardManager;
  private ProxyFacade: ProxyFacade;
  private RouteFactory: RouteFactory;
  private logger: SecurityServiceLogger;

  /**
   * @param payloadFactory
   */
  constructor(private payloadFactory: Proxy.IPayloadFactory) {
    super();
    this.logger = new SecurityServiceLogger(this);
  }

  /**
   * Delega una petición request a una ruta de un microservicio
   * @param endpoint Ruta que se desea utilizar como punto de delegación
   * @param request petición de Express a ser reenviado
   * @param callback retrollamada para procesar los resultados del proxy
   */
  delegate(endpoint: string, request: any): void {
    try {
      const data: Proxy.PayloadWrapper = this.applyFilter(
        ProxyService.FILTER_DECORATED_WRAPPER,
        this.wrappPayload(endpoint, request)
      );
      this.delegateWrapper(endpoint, data);
    } catch (e) {
      this.theError(ProxyService.DELEGATION_ERROR, e, 409, endpoint);
    }
  }

  /**
   * @param endpoint
   * @param data
   */
  delegateWrapper(endpoint: string, data: Proxy.PayloadWrapper): void {
    const that = this;
    this.RouteGuardManager.removeAllListeners();

    this.RouteGuardManager.once(this.RouteGuardManager.ON_ALLOWED, ($ev) => {
      that.emit(ProxyService.ON_BEFORE_REQUEST, data.decorated, endpoint);
      data.sender.send(data.decorated, that.buildResponse(endpoint));
    });
    this.RouteGuardManager.once(this.RouteGuardManager.ON_NOT_ALLOWED, ($ev) => {
      that.theError(ProxyService.REQUEST_ERROR, "NOT ALLOWED", 401, endpoint, $ev[2]);
    });

    this.RouteGuardManager.isAllowed(data);
  }

  /**
   * @param type
   * @param data
   */
  private theError(type: string, reason, status, endpoint: string, data: string[] = []) {
    const json = new EndpointError(true, type, endpoint, reason, status, data);
    this.emit(ProxyService.ON_ERROR, json, endpoint, status);
  }

  /**
   * @param endpoint
   * @param request
   */
  wrappPayload(endpoint: string, request: any): Proxy.PayloadWrapper {
    const route = this.RouteFactory.build(endpoint);
    const payload = this.payloadFactory.build(request, route);
    const sender = this.ProxyFacade.getProxySender();
    const decoratedPayload = sender.decoratePackage(payload);
    const wrapper: Proxy.PayloadWrapper = new Proxy.PayloadWrapper();

    wrapper.decorated = decoratedPayload;
    wrapper.payload = EventBus.applyFilter(ProxyEvents.RAW_PAYLOAD, payload);
    wrapper.route = EventBus.applyFilter(ProxyEvents.RAW_ROUTE, route);
    wrapper.sender = sender;

    return wrapper;
  }

  private buildResponse(endpoint) {
    const that = this;
    return (error, response, body) => {
      const responseContainer = that.applyFilter(
        ProxyService.FILTER_IS_ERROR,
        new ResponseContainer(error, response, body)
      );

      if (!responseContainer.error) {
        that.emit(ProxyService.ON_REQUEST_RESULT, responseContainer, endpoint);
        return;
      }

      that.theError(
        ProxyService.CONNECTION_REFUSED,
        "ERROR",
        409,
        responseContainer.error
      );
    }
  }


}
