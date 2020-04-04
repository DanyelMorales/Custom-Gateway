import "ts-node";
import "mocha";
import { expect } from "chai";
import { ITreeParser, TreeParser } from "../TreeParser";
import { JsonWrapper, JsonReader } from "@utils/JSONUtils";
import { IMenuItem } from "../MenuTree";
import { JSONType } from "@utils/JSONUtils";
import { base64, checksum } from "@utils/Checksum";
const fs = require("fs");
const fakeFilename = __dirname + "/fake";
const expectedFile = __dirname + "/expectedresult";

describe("TreeParser", () => {
  let parser: ITreeParser<IMenuItem> = null;
  let reader: JsonReader = null;

  beforeEach(function() {
    reader = new JsonReader(fakeFilename, false);
    parser = new TreeParser();
  });
  afterEach(function() {});

  it("deberia generar el arbol", done => {
    const jsonType = new JSONType(reader.readFile());
    const result = JSON.stringify(parser.parse(jsonType));
    fs.readFile(expectedFile, { encoding: "utf-8" }, function(err, data) {
      expect(data).to.be.equals(base64(result));
      done();
    });
  });
});
