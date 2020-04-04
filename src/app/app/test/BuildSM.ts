import { Globals, AppServices, ServiceBootstrap } from "@system";

const sb: ServiceBootstrap = Globals.bootstrap({});
const sm = sb.serviceManager;

exports = {
  sm: sm
};
