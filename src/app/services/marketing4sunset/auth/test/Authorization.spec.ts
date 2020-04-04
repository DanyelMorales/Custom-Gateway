import { PayloadWrapper } from "@proxy/GenericProxy";
import "ts-node";
import "mocha";
import { expect } from "chai";
import { Authorization } from "../Authorization";
import { GuardOptions } from "@mods_/System/model/RouteGuardManager/interfaces/ValidationGuardOptions";

import { FakePayload } from "@mods_/Guards/test/FakePayload";
import { FakeProfile } from "@mods_/Auth/model/test/fixture/FakeProfile";
import { Route } from "@proxy/RouteFactory";
const helper = require("@mods_/Auth/model/test/Helper");
const data = helper();

const gooodTOken: string =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9." +
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

describe("AliasAuthorization", () => {
  const objectToTest = new Authorization(data.authenticatorFacade);

  beforeEach(function() {});
  afterEach(function() {});
  it("Deberia permitir la visualizacion si posee permisos", () => {
    const __payload__ = data.__payload__(
      "/foo/bar/bare",
      "bar",
      "foo",
      gooodTOken,
      ["foo@bar", "b@b", "bare@bar"]
    );
    // console.log(__payload__["route"].route.permission);
    // SI POSEE LOS PERMISOS
    expect(
      objectToTest.isAuthorized(__payload__["route"].payload, [
        "foo@bar",
        "b@b",
        "bare@bar"
      ])
    ).to.be.equals(GuardOptions.ACCEPT);
  });

  it("Deberia fallar si no tiene permisos", () => {
    let __payload__ = data.__payload__(
      "/foo/bar/bare",
      "barxxxx",
      "fooxxx",
      gooodTOken,
      []
    );
    const __bad_payload__ = data.__payload__(
      "/foo/bar/bare",
      "barxxxx",
      "fooxxx",
      gooodTOken + "asdasaa"
    );
    // NO LE CORRESPONDE DECIDIR SOLO SI ES NULL EL CONTENEDOR DE PERMISOS
    expect(
      objectToTest.isAuthorized(__payload__["route"].payload, [])
    ).to.be.equals(GuardOptions.CONTINUE);
    __payload__ = data.__payload__(
      "/foo/bar/bare",
      "barxxxx",
      "fooxxx",
      gooodTOken,
      ["foooooo@bad@perm"]
    );

    // NO POSEE PERMISOS
    expect(
      objectToTest.isAuthorized(__payload__["route"].payload, [
        "foooooo@bad@perm"
      ])
    ).to.be.equals(GuardOptions.DIE);
  });
});
