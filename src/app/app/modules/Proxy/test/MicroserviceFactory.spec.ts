import 'ts-node';
import 'mocha';
import {expect} from 'chai';
import {Microservice, MicroserviceFactory} from '../Microservice';
import { TestHelper } from "@tests/ProxyUtils";

const testHelper: TestHelper = new TestHelper();

describe('MicroserviceFactory', () => {

  let factory = null;

  beforeEach(function() {
    factory = new MicroserviceFactory(testHelper.microservices, "dev", "microservices>API1_DROPWIZARD" );
  });

  afterEach(function() {

  });

  it("deberia leer el archivo solicitado",  () => {
    expect(factory.appMicroservice).to.not.be.null;
    const built = factory.build();
    const auth =  built.getAuth();
    expect( auth ).to.not.be.null;
    expect( auth.password ).to.not.be.null;
    expect(built).to.not.be.null;
    expect(built.getKey("parent")).to.not.be.null;
    expect(built.getKey("common")).to.not.be.null;
    expect(built.getPath()).to.be.equals("v1");

    expect(built.getKey().url).to.be.equals('http://127.0.0.1:1010');
  });

});