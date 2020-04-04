"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("ts-node");
require("mocha");
const chai_1 = require("chai");
const helper = require("./Helper");
const data = helper();
describe("AuthenticatorFacade", () => {
    beforeEach(function () { });
    afterEach(function () { });
    // Authorization : Bearer cn389ncoiwuencr
    it("deberia retornar un token", () => {
        chai_1.expect(data.authenticatorFacade.getToken("Bearer cn389ncoiwuencr")).to.be.equals("cn389ncoiwuencr");
        //
        try {
            data.authenticatorFacade.getToken("");
        }
        catch (e) {
            chai_1.expect(e.msg.toString()).to.be.equals("[credentials_required] Authentication is mandatory");
        }
        //
        try {
            data.authenticatorFacade.getToken("Bearer");
        }
        catch (e) {
            chai_1.expect(e.msg.toString()).to.be.equals("[bad_format] Format must be: <type> <credentials>");
        }
        //
        try {
            data.authenticatorFacade.getToken("basic ksdajksajksajka");
        }
        catch (e) {
            chai_1.expect(e.msg.toString()).to.be.equals("[credentials_bad_scheme] Authentication type not allowed");
        }
        //
        try {
            data.authenticatorFacade.getToken("basic ksdajksajksajka");
        }
        catch (e) {
            chai_1.expect(e.msg.toString()).to.be.equals("[credentials_bad_scheme] Authentication type not allowed");
        }
    });
    it("Deberia autenticar incorrectamente", () => {
        data.authenticatorFacade.on(data.authenticatorFacade.ON_BAD_AUTHENTICATION, (auuht, msg) => {
            chai_1.expect(msg.toString()).to.be.equals("Error: [not_a_user] Authentication failed");
        });
        data.fakeAuth.toReturn = "-1";
        data.authenticatorFacade.authenticate(data.fakeprofile);
    });
    it("Deberia autenticar correctamente", () => {
        data.authenticatorFacade.on(data.authenticatorFacade.ON_AUTHENTICATION, (resource, signed) => { });
        data.fakeAuth.initialize();
        const token = data.authenticatorFacade.authenticate(data.fakeprofile);
        chai_1.expect(token).to.not.be.null;
    });
    it("Deberia autenticar correctamente asyncronamente", () => {
        data.fakeAuth.initialize();
        data.authenticatorFacade
            .asyncAuthenticate(data.fakeprofile)
            .then(result => {
            chai_1.expect(result).to.not.be.null;
        });
    });
    it("Deberia verificar si es o no valido un token", () => {
        const gooodTOken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9." +
            "eyJ1c2VySWQiOiIxMjU1NiIsInBlcm1pc3Npb24" +
            "iOlsiZm9vQGJhciIsImJhcmVAYmFyIiwiYkBiIl0sImlzcyI6InRydWUi" +
            "LCJpYXQiOjE1MjAwMTE1MTh9.SDoDNIj5uBupRPzdi-ziaQRy0jy85LL6uc" +
            "6oxyeo5waanw" +
            "t_w7PXQmfKt_4h7X5VVnFBKqf4bGzLGeZgmgD5WNp8aGkeg9" +
            "m7Nk9NyNjvaOWjEqAg-nXwpcSGPGWEzrlBxP8jZofmSOZqyoY4TQJbs6J" +
            "E99IC7OSENm-D-gSUL4WyyGnOB8CJVv6NB7GEWzTGyrc2UJz566ZvdI4woYNeOlpHY7BsaVg1Vhc77ly95OUx8nCGTYfQaoO6O_M_" +
            "8L9n6bBvEkbVmlpk5LV0ERsKGENr_a3aG78i2JQsiTqEyeeTlTKZ6mfIlITH6RG3TmFJv2qD-iw54I_DdhBxn_G6J7NQr" +
            "4xNJpkotg6XRzRdmV6SWpvdj5qYe8B0lMmDaGrCda0g" +
            "-9aVRs9iCFd8vgQzp8PuMfV1cJPVndZmH45iM5kJ_PLtQ-Ure_AifrvaKILx" +
            "MjIxOnym3N9V4bBhMqcnKWs7lGtlqUQRZuAb1Gf-4Xxb9ZvXnc22bVwPFV67i" +
            "eQ_9SjPoxcoitCJmMpFDU2BI1dM44476bNca-SoxcCNtCbkXp5Ok71Hd4Z" +
            "bw4tzNGiGta_HS4j2sn8GHiLFI5c6NGhbfyLbPZncVJw2v5rbKmn-czpqmQdxx" +
            "OxT65sWbvnrEsAHAfIthMNl1KOPTMCY1o28M4Cp7mucdebzE9_HgnQ";
        const isAuth = data.authenticatorFacade.isAuthenticated("Bearer " + gooodTOken);
        chai_1.expect(isAuth).to.be.true;
        const badAuth = data.authenticatorFacade.isAuthenticated("Bearer " + data.badToken);
        chai_1.expect(badAuth).to.be.false;
    });
});
//# sourceMappingURL=AuthenticatorFacade.spec.js.map