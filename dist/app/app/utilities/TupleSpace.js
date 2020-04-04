"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _servicemanager_1 = require("@servicemanager");
class TupleSpace extends _servicemanager_1.ServiceManager {
    constructor() {
        super();
        this.groups = [];
    }
    getService(group, serviceName) {
        const name = this.getName(group, serviceName);
        return super.get(name);
    }
    addService(group, serviceName, value) {
        const name = this.getName(group, serviceName);
        this.addToGroup(group, serviceName);
        this.remove(name).add(name, value);
    }
    removeService(group, service) {
        const values = this.getGroupValues(group);
        const name = this.getName(group, service);
        const index = values.indexOf(service);
        if (index > -1) {
            // remove from array
            values.splice(index, 1);
            // remove from services
            this.remove(name);
            // remove group
            this.removeGroup(group);
            // creating group again
            this.addGroup(group, values);
        }
    }
    removeGroup(group) {
        const value = this.getGroup(group);
        const index = this.groups.indexOf(value);
        if (index > -1) {
            this.groups.splice(index, 1);
        }
    }
    addToGroup(group, services) {
        const values = this.getGroupValues(group);
        values.push(services);
        this.removeGroup(group);
        this.addGroup(group, values);
    }
    popService(group, serviceName) {
        const service = this.getService(group, serviceName);
        this.removeService(group, serviceName);
        return service;
    }
    getServices(group) {
        const results = [];
        const values = this.getGroupValues(group);
        const that = this;
        values.forEach(val => {
            const service = that.get(that.getName(group, val));
            if (service) {
                results.push(service);
            }
        });
        return results;
    }
    getGroupValues(request) {
        const group = this.getGroup(request);
        if (group) {
            return group.values;
        }
        return [];
    }
    getName(group, serviceName) {
        return group + "@" + serviceName;
    }
    addGroup(group, services) {
        this.groups.push({
            group: group,
            values: services
        });
    }
    getGroup(request) {
        for (const group of this.groups) {
            if (group.group === request) {
                return group;
            }
        }
        return null;
    }
}
exports.TupleSpace = TupleSpace;
//# sourceMappingURL=TupleSpace.js.map