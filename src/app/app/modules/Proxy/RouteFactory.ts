import * as Definition from "@proxy/RouteContainer/RouteContainerDefinition";
import { JsonWrapper, JsonReader, JsonResult } from "@utils/JSONUtils";
import * as Proxy from "@proxy/GenericProxy";
import { IServiceProviderDelegator } from "app/utilities/ServiceManager";
import { ConfigManager } from "app/utilities/ConfigManager";
import { AppServices } from "@system";
import { Interpolator } from "@utils/Interpolator";

export class RouteServiceProvider implements IServiceProviderDelegator {
  get iCanDelegate(): string[] {
    return [AppServices.RouteFactory];
  }
  delegate(name: string, sm): any {
    const configManager = sm.get(AppServices.ConfigManager);
    return new RouteFactory(configManager.getWrapper("routes"));
  }
}

export class RouteFactory implements Definition.IRouteFactory {
  readonly E_NOT_FOUND: string = "NOT FOUND ENDPOINT";
  private haystack: any;
  private interpolator: Interpolator;
  constructor(private routesWrapper: JsonWrapper) {
    this.haystack = this.routesWrapper.readCycl("routes");
    this.interpolator = new Interpolator("/");
  }



  build(endpoint: string): Proxy.IProxyRoute {
    const endpointParts = this.interpolator.eval(endpoint);
    const result = this.routesWrapper.findByAttrIM(endpointParts.shift(), this.haystack);
    if (!result.isFound) {
      throw new RouteException<JsonResult>(this.E_NOT_FOUND, result);
    }
    result.result.route = this.interpolator.expand(result.result.route);
    return new Route(result.result);
  }

  get containerWrapper(): any {
    return this.routesWrapper;
  }
}
/**
 *
 */
export class Route implements Proxy.IProxyRoute {
  private readonly I_PROTECTED: string = "protected";
  private readonly I_ROUTE: string = "route";
  private readonly I_ACTIONS: string = "methods";
  private readonly I_NAME: string = "name";
  private readonly I_PARENT: string = "parent";
  private readonly I_WEB_INVOKATION: string = "web_invokation";
  private readonly I_PERMISSIONS: string = "permission";

  constructor(private data: any) { }

  get webInvokation(): boolean {
    const invokation = this.getKey(this.I_WEB_INVOKATION);
    return invokation === null ? true : invokation;
  }

  get protected(): boolean {
    return this.getKey(this.I_PROTECTED) || false;
  }

  get route(): string {
    return this.getKey(this.I_ROUTE);
  }

  get methods(): Proxy.IHTTPMethod {
    return this.getKey(this.I_ACTIONS) || null;
  }
  set methods(methods: Proxy.IHTTPMethod) {
    this.data[this.I_ACTIONS] = methods;
  }
  get alias(): string {
    return this.getKey(this.I_NAME);
  }

  get parent(): string {
    return this.getKey(this.I_PARENT);
  }

  getKey(key: string) {
    if (typeof this.data[key] === "undefined") {
      return null;
    }
    return this.data[key];
  }

  get permission() {
    return this.data["permission"] || [];
  }
}

/**
 * Routing excepcion
 */
export class RouteException<E> extends Error {
  constructor(message, private data: E) {
    super(message);
  }
}
