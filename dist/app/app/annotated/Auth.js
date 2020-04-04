"use strict";
const JSONUtils_1 = require("@utils/JSONUtils");
const buildAuthData = function (data, sendInmediately = false) {
    if (!data ||
        typeof data["user"] === "undefined" ||
        typeof data["password"] === "undefined") {
        return {};
    }
    return {
        user: data.user,
        pass: data.password,
        sendImmediately: sendInmediately
    };
};
/**
 * Genera un paquete de autenticación utilizando un ruta y los datos
 * originales que devuelve el metodo.
 *
 * @param path ruta que se desea iterar
 * @param sendInmediately true or false
 */
const methodInvokation = (path, sendInmediately = false) => {
    return (target, propertyKey, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = function () {
            const jsonValue = originalMethod.apply(this, arguments);
            if (typeof jsonValue === "undefined") {
                return jsonValue;
            }
            const wrapper = new JSONUtils_1.JsonWrapper(jsonValue);
            const authData = wrapper.readCycl(path);
            return buildAuthData(authData, sendInmediately);
        };
        return descriptor;
    };
};
module.exports = {
    container: methodInvokation
};
//# sourceMappingURL=Auth.js.map