"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
class FakeAuthenticator {
    constructor() {
        this.toreturn = "-1";
        this.END_POINT = "AUTH_MANAGER";
    }
    initialize() {
        this.toReturn = {
            userId: "12556",
            perms: ["foo@bar", "bare@bar", "b@b"],
            iss: "true"
        };
    }
    set toReturn(value) {
        this.toreturn = value;
    }
    /**
     * @param resource
     */
    authenticate(resource) {
        return this.toreturn;
    }
    asyncAuthenticate(resource) {
        const self = this;
        return new Promise((resolve, reject) => {
            resolve(self.authenticate(resource));
        });
    }
}
exports.FakeAuthenticator = FakeAuthenticator;
//# sourceMappingURL=FakeAuthenticator.js.map