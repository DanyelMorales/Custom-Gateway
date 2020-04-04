/**
 * Carga el service manager global
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 */
import { AppServices, Globals } from "@system";
import { ConfigManager } from "@utils/ConfigManager";
import { IJSONType, JSONType } from "@utils/JSONUtils";
import { ServiceManager, IServiceManagerProvider } from "@servicemanager";
import EventBus from "@utils/EventBus";
import $TUPLE_SPACE from "@utils/TupleSpaceService";
import $SYMB from "@utils/SERVICE_DECLARATION";

/**
 * Anotación proveedora de servicios
 * @param service primer servicio opcional
 * @param services cadena variable de servicios
 */
const ServicesProvider = function(...services: string[]): Function {
  return (constructor: Function) => {
    services.forEach(service => {
      const serviceName = AppServices[service];
      EventBus.on(Globals.ON_READY, $instance => {
        const sm = $TUPLE_SPACE.getService(
          $SYMB.$GLOBAL,
          $SYMB.$SERVICE_MANAGER
        );
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
const serviceManagerProvider = function(): Function {
  return (target: any, key: string) => {
    let value = target[key];
    const getter = function() {
      const sm = Globals.bootstrap({}).serviceManager;
      return sm;
    };

    const setter = function(newVal) {
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
const ServiceProvider = function(serviceName: string): Function {
  return (target: any, key: string) => {
    let value = target[key];

    const getter = function() {
      const sm = Globals.bootstrap({}).serviceManager;
      return sm.get(serviceName);
    };

    const setter = function(newVal) {
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

export = {
  Service: ServiceProvider,
  Services: ServicesProvider,
  ServiceManager: serviceManagerProvider
};
