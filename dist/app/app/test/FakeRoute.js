"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RouteRegister = require("@utils/RouteRegister");
/**
 *
 */
class FakeRoute {
    /**
     *
     */
    constructor() {
        this.route = "/proxy/*";
    }
    /**
     *
     */
    getType() {
        return RouteRegister.RouteType.ALL;
    }
    /**
     *
     */
    invoke(req, res, next) {
        console.log(req.method);
        res.send("Express RESTful APsssI");
    }
    /**
     *
     */
    getRoute() {
        return "/testfake";
    }
}
exports.FakeRoute = FakeRoute;
//# sourceMappingURL=FakeRoute.js.map