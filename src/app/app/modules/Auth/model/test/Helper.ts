/**
 * Fixtures & Test Data
 * @author Daniel Vera Morales
 */
import { Tokenizer } from "@auth/model/Tokenizer";
import { AuthenticatorFacade } from "@auth/model/AuthenticatorFacade";
import { CriticalKeyProvider } from "@auth/model/CriticalKeyProvider";
import { JSONType, JsonWrapper } from "@utils/JSONUtils";
import { Globals, AppServices, ServiceBootstrap } from "@system";
import { FakeAuthenticator } from "./fixture/FakeAuthenticator";
import { FakeProfile } from "./fixture/FakeProfile";
import { UnauthorizedException } from "@auth/model/exceptions/UnauthorizedException";
import { TestData } from "@guards/test/FakePayload";
function helper() {
  // ServiceManager
  const sb: ServiceBootstrap = Globals.bootstrap({
    ConfigManager: {
      routes: "routes",
      microservices: "microservices",
      declarations: "declarations"
    },
    globals: {
      pathToRoot: __dirname + "/../../../../../"
    }
  });
  const sm = sb.serviceManager;

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

  // Authentication concrete model
  const fakeAuth = new FakeAuthenticator();

  // Authentication helper
  const authenticatorFacade = new AuthenticatorFacade(tokenizer, fakeAuth);

  // test data
  const original = {
    iss: "232323",
    sub: "admin",
    isadm: "no",
    issuer: "yessss",
    name: "Danielo"
  };
  const badToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
    "eyJsb2dnZWRJbkFzIjoiYWRtaW4iLCJpYXQiOjE0MjI3Nzk2Mzh9.gzSraSYS8EXBxLN_oWnFSRgCzcmJmMjLiuyu5CSpyHI";

  // Operations
  return {
    authenticatorFacade: authenticatorFacade,
    fakeAuth: fakeAuth,
    tokenizer: tokenizer,
    keyprovider: keyprovider,
    badToken: badToken,
    original: original,
    // Fake test data for login
    fakeprofile: new FakeProfile(),
    __payload__: (route, name, method, gooodTOken, permissions) => {
      const datajson = {
        protected: false,
        route: null,
        actions: [],
        name: "",
        parent: "",
        permission: permissions || []
      };
      datajson.route = route;
      datajson.name = name;
      const __payload__ = TestData.data(datajson);
      __payload__.fakepayload.method = method;
      __payload__.fakepayload.headers = {
        Authorization: "Bearer " + gooodTOken
      };
      return __payload__;
    }
  };
}

export = helper;
