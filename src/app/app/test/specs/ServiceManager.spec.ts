import "ts-node";
import "mocha";
import { expect } from "chai";
import { ServiceManager } from "@utils/ServiceManager";
import { ServiceBootstrap } from "@root/System";
import { AppServices } from "@system";

describe("ServiceManager", () => {
  let sm: ServiceManager<string>;
  beforeEach(function() {
    sm = new ServiceManager<string>();
  });
  afterEach(function() {});

  it("Deberia agregar un nuevo servicio", () => {
    sm.add("myservice", "anyservice");
    sm.add("myservice2", "shalalala");
    sm.add("myservice3", "foobar");
    expect(sm.has("myservice3")).to.be.true;
    expect(sm.has("myserviceasasasas3")).to.be.false;
  });

  it("Deberia remover un nuevo servicio", () => {
    sm.add("myservice", "anyservice");
    expect(sm.has("myservice")).to.be.true;
    sm.remove("myservice");
    expect(sm.has("myservice")).to.be.false;
  });

  it("Deberia obtener un nuevo servicio", () => {
    sm.add("myservice", "anyservice");
    expect(sm.get("myservice")).to.be.equals("anyservice");
  });

  it("Deberia agregar nuevos indices con un json", () => {
    sm.addAll({
      a: "aaa",
      b: "bbb",
      c: "ccc"
    });
    expect(sm.get("a")).to.be.equals("aaa");
    expect(sm.get("b")).to.be.equals("bbb");
    expect(sm.get("c")).to.be.equals("ccc");
  });
});
