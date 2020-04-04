import * as Proxy from './../GenericProxy';

/**
 *
 */
export interface IRouteContainer {
    container: any;
    add(route: string): IRouteContainer;
    merge(routes: string[]): IRouteContainer;
    has(name: string): boolean;
    build(endpoint: string): Proxy.IProxyRoute;
    remove(endpoint: string): IRouteContainer;
}

/**
 *
 */
export interface IRouteFactory {
    build(endpoint: string): Proxy.IProxyRoute;
}


