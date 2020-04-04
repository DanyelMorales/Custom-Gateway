import "ts-node";
import "mocha";
import { expect } from "chai";
import { ProxyService } from "@proxy/ProxyService";
import { TestHelper } from "@tests/ProxyUtils";
import { PayloadFactory } from "@proxy/ExpressRequest/Express";

const mode: string = "prod";
const testHelper: TestHelper = new TestHelper();
const routeName = "listCountries";
const bad_routeName = "listarpaisesxxxx";

describe("ProxyService", () => {
  let payloadfactory;
  let proxyservice;

  beforeEach(function() {
    payloadfactory = new PayloadFactory(mode, testHelper.microservices);
    proxyservice = new ProxyService(payloadfactory);
  });
  afterEach(function() {});

  it("deberia retornar false puesto que no esta en el contenedor de rutas permitidas", done => {
    proxyservice.on(ProxyService.ON_ERROR, data => {
      expect(data.type + "").to.be.equals(ProxyService.DELEGATION_ERROR);
      done();
    });

    const resb = proxyservice.delegate(bad_routeName, testHelper.expressReq);
  });

 
  it("deberia delegar la peticion correctamente pues la ruta esta contenida", done => {
    proxyservice.on(ProxyService.ON_REQUEST_RESULT, container => {
      console.log("error:", container.error); // Print the error if one occurred
      console.log(
        "statusCode:",
        container.response && container.response.statusCode
      ); // Print the response status code if a response was received
      console.log("body:", container.body); // Print the HTML for the Google homepage.
      expect(container.response.statusCode).to.be.equals(401);
      done();
    });
    proxyservice.delegate(routeName, testHelper.expressReq);
  });
});
