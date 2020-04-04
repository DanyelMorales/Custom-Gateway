import { IRouteGuard, AbstractRouteGuard } from "@mods_/System/model/RouteGuardManager/interfaces/IRouteGuard";
import { GuardOptions } from "@mods_/System/model/RouteGuardManager/interfaces/ValidationGuardOptions";
import { JsonWrapper } from "@utils/JSONUtils";
import { PayloadWrapper, IHTTPMethod } from "@proxy/GenericProxy";
import { ActionFilter } from "@utils/ActionFIlter";
import { expect } from "chai";

/**
 *@author Daniel Vera Morales
 */
export class PublicRouteGuard extends AbstractRouteGuard<PayloadWrapper>{
  readonly FILTER_NO_PROTECTED: string = "FILTER_NO_PROTECTED";
  readonly FOR_NO_PROTECTED_GUARDS: GuardOptions = GuardOptions.ACCEPT;

  constructor() {
    super();
  }

  /**
   * Verifica si posee el flag "allowedAll" y si es true o false, dependiendo
   * de la respuesta se genera una opcion. Si no se encuentra, 
   * verifica si una ruta esta permitida sin necesidad de otras verificaciones.
   * Para ello, se verifica el metodo http que se requiere validar.
   *
   * @param route
   */
  isAllowed(route: PayloadWrapper): GuardOptions {
    const actions: IHTTPMethod = route.route.methods;
    const currentMethod: string = route.payload.getMethod();
    this.reset();
    if (!this.isSourceValid(route)) {
      this._messages.push("NOT VALID SOURCE");
      return GuardOptions.DIE;
    }

    const isAllowedAll = this.isAllowedAll(actions);
    if (isAllowedAll === 1 || isAllowedAll === 0) {
      return isAllowedAll === 1? GuardOptions.ACCEPT : GuardOptions.DIE ;
    }
    
    if (!this.isMethodValid(currentMethod, actions)) {
      this._messages.push(`METHOD ${currentMethod} IS NOT VALID`);
      return GuardOptions.DIE;
    }

    if (!route.route.protected) {
      return this.applyFilter(
        this.FILTER_NO_PROTECTED,
        this.FOR_NO_PROTECTED_GUARDS
      );
    }
    return GuardOptions.CONTINUE;
  }

  private isAllowedAll(methods: IHTTPMethod): number {
    if (!methods || typeof methods.allowAll === 'undefined') {
      return -1;
    }
    return (methods.allowAll === true) ? 1 : 0;
  }


  /**
   * Determina si la solicitud proviene de una fuente valida:
   *
   * - Si viene de la web y se esperaba que venga de la web, se retorna true.
   * - Si actualmente no viene de la web y se esperaba que si, se retorna true
   * - de otro modo se retorna false.
   * @param wrapper
   */
  private isSourceValid(wrapper: PayloadWrapper): boolean {
    const expected = wrapper.route.webInvokation;
    const current = wrapper.webInvokation;
    if (expected === current || (current === false && expected === true)) {
      return true;
    }
    return false;
  }

  /**
   * We check only public methods
   *
   * @param currentMethod
   * @param methods
   */
  private isMethodValid(currentMethod: string, methods: IHTTPMethod): boolean {
    if (!methods || methods.public.length === 0) {
      return true;
    }
    methods.public.map(function(x) {
      return x.toUpperCase();
    });
    return methods.public.indexOf(currentMethod.toUpperCase()) > -1;
  }
}
