"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("ts-node");
require("mocha");
const chai_1 = require("chai");
const TreeParser_1 = require("../TreeParser");
const JSONUtils_1 = require("@utils/JSONUtils");
const JSONUtils_2 = require("@utils/JSONUtils");
const Checksum_1 = require("@utils/Checksum");
const fs = require("fs");
const fakeFilename = __dirname + "/fake";
const expectedFile = __dirname + "/expectedresult";
describe("TreeParser", () => {
    let parser = null;
    let reader = null;
    beforeEach(function () {
        reader = new JSONUtils_1.JsonReader(fakeFilename, false);
        parser = new TreeParser_1.TreeParser();
    });
    afterEach(function () { });
    it("deberia generar el arbol", done => {
        const jsonType = new JSONUtils_2.JSONType(reader.readFile());
        const result = JSON.stringify(parser.parse(jsonType));
        fs.readFile(expectedFile, { encoding: "utf-8" }, function (err, data) {
            chai_1.expect(data).to.be.equals(Checksum_1.base64(result));
            done();
        });
    });
});
//# sourceMappingURL=TreeParser.spec.js.map