"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("ts-node");
require("mocha");
const chai_1 = require("chai");
const Microservice_1 = require("../Microservice");
const ProxyUtils_1 = require("@tests/ProxyUtils");
const testHelper = new ProxyUtils_1.TestHelper();
describe('MicroserviceFactory', () => {
    let factory = null;
    beforeEach(function () {
        factory = new Microservice_1.MicroserviceFactory(testHelper.microservices, "dev", "microservices>API1_DROPWIZARD");
    });
    afterEach(function () {
    });
    it("deberia leer el archivo solicitado", () => {
        chai_1.expect(factory.appMicroservice).to.not.be.null;
        const built = factory.build();
        const auth = built.getAuth();
        chai_1.expect(auth).to.not.be.null;
        chai_1.expect(auth.password).to.not.be.null;
        chai_1.expect(built).to.not.be.null;
        chai_1.expect(built.getKey("parent")).to.not.be.null;
        chai_1.expect(built.getKey("common")).to.not.be.null;
        chai_1.expect(built.getPath()).to.be.equals("v1");
        chai_1.expect(built.getKey().url).to.be.equals('http://127.0.0.1:1010');
    });
});
//# sourceMappingURL=MicroserviceFactory.spec.js.map