import "ts-node";
import "mocha";
import { Tokenizer } from "@auth/model/Tokenizer";
import { expect } from "chai";
const helper = require("./Helper");
const data = helper();
describe("CriticalKeyProvider", () => {
  beforeEach(function() {});
  afterEach(function() {});
  it("deberia leer las claves publicas", () => {
    expect(data.keyprovider.type).to.be.equals("RS256");
    const a = data.keyprovider.privatek;
    expect(a).to.not.be.null;
    const b = data.keyprovider.publick;
    expect(b).to.not.be.null;
  });
});

describe("Tokenizer", () => {
  const tokenizer: Tokenizer<any> = new Tokenizer<any>(data.keyprovider);
  let otkenized;
  beforeEach(function() {
    otkenized = tokenizer.sign(data.original);
  });
  afterEach(function() {});
  it("deberia firmar correctamente un payload", () => {
    expect(otkenized).to.not.be.equals(data.original);
  });
  it("Deberia verificar un payload", () => {
    expect(tokenizer.verify(otkenized)).to.be.true;
    expect(tokenizer.verify(data.badtoken)).to.be.false;
    expect(tokenizer.verify(otkenized, { name: "urn:name" })).to.be.true;
    expect(tokenizer.verify(otkenized, { issuer: "urn:issuer" })).to.be.false;
  });
  it("Deberia decodificar un payload", () => {
    const decoded = tokenizer.decode(otkenized);
    expect(decoded).to.not.be.null;
  });
});
