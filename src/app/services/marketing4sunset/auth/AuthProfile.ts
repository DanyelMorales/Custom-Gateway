import { IAuthenticationProfile } from "@auth/Auth";
const querystring = require("querystring");

/**
 *
 */
export class AuthProfile implements IAuthenticationProfile {
  constructor(private request: any) {}

  private get(key: string): string {
    if (
      this.request === null ||
      typeof this.request.body === "undefined" ||
      typeof this.request.body[key] === "undefined"
    ) {
      return null;
    }
    return this.request.body[key];
  }

  /**
   *
   */
  get authData(): any {
    const formData = querystring.stringify({
      username: this.get("username"),
      password: this.get("password")
    });
    return {
      formData: formData,
      length: formData.size
    };
  }
}
