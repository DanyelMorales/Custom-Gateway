import { ServiceManager, IServiceManagerProvider } from "@utils/ServiceManager";
import sm = require("@annotated/ServiceManager");
import { ServiceBootstrap } from "@root/System";
import { ConfigManager } from "@utils/ConfigManager";
import { AppServices, Globals } from "@system";
import serviceInitializer = require("@annotated/initializers/ServiceManager");
import { IJSONType, JSONType } from "@utils/JSONUtils";

@sm.Services(AppServices.ConfigManager, AppServices.helloworld)
export class FakeClass {
  @sm.ServiceManager() private sm: ServiceManager<AppServices>;

  @sm.Service(AppServices.ConfigManager) private config_manager: ConfigManager;

  private ConfigManager: ConfigManager;
  private helloworld: string;

  constructor() {}

  getSM(): ServiceManager<AppServices> {
    return this.sm;
  }

  getCfgManager(): ConfigManager {
    return this.config_manager;
  }

  get configmanagerobj(): ConfigManager {
    return this.ConfigManager;
  }

  get helloworldobj(): string {
    return this.helloworld;
  }
}
