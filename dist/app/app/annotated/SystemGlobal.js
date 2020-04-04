"use strict";
const JSONUtils_1 = require("@utils/JSONUtils");
const SystemGlobal_1 = require("@app/SystemGlobal");
const buildSystemGlobals = (data) => {
    const jsonMap = new JSONUtils_1.JSONType(data);
    return new SystemGlobal_1.SystemGlobal(jsonMap);
};
const systemGlobalFactory = function (data) {
    return function (target, propertyKey, descriptor) {
        target[propertyKey] = buildSystemGlobals(data);
    };
};
const sinitializer = function (data) {
    return (constructor) => {
        constructor.prototype["systemGlobals"] = buildSystemGlobals(data);
    };
};
module.exports = {
    setTo: systemGlobalFactory,
    init: sinitializer,
    build: buildSystemGlobals
};
//# sourceMappingURL=SystemGlobal.js.map