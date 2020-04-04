import { IMicroservice } from "./IMicroservice";
import * as url from "url";

/**
 *
 */
export interface Payload {
  getMethod(): string;
  getBody(): any;
  getCookies(): any;
  getParams(): any;
  getHeaders(key: string): any;
  getURI(): string;
  getPath(): string;
  getAPIName(): string;
  getMicroservice(): IMicroservice;
  getAuth(): any;
  getURL(): url.Url;
}
export interface IHTTPMethod {
  allowAll?:boolean,
  private?: {};
  public: string[];
}
/**
 *
 */
export interface IProxyRoute {
  route: string;
  methods: IHTTPMethod;
  protected: boolean;
  webInvokation: boolean;
  alias: string;
  parent: string;
  permission?: string[];
}

/**
 *
 */
export interface IProxySender {
  send(payload: any, callback: Function);
}

/**
 *
 */
export interface IProxy {
  delegate(endpoint: string, request: any);
  delegateWrapper(endpoint: string, data: PayloadWrapper): void;
}

/**
 *
 */
export interface IPayloadFactory {
  build(req: any, route: IProxyRoute): Payload;
}

/**
 *
 */
export interface IProxyResponse {
  readonly status: number;
  readonly body: any;
  readonly header: any;
  readonly type: string;
}

/**
 *
 */
export interface IProxyResponseFactory {
  build(error, response, body): void;
  fail(data: any): void;
  success(data: any): void;
}

/**
 *
 */
export class PayloadWrapper {
  private _decorated: any;
  private _sender: IProxySender;
  private _route: IProxyRoute;
  private _payload: Payload;
  private _isWebInvokation: boolean = true;

  get webInvokation(): boolean {
    return this._isWebInvokation;
  }
  set webInvokation(value: boolean) {
    this._isWebInvokation = value;
  }

  get decorated(): any {
    return this._decorated;
  }
  set decorated(v: any) {
    this._decorated = v;
  }

  get sender(): IProxySender {
    return this._sender;
  }
  set sender(v: IProxySender) {
    this._sender = v;
  }

  get route(): IProxyRoute {
    return this._route;
  }
  set route(v: IProxyRoute) {
    this._route = v;
  }

  get payload(): Payload {
    return this._payload;
  }
  set payload(v: Payload) {
    this._payload = v;
  }
}
