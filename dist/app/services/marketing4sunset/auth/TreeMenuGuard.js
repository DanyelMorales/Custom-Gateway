"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Authorization_1 = require("./Authorization");
const System_1 = require("@/System");
class MenuGuard {
    constructor(facade) {
        this.facade = facade;
        this.authorization = new Authorization_1.Authorization(facade);
    }
    isAllowed(sec) {
        if (typeof sec.enabled !== "undefined" && sec.enabled === false) {
            return true;
        }
        const payload = System_1.$TUPLE_SPACE.getService(System_1.$SYMB.$HEADER, System_1.$SYMB.$PAYLOAD);
        const result = this.authorization.isAuthorized(payload, sec.permission);
        return result === System_1.GuardOptions.ACCEPT;
    }
}
exports.MenuGuard = MenuGuard;
//# sourceMappingURL=TreeMenuGuard.js.map