"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProxyRoute_1 = require("@proxy/routes/ProxyRoute");
/**
 *@author Daniel Vera Morales
 */
class ProxyCollection {
    static instance() {
        return new ProxyCollection();
    }
    constructor() { }
    get webProxy() {
        return ProxyRoute_1.ProxyRoute.build("/@proxy@/*", /\/@proxy@\//gi);
    }
}
exports.ProxyCollection = ProxyCollection;
//# sourceMappingURL=Proxy.js.map