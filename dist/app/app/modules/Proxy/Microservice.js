"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const loadJson = require("@annotated/JSON");
const Auth = require("@annotated/Auth");
const Logger = require("@annotated/Logger");
/**
 *
 */
class Microservice {
    constructor(jsonWrapper, mode, ns) {
        this.jsonWrapper = jsonWrapper;
        this.mode = mode;
        this.ns = ns;
        this.json = jsonWrapper.readCycl(ns, mode);
    }
    getKey(key = null) {
        if (!key) {
            return this.json;
        }
        if (typeof this.json[key] !== "undefined") {
            return this.json[key];
        }
        return "";
    }
    getAuth() {
        return this.json;
    }
    getMode() {
        return this.mode;
    }
    getNS() {
        return this.ns;
    }
    getPath() {
        return this.json || {};
    }
}
__decorate([
    Logger.eval({
        on: "typeof@undefined",
        return: {},
        level: "warning"
    }),
    Auth.container("common>Auth>credentials"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Microservice.prototype, "getAuth", null);
__decorate([
    loadJson.MethodExtract("common>path"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], Microservice.prototype, "getPath", null);
exports.Microservice = Microservice;
/**
 * Construye un objeto de microservicio
 */
class MicroserviceFactory {
    /**
     * @param microserviceJSON
     * @param runningMode
     * @param runningNS
     */
    constructor(microserviceWrapper, runningMode, runningNS) {
        this.microserviceWrapper = microserviceWrapper;
        this.runningMode = runningMode;
        this.runningNS = runningNS;
    }
    /**
     *
     */
    get appMicroservice() {
        return this.microserviceWrapper;
    }
    /**
     *
     */
    build() {
        return new Microservice(this.microserviceWrapper, this.runningMode, this.runningNS);
    }
}
exports.MicroserviceFactory = MicroserviceFactory;
//# sourceMappingURL=Microservice.js.map