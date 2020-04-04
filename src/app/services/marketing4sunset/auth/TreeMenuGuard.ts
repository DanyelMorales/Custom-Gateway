import { IAuthenticationFacade } from "@auth/Auth";
import { Authorization } from "./Authorization";
import { AppServices } from "@system";
import {
  GuardOptions,
  ITreeGuard,
  $SYMB,
  IMenuSecurity,
  $TUPLE_SPACE,
  Payload
} from "@/System";

export class MenuGuard implements ITreeGuard {
  private authorization: Authorization;

  constructor(private facade: IAuthenticationFacade<string, string>) {
    this.authorization = new Authorization(facade);
  }
  isAllowed(sec: IMenuSecurity): boolean {
    if (typeof sec.enabled !== "undefined" && sec.enabled === false) {
      return true;
    }
    const payload = $TUPLE_SPACE.getService($SYMB.$HEADER, $SYMB.$PAYLOAD);
    const result = this.authorization.isAuthorized(payload, sec.permission);
    return result === GuardOptions.ACCEPT;
  }
}
