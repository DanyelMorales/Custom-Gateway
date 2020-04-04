"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IRouteGuard_1 = require("../../RouteGuardManager/interfaces/IRouteGuard");
/**
 *
 */
class FakeGuard extends IRouteGuard_1.AbstractRouteGuard {
    constructor(toreturn) {
        super();
        this.toreturn = toreturn;
    }
    isAllowed(route) {
        return this.toreturn;
    }
}
exports.FakeGuard = FakeGuard;
//# sourceMappingURL=FakeGuard.js.map