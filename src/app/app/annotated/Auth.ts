import { JsonWrapper, JsonReader } from "@utils/JSONUtils";
import { Log } from "@root/SystemLog";

const buildAuthData = function(data: any, sendInmediately: boolean = false) {
  if (
    !data ||
    typeof data["user"] === "undefined" ||
    typeof data["password"] === "undefined"
  ) {
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
const methodInvokation = (path: string, sendInmediately: boolean = false) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function() {
      const jsonValue = originalMethod.apply(this, arguments);
      if (typeof jsonValue === "undefined") {
        return jsonValue;
      }
      const wrapper = new JsonWrapper(jsonValue);
      const authData = wrapper.readCycl(path);
      return buildAuthData(authData, sendInmediately);
    };
    return descriptor;
  };
};

export = {
  container: methodInvokation
};
