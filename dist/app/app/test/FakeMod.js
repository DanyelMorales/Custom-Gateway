"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FakeRoute_1 = require("./FakeRoute");
/**
 *
 */
class FakeMod {
    constructor() { }
    serviceManager(sm) { }
    getRouter() {
        return null;
    }
    getRoutes() {
        return [new FakeRoute_1.FakeRoute()];
    }
    register(app) { }
}
exports.FakeMod = FakeMod;
//# sourceMappingURL=FakeMod.js.map