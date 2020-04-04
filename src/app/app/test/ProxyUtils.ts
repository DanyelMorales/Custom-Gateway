import { ProxyFacade } from "@proxy/ProxyFacade";
import { JsonWrapper, JsonReader } from "@utils/JSONUtils";
import { JSONType } from "@utils/JSONUtils";
import { Globals, AppServices, ServiceManagerMiddleware } from "@system";

const routes_test_config: string = __dirname + "/../annotated/test/config";
const microservices_test_config: string =
  __dirname + "/../modules/Proxy/test/config";
const currentmode = "dev";
const currentMSPath = "microservices>API1_DROPWIZARD";
const routeName = "listarpaises";
const SystemGlobal = require("@annotated/SystemGlobal");

export class TestHelper extends ProxyFacade {
  private request: any = {
    body: {},
    method: "GET",
    query: {},
    baseUrl: "http://127.0.0.1/proxy/listarpaises",
    cookies: {}
  };

  constructor() {
    super();
  }

  buildRequest(index: string, value: any): any {
    this.request[index] = value;
    return this.request;
  }

  get expressReq(): any {
    return this.request;
  }

  get routes(): JsonWrapper {
    const reader: JsonReader = new JsonReader(routes_test_config, true);
    return reader.readFile();
  }

  get microservices(): JsonWrapper {
    const reader: JsonReader = new JsonReader(microservices_test_config, true);
    return reader.readFile();
  }

  get appConfig(): JSONType<string, any> {
    const jsonx = {
      ConfigManager: {
        routes: routes_test_config,
        microservices: microservices_test_config
      }
    };
    return new JSONType<string, any>(jsonx);
  }

  get constants(): any {
    return {
      routes_test_config: routes_test_config,
      microservices_test_config: microservices_test_config,
      currentmode: currentmode,
      currentMSPath: currentMSPath,
      routeName: routeName
    };
  }
}
