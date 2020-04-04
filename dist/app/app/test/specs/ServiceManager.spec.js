"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("ts-node");
require("mocha");
const chai_1 = require("chai");
const ServiceManager_1 = require("@utils/ServiceManager");
describe("ServiceManager", () => {
    let sm;
    beforeEach(function () {
        sm = new ServiceManager_1.ServiceManager();
    });
    afterEach(function () { });
    it("Deberia agregar un nuevo servicio", () => {
        sm.add("myservice", "anyservice");
        sm.add("myservice2", "shalalala");
        sm.add("myservice3", "foobar");
        chai_1.expect(sm.has("myservice3")).to.be.true;
        chai_1.expect(sm.has("myserviceasasasas3")).to.be.false;
    });
    it("Deberia remover un nuevo servicio", () => {
        sm.add("myservice", "anyservice");
        chai_1.expect(sm.has("myservice")).to.be.true;
        sm.remove("myservice");
        chai_1.expect(sm.has("myservice")).to.be.false;
    });
    it("Deberia obtener un nuevo servicio", () => {
        sm.add("myservice", "anyservice");
        chai_1.expect(sm.get("myservice")).to.be.equals("anyservice");
    });
    it("Deberia agregar nuevos indices con un json", () => {
        sm.addAll({
            a: "aaa",
            b: "bbb",
            c: "ccc"
        });
        chai_1.expect(sm.get("a")).to.be.equals("aaa");
        chai_1.expect(sm.get("b")).to.be.equals("bbb");
        chai_1.expect(sm.get("c")).to.be.equals("ccc");
    });
});
//# sourceMappingURL=ServiceManager.spec.js.map