/**
 * @author Daniel Vera Morales
 */
import { GenericException } from "@mods_/System/model/GenericException";

export class UnauthorizedException extends GenericException {
  constructor(msg: string, code: string) {
    super("UnauthorizedException", msg, code, 401);
  }
}
