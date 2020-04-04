import { JSONType } from "@utils/JSONUtils";
import { SystemGlobal, IGlobalFieldContainer } from "@app/SystemGlobal";

const buildSystemGlobals = (data: any): IGlobalFieldContainer => {
  const jsonMap = new JSONType<string, string>(data);
  return new SystemGlobal(jsonMap);
};
const systemGlobalFactory = function(data: any): Function {
  return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
    target[propertyKey] = buildSystemGlobals(data);
  };
};

const sinitializer = function(data: any): Function {
  return (constructor: Function) => {
    constructor.prototype["systemGlobals"] = buildSystemGlobals(data);
  };
};

export = {
  setTo: systemGlobalFactory,
  init: sinitializer,
  build: buildSystemGlobals
};
