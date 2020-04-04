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
const ServiceManager_1 = require("@utils/ServiceManager");
const sm = require("@annotated/ServiceManager");
const ConfigManager_1 = require("@utils/ConfigManager");
const _system_1 = require("@system");
let FakeClass = class FakeClass {
    constructor() { }
    getSM() {
        return this.sm;
    }
    getCfgManager() {
        return this.config_manager;
    }
    get configmanagerobj() {
        return this.ConfigManager;
    }
    get helloworldobj() {
        return this.helloworld;
    }
};
__decorate([
    sm.ServiceManager(),
    __metadata("design:type", ServiceManager_1.ServiceManager)
], FakeClass.prototype, "sm", void 0);
__decorate([
    sm.Service(_system_1.AppServices.ConfigManager),
    __metadata("design:type", ConfigManager_1.ConfigManager)
], FakeClass.prototype, "config_manager", void 0);
FakeClass = __decorate([
    sm.Services(_system_1.AppServices.ConfigManager, _system_1.AppServices.helloworld),
    __metadata("design:paramtypes", [])
], FakeClass);
exports.FakeClass = FakeClass;
//# sourceMappingURL=FakeClass.js.map