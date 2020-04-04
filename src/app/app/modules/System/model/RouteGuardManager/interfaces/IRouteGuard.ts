import { GuardOptions } from "./ValidationGuardOptions";
import { ActionFilter } from "@utils/ActionFIlter";
/**
 * @param T tipo de ruta que se pretende verificar
 */
export interface IRouteGuard<T> {
  messages: string[];
  isAllowed(route: T): GuardOptions;
}

export abstract class AbstractRouteGuard<T> extends ActionFilter
  implements IRouteGuard<T>{
  protected _messages: string[] = [];
  get messages(): string[] {
    return this._messages;
  }
  protected reset() {
    this._messages = [];
  }

  abstract isAllowed(route: T): GuardOptions;
}