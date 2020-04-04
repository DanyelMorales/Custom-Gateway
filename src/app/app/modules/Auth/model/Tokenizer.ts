import { PayloadWrapper } from "@proxy/GenericProxy";
import { IAuthenticationFacade, ITokenizer, ICriticalKeyProvider } from "@auth/Auth";

const jwt = require("jsonwebtoken");

/**
 *
 */
export class Tokenizer<T> implements ITokenizer<T, any> {
  readonly UNAUTHORIZED_TOKEN: string = "unauthorized token";
  constructor(private keyProvider: ICriticalKeyProvider) {}

  /**
   *
   * @param resource
   */
  sign(resource: T): any {
    return jwt.sign(resource, this.keyProvider.privatek, {
      algorithm: this.keyProvider.type
    });
  }

  /**
   *
   * @param token.to.not.be.null
   * @param consumer
   * @param claim
   */
  decode(token: any, claim: any = null): T {
    if (!this.verify(token, claim)) {
      throw new Error(this.UNAUTHORIZED_TOKEN);
    }
    return jwt.decode(token, this.keyProvider.publick);
  }

  /**
   *
   * @param token
   * @param claim
   */
  verify(token: any, claim: any = null): boolean {
    try {
      jwt.verify(token, this.keyProvider.publick, claim);
      return true;
    } catch (e) {
      return false;
    }
  }
}
