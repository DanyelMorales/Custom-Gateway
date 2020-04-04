"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("ts-node");
require("mocha");
const Tokenizer_1 = require("@auth/model/Tokenizer");
const chai_1 = require("chai");
const helper = require("./Helper");
const data = helper();
describe("CriticalKeyProvider", () => {
    beforeEach(function () { });
    afterEach(function () { });
    it("deberia leer las claves publicas", () => {
        chai_1.expect(data.keyprovider.type).to.be.equals("RS256");
        const a = data.keyprovider.privatek;
        chai_1.expect(a).to.not.be.null;
        const b = data.keyprovider.publick;
        chai_1.expect(b).to.not.be.null;
    });
});
describe("Tokenizer", () => {
    const tokenizer = new Tokenizer_1.Tokenizer(data.keyprovider);
    let otkenized;
    beforeEach(function () {
        otkenized = tokenizer.sign(data.original);
    });
    afterEach(function () { });
    it("deberia firmar correctamente un payload", () => {
        chai_1.expect(otkenized).to.not.be.equals(data.original);
    });
    it("Deberia verificar un payload", () => {
        chai_1.expect(tokenizer.verify(otkenized)).to.be.true;
        chai_1.expect(tokenizer.verify(data.badtoken)).to.be.false;
        chai_1.expect(tokenizer.verify(otkenized, { name: "urn:name" })).to.be.true;
        chai_1.expect(tokenizer.verify(otkenized, { issuer: "urn:issuer" })).to.be.false;
    });
    it("Deberia decodificar un payload", () => {
        const decoded = tokenizer.decode(otkenized);
        chai_1.expect(decoded).to.not.be.null;
    });
});
//# sourceMappingURL=Tokenizer.spec.js.map