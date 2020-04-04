import { PayloadWrapper, Payload } from "@proxy/GenericProxy";
import { Route } from "@proxy/RouteFactory";
export class FakePayload implements Payload {
  public method: string;
  public body: any;
  public cookies: any;
  public params: any;
  public headers: any;
  public uri: string;
  public path: string;
  public apiName: string;
  public ms;
  public auth: any;

  getMethod(): string {
    return this.method;
  }
  getBody(): any {
    return this.body;
  }
  getCookies(): any {
    return this.cookies;
  }
  getParams(): any {
    return this.params;
  }

  getHeaders(key: string): any {
    return this.headers[key];
  }

  getURI(): string {
    return this.uri;
  }
  getPath(): string {
    return this.path;
  }
  getAPIName(): string {
    return this.apiName;
  }
  getMicroservice(): any {
    return this.ms;
  }
  getAuth(): any {
    return this.auth;
  }
  getURL(): any {
    return this.uri;
  }
}

export class TestData {
  static data(data) {
    const fakepayload = new FakePayload();
    const wrapper: PayloadWrapper = new PayloadWrapper();
    fakepayload.method = "post";
    wrapper.route = new Route(data);
    wrapper.payload = fakepayload;
    return {
      fakepayload: fakepayload,
      route: wrapper
    };
  }
}
