import {
  ProxySender,
  PayloadFactory,
  ProxyHelper
} from "@proxy/ExpressRequest/Express";
import { IProxyRoute } from "@proxy/GenericProxy";
import { Payload } from "@proxy/ExpressRequest/Express";
import { Microservice, MicroserviceFactory } from "@proxy/Microservice";
import { IMicroservice } from "@proxy/IMicroservice";
import { JsonWrapper, JsonReader } from "@utils/JSONUtils";
import { RouteFactory } from "@proxy/RouteFactory";
/**
 * Operaciones comunes para proxy
 *
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 */
export class ProxyFacade {
  /**
   * Carga un wrapper a partir de un path de configuración
   * @param configPath
   */
  getWrapper(configPath: string): JsonWrapper {
    const reader: JsonReader = new JsonReader(configPath, true);
    return reader.readFile();
  }

  /**
   * Producde una isntancia de ProxySender
   */
  getProxySender(): any {
    return new ProxySender();
  }

  /**
   * Genera un proxyhelper al ejecutar la función anonima. Requiere de un payload.
   */
  getProxyHelper(): Function {
    return payload => {
      return ProxyHelper.decoratePackage(payload);
    };
  }

  /**
   * Produce una ruta a partir de un wrapper y un indice de lectura.
   *
   * @param configWrapper
   * @param index
   */
  getRoute(configWrapper: JsonWrapper, index): any {
    const route: RouteFactory = new RouteFactory(configWrapper);
    return route.build(index);
  }

  /**
   * Crea un payload a partir de un modo de operación, una configuración wrapeada
   * un request de servidor y una ruta.
   *
   * @param mode
   * @param configWrapper
   * @param req
   * @param route
   */
  getPayload(mode: string, configWrapper: JsonWrapper, req, route): any {
    const factory: PayloadFactory = new PayloadFactory(mode, configWrapper);
    return factory.build(req, route);
  }

  /**
   * Crea un microservicio a partir de un wrapper de configuracion, un modo y
   * un apiname.
   *
   * @param configWrapper
   * @param mode
   * @param apiname
   */
  getMicroservice(configWrapper: JsonWrapper, mode, apiname): any {
    const factory: MicroserviceFactory = new MicroserviceFactory(
      configWrapper,
      mode,
      apiname
    );
    return factory.build();
  }
}
