import { Globals, AppServices, ServiceBootstrap } from "@system";
import { Tokenizer } from "@auth/model/Tokenizer";
import { JSONType, JsonWrapper } from "@utils/JSONUtils";
import { AuthenticatorFacade } from "@auth/model/AuthenticatorFacade";
import { CriticalKeyProvider } from "@auth/model/CriticalKeyProvider";
import { IAuthenticator } from "@auth/Auth";
import { EventBus } from "@/System";
import { EventDelegator } from "@utils/EventDelegator";
/**
 *
 * @param sm
 * @param authenticator
 */
const buildFacade = (sm: any, authenticator: IAuthenticator<any>) => {
  // JSON CONFIG
  const sysGlobal: any = sm.get(AppServices.SystemEnvironmentData);
  const declarations: JsonWrapper = sm.get(AppServices.DECLARATIONS_MIDDLEWARE);

  // JSON Config keys
  const keys = declarations.readCycl("critical>keys");

  // keyprovider for this project
  const keyprovider: CriticalKeyProvider = new CriticalKeyProvider(
    sysGlobal.critical,
    new JSONType<string, any>(keys)
  );
  // Token generator
  const tokenizer: Tokenizer<any> = new Tokenizer<any>(keyprovider);

  // Authentication helper
  const authenticatorFacade = new AuthenticatorFacade(tokenizer, authenticator);
  // Registering on EventBus
  return authenticatorFacade;
};

export = {
  factory: buildFacade
};
