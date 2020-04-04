"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("ts-node");
require("mocha");
const chai_1 = require("chai");
const ProxyService_1 = require("@proxy/ProxyService");
const ProxyUtils_1 = require("@tests/ProxyUtils");
const Express_1 = require("@proxy/ExpressRequest/Express");
const mode = "prod";
const testHelper = new ProxyUtils_1.TestHelper();
const routeName = "listCountries";
const bad_routeName = "listarpaisesxxxx";
describe("ProxyService", () => {
    let payloadfactory;
    let proxyservice;
    beforeEach(function () {
        payloadfactory = new Express_1.PayloadFactory(mode, testHelper.microservices);
        proxyservice = new ProxyService_1.ProxyService(payloadfactory);
    });
    afterEach(function () { });
    it("deberia retornar false puesto que no esta en el contenedor de rutas permitidas", done => {
        proxyservice.on(ProxyService_1.ProxyService.ON_ERROR, data => {
            chai_1.expect(data.type + "").to.be.equals(ProxyService_1.ProxyService.DELEGATION_ERROR);
            done();
        });
        const resb = proxyservice.delegate(bad_routeName, testHelper.expressReq);
    });
    it("deberia delegar la peticion correctamente pues la ruta esta contenida", done => {
        proxyservice.on(ProxyService_1.ProxyService.ON_REQUEST_RESULT, container => {
            console.log("error:", container.error); // Print the error if one occurred
            console.log("statusCode:", container.response && container.response.statusCode); // Print the response status code if a response was received
            console.log("body:", container.body); // Print the HTML for the Google homepage.
            chai_1.expect(container.response.statusCode).to.be.equals(401);
            done();
        });
        proxyservice.delegate(routeName, testHelper.expressReq);
    });
});
//# sourceMappingURL=ProxyService.spec.js.map