"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("ts-node");
require("mocha");
const chai_1 = require("chai");
const Express_1 = require("@proxy/ExpressRequest/Express");
const ProxyUtils_1 = require("@tests/ProxyUtils");
const mode = "prod";
const testHelper = new ProxyUtils_1.TestHelper();
const routeName = "listarpaises";
const cleanWords = (regexstr, word) => {
    const regex = new RegExp(regexstr, "gi");
    return word.replace(regex, "");
};
const cleanRequest = (req) => {
    ["/@proxy@"].forEach(regexstr => {
        req.path = cleanWords(regexstr, req.path);
    });
    return req;
};
describe("PayloadFactory", () => {
    const factory = new Express_1.PayloadFactory(mode, testHelper.microservices);
    beforeEach(function () { });
    afterEach(function () { });
    it("deberia formatear correctamente el payload del proxy", function () {
        const expects_ = {
            "http://127.0.0.1:80/@proxy@/countries/listing/shalalala": "http://127.0.0.1:80/countries/listing/shalalala",
            "http://127.0.0.1:80/@proxy@/": "http://127.0.0.1:80/",
            "http://127.0.0.1:80/@proxy@": "http://127.0.0.1:80",
            "http://127.0.0.1:80/": "http://127.0.0.1:80/",
            "http://127.0.0.1:80/ruta/desconocida": "http://127.0.0.1:80/ruta/desconocida",
            "http://127.0.0.1:80/ruta/desconocida/@proxy@/": "http://127.0.0.1:80/ruta/desconocida/"
        };
        let index = "";
        for (index in expects_) {
            if (expects_[index]) {
                const newreq = cleanRequest({
                    path: index
                });
                chai_1.expect(newreq.path).to.be.equals(expects_[index]);
            }
        }
    });
    it("deberia construir correctamente un payload", function () {
        const payload = factory.build(testHelper.expressReq, testHelper.getRoute(testHelper.routes, routeName));
        chai_1.expect(payload).to.not.be.null;
    });
});
describe("ProxySender", () => {
    let payload;
    let sender;
    beforeEach(function () {
        sender = new Express_1.ProxySender();
        payload = testHelper.getPayload(mode, testHelper.microservices, testHelper.expressReq, testHelper.getRoute(testHelper.routes, routeName));
    });
    afterEach(function () { });
    it("deberia enviar datos remotos", done => {
        const eve = (error, response, body) => {
            console.log("error:", error); // Print the error if one occurred
            console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
            console.log("body:", body); // Print the HTML for the Google homepage.
            chai_1.expect(response.statusCode).to.be.equals(401);
            done();
        };
        sender.send(payload, eve);
    });
});
//# sourceMappingURL=Express.spec.js.map