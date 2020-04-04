"use strict";
/**
 * Carga el service manager global
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 */
const _system_1 = require("@system");
const EventBus_1 = require("@utils/EventBus");
const TupleSpaceService_1 = require("@utils/TupleSpaceService");
const SERVICE_DECLARATION_1 = require("@utils/SERVICE_DECLARATION");
/**
 * Anotación proveedora de servicios
 * @param service primer servicio opcional
 * @param services cadena variable de servicios
 */
const ServicesProvider = function (...services) {
    return (constructor) => {
        services.forEach(service => {
            const serviceName = _system_1.AppServices[service];
            EventBus_1.default.on(_system_1.Globals.ON_READY, $instance => {
                const sm = TupleSpaceService_1.default.getService(SERVICE_DECLARATION_1.default.$GLOBAL, SERVICE_DECLARATION_1.default.$SERVICE_MANAGER);
                if (!sm.has(service)) {
                    throw Error("Service is not loaded " + service);
                }
                constructor.prototype[serviceName] = sm.get(service);
            });
            constructor.prototype[serviceName] = null;
        });
    };
};
/**
 *
 */
const serviceManagerProvider = function () {
    return (target, key) => {
        let value = target[key];
        const getter = function () {
            const sm = _system_1.Globals.bootstrap({}).serviceManager;
            return sm;
        };
        const setter = function (newVal) {
            value = newVal;
        };
        if (delete target[key]) {
            Object.defineProperty(target, key, {
                get: getter,
                set: setter,
                enumerable: true,
                configurable: true
            });
        }
    };
};
/**
 *
 */
const ServiceProvider = function (serviceName) {
    return (target, key) => {
        let value = target[key];
        const getter = function () {
            const sm = _system_1.Globals.bootstrap({}).serviceManager;
            return sm.get(serviceName);
        };
        const setter = function (newVal) {
            value = newVal;
        };
        if (delete target[key]) {
            Object.defineProperty(target, key, {
                get: getter,
                set: setter,
                enumerable: true,
                configurable: true
            });
        }
    };
};
module.exports = {
    Service: ServiceProvider,
    Services: ServicesProvider,
    ServiceManager: serviceManagerProvider
};
//# sourceMappingURL=ServiceManager.js.map