import { PayloadWrapper, Payload } from "@proxy/GenericProxy";
import {
  IAuthorization,
  ITokenizer,
  AuthHeader,
  IAuthenticationProfile,
  IAuthenticationFacade
} from "@auth/Auth";
import { Tokenizer } from "@auth/model/Tokenizer";
import { EventEmitter } from "events";
import { JSONType } from "@utils/JSONUtils";
import { GuardOptions } from "@mods_/System/model/RouteGuardManager/interfaces/ValidationGuardOptions";

/**
 *@author Daniel Vera Morales
 */
export class Authorization extends EventEmitter
  implements IAuthorization<Payload> {
  constructor(private facade: IAuthenticationFacade<string, string>) {
    super();
  }

  /**
   * @param resource
   */
  isAuthorized(
    payload: Partial<Payload>,
    expectedPerms: string[]
  ): GuardOptions {
    // si la ruta no tiene permiso
    if (expectedPerms === null || expectedPerms.length === 0) {
      return GuardOptions.CONTINUE;
    }

    const profile: JSONType<string, any> = this.extractUserPayload(payload);
    const userPerms: string[] = profile.get("permission");
    if (userPerms === null || userPerms.length === 0) {
      // NO PERMITAS QUE CONTINUE
      return GuardOptions.DIE;
    }

    // si posee el permiso se acepta
    for (const perm of expectedPerms) {
      if (userPerms.indexOf(perm) > -1) {
        return GuardOptions.ACCEPT;
      }
    }
    // de otro modo se asesina la verificacion
    return GuardOptions.DIE;
  }

  /**
   * @param resource
   */
  private extractUserPayload(payload: Partial<Payload>): JSONType<string, any> {
    const authorizationHeader = payload.getHeaders(AuthHeader.AUTHORIZATION);
    const profile: IAuthenticationProfile = this.facade.getPayload(
      authorizationHeader
    );
    return new JSONType<string, any>(profile || {});
  }
}
