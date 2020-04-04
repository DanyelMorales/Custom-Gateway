import {
  IRouteRegister,
  RouteType,
  IComplexRoute,
  SimpleRouteContainer,
  SimpleRoute
} from "@utils/RouteRegister";
/**
 *   Implementación predeterminada de un registro de rutas.
 */
export class HttpRouteRegister implements IRouteRegister {
  static registerHttpRouter(router: any, routes: IComplexRoute[]) {
    if (routes == null || routes.length === 0) {
      return;
    }
    const routeRegister = new HttpRouteRegister();
    for (const aRoute of routes) {
      routeRegister.register(aRoute, router);
    }
  }
  /**
   * Construye una función wrapper para hacer interfaz con la clase
   * que se ha construido.
   */
  register(aRoute: any, router: any) {
    const routeType = RouteType[aRoute.getType()].toLowerCase();
    const theRoute = aRoute.getRoute();

    if (typeof router[routeType] === "undefined") {
      throw new Error("METHOD NOT FOUND:" + routeType);
    }

    const theFunction = router[routeType];
    theFunction.call(router, theRoute, (req, res, next) => {
      aRoute.invoke(req, res, next);
    });
  }
}

export class SimpleRouteRegister implements IRouteRegister {
  static _single(route: SimpleRoute, router: any, app: any) {
    return SimpleRouteRegister.instance().register(route, router, app);
  }
  static _all(routes: SimpleRouteContainer, router: any, app: any) {
    return SimpleRouteRegister.instance().registerAll(routes, router, app);
  }

  static instance(): SimpleRouteRegister {
    return new SimpleRouteRegister();
  }

  register(route: SimpleRoute, router: any, app: any): any {
    const fn = router.call(router, <string>route.value);
    if (route.hasName()) {
      app.use(route.name, fn);
    } else {
      app.use(fn);
    }
    return fn;
  }

  registerAll(container: SimpleRouteContainer, router: any, app: any): any {
    container.container.forEach(element => {
      this.register(element, router, app);
    });
    return router;
  }
}
