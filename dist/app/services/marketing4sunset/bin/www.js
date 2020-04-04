#!/usr/bin/env node
const TSModuleAlias = require("@momothepug/tsmodule-alias");
const tsconfigToReadFromRoot = "dist";
const aliasRegister = TSModuleAlias.play(tsconfigToReadFromRoot);
const ServerRunner = require("./../../../bin/AbstractRunner");
const runnerInstance = new ServerRunner("marketing4sunset/MyApp", process.env.PORT, process.env.RMODE);
runnerInstance.initialize();
//# sourceMappingURL=www.js.map