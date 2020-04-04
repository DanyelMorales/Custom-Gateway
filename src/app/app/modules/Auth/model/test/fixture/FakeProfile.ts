import { IAuthenticationProfile } from "@auth/Auth";

export class FakeProfile implements IAuthenticationProfile {
  private data: any;
  use(data: any) {
    this.data = data;
  }

  has(key: string): boolean {
    return false;
  }
  get(key: string): any {
    return "";
  }

  get authData(): any {
    return {
      username: "fooobar",
      password: "passwordpassword"
    };
  }
}
