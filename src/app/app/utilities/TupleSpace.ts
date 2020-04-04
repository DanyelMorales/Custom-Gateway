import { ServiceManager } from "@servicemanager";

export interface ITupleSpaceService<E, T> {
  group: E;
  values: T[];
}

export interface ITupleSpace<SERVICE, GROUP> {
  addService(group: GROUP, service: SERVICE, value: any);
  removeGroup(group: GROUP);
  removeService(group: GROUP, service: SERVICE);
  addToGroup(group: GROUP, service: SERVICE);
  getServices(group: GROUP): any[];
  getService(group: GROUP, serviceName: SERVICE): any;
  popService(group: GROUP, serviceName: SERVICE): any;
}

export class TupleSpace<E, T> extends ServiceManager<string>
  implements ITupleSpace<T, E> {
  private groups: ITupleSpaceService<E, T>[] = [];

  constructor() {
    super();
  }

  getService(group: E, serviceName: T): any {
    const name = this.getName(group, serviceName);
    return super.get(name);
  }

  addService(group: E, serviceName: T, value: any) {
    const name = this.getName(group, serviceName);
    this.addToGroup(group, serviceName);
    this.remove(name).add(name, value);
  }
  removeService(group: E, service: T) {
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
  removeGroup(group: E) {
    const value = this.getGroup(group);
    const index = this.groups.indexOf(value);
    if (index > -1) {
      this.groups.splice(index, 1);
    }
  }

  addToGroup(group: E, services: T) {
    const values = this.getGroupValues(group);
    values.push(services);
    this.removeGroup(group);
    this.addGroup(group, values);
  }

  popService(group: E, serviceName: T): any {
    const service = this.getService(group, serviceName);
    this.removeService(group, serviceName);
    return service;
  }

  getServices(group: E): any[] {
    const results: any[] = [];
    const values: T[] = this.getGroupValues(group);
    const that = this;
    values.forEach(val => {
      const service = that.get(that.getName(group, val));
      if (service) {
        results.push(service);
      }
    });
    return results;
  }

  private getGroupValues(request: E): T[] {
    const group = this.getGroup(request);
    if (group) {
      return group.values;
    }
    return [];
  }

  private getName(group: E, serviceName: T): string {
    return group + "@" + serviceName;
  }

  private addGroup(group: E, services: T[]) {
    this.groups.push({
      group: group,
      values: services
    });
  }

  private getGroup(request: E): ITupleSpaceService<E, T> {
    for (const group of this.groups) {
      if (group.group === request) {
        return group;
      }
    }
    return null;
  }
}
