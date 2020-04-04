import "ts-node";
import "mocha";
import { expect } from "chai";
import { FakeGuard } from "./FakeGuard";
import { GuardOptions } from "../../RouteGuardManager/interfaces/ValidationGuardOptions";
import { RouteGuardManager } from "./../RouteGuardManager";
import { TestHelper } from "@tests/ProxyUtils";

const testHelper: TestHelper = new TestHelper();

describe("ProxyService", () => {
  let rgm;
  beforeEach(function() {
    rgm = new RouteGuardManager();
  });
  afterEach(function() {});

  it("deberia verificar que sea permitido", () => {
    rgm.add(new FakeGuard(GuardOptions.CONTINUE));
    rgm.add(new FakeGuard(GuardOptions.CONTINUE));
    rgm.add(new FakeGuard(GuardOptions.CONTINUE));
    rgm.add(new FakeGuard(GuardOptions.ACCEPT));
    expect(rgm.isAllowed("any")).to.be.true;
  });

  it("deberia verificar que no es permitido", () => {
    rgm.add(new FakeGuard(GuardOptions.CONTINUE));
    rgm.add(new FakeGuard(GuardOptions.CONTINUE));
    rgm.add(new FakeGuard(GuardOptions.CONTINUE));
    rgm.add(new FakeGuard(GuardOptions.DIE));
    expect(rgm.isAllowed("any")).to.be.false;
  });

  it("deberia verificar que no es permitido pues no se encontraron validadores", () => {
    rgm.add(new FakeGuard(GuardOptions.CONTINUE));
    rgm.add(new FakeGuard(GuardOptions.CONTINUE));
    rgm.add(new FakeGuard(GuardOptions.CONTINUE));
    rgm.add(new FakeGuard(GuardOptions.CONTINUE));
    expect(rgm.isAllowed("any")).to.be.false;
  });
});
