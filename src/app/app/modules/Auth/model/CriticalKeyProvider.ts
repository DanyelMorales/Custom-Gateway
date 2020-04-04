import { PayloadWrapper } from "@proxy/GenericProxy";
import { IAuthenticationFacade, ITokenizer, ICriticalKeyProvider } from "@auth/Auth";
import { JSONType, JsonWrapper } from "@utils/JSONUtils";

const fs = require("fs");
const nodePath = require("path");

export class CriticalKeyProvider implements ICriticalKeyProvider {
  readonly KEY_PRIVATE: string = "private";
  readonly KEY_PUBLIC: string = "public";
  readonly KEY_TYPE: string = "type";

  constructor(
    private criticalPath: string,
    private keys: JSONType<string, any>
  ) {
    this.validate();
  }

  /**
   * @param index si es null se devuelven los keys en un json de lo contrario se retorna la llave que se requiere
   */
  validate(): void {
    if (
      !this.keys.get(this.KEY_PUBLIC) ||
      !this.keys.get(this.KEY_PRIVATE) ||
      !this.keys.get(this.KEY_TYPE)
    ) {
      throw Error(
        "public key or private key not defined in DECLARATIONS>critical>rs256"
      );
    }
  }

  private readFile(index: string): any {
    const content: string = this.keys.get(index);
    const path: string = nodePath.join(this.criticalPath, content);
    return fs.readFileSync(path);
  }
  get privatek(): any {
    return this.readFile(this.KEY_PRIVATE);
  }

  get publick(): any {
    return this.readFile(this.KEY_PUBLIC);
  }

  get type(): string {
    return this.keys.get(this.KEY_TYPE);
  }
}
