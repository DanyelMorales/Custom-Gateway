import { JsonWrapper, JsonReader, IJSONType } from "@utils/JSONUtils";
const nodePath = require("path");
import { IServiceProviderDelegator } from "./ServiceManager";
import { AppServices } from "@system";

export class ConfigManagerProvider implements IServiceProviderDelegator {
  constructor(private data: {}, private root: string) {}

  get iCanDelegate(): string[] {
    return [
      AppServices.ConfigManager,
      AppServices.ROUTES_MIDDLEWARE,
      AppServices.MICROSERVICES_MIDDLEWARE,
      AppServices.DECLARATIONS_MIDDLEWARE
    ];
  }

  delegate(name: string): any {
    const configManager: ConfigManager = new ConfigManager(
      this.data,
      this.root
    );
    if (name === AppServices.ConfigManager) {
      return configManager;
    }
    return configManager.getWrapper(name);
  }

  set _data_(value) {
    this.data = value;
  }

  set _root_(value) {
    this.root = value;
  }
}

/**
 * Carga una configuracion deseada basandose en los paths
 * que se ha almacenado en el arreglo de paths.
 *
 * Si no existe un wrapper en el contenedor entonces se carga y se almacena,
 * si existiera un wrapper entonces se retorna el contenido.
 *
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 */
export class ConfigManager {
  // almacena los nombres de los wrappers que han sido cargados
  private loadedWrapper: string[];

  // almacena los wrappers como tal
  private wrappers: any;

  constructor(private paths: any, private basePath: string = null) {
    this.initialize();
  }

  /**
   * Verifica si existe el wrapper ya cargado
   * @param index nombre del wrapper
   */
  isLoaded(index: string): boolean | number {
    const theindex = this.loadedWrapper.indexOf(index);
    return theindex > -1 ? theindex : false;
  }

  /**
   * Carga el wrapper basandose en el nombre del indice en el path.
   * Almacena el nombre en el arreglo de wrappers.
   * ALmacena el wrapper en el objeto de wrappers.
   */
  loadWrapper(wrapperName: string): JsonWrapper {
    if (typeof this.paths[wrapperName] === "undefined") {
      return null;
    }
    let wrapperStrName = this.paths[wrapperName];
    if (this.basePath !== null) {
      wrapperStrName = nodePath.join(this.basePath, wrapperStrName);
    }
    const jsonReader: JsonReader = new JsonReader(wrapperStrName, true);
    const json: any = jsonReader.readFile();

    this.wrappers[wrapperName] = json;
    this.loadedWrapper.push(wrapperName);

    return json;
  }

  /**
   * Remueve un wrapper de los contenedores
   * @param indexName
   */
  removeWrapper(indexName: string): boolean {
    const index = this.isLoaded(indexName);

    if (index === false) {
      return false;
    }

    delete this.loadedWrapper[<number>index];
    delete this.wrappers[indexName];

    return true;
  }

  private initialize(): void {
    this.wrappers = {};
    this.loadedWrapper = [];
  }
  /**
   * Remueve todos los wrappers
   */
  removeAll(): void {
    delete this.wrappers;
    delete this.loadedWrapper;
    this.initialize();
  }
  /**
   * Carga un wrapper utilizando un alias que apunta a un path de configuracion.
   * Si ya se ha cargado el wrapper entonces se retorna el que este almacenado, de otro
   * modo se carga y se almacena en el contenedor de wrappers.
   *
   * @param indexName nombre de alias para una ruta de configuracion.
   **/
  getWrapper(indexName: string): JsonWrapper {
    if (!this.isLoaded(indexName)) {
      return this.loadWrapper(indexName);
    }
    return this.wrappers[indexName];
  }

  /**
   * @returns path collection
   */
  get _paths_(): any {
    return this.paths;
  }

  set _basePath_(value: string) {
    this.basePath = value;
  }
}
