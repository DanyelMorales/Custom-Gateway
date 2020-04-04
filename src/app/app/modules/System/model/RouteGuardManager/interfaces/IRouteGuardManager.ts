import { IRouteGuard } from "./IRouteGuard";
import { PriorityQueue, IPriorityQueue } from "@utils/PriorityQueue";
/**
 * @param T tipo de las rutas
 * @param E tipo del contenedor de rutas dentro del middleware
 */
export interface IRouteGuardManager<T, E> extends IPriorityQueue<E> {
  isAllowed(route: T): boolean;
}
