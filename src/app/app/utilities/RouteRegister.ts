/**
 * Colección de interfaces, enumeradores y clases para la resolución de rutas.
 * @author Daniel Vera Morales
 */

/**
 *  Tipos de rutas soportados por el sistema
 */
export enum RouteType {
  ALL,
  GET,
  POST,
  PUT,
  PATCH,
  DELETE
}

/**
 *  Operaciones de una ruta cuando coincida en la url
 */
export interface IComplexRoute {
  /**
   * @req request del cliente
   * @res response que será devuelto al cliente
   * @next pasar datos a otros filtros
   */
  invoke(req: any, res: any, next: any);
  /**
   * @return la ruta que se utilizará para accesar
   */
  getRoute(): string;
  /**
   * @aRoute tipo de ruta
   */
  getType(): RouteType;
}

/**
 * Defines a simple route containing value and name
 */
export class SimpleRoute {
  constructor(readonly value: string, readonly name: any = null) {}
  hasName(): boolean {
    return !(this.name === null);
  }
}

/**
 * Contenedor de rutas para assets
 */
export class SimpleRouteContainer {
  readonly container: SimpleRoute[] = [];

  build(value: string, name: any = null): SimpleRouteContainer {
    this.add(new SimpleRoute(value, name));
    return this;
  }

  add(route: SimpleRoute): SimpleRouteContainer {
    this.container.push(route);
    return this;
  }

  remove(route: SimpleRoute): SimpleRouteContainer {
    const index = this.container.indexOf(route);
    delete this.container[index];
    return this;
  }

  get(index: number): SimpleRoute {
    return this.container[index];
  }

  getContainer(): SimpleRoute[] {
    return this.container;
  }
}

/**
 *  Registro de rutas
 */
export interface IRouteRegister {
  /**
   * @aRoute ruta a registrar
   */
  register(aRoute: any, router: any, app: any);
}
