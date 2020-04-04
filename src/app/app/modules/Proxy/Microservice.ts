import { IMicroservice, IMicroserviceFactory } from "./IMicroservice";
import loadJson = require("@annotated/JSON");
import Auth = require("@annotated/Auth");
import Logger = require("@annotated/Logger");
import { JsonWrapper } from "@utils/JSONUtils";

/**
 *
 */
export class Microservice implements IMicroservice {
  private json: any;

  constructor(
    private jsonWrapper: JsonWrapper,
    private mode: string,
    private ns: string
  ) {
    this.json = jsonWrapper.readCycl(ns, mode);
  }

  getKey(key: string = null): string {
    if (!key) {
      return this.json;
    }

    if (typeof this.json[key] !== "undefined") {
      return this.json[key];
    }
    return "";
  }

  @Logger.eval({
    on: "typeof@undefined",
    return: {},
    level: "warning"
  })
  @Auth.container("common>Auth>credentials")
  getAuth() {
    return this.json;
  }

  getMode(): string {
    return this.mode;
  }

  getNS(): string {
    return this.ns;
  }

  @loadJson.MethodExtract("common>path")
  getPath(): string {
    return this.json || {};
  }
}

/**
 * Construye un objeto de microservicio
 */
export class MicroserviceFactory implements IMicroserviceFactory {
  /**
   * @param microserviceJSON
   * @param runningMode
   * @param runningNS
   */
  constructor(
    private microserviceWrapper: JsonWrapper,
    private runningMode: string,
    private runningNS: string
  ) {}

  /**
   *
   */
  get appMicroservice(): JsonWrapper {
    return this.microserviceWrapper;
  }

  /**
   *
   */
  build(): IMicroservice {
    return new Microservice(
      this.microserviceWrapper,
      this.runningMode,
      this.runningNS
    );
  }
}
