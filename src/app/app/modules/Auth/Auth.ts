import { GuardOptions } from "@mods_/System/model/RouteGuardManager/interfaces/ValidationGuardOptions";

/**
 *
 */
export interface IAuthorization<T> {
  isAuthorized(payload: T, routePerms: string[]): GuardOptions;
}

/**
 *
 */
export interface IAuthenticator<E> {
  authenticate(resource: IAuthenticationProfile): E;
  asyncAuthenticate(resource: IAuthenticationProfile): Promise<E>;
}

/**
 *
 */
export interface IAuthenticationFacade<T, E> extends IAuthenticator<E> {
  getToken(authorizationHeader: string): string;
  isAuthenticated(resource: T): boolean;
  getPayload(authToken: T): IAuthenticationProfile;
}

/**
 *
 */
export interface ITokenizer<T, E> {
  sign(resource: T): E;
  verify(token: E, claim: any): boolean;
  decode(token: E, claim: any): T;
}

/**
 *
 */
export interface ICriticalKeyProvider {
  privatek: any;
  publick: any;
  type: string;
}

/**
 *
 */
export enum AuthHeader {
  AUTHORIZATION = "Authorization"
}

/**
 *
 */
export interface IAuthPayloadFactory {
  build(data: any): any;
}

/**
 *
 */
export interface IAuthenticationProfile {
  authData: any;
}

/**
 *
 */
export class AuthTokenContainer {
  /**
   * @param tokenId token value
   * @param expiresIn 604800 1 week
   */
  constructor(private tokenId: any, private expiresIn: string = "604800") {}
}
