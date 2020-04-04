import {
  IAuthenticator,
  IAuthenticationFacade,
  IAuthenticationProfile
} from "@auth/Auth";

/**
 * @author Daniel Vera Morales
 */
export abstract class AbstractAsyncAuthenticator<T>
  implements IAuthenticator<T> {
  /**
   *
   * @param delegator
   * @param resolve
   * @param reject
   */
  protected subscribe(delegator, resolve, reject) {
    delegator.onResult(container => {
      resolve(this.getObjectResponse(container));
    });
    delegator.onError(container => {
      reject(container);
    });
    delegator.filterResult(this.isValidResult);
  }

  protected isValidResult(container) {
    return container;
  }

  protected abstract delegator();
  protected abstract sendPayload(resource: IAuthenticationProfile);
  protected abstract getObjectResponse(data);

  /**
   * @param resource
   */
  authenticate(resource: IAuthenticationProfile): T {
    return null;
  }

  /**
   *
   * @param resource
   */
  asyncAuthenticate(resource: IAuthenticationProfile): Promise<T> {
    const self = this;
    return new Promise<T>((resolve, reject) => {
      self.subscribe(self.delegator(), resolve, reject);
      self.sendPayload(resource);
    });
  }
}
