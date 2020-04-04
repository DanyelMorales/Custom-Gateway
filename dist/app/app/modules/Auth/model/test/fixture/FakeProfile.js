"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FakeProfile {
    use(data) {
        this.data = data;
    }
    has(key) {
        return false;
    }
    get(key) {
        return "";
    }
    get authData() {
        return {
            username: "fooobar",
            password: "passwordpassword"
        };
    }
}
exports.FakeProfile = FakeProfile;
//# sourceMappingURL=FakeProfile.js.map