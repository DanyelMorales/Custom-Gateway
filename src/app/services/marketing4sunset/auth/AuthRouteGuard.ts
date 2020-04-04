import { IRouteGuard, AbstractRouteGuard } from "@mods_/System/model/RouteGuardManager/interfaces/IRouteGuard";
import { GuardOptions } from "@mods_/System/model/RouteGuardManager/interfaces/ValidationGuardOptions";
import { JsonWrapper } from "@utils/JSONUtils";
import { PayloadWrapper } from "@proxy/GenericProxy";
import { ActionFilter } from "@utils/ActionFIlter";
import { IAuthorization } from "../../../app/modules/Auth/Auth";
import { Payload } from "@proxy/ExpressRequest/Express";
import { IHTTPMethod } from "@proxy/GenericProxy";

/**
 * Verifica los permisos de una ruta
 */
export class AuthRouteGuard extends AbstractRouteGuard<PayloadWrapper>
{
  constructor(private authorization: IAuthorization<Payload>) {
    super();
  }

  /**
   * Se verifica que posea los permisos, para ello realiza la verificación
   * de permisos que se posee en la sessión de usuario, sin embargo
   * si se invoca esta ruta y no posee permisos entonces se toma
   * como que es valido.
   *
   * NOTA:
   * Si no requiere protección se evita la verificación, pues
   * es muy probable que no existan permisos contenidos.
   * @param route
   */
  isAllowed(route: PayloadWrapper): GuardOptions {
    if (!route.route.protected) {
      return GuardOptions.CONTINUE;
    }
    const routePerms: string[] = route.route.permission;
    return this.authorization.isAuthorized(<Payload>route.payload, routePerms);
  }
}

export class AuthRouteMethodGuard extends AbstractRouteGuard<PayloadWrapper> {
  constructor(private authorization: IAuthorization<Payload>) {
    super();
  }


  /**
   * Si no esta definido los metodos en la ruta
   * o si esta vacío el arreglo de métodos
   * o si se define el flag allowAll como true
   * o si se encuentra el método http entonces es true.
   *
   * de otro modo es false.
   * @param currentMethod
   * @param methods
   */
  private isPublicMethodAllowed(
    currentMethod: string,
    methods: IHTTPMethod
  ): boolean {
    if (!methods || (methods.public.length === 0 && !methods.private)) {
      return true;
    }
    if (
      methods.public.length > 0 &&
      methods.public.indexOf(currentMethod) > -1
    ) {
      return true;
    }
    return false;
  }

  /**
   * verifica los metodos publicos, si no, se verifica los metodos privados.
   * 
   * @param route 
   */
  isAllowed(route: PayloadWrapper): GuardOptions {
    const currentRoute = route.route;
    const methods: IHTTPMethod = currentRoute.methods;
    const currentMethod = route.payload.getMethod();

    if (this.isPublicMethodAllowed(currentMethod, methods)) {
      return GuardOptions.CONTINUE;
    }

    const privateMethodPerms = methods.private[currentMethod] || null;
    if (!privateMethodPerms) {
      return GuardOptions.CONTINUE;
    }
    return this.authorization.isAuthorized(
      <Payload>route.payload,
      privateMethodPerms
    );
  }
}
