"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author Daniel Vera Morales
 */
const GenericException_1 = require("@mods_/System/model/GenericException");
class UnauthorizedException extends GenericException_1.GenericException {
    constructor(msg, code) {
        super("UnauthorizedException", msg, code, 401);
    }
}
exports.UnauthorizedException = UnauthorizedException;
//# sourceMappingURL=UnauthorizedException.js.map