import { ProxyEvents } from "@app/modules/Proxy/ProxyEvents";
import { EventBus } from "@app/utilities";


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
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function () {
      let data: any[] = originalMethod.apply(this, arguments);
      data = (EventBus.applyFilter(ProxyEvents.BEFORE_SEND, data));
      console.log(data["payload"]);
      request(data["payload"], data["emitter"]);
    };
    return descriptor;
  };
};

export = {
  request: methodInvokation
};
