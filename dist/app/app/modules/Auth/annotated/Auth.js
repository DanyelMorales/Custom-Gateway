"use strict";
const _system_1 = require("@system");
const Tokenizer_1 = require("@auth/model/Tokenizer");
const JSONUtils_1 = require("@utils/JSONUtils");
const AuthenticatorFacade_1 = require("@auth/model/AuthenticatorFacade");
const CriticalKeyProvider_1 = require("@auth/model/CriticalKeyProvider");
/**
 *
 * @param sm
 * @param authenticator
 */
const buildFacade = (sm, authenticator) => {
    // JSON CONFIG
    const sysGlobal = sm.get(_system_1.AppServices.SystemEnvironmentData);
    const declarations = sm.get(_system_1.AppServices.DECLARATIONS_MIDDLEWARE);
    // JSON Config keys
    const keys = declarations.readCycl("critical>keys");
    // keyprovider for this project
    const keyprovider = new CriticalKeyProvider_1.CriticalKeyProvider(sysGlobal.critical, new JSONUtils_1.JSONType(keys));
    // Token generator
    const tokenizer = new Tokenizer_1.Tokenizer(keyprovider);
    // Authentication helper
    const authenticatorFacade = new AuthenticatorFacade_1.AuthenticatorFacade(tokenizer, authenticator);
    // Registering on EventBus
    return authenticatorFacade;
};
module.exports = {
    factory: buildFacade
};
//# sourceMappingURL=Auth.js.map