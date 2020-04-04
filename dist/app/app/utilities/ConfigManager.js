"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSONUtils_1 = require("@utils/JSONUtils");
const nodePath = require("path");
const _system_1 = require("@system");
class ConfigManagerProvider {
    constructor(data, root) {
        this.data = data;
        this.root = root;
    }
    get iCanDelegate() {
        return [
            _system_1.AppServices.ConfigManager,
            _system_1.AppServices.ROUTES_MIDDLEWARE,
            _system_1.AppServices.MICROSERVICES_MIDDLEWARE,
            _system_1.AppServices.DECLARATIONS_MIDDLEWARE
        ];
    }
    delegate(name) {
        const configManager = new ConfigManager(this.data, this.root);
        if (name === _system_1.AppServices.ConfigManager) {
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
exports.ConfigManagerProvider = ConfigManagerProvider;
/**
 * Carga una configuracion deseada basandose en los paths
 * que se ha almacenado en el arreglo de paths.
 *
 * Si no existe un wrapper en el contenedor entonces se carga y se almacena,
 * si existiera un wrapper entonces se retorna el contenido.
 *
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 */
class ConfigManager {
    constructor(paths, basePath = null) {
        this.paths = paths;
        this.basePath = basePath;
        this.initialize();
    }
    /**
     * Verifica si existe el wrapper ya cargado
     * @param index nombre del wrapper
     */
    isLoaded(index) {
        const theindex = this.loadedWrapper.indexOf(index);
        return theindex > -1 ? theindex : false;
    }
    /**
     * Carga el wrapper basandose en el nombre del indice en el path.
     * Almacena el nombre en el arreglo de wrappers.
     * ALmacena el wrapper en el objeto de wrappers.
     */
    loadWrapper(wrapperName) {
        if (typeof this.paths[wrapperName] === "undefined") {
            return null;
        }
        let wrapperStrName = this.paths[wrapperName];
        if (this.basePath !== null) {
            wrapperStrName = nodePath.join(this.basePath, wrapperStrName);
        }
        const jsonReader = new JSONUtils_1.JsonReader(wrapperStrName, true);
        const json = jsonReader.readFile();
        this.wrappers[wrapperName] = json;
        this.loadedWrapper.push(wrapperName);
        return json;
    }
    /**
     * Remueve un wrapper de los contenedores
     * @param indexName
     */
    removeWrapper(indexName) {
        const index = this.isLoaded(indexName);
        if (index === false) {
            return false;
        }
        delete this.loadedWrapper[index];
        delete this.wrappers[indexName];
        return true;
    }
    initialize() {
        this.wrappers = {};
        this.loadedWrapper = [];
    }
    /**
     * Remueve todos los wrappers
     */
    removeAll() {
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
    getWrapper(indexName) {
        if (!this.isLoaded(indexName)) {
            return this.loadWrapper(indexName);
        }
        return this.wrappers[indexName];
    }
    /**
     * @returns path collection
     */
    get _paths_() {
        return this.paths;
    }
    set _basePath_(value) {
        this.basePath = value;
    }
}
exports.ConfigManager = ConfigManager;
//# sourceMappingURL=ConfigManager.js.map