"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const RouteRegister_1 = require("@utils/RouteRegister");
const RouteStrategy_1 = require("@utils/RouteStrategy");
const _system_1 = require("@system");
const SystemLog_1 = require("@root/SystemLog");
class AssetsModule {
    constructor() {
        this.log = SystemLog_1.Log.Message.instance();
    }
    register(app) {
        this.log
            .is()
            .success()
            .action(SystemLog_1.Log.MessageAction.USER_SYS_ACTION)
            .printf(this.environmentData.front, "Assets", "Initializing");
        const route = new RouteRegister_1.SimpleRoute(this.environmentData.front);
        const router = express.static;
        RouteStrategy_1.SimpleRouteRegister._single(route, router, app);
    }
    serviceManager(serviceManager) {
        this.environmentData = serviceManager.get(_system_1.AppServices.SystemEnvironmentData);
    }
}
exports.AssetsModule = AssetsModule;
//# sourceMappingURL=AssetsModule.js.map