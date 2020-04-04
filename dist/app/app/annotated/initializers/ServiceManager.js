"use strict";
const initializeServices = function () {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function () {
            const provider = originalMethod.apply(this, arguments);
            provider.initializeSM();
        };
        return descriptor;
    };
};
module.exports = {
    initialize: initializeServices
};
//# sourceMappingURL=ServiceManager.js.map