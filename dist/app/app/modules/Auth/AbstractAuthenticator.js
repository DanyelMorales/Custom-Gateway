"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author Daniel Vera Morales
 */
class AbstractAsyncAuthenticator {
    /**
     *
     * @param delegator
     * @param resolve
     * @param reject
     */
    subscribe(delegator, resolve, reject) {
        delegator.onResult(container => {
            resolve(this.getObjectResponse(container));
        });
        delegator.onError(container => {
            reject(container);
        });
        delegator.filterResult(this.isValidResult);
    }
    isValidResult(container) {
        return container;
    }
    /**
     * @param resource
     */
    authenticate(resource) {
        return null;
    }
    /**
     *
     * @param resource
     */
    asyncAuthenticate(resource) {
        const self = this;
        return new Promise((resolve, reject) => {
            self.subscribe(self.delegator(), resolve, reject);
            self.sendPayload(resource);
        });
    }
}
exports.AbstractAsyncAuthenticator = AbstractAsyncAuthenticator;
//# sourceMappingURL=AbstractAuthenticator.js.map