import { IRouteGuard, AbstractRouteGuard } from "../../RouteGuardManager/interfaces/IRouteGuard";
import { GuardOptions } from "../../RouteGuardManager/interfaces/ValidationGuardOptions";

/**
 *
 */
export class FakeGuard extends AbstractRouteGuard<string> {
  constructor(private toreturn: GuardOptions) {
    super();
  }
  isAllowed(route: string): GuardOptions {
    return this.toreturn;
  }
}
