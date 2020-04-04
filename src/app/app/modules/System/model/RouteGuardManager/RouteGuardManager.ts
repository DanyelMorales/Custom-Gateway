import { IRouteGuardManager } from "@mods_/System/model/RouteGuardManager/interfaces/IRouteGuardManager";
import { GuardOptions } from "./interfaces/ValidationGuardOptions";
import { IRouteGuard } from "./interfaces/IRouteGuard";
import { PayloadWrapper } from "@proxy/GenericProxy";
import { PriorityQueue } from "@utils/PriorityQueue";
import { ActionFilter } from "@utils/ActionFIlter";

/**
 * Administra los verificadores de rutas
 */
export class RouteGuardManager extends ActionFilter
  implements IRouteGuardManager<PayloadWrapper, IRouteGuard<PayloadWrapper>> {
  readonly ON_ALLOWED: string = "ALLOWED_ROUTE";
  readonly ON_NOT_ALLOWED: string = "NOT_ALLOWED_ROUTE";
  readonly FILTER_NO_GUARDS: string = "FILTER_NO_GUARDS";
  readonly FOR_EMPTY_GUARDS: boolean = true;

  private queue: PriorityQueue<IRouteGuard<PayloadWrapper>>;

  constructor() {
    super();
    this.queue = new PriorityQueue<IRouteGuard<PayloadWrapper>>();
  }

  /**
   * @param route a verificar
   * @returns true si no se encontró algún validador que retorne true o si algún validador dijo explicitamente que no es valido.
   */
  isAllowed(route: PayloadWrapper): boolean {
    if (this.isEmpty()) {
      return this.applyFilter(this.FILTER_NO_GUARDS, this.FOR_EMPTY_GUARDS);
    }
    const _result_: any[] = [route, "ROUTE_MANAGER", ["REQUEST NOT VERIFIED"]];
    for (const item of this.get()) {
      const result = item.isAllowed(route);
      if (result === GuardOptions.CONTINUE) {
        continue;
      }
      _result_[1] = item.constructor.name;
      _result_[2] = item.messages;
      if (result === GuardOptions.ACCEPT) {
        this.emit(this.ON_ALLOWED, _result_);
        return true;
      } else if (result === GuardOptions.DIE) {
        this.emit(this.ON_NOT_ALLOWED, _result_);
        return false;
      }
    }

    this.emit(this.ON_NOT_ALLOWED, _result_);
    return false;
  }

  add(
    value: IRouteGuard<PayloadWrapper>,
    priority: number = 0
  ): RouteGuardManager {
    this.queue.add(value, priority);
    return this;
  }

  remove(value: IRouteGuard<PayloadWrapper>): RouteGuardManager {
    this.queue.remove(value);
    return this;
  }

  clearAll(): void {
    this.queue.clearAll();
  }

  get(): IRouteGuard<PayloadWrapper>[] {
    return this.queue.get();
  }

  isEmpty(): boolean {
    return this.queue.isEmpty();
  }
}
