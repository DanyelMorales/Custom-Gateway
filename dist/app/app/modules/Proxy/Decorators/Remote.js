"use strict";
const ProxyEvents_1 = require("@app/modules/Proxy/ProxyEvents");
const utilities_1 = require("@app/utilities");
/**
 * Utiliza lo retornado por el método que posee este tag.
 * Lo retornado se ejecuta y se invoa el callback.
 *
 * El arreglo DATA debe poseer los siguientes indices:
 *  0: json con datos de envio
 *  1: callback
 * @author Daniel Vera Morales
 */
const request = require("request");
const methodInvokation = () => {
    return (target, propertyKey, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = function () {
            let data = originalMethod.apply(this, arguments);
            data = (utilities_1.EventBus.applyFilter(ProxyEvents_1.ProxyEvents.BEFORE_SEND, data));
            console.log(data["payload"]);
            request(data["payload"], data["emitter"]);
        };
        return descriptor;
    };
};
module.exports = {
    request: methodInvokation
};
//# sourceMappingURL=Remote.js.map