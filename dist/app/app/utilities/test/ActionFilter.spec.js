"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("ts-node");
require("mocha");
const chai_1 = require("chai");
const ActionFIlter_1 = require("../ActionFIlter");
describe("ActionFilter", () => {
    beforeEach(function () { });
    afterEach(function () { });
    it("deberia registrar y disparar filtros", () => {
        const obj = new ActionFIlter_1.ActionFilter();
        obj.addFilter("foo", function (a, b, c) {
            return a + "-" + b + "-" + c;
        });
        obj.addFilter("bar", function (a) {
            return a;
        });
        obj.addFilter("foobar", function (a, b) {
            return a + "-" + b;
        });
        obj.addFilter("anyfilter", function (a, b, c, d, e) {
            return "awesome" + a + "@" + b + "@" + c + "@" + d + "@" + e + "@";
        });
        const r1 = obj.applyFilter("foo", "lorem", "ipsum", "dolor");
        const r2 = obj.applyFilter("bar", "dolor");
        const r3 = obj.applyFilter("foobar", "ipsum", "dolor");
        const r4 = obj.applyFilter("anyfilter", 1, 2, 3, 4, 5);
        const r5 = obj.applyFilter("anyfilternotf", "abc", "def", 123, 4);
        chai_1.expect(r1).to.be.equals("lorem-ipsum-dolor");
        chai_1.expect(r2).to.be.equals("dolor");
        chai_1.expect(r3).to.be.equals("ipsum-dolor");
        chai_1.expect(r4).to.be.equals("awesome1@2@3@4@5@");
        chai_1.expect(r5).to.be.equals("abc");
    });
});
//# sourceMappingURL=ActionFilter.spec.js.map