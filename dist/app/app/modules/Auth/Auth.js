"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
var AuthHeader;
(function (AuthHeader) {
    AuthHeader["AUTHORIZATION"] = "Authorization";
})(AuthHeader = exports.AuthHeader || (exports.AuthHeader = {}));
/**
 *
 */
class AuthTokenContainer {
    /**
     * @param tokenId token value
     * @param expiresIn 604800 1 week
     */
    constructor(tokenId, expiresIn = "604800") {
        this.tokenId = tokenId;
        this.expiresIn = expiresIn;
    }
}
exports.AuthTokenContainer = AuthTokenContainer;
//# sourceMappingURL=Auth.js.map