import {
  IAuthenticator,
  IAuthenticationFacade,
  IAuthenticationProfile
} from "../../../Auth";
/**
 *
 */
export class FakeAuthenticator implements IAuthenticator<any> {
  private toreturn: any = "-1";
  readonly END_POINT: string = "AUTH_MANAGER";

  initialize() {
    this.toReturn = {
      userId: "12556",
      perms: ["foo@bar", "bare@bar", "b@b"],
      iss: "true"
    };
  }

  set toReturn(value: any) {
    this.toreturn = value;
  }

  /**
   * @param resource
   */
  authenticate(resource: IAuthenticationProfile): any {
    return this.toreturn;
  }
  asyncAuthenticate(resource: IAuthenticationProfile): Promise<string> {
    const self = this;
    return new Promise<string>((resolve, reject) => {
      resolve(self.authenticate(resource));
    });
  }
}
