"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("ts-node");
require("mocha");
const chai_1 = require("chai");
const PriorityQueue_1 = require("../PriorityQueue");
const obj = new PriorityQueue_1.PriorityQueue();
describe("PriorityQueue", () => {
    beforeEach(function () { });
    afterEach(function () { });
    it("deberia ordenar los valores que se le añaden", () => {
        obj.add({ value: "e1" }, 35);
        obj.add({ value: "f" }, 4);
        obj.add({ value: "a" }, 20);
        obj.add({ value: "b" }, 12);
        obj.add({ value: "c" }, 1);
        obj.add({ value: "d" }, 50);
        obj.add({ value: "e" }, 35);
        obj.add({ value: "g" }, 4);
        const result = obj.get();
        chai_1.expect(result).to.not.be.null;
        chai_1.expect(result[7]["value"]).to.be.equals("c");
        chai_1.expect(result[6]["value"]).to.be.equals("g");
        chai_1.expect(result[5]["value"]).to.be.equals("f");
        chai_1.expect(result[4]["value"]).to.be.equals("b");
        chai_1.expect(result[3]["value"]).to.be.equals("a");
        chai_1.expect(result[2]["value"]).to.be.equals("e");
        chai_1.expect(result[1]["value"]).to.be.equals("e1");
        chai_1.expect(result[0]["value"]).to.be.equals("d");
    });
    it("deberia eliminar un valor", () => {
        obj.clearAll();
        const o = { value: "f" };
        obj.add({ value: "el" }, 35);
        obj.add(o, 4);
        obj.add({ value: "a" }, 20);
        obj.remove(o);
        const result = obj.get();
        chai_1.expect(result).to.not.be.null;
        chai_1.expect(result.length).to.be.equals(2);
        chai_1.expect(result[1]["value"]).to.be.equals("a");
        chai_1.expect(result[0]["value"]).to.be.equals("el");
    });
});
//# sourceMappingURL=PriorityQueue.spec.js.map