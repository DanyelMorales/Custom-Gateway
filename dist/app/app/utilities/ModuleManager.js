"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSONUtils_1 = require("@utils/JSONUtils");
/**
 * Implementación predeterminada de un administrador de modulos
 * en el sistema.
 */
class ModuleManager {
    /**
     * @app Aplicación de express que será configurado
     */
    constructor(systemData) {
        this.systemData = new JSONUtils_1.JSONType(systemData);
        this.app = this.systemData.get("expressApp");
        this.router = this.systemData.get("expressRouter");
    }
    /**
     * @see IModuleManager#subscribe
     */
    subscribe(_module) {
        for (const _mod of _module) {
            this.add(_mod);
        }
    }
    /**
     * @see IModuleManager#add
     */
    add(_module) {
        _module.serviceManager(this.systemData.get("service_manager"));
        if (_module.register) {
            _module.register(this.app, this.router);
        }
    }
    register(type, routes) { }
}
exports.ModuleManager = ModuleManager;
//# sourceMappingURL=ModuleManager.js.map