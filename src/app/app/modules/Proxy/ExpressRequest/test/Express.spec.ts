import "ts-node";
import "mocha";
import { expect } from "chai";
import {
  ProxyHelper,
  Payload,
  PayloadFactory,
  ProxySender
} from "@proxy/ExpressRequest/Express";
import { TestHelper } from "@tests/ProxyUtils";
import * as path from "path";

const mode: string = "prod";
const testHelper: TestHelper = new TestHelper();
const routeName = "listarpaises";

const cleanWords = (regexstr: string, word: string): string => {
  const regex = new RegExp(regexstr, "gi");
  return word.replace(regex, "");
};

const cleanRequest = (req: any): any => {
  ["/@proxy@"].forEach(regexstr => {
    req.path = cleanWords(regexstr, req.path);
  });
  return req;
};

describe("PayloadFactory", () => {
  const factory = new PayloadFactory(mode, testHelper.microservices);

  beforeEach(function() {});

  afterEach(function() {});

  it("deberia formatear correctamente el payload del proxy", function() {
    const expects_ = {
      "http://127.0.0.1:80/@proxy@/countries/listing/shalalala":
        "http://127.0.0.1:80/countries/listing/shalalala",
      "http://127.0.0.1:80/@proxy@/": "http://127.0.0.1:80/",
      "http://127.0.0.1:80/@proxy@": "http://127.0.0.1:80",
      "http://127.0.0.1:80/": "http://127.0.0.1:80/",
      "http://127.0.0.1:80/ruta/desconocida":
        "http://127.0.0.1:80/ruta/desconocida",
      "http://127.0.0.1:80/ruta/desconocida/@proxy@/":
        "http://127.0.0.1:80/ruta/desconocida/" 
    };
    let index = "";
    for (index in expects_) {
      if (expects_[index]) {
        const newreq = cleanRequest({
          path: index
        });
        expect(newreq.path).to.be.equals(expects_[index]);
      }
    }
  });

  it("deberia construir correctamente un payload", function() {
    const payload = factory.build(
      testHelper.expressReq,
      testHelper.getRoute(testHelper.routes, routeName)
    );
    expect(payload).to.not.be.null;
  });
});

describe("ProxySender", () => {
  let payload: Payload;
  let sender: ProxySender;

  beforeEach(function() {
    sender = new ProxySender();
    payload = testHelper.getPayload(
      mode,
      testHelper.microservices,
      testHelper.expressReq,
      testHelper.getRoute(testHelper.routes, routeName)
    );
  });

  afterEach(function() {});

  it("deberia enviar datos remotos", done => {
    const eve = (error, response, body) => {
      console.log("error:", error); // Print the error if one occurred
      console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
      console.log("body:", body); // Print the HTML for the Google homepage.
      expect(response.statusCode).to.be.equals(401);
      done();
    };

    sender.send(payload, eve);
  });
});
