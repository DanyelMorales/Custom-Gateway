import "ts-node";
import "mocha";
import { expect } from "chai";
import { PriorityQueue } from "../PriorityQueue";

const obj: PriorityQueue<any> = new PriorityQueue<any>();
describe("PriorityQueue", () => {
  beforeEach(function() {});

  afterEach(function() {});

  it("deberia ordenar los valores que se le añaden", () => {
    obj.add({ value: "e1" }, 35);
    obj.add({ value: "f" }, 4);
    obj.add({ value: "a" }, 20);
    obj.add({ value: "b" }, 12);
    obj.add({ value: "c" }, 1);
    obj.add({ value: "d" }, 50);
    obj.add({ value: "e" }, 35);
    obj.add({ value: "g" }, 4);
    const result = obj.get();
    expect(result).to.not.be.null;
    expect(result[7]["value"]).to.be.equals("c");
    expect(result[6]["value"]).to.be.equals("g");
    expect(result[5]["value"]).to.be.equals("f");
    expect(result[4]["value"]).to.be.equals("b");
    expect(result[3]["value"]).to.be.equals("a");
    expect(result[2]["value"]).to.be.equals("e");
    expect(result[1]["value"]).to.be.equals("e1");
    expect(result[0]["value"]).to.be.equals("d");
  });

  it("deberia eliminar un valor", () => {
    obj.clearAll();
    const o = { value: "f" };
    obj.add({ value: "el" }, 35);
    obj.add(o, 4);
    obj.add({ value: "a" }, 20);
    obj.remove(o);
    const result = obj.get();
    expect(result).to.not.be.null;
    expect(result.length).to.be.equals(2);
    expect(result[1]["value"]).to.be.equals("a");
    expect(result[0]["value"]).to.be.equals("el");
  });
});
