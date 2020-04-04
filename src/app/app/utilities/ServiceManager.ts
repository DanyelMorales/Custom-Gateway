import { IJSONType, JSONType } from "@utils/JSONUtils";
import EventBus from "@utils/EventBus";

/**
 * Administra servicios de cualquier tipo.
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 */
export interface IServiceManager<T> {
  add(key: T, value: any): IServiceManager<T>;
  remove(key: T): IServiceManager<T>;
  get(key: T): any;
  addAll(json: any): IServiceManager<T>;
  has(key: T): boolean;
}

/**
 *
 */
export interface IServiceManagerProvider<T> {
  getServiceManager(): ServiceManager<T>;
  initializeSM();
}

export interface IServiceProviderDelegator {
  iCanDelegate: string[];
  delegate(name: string, context?: ISuperServiceManager<string>): any;
}

export class ServiceManager<TYPE> implements IServiceManager<TYPE> {
  protected services: any = {};

  add(key: TYPE | string, value: any): IServiceManager<TYPE> {
    if (this.has(<TYPE>key)) {
      throw Error("Service Already defined ");
    }
    this.services[key] = value;
    return this;
  }
  remove(key: TYPE): IServiceManager<TYPE> {
    delete this.services[key];
    return this;
  }
  get(key: TYPE): any {
    if (typeof this.services[key] === "undefined") {
      return null;
    }
    return this.services[key];
  }

  addAll(json: any): IServiceManager<TYPE> {
    for (const index in json) {
      if (json[index] !== null) {
        this.add(index, json[index]);
      }
    }
    return this;
  }

  has(key: TYPE): boolean {
    return typeof this.services[key] === "undefined" ? false : true;
  }
}

export interface ISuperServiceManager<TYPE> {
  removeDelegator(delegatorType: String);
  addProvider(delegator: IServiceProviderDelegator);
  get(key: TYPE | string): any;
  hasProviderForService(service: string): boolean;
  getDelegator(delegatorType: String): any;
}

export class SuperServiceManager<TYPE> extends ServiceManager<TYPE>
  implements ISuperServiceManager<TYPE> {
  readonly AFTER_DELEGATION: string = "SERVICE_MANAGER_AFTER_DELEGATION";

  private providedServices: string[] = [];
  private delegatorContainer: {
    delegator: IServiceProviderDelegator;
    services: string[];
  }[] = [];

  constructor() {
    super();
  }

  getDelegator(delegatorType: String): any {
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

  removeDelegator(delegatorType: String) {
    const delegator = this.getDelegator(delegatorType);
    const i = this.delegatorContainer.indexOf(delegator);
    if (i > -1 && delegator !== null) {
      this.providedServices = this.providedServices.filter(
        axx => delegator.services.indexOf(axx) > -1
      );
      this.delegatorContainer.splice(i, 1);
    }
    return this;
  }

  /**
   * A service could be served by any provider
   */
  get(key: TYPE | string): any {
    const service = super.get(<TYPE>key);
    if (service !== null) {
      return service;
    }

    if (!this.hasProviderForService(<string>key)) {
      return null;
    }

    // looking for a provider
    for (const item of this.delegatorContainer) {
      if (item.services.indexOf(<string>key) > -1) {
        const serviceResult = item.delegator.delegate(<string>key, this);
        return EventBus.applyFilter(this.AFTER_DELEGATION, serviceResult, key);
      }
    }

    return null;
  }

  has(key: TYPE | string): boolean {
    const dadaHasIt: boolean = super.has(<TYPE>key);
    if (dadaHasIt) {
      return true;
    }
    return this.providedServices.indexOf(<string>key) > -1;
  }

  hasProviderForService(service: string): boolean {
    return this.providedServices.indexOf(service) > -1;
  }

  addProvider(delegator: IServiceProviderDelegator): SuperServiceManager<TYPE> {
    const container = {
      delegator: delegator,
      services: delegator.iCanDelegate
    };
    if (container.services.every(this.hasProviderForService.bind(this))) {
      throw Error(
        "A delegator is already handling services for: " +
          container.services.join(",")
      );
    }
    this.delegatorContainer.push(container);
    this.providedServices = this.providedServices.concat(
      delegator.iCanDelegate
    );
    return this;
  }
}
