"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const App = require("@app/AbstractApp");
const auth = require("./auth/AuthModule");
const system = require("@mods_/System/SystemModule");
const AssetsModule_1 = require("@mods_/Assets/AssetsModule");
const BlockModule_1 = require("@mods_/Assets/BlockModule");
const CORSModule_1 = require("./other/CORSModule");
const EnvyHelper_1 = require("./../../bin/EnvyHelper");
const Environments_1 = require("./../../bin/Environments");
/**
 * Normalize a port into a number, string, or false.
 */
class MyApp extends App.Server {
    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    static bootstrap() {
        return new MyApp();
    }
    constructor() {
        super({
            ConfigManager: {
                routes: "routes",
                microservices: "microservices",
                declarations: "declarations",
                "menu-tree": "menu-tree"
            },
            globals: {
                pathToRoot: __dirname + "/../../../../"
            }
        });
    }
    /**
     *  modulos que se van a cargar al sistema
     */
    getModules() {
        const _mods_ = [
            new system.SystemModule(),
            new AssetsModule_1.AssetsModule(),
            new auth.AuthModule(),
            new BlockModule_1.BlockModule()
        ];
        return this.addDevMods(_mods_);
    }
    addDevMods(mods) {
        const helper = new EnvyHelper_1.default();
        if (helper.isEnvy(Environments_1.Environment.DEVELOPMENT)) {
            mods.unshift(new CORSModule_1.CORSModule());
        }
        return mods;
    }
}
exports.MyApp = MyApp;
/**
 * New typescript file
 */
module.exports = MyApp;
//# sourceMappingURL=MyApp.js.map