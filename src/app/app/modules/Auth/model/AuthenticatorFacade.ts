/**
 * @author Daniel Vera Morales
 */
import {
  IAuthenticationFacade,
  ITokenizer,
  ICriticalKeyProvider,
  AuthHeader,
  IAuthenticator,
  AuthTokenContainer,
  IAuthenticationProfile
} from "@auth/Auth";
import { Tokenizer } from "@auth/model/Tokenizer";
import { EventEmitter } from "events";
import { UnauthorizedException } from "@auth/model/exceptions/UnauthorizedException";
import EventBus from "@utils/EventBus";
import { AUTH_EVENTS } from "../Events";

export class AuthenticatorFacade extends EventEmitter
  implements IAuthenticationFacade<string, AuthTokenContainer> {
  readonly ON_AUTHENTICATION: string = "1";
  readonly ON_BAD_AUTHENTICATION: string = "2";
  readonly ON_BAD_TOKEN: string = "3";
  readonly ON_AUTHENTICATOR_ERROR: string = "4";
  readonly ON_ALREADY_AUTHENTICATED: string = "5";

  constructor(
    private tokenizer: Tokenizer<any>,
    private thirdPartyAuth: IAuthenticator<any>
  ) {
    super();

    this.on(this.ON_AUTHENTICATOR_ERROR, (who, what) => {
      EventBus.emit(AUTH_EVENTS.ON_AUTH_ERROR, who, what);
    });
  }

  /**
   * Detecta tokens barear
   * @param authorizationHeader
   */
  getToken(authorizationHeader: string): string {
    if (!authorizationHeader || authorizationHeader === "") {
      throw {
        msg: "[credentials_required] Authentication is mandatory"
      };
    }
    const parts = authorizationHeader.split(" ");

    if (parts.length !== 2) {
      throw { msg: "[bad_format] Format must be: <type> <credentials>" };
    }

    const scheme = parts[0];
    const credentials = parts[1];
    if (/^Bearer$/i.test(scheme)) {
      return credentials;
    }
    throw { msg: "[credentials_bad_scheme] Authentication type not allowed" };
  }

  /**
   * Verifica si existe las cabeceras de authorizacion
   * @param resource
   */
  isAuthenticated(authorizationHeader: string): boolean {
    try {
      const result: boolean = this.tokenizer.verify(
        this.getToken(authorizationHeader)
      );
      return result;
    } catch (obj) {
      this.emit(
        this.ON_AUTHENTICATOR_ERROR,
        "Error: [not_a_user] Authentication failed",
        obj.msg
      );
    }
  }

  /**
   *
   * @param resource
   */
  authenticate(resource: IAuthenticationProfile): AuthTokenContainer {
    const result = this.thirdPartyAuth.authenticate(resource);
    return this.evalAutheResult(resource, result);
  }

  private evalAutheResult(
    resource: IAuthenticationProfile,
    result: any
  ): AuthTokenContainer {
    if (!result) {
      this.emit(
        this.ON_AUTHENTICATOR_ERROR,
        resource,
        "Error: [not_a_user] Authentication failed"
      );
      return null;
    }
    const signedResult = new AuthTokenContainer(this.tokenizer.sign(result));
    this.emit(this.ON_AUTHENTICATION, resource, signedResult);
    return signedResult;
  }

  /**
   * Realiza la autenticación de forma asincrona
   *
   * @param resource
   * @param cb
   */
  asyncAuthenticate(
    resource: IAuthenticationProfile
  ): Promise<AuthTokenContainer> {
    const self = this;
    return new Promise<AuthTokenContainer>((resolve, reject) => {
      self.on(self.ON_AUTHENTICATOR_ERROR, (endpoint, msg) => {
        reject(endpoint);
      });
      self.thirdPartyAuth
        .asyncAuthenticate(resource)
        .then(res => {
          return self.evalAutheResult(resource, res);
        })
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  getPayload(authorizationHeader: string): any {
    if (this.isAuthenticated(authorizationHeader)) {
      return this.tokenizer.decode(this.getToken(authorizationHeader));
    }
    return null;
  }
}
