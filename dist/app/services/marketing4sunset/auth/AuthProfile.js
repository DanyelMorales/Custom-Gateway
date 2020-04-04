"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const querystring = require("querystring");
/**
 *
 */
class AuthProfile {
    constructor(request) {
        this.request = request;
    }
    get(key) {
        if (this.request === null ||
            typeof this.request.body === "undefined" ||
            typeof this.request.body[key] === "undefined") {
            return null;
        }
        return this.request.body[key];
    }
    /**
     *
     */
    get authData() {
        const formData = querystring.stringify({
            username: this.get("username"),
            password: this.get("password")
        });
        return {
            formData: formData,
            length: formData.size
        };
    }
}
exports.AuthProfile = AuthProfile;
//# sourceMappingURL=AuthProfile.js.map