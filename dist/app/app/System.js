"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _servicemanager_1 = require("@servicemanager");
const ConfigManager_1 = require("@utils/ConfigManager");
const JSONUtils_1 = require("@utils/JSONUtils");
const ProxyFacade_1 = require("@proxy/ProxyFacade");
const RouteFactory_1 = require("@proxy/RouteFactory");
const PublicRouteGuard_1 = require("@guards/PublicRouteGuard");
const annotationSG = require("@annotated/SystemGlobal");
const events_1 = require("events");
const System_1 = require("@/System");
const System_2 = require("@/System");
const Express_1 = require("@proxy/ExpressRequest/Express");
/**
 * Globales
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 */
class AppServices {
}
AppServices.ConfigManager = "ConfigManager";
AppServices.RouteFactory = "RouteFactory";
AppServices.RouteGuardManager = "RouteGuardManager";
AppServices.ProxyFacade = "ProxyFacade";
AppServices.ProxyService = "ProxyService";
AppServices.helloworld = "helloworld";
AppServices.PayloadFactory = "PayloadFactory";
AppServices.SystemEnvironmentData = "SystemEnvironmentData";
AppServices.ROUTES_MIDDLEWARE = "routes";
AppServices.MICROSERVICES_MIDDLEWARE = "microservices";
AppServices.DECLARATIONS_MIDDLEWARE = "declarations";
AppServices.ServiceManager = "ServiceManager";
AppServices.TreeParserProvider = "TreeParserProvider";
AppServices.___MENU_TREE_GUARD___ = "___MENU_TREE_GUARD___";
AppServices.__PAYLOAD__ = "__PAYLOAD__";
exports.AppServices = AppServices;
var AppServicesEvent;
(function (AppServicesEvent) {
    AppServicesEvent["RouteWrapper"] = "RouteWrapperInitialized";
    AppServicesEvent["ServiceManager"] = "ServiceManagerInitialized";
})(AppServicesEvent = exports.AppServicesEvent || (exports.AppServicesEvent = {}));
class Globals {
    static bootstrap(serviceData) {
        serviceData = ServiceBootstrap.hasInstance()
            ? null
            : new JSONUtils_1.JSONType(serviceData);
        const theInstance = ServiceBootstrap.instance(serviceData);
        Globals.EV.emit(Globals.ON_READY, theInstance);
        System_2.EventBus.emit(Globals.ON_READY, theInstance);
        return theInstance;
    }
    static instance() {
        if (ServiceBootstrap.hasInstance()) {
            return ServiceBootstrap.instance(null);
        }
        return null;
    }
}
Globals.ON_READY = "ON_READY";
Globals.EV = new events_1.EventEmitter();
exports.Globals = Globals;
/**
 * Clase con operaciones staticas que retornar servicios.
 * La clase tiene constructor privado de modo que es un singleton que debe ser usado
 * con responsabilidad.
 *
 * Se accesa mediante el método static isntance:
 * - AppServiceContainer.instance.operaciondeseada();
 */
class ServiceBootstrap {
    /**
     * Eliminamos la posibilidad de construir una instancia
     */
    constructor(defValues) {
        this.defValues = defValues;
        this.smm = new ServiceManagerMiddleware(defValues);
    }
    /**
     * Devolvemos una sola instancia, si no existe se crea si existe se retorna.
     */
    static instance(defValues) {
        if (!ServiceBootstrap.hasInstance()) {
            ServiceBootstrap.myowninstance = new ServiceBootstrap(defValues);
        }
        return ServiceBootstrap.myowninstance;
    }
    /**
     * Retorna false si no posee instancia de lo contrario retorna true.
     */
    static hasInstance() {
        if (ServiceBootstrap.myowninstance === null) {
            return false;
        }
        return true;
    }
    get serviceManager() {
        return this.smm.serviceManager;
    }
}
// almacena la instancia del singleton
ServiceBootstrap.myowninstance = null;
exports.ServiceBootstrap = ServiceBootstrap;
/**
 * Clase intermediaria que posee el service manager que utilizarán los decoradores.
 */
class ServiceManagerMiddleware {
    constructor(defValues) {
        this.defValues = defValues;
        this.sm = new _servicemanager_1.SuperServiceManager();
        this.subscribeInitializer();
        this.initializeSM();
    }
    get serviceManager() {
        return this.sm;
    }
    initializeSM() {
        // SystemEnvironmentData
        const runningMode = process.env.RMODE;
        // ProxyFacade
        const facade = new ProxyFacade_1.ProxyFacade();
        // ConfigManager
        const systemGlobal = annotationSG.build(this.defValues.get("globals"));
        // ConfigManager should be the very first  services to be injected
        this.sm.add(AppServices.SystemEnvironmentData, systemGlobal);
        this.sm.addProvider(new ConfigManager_1.ConfigManagerProvider(this.defValues.get("ConfigManager"), systemGlobal.projectRoot));
        this.sm.addProvider(new RouteFactory_1.RouteServiceProvider());
        this.sm.addProvider(new Express_1.PayloadFactoryProvider(runningMode));
        //  RouteGuardManager
        const routeGuardManager = new System_1.RouteGuardManager();
        routeGuardManager.add(new PublicRouteGuard_1.PublicRouteGuard(), 100);
        this.sm
            .add(AppServices.helloworld, "HELLO WORLD")
            .add(AppServices.ProxyFacade, facade);
        this.sm.add(AppServices.RouteGuardManager, routeGuardManager);
        // SYSTEM TUPLE SPACE
        System_2.$TUPLE_SPACE.addService(System_2.$SYMB.$GLOBAL, System_2.$SYMB.$SERVICE_MANAGER, this.sm);
        System_2.$TUPLE_SPACE.addService(System_2.$SYMB.$HEADER, System_2.$SYMB.$PAYLOAD, new System_2.BasePayload({}));
        System_2.$TUPLE_SPACE.addService(System_2.$SYMB.$GLOBAL, System_2.$SYMB.$EVENT, System_2.EventBus);
    }
    subscribeInitializer() {
        Globals.EV.on(Globals.ON_READY, $instance => {
            const sm = $instance.serviceManager;
            sm.remove(AppServices.TreeParserProvider);
            sm.add(AppServices.TreeParserProvider, new System_1.TreeParserProvider(sm.get(AppServices.ConfigManager)));
        });
    }
}
exports.ServiceManagerMiddleware = ServiceManagerMiddleware;
//# sourceMappingURL=System.js.map