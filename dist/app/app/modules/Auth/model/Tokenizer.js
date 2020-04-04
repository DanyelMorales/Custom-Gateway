"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
/**
 *
 */
class Tokenizer {
    constructor(keyProvider) {
        this.keyProvider = keyProvider;
        this.UNAUTHORIZED_TOKEN = "unauthorized token";
    }
    /**
     *
     * @param resource
     */
    sign(resource) {
        return jwt.sign(resource, this.keyProvider.privatek, {
            algorithm: this.keyProvider.type
        });
    }
    /**
     *
     * @param token.to.not.be.null
     * @param consumer
     * @param claim
     */
    decode(token, claim = null) {
        if (!this.verify(token, claim)) {
            throw new Error(this.UNAUTHORIZED_TOKEN);
        }
        return jwt.decode(token, this.keyProvider.publick);
    }
    /**
     *
     * @param token
     * @param claim
     */
    verify(token, claim = null) {
        try {
            jwt.verify(token, this.keyProvider.publick, claim);
            return true;
        }
        catch (e) {
            return false;
        }
    }
}
exports.Tokenizer = Tokenizer;
//# sourceMappingURL=Tokenizer.js.map