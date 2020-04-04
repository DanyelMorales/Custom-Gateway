/**
 * El proposito de esta clase es armar un objeto
 * que simule y actue como un request de Express.
 *
 * @author Daniel Vera Morales
 */
export class ExpressRequest {
  private _data: any = {};
  constructor(data: any = null) {
    this.dispose();
    if (data !== null) {
      this._data = data;
    }
  }

  private addToContainer(index: string, key: string, value: string) {
    const container =
      typeof this._data[index] === "undefined" ? {} : this._data[index];
    container[key] = value;
    this._data[index] = container;
  }

  /**
   * Añadir cabecera http
   * @param key
   * @param value
   */
  addHeader(key: string, value: string) {
    this.addToContainer("headers", key, value);
  }

  /**
   * Añadir una cookie
   * @param key
   * @param value
   */
  addCookie(key: string, value: string) {
    this.addToContainer("cookies", key, value);
  }

  /**
   * Añadir un query request
   * @param key
   * @param value
   */
  addQuery(key: string, value: string) {
    this.addToContainer("query", key, value);
  }

  /**
   * Añadir valores form request
   * @param key
   * @param value
   */
  addBody(key: string, value: string) {
    this.addToContainer("body", key, value);
  }

  dispose() {
    this._data = {
      method: "",
      body: {},
      query: {},
      headers: {},
      cookies: {}
    };
  }

  set method(value: string) {
    this._data["method"] = value;
  }

  /**
   * Añadir datos al cuerpo del request
   */
  set body(value: any) {
    this._data["body"] = value;
  }

  set query(value: any) {
    this._data["query"] = value;
  }

  set headers(value: any) {
    this._data["headers"] = value;
  }

  set cookies(value: any) {
    this._data["cookies"] = value;
  }

  build(): any {
    return this._data;
  }
}
