"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventBus_1 = require("@utils/EventBus");
class ServiceManager {
    constructor() {
        this.services = {};
    }
    add(key, value) {
        if (this.has(key)) {
            throw Error("Service Already defined ");
        }
        this.services[key] = value;
        return this;
    }
    remove(key) {
        delete this.services[key];
        return this;
    }
    get(key) {
        if (typeof this.services[key] === "undefined") {
            return null;
        }
        return this.services[key];
    }
    addAll(json) {
        for (const index in json) {
            if (json[index] !== null) {
                this.add(index, json[index]);
            }
        }
        return this;
    }
    has(key) {
        return typeof this.services[key] === "undefined" ? false : true;
    }
}
exports.ServiceManager = ServiceManager;
class SuperServiceManager extends ServiceManager {
    constructor() {
        super();
        this.AFTER_DELEGATION = "SERVICE_MANAGER_AFTER_DELEGATION";
        this.providedServices = [];
        this.delegatorContainer = [];
    }
    getDelegator(delegatorType) {
        for (let i = 0; i < this.delegatorContainer.length; i++) {
            const item = this.delegatorContainer[i];
            // looking for a provider
            if (typeof item.delegator === delegatorType) {
                continue;
            }
            return item;
        }
        return null;
    }
    removeDelegator(delegatorType) {
        const delegator = this.getDelegator(delegatorType);
        const i = this.delegatorContainer.indexOf(delegator);
        if (i > -1 && delegator !== null) {
            this.providedServices = this.providedServices.filter(axx => delegator.services.indexOf(axx) > -1);
            this.delegatorContainer.splice(i, 1);
        }
        return this;
    }
    /**
     * A service could be served by any provider
     */
    get(key) {
        const service = super.get(key);
        if (service !== null) {
            return service;
        }
        if (!this.hasProviderForService(key)) {
            return null;
        }
        // looking for a provider
        for (const item of this.delegatorContainer) {
            if (item.services.indexOf(key) > -1) {
                const serviceResult = item.delegator.delegate(key, this);
                return EventBus_1.default.applyFilter(this.AFTER_DELEGATION, serviceResult, key);
            }
        }
        return null;
    }
    has(key) {
        const dadaHasIt = super.has(key);
        if (dadaHasIt) {
            return true;
        }
        return this.providedServices.indexOf(key) > -1;
    }
    hasProviderForService(service) {
        return this.providedServices.indexOf(service) > -1;
    }
    addProvider(delegator) {
        const container = {
            delegator: delegator,
            services: delegator.iCanDelegate
        };
        if (container.services.every(this.hasProviderForService.bind(this))) {
            throw Error("A delegator is already handling services for: " +
                container.services.join(","));
        }
        this.delegatorContainer.push(container);
        this.providedServices = this.providedServices.concat(delegator.iCanDelegate);
        return this;
    }
}
exports.SuperServiceManager = SuperServiceManager;
//# sourceMappingURL=ServiceManager.js.map