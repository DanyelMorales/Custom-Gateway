/**
 * Anotación que carga un archivo JSON y lo coloca en el target
 *
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 * @fileToRead Nombre del archivo que desea ser cargado, sin la extensión json
 * @whereToSet nombre de la variable donde será colocado el contenido del archivo
 */

/**
 * Se cargan las dependencias del sistema
 */
const fs = require("fs");
// const pathToRoot = __dirname + "/../";
import { EventEmitter } from "events";
export * from "./IJsonType";

export class JsonUtils {
  static extractJSONFromMethod(
    context: any,
    originalMethod: any,
    path: string
  ): any {
    const jsonValue = originalMethod.apply(context, arguments);
    const wrapper = new JsonWrapper(jsonValue);
    return wrapper.readCycl(path);
  }
}

/**
 * Wrapper de lecturas JSON
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 */
export class JsonWrapper extends EventEmitter {
  static readonly ON_NOT_FOUND_SEEKING: string = "SEEKING@RESULT_NOT_FOUND";
  static readonly ON_VERSION_NOT_FOUND_SEEKING: string = "SEEKING@VERSION_NOT_FOUND";
  static readonly ON_BEFORE_SEEKING: string = "SEEKING@BEFORE_SEEKING";
  static readonly ON_RESULT_SEEKING: string = "SEEKING@RESULT_FOUND";

  /**
   * @param json contenido json
   */
  constructor(private json: any) {
    super();
  }

  set jsonObj(value: any) {
    this.json = value;
  }

  /**
   * Busca dentro de una cadena de llaves, utilizando cada llave una version dentro de una pila de datos.
   */
  readCycl(needlesPath: string, version: string = null, haystack: any = false) {
    const needles = needlesPath.split(">");
    for (const needle of needles) {
      haystack = this.read(needle, version, haystack);
    }
    return haystack;
  }

  /**
   * Busca una llave de una pila de datos, si no se asigna datos entonces se utiliza el pasado como
   * argumento a la clase.
   *
   * @param needle
   * @param version
   * @param haystack
   */
  read(needle: string, version: string = null, haystack: any = false) {
    if (!haystack) {
      haystack = this.json;
    }
    return this.seek(needle, version, haystack);
  }

  toJSON(): any {
    return this.json;
  }

  get haystack(): any {
    return this.json;
  }
  /**
   * @param needle   que se va a buscar
   * @param version   que version se va a buscar
   * @param haystack de donde se va a buscar
   *
   * @return si existe la version se retorna, si no se retorna sin version
   */
  seek(needle: string, version: string = "", haystack: any) {
    this.emit(JsonWrapper.ON_BEFORE_SEEKING, needle, version);
    if (typeof haystack[needle] === "undefined") {
      this.emit(JsonWrapper.ON_NOT_FOUND_SEEKING, needle);
      return;
    }

    const newhaystack = haystack[needle];
    if (typeof newhaystack[version] === "undefined") {
      this.emit(JsonWrapper.ON_VERSION_NOT_FOUND_SEEKING, needle, version);
      return newhaystack;
    }

    const result = newhaystack[version];
    if (typeof result === "object") {
      result["parent"] = version;
      result["needle"] = needle;
      this.decorateMatch(newhaystack, result, "common");
    }

    this.emit(JsonWrapper.ON_RESULT_SEEKING, needle, version, result);
    return result;
  }

  findParentCycl(needlesPath: string, haystack: any = null) {
    haystack = haystack === null ? this.json : haystack;
    const needles = needlesPath.split(">");
    for (const needle of needles) {
      haystack = this.findParent(needle, haystack);
    }
    return haystack;
  }

  findParent(needle: string, haystack: any = null) {
    haystack = haystack === null ? this.json : haystack;
    for (const index in haystack) {
      if (index === needle) {
        return haystack[index];
      }
    }
    return haystack;
  }

  decorateMatch(haystack: any, match: any, needle: string): any {
    if (typeof haystack[needle] !== "undefined") {
      match[needle] = haystack[needle];
    }
    return match;
  }

  findByAttrIM(attr: string, haystack: any = null): JsonResult {
    haystack = haystack === null ? this.json : haystack;
    const result = new JsonResult();
    for (const index in haystack) {
      if (
        typeof haystack[index] === "undefined" ||
        typeof haystack[index][attr] === "undefined"
      ) {
        continue;
      }
      const currentMatch = { ...haystack[index] };
      const attrMatched = { ...currentMatch[attr] };
      attrMatched["parent"] = index;
      attrMatched["name"] = attr;
      result.haystack = currentMatch;
      result.result = attrMatched;
      result.isFound = true;
      result.name = attr;
      result.parent = index;
      break;
    }

    return result;
  }

  /**
   * @deprecated
   * @param attr
   * @param haystack
   */
  findByAttr(attr: string, haystack: any = null) {
    haystack = haystack === null ? this.json : haystack;
    for (const index in haystack) {
      if (
        typeof haystack[index] === "undefined" ||
        typeof haystack[index][attr] === "undefined"
      ) {
        continue;
      }

      const currentHaystack = haystack[index];
      const currentMatch = currentHaystack[attr];
      currentMatch["parent"] = index;
      currentMatch["name"] = attr;
      return currentMatch;
    }

    return haystack;
  }
}

export class JsonResult {
  private _result: any;
  public get result(): any {
    return this._result;
  }
  public set result(v: any) {
    this._result = v;
  }

  private _isFound: boolean = false;
  public get isFound(): boolean {
    return this._isFound;
  }
  public set isFound(v: boolean) {
    this._isFound = v;
  }

  private _parent: string;
  public get parent(): string {
    return this._parent;
  }
  public set parent(v: string) {
    this._parent = v;
  }

  private _haystack: any;
  public get haystack(): any {
    return this._haystack;
  }
  public set haystack(v: any) {
    this._haystack = v;
  }

  private _name: string;
  public get name(): string {
    return this._name;
  }
  public set name(v: string) {
    this._name = v;
  }
}

/**
 * Lector de archivos json
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 */
export class JsonReader {
  private fileName: string;
  private extension: string = ".json";

  /**
   * @param fileToRead archivo que se cargará
   * @param useReader true si se necesita un wrapper o false de lo contrario.
   */
  constructor(private fileToRead: string, private useReader: boolean = false) {
    this.formatFileName();
  }

  private formatFileName() {
    this.fileName = this.fileToRead + this.extension;
  }

  /**
   * Leer archivo
   */
  readFile(): any {
    const json: any = JSON.parse(fs.readFileSync(this.fileName, "utf8"));
    if (this.useReader) {
      return new JsonWrapper(json);
    }
    return json;
  }

  get dataSource(): string {
    return this.fileToRead;
  }

  set dataSource(data: string) {
    this.fileToRead = data;
    this.formatFileName();
  }
}
