"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GenericProxy_1 = require("@proxy/GenericProxy");
const RouteFactory_1 = require("@proxy/RouteFactory");
class FakePayload {
    getMethod() {
        return this.method;
    }
    getBody() {
        return this.body;
    }
    getCookies() {
        return this.cookies;
    }
    getParams() {
        return this.params;
    }
    getHeaders(key) {
        return this.headers[key];
    }
    getURI() {
        return this.uri;
    }
    getPath() {
        return this.path;
    }
    getAPIName() {
        return this.apiName;
    }
    getMicroservice() {
        return this.ms;
    }
    getAuth() {
        return this.auth;
    }
    getURL() {
        return this.uri;
    }
}
exports.FakePayload = FakePayload;
class TestData {
    static data(data) {
        const fakepayload = new FakePayload();
        const wrapper = new GenericProxy_1.PayloadWrapper();
        fakepayload.method = "post";
        wrapper.route = new RouteFactory_1.Route(data);
        wrapper.payload = fakepayload;
        return {
            fakepayload: fakepayload,
            route: wrapper
        };
    }
}
exports.TestData = TestData;
//# sourceMappingURL=FakePayload.js.map