"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const voltux = require("@utils/ModuleManager");
const _system_1 = require("@system");
/**
 * The server.
 *
 * @class Server
 */
class Server {
    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor(appData) {
        _system_1.Globals.bootstrap(appData);
        const service_manager = _system_1.Globals.bootstrap(appData).serviceManager;
        this.moduleData = {
            expressApp: express(),
            service_manager: service_manager,
            expressRouter: express.Router({ mergeParams: true })
        };
        this._voltuxModules = new voltux.ModuleManager(this.moduleData);
    }
    /**
     *
     */
    get myExpress() {
        return this.moduleData.expressApp;
    }
    /**
     *
     */
    initialize() {
        this._voltuxModules.subscribe(this.getModules());
    }
}
exports.Server = Server;
//# sourceMappingURL=AbstractApp.js.map