import "@proxy/Filters/ProxyHeaderFilter";
import * as Proxy from "@proxy/GenericProxy";
import * as url from "url";
import { Microservice, MicroserviceFactory } from "@proxy/Microservice";
import { IMicroservice } from "@proxy/IMicroservice";
import { ProxyFacade } from "@proxy/ProxyFacade";
import Remote = require("@proxy/Decorators/Remote");
import { JsonWrapper } from "@utils/JSONUtils";
import { AppServices } from "@system";
import { IServiceProviderDelegator } from "app/utilities/ServiceManager";
import { ISuperServiceManager } from "@utils/ServiceManager";
import { EventBus } from "@app/utilities";
import { ProxyEvents } from "@app/modules/Proxy/ProxyEvents";
const rtrim = require("rtrim");
const THE_ENDPOINT = "the_endpoint";

export class PayloadFactoryProvider implements IServiceProviderDelegator {
  constructor(private runningMode) { }

  get iCanDelegate(): string[] {
    return [AppServices.PayloadFactory];
  }

  delegate(name: string, context: ISuperServiceManager<string>): any {
    const microserviceWrapper = context.get(
      AppServices.MICROSERVICES_MIDDLEWARE
    );
    const payloadFactory = new PayloadFactory(
      this.runningMode,
      microserviceWrapper
    );
    return payloadFactory;
  }
}

/**
 *
 */
export class PayloadFactory implements Proxy.IPayloadFactory {
  private facade: ProxyFacade = new ProxyFacade();

  constructor(private mode: string, private microserviceWrapper: JsonWrapper) { }

  build(req: any, route: Proxy.IProxyRoute): Proxy.Payload {
    const apiname: string = "microservices>" + route.parent;
    return new Payload(
      req,
      route,
      this.facade.getMicroservice(this.microserviceWrapper, this.mode, apiname)
    );
  }
}

export class BasePayload implements Partial<Proxy.Payload> {
  constructor(protected expressData: any) { }

  getHeaders(key: string = null): any {
    if (key === null) {
      return this.expressData.headers;
    }

    const keys = [key, key.charAt(0).toLocaleLowerCase() + key.slice(1)];
    for (const header of keys) {
      if (typeof this.expressData.headers[header] !== "undefined") {
        return this.expressData.headers[header];
      }
    }

    return null;
  }
  set data(value: any) {
    this.expressData = value;
  }
}

/**
 *
 */
export class Payload extends BasePayload {
  private uri: string;

  constructor(
    private _expressData: any,
    private route: Proxy.IProxyRoute,
    private microservice: IMicroservice
  ) {
    super(_expressData);
  }

  getMethod(): string {
    return this.expressData.method;
  }

  getBody(): any {
    return this.expressData.body;
  }

  getParams(): any {
    if (!this.expressData.originalUrl) {
      return "";
    }
    const params: string[] = this.expressData.originalUrl.split("?");
    if (!params || params.length === 0) {
      return "";
    }
    params.shift();
    return params.join("?");
  }

  getURI(): string {
    return this.microservice.getKey("url");
  }

  getPath(): string {
    const path = rtrim(this.microservice.getPath(), "/");
    const routestr = rtrim(this.route.route, "/");
    return path + "/" + routestr;
  }

  getURL(): url.Url {
    const params = this.getParams();
    const urlstr = rtrim(this.getURI(), "/") + "/" + this.getPath() + (params ? "?" + params : "");
    return url.parse(urlstr);
  }

  getAPIName(): string {
    return this.route.parent;
  }

  getCookies(): any {
    return this.expressData.cookies;
  }

  getMicroservice(): IMicroservice {
    return this.microservice;
  }

  getAuth(): any {
    return this.microservice.getAuth();
  }
}

export class ProxySender implements Proxy.IProxySender {
  decoratePackage(payload: Payload): any {
    return ProxyHelper.decoratePackage(payload);
  }

  /**
   * Carga un Microservicio utilizando el enpoint hijo.
   * Luego se generan paquetes de envio base y se realiza el procesamiento.
   * @param callback
   */
  @Remote.request()
  send(payload: Payload, callback: Function) {
    if (
      typeof payload["decorated"] === "undefined" ||
      payload["decorated"] === false
    ) {
      payload = this.decoratePackage(payload);
    }
    return {
      payload: payload,
      emitter: callback
    };
  }
}

export class ProxyHelper {
  /**
   * decorar basado en el tipo de metodo
   */
  static decoratePackage(payload: Payload): any {
    let shallow = {
      decorated: true,
      params: payload.getParams(),
      method: payload.getMethod(),
      auth: payload.getAuth(),
      uri: payload.getURL(),
      uristr: url.format(payload.getURL()),
      headers: payload.getHeaders()
    };
    shallow = EventBus.applyFilter(ProxyEvents.NORMALIZE_PAYLOAD, shallow, payload);
    return shallow;
  }
}
