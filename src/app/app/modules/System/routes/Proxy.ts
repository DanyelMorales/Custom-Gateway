import { ProxyRoute } from "@proxy/routes/ProxyRoute";

/**
 *@author Daniel Vera Morales
 */
export class ProxyCollection {
  static instance(): ProxyCollection {
    return new ProxyCollection();
  }

  private constructor() {}

  get webProxy(): ProxyRoute {
    return ProxyRoute.build("/@proxy@/*", /\/@proxy@\//gi);
  }
}
