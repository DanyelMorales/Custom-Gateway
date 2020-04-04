import { JSONType } from "@utils/JSONUtils";
import { EventEmitter } from "events";
export class ActionFilter extends EventEmitter {
  protected filters: JSONType<string, Function>;

  constructor() {
    super();
    this.filters = new JSONType<string, Function>();
  }

  addFilter(key: string, value: Function): ActionFilter {
    this.filters.put(key, value);
    return this;
  }
  /**
   *
   * @param key
   * @param data indice 0 deberia ser el principal dato a retornar, el resto son opciones
   * @returns indice 0 del arreglo de argumentos que se ha pasado,
   * si no existe filtro alguno
   */
  applyFilter(key: string, ...data: any[]): any {
    if (!this.filters.has(key)) {
      return data[0];
    }
    const fx: Function = this.filters.get(key);
    const result: any = fx.apply(fx, data);
    this.emit(key, result);
    return result;
  }
}
