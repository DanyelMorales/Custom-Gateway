"use strict";
/**
 * Fixtures & Test Data
 * @author Daniel Vera Morales
 */
const Tokenizer_1 = require("@auth/model/Tokenizer");
const AuthenticatorFacade_1 = require("@auth/model/AuthenticatorFacade");
const CriticalKeyProvider_1 = require("@auth/model/CriticalKeyProvider");
const JSONUtils_1 = require("@utils/JSONUtils");
const _system_1 = require("@system");
const FakeAuthenticator_1 = require("./fixture/FakeAuthenticator");
const FakeProfile_1 = require("./fixture/FakeProfile");
const FakePayload_1 = require("@guards/test/FakePayload");
function helper() {
    // ServiceManager
    const sb = _system_1.Globals.bootstrap({
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
    const sysGlobal = sm.get(_system_1.AppServices.SystemEnvironmentData);
    const declarations = sm.get(_system_1.AppServices.DECLARATIONS_MIDDLEWARE);
    // JSON Config keys
    const keys = declarations.readCycl("critical>keys");
    // keyprovider for this project
    const keyprovider = new CriticalKeyProvider_1.CriticalKeyProvider(sysGlobal.critical, new JSONUtils_1.JSONType(keys));
    // Token generator
    const tokenizer = new Tokenizer_1.Tokenizer(keyprovider);
    // Authentication concrete model
    const fakeAuth = new FakeAuthenticator_1.FakeAuthenticator();
    // Authentication helper
    const authenticatorFacade = new AuthenticatorFacade_1.AuthenticatorFacade(tokenizer, fakeAuth);
    // test data
    const original = {
        iss: "232323",
        sub: "admin",
        isadm: "no",
        issuer: "yessss",
        name: "Danielo"
    };
    const badToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
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
        fakeprofile: new FakeProfile_1.FakeProfile(),
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
            const __payload__ = FakePayload_1.TestData.data(datajson);
            __payload__.fakepayload.method = method;
            __payload__.fakepayload.headers = {
                Authorization: "Bearer " + gooodTOken
            };
            return __payload__;
        }
    };
}
module.exports = helper;
//# sourceMappingURL=Helper.js.map