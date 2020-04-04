import { AbstractAsyncAuthenticator } from "@auth/AbstractAuthenticator";
import { IAuthenticationProfile } from "@auth/Auth";

import { DelegationHelper } from "@proxy/ExpressRequest/DelegationHelper";

/**
 *  @author Daniel Vera Morales
 */
export class Authenticator extends AbstractAsyncAuthenticator<any> {
  readonly END_POINT: string = "USER_AUTHENTICATION";
  protected _delegator: DelegationHelper = new DelegationHelper();

  /**
   * Se genera un objeto de express que actua como payload para
   * la delegación de servicios. Se configura para utilizar
   * el método HTTP "POST" y se delega indicando al delegador que
   * la petición deberá ser desde un medio interno (no web).
   */
  protected sendPayload(resource: IAuthenticationProfile) {
    const authData = resource.authData;
    const payload = this._delegator.expressRequest({
      method: "POST",
      body: authData.formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": authData.length
      }
    });
    this._delegator.delegate(this.END_POINT, payload.build(), false);
  }

  /**
   * @param response
   */
  protected getObjectResponse(container) {
    const body = container.body;
    const data = JSON.parse(body);
    return {
      userId: data["email"],
      user: data["usuario"],
      name: data["nombre"],
      iss: true,
      permission: data["permisos"],
      data: {
        telefono: data["telefono"],
        extension: data["extension"]
      }
    };
  }

  /**
   *
   * @param container
   */
  protected isValidResult(container) {
    if (container.error) {
      return container;
    }
    const body = container.body;
    const data = JSON.parse(body);

    if (
      data === null ||
      container.response.statusCode !== 200 ||
      typeof data["email"] === "undefined" ||
      typeof data["nombre"] === "undefined" ||
      typeof data["usuario"] === "undefined" ||
      typeof data["permisos"] === "undefined" ||
      typeof data["extension"] === "undefined" ||
      typeof data["telefono"] === "undefined"
    ) {
      container.error = true;
      container.response.statusCode = 412;
    }
    return container;
  }

  /**
   *
   */
  protected delegator() {
    return this._delegator;
  }
}
