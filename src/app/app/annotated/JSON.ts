import {JsonWrapper, JsonReader, JsonUtils } from '@utils/JSONUtils';
/***
 * Anotación para lecturas de JSON
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 */
class JsonAnnotated {
  /**
   *
   * @param whereToSet variable donde se almacenará la lectura del json
   * @param reader lector de json files
   */
  constructor(
    private whereToSet: string,
    private reader: JsonReader,
    private opts: any = null
  ) {}
  /**
   * Helper para ejecución desde un metodo
   */
  method(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    target[this.whereToSet] = this.reader.readFile();
  }
  /**
   * Helper de ejecución desde una clase
   */
  clazz(constructor: Function) {
    constructor.prototype[this.whereToSet] = this.reader.readFile();
  }

  /**
   * Lee una configuracion, busca un indice en cadena con una version y lo coloca en una variable.
   */
  clazzChain(constructor: Function) {
    const wrapper = this.reader.readFile();
    const results = this.readCycl(wrapper, constructor.prototype);
    if (!results) {
      return;
    }
    constructor.prototype[this.whereToSet] = results;
  }

  private readCycl(wrapper: any, context: any = false): any {
    if (this.opts == null || wrapper === null) {
      return false;
    }

    const readFromvar = typeof this.opts["var"] !== 'undefined' && this.opts["var"] === true;
    let path = this.opts["path"];
    let version = this.opts["version"];

    if (path === null || version === null || (readFromvar && !context)) {
      return false;
    }

    if (readFromvar) {
      path = context[path];
      version = context[version];
    }

    return wrapper.readCycl(path, version);
  }

  /**
   * Lee el archivo desde un atributo en la clase objetivo.
   * El archivo leeido se coloca en el reader y se invoca una invocacion
   * clazzchain.
   */
  dataFromAttr(target: any, key: string) {
    let value = target[key];
    const self = this;
    const myreader = this.reader;

    const getter = function() {
      return value;
    };

    const setter = function(newVal) {
      myreader.dataSource = newVal;
      const wrapper = myreader.readFile();
      const results = self.readCycl(wrapper, this);
      value = (results) ? results : wrapper;
    };

    if (delete target[key]) {
      Object.defineProperty(target, key, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true
      });
    }
  }
}

const annotation = (
  fileToRead: string,
  whereToSet: string,
  useReader: boolean = false
) => {
  const reader: JsonReader = new JsonReader(fileToRead, useReader);
  const obj: JsonAnnotated = new JsonAnnotated(whereToSet, reader);
  return obj.clazz.bind(obj);
};

const annotation_find = (
  fileToRead: string,
  whereToSet: string,
  path: string,
  mode: string
) => {
  const reader: JsonReader = new JsonReader(fileToRead, true);
  const obj: JsonAnnotated = new JsonAnnotated(whereToSet, reader, [path, mode]);
  return obj.clazzChain.bind(obj);
};

const annotation_invoke = (
  useReader: boolean = false,
  opts: any = null
) => {
  const reader: JsonReader = new JsonReader(null, useReader);
  const obj: JsonAnnotated = opts == null ? new JsonAnnotated(null, reader) : new JsonAnnotated(null, reader, opts);
  return obj.dataFromAttr.bind(obj);
};

const methodInvokation = (
  path: string
 ) => {
   return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
           const originalMethod = descriptor.value;
           descriptor.value = function () {
              return JsonUtils.extractJSONFromMethod(this, originalMethod, path);
           }
    };
};

/**
 * Empaquetado
 */
export = {
  GJSON: annotation_find,
  JSON: annotation,
  TAKE_AS_NAME: annotation_invoke,
  JsonAnnotated: JsonAnnotated,
  JsonReader: JsonReader,
  JsonWrapper: JsonWrapper,
  MethodExtract: methodInvokation
};
