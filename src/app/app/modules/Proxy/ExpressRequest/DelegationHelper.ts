import sm = require("@annotated/ServiceManager");
import { AppServices } from "@system";
import { ProxyService } from "@proxy/ProxyService";
import { PayloadFactory } from "@proxy/ExpressRequest/Express";
import { ExpressRequest } from "./ExpressRequest";
/**
 * Facilita el uso del proxy en express
 *
 * @author Daniel Vera Morales
 */
@sm.Services(AppServices.PayloadFactory)
export class DelegationHelper {
  private PayloadFactory: PayloadFactory;
  private _proxyService: ProxyService;

  constructor() {
    this._proxyService = new ProxyService(this.PayloadFactory);
  }

  /**
   * Delega una petición simulando una petición Express, especificando si
   * la petición viene desde un cliente web o no (petición interna).
   * @param endpoint
   * @param request
   * @param fromWeb
   */
  delegate(endpoint: string, request: any, fromWeb: boolean = true): void {
    this._proxyService.addFilter(
      ProxyService.FILTER_DECORATED_WRAPPER,
      wrapper => {
        wrapper.webInvokation = fromWeb;
        return wrapper;
      }
    );
    this._proxyService.delegate(endpoint, request);
  }

  /**
   * @returns un nuevo request tipo express, listo para ser usado
   * @param data datos de inicialización
   */
  expressRequest(data: any = null) {
    return new ExpressRequest(data);
  }

  /**
   *  @returns instancia del servicio de proxy
   */
  get proxyService() {
    return this._proxyService;
  }

  /**
   * suscribe un callback si existe respuesta por parte del
   * servidor remoto.
   *
   * @param cb
   */
  onResult(cb: (container) => any) {
    this.proxyService.on(ProxyService.ON_REQUEST_RESULT, cb);
  }

  /**
   * Si ocurre algún tipo de error se ejecuta el cb
   *
   * @param cb
   */
  onError(cb: (error) => any) {
    this.proxyService.on(ProxyService.ON_ERROR, cb);
  }

  filterResult(cb: (container) => any) {
    this.proxyService.addFilter(ProxyService.FILTER_IS_ERROR, cb);
  }
}
