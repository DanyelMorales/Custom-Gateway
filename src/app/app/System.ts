import {
  IServiceManagerProvider,
  ServiceManager,
  IServiceProviderDelegator,
  SuperServiceManager
} from "@servicemanager";
import { ConfigManager, ConfigManagerProvider } from "@utils/ConfigManager";
import { IJSONType, JSONType } from "@utils/JSONUtils";
import { ProxyFacade } from "@proxy/ProxyFacade";
import { PayloadFactory } from "@proxy/ExpressRequest/Express";
import services = require("@annotated/initializers/ServiceManager");
import { Log } from "@root/SystemLog";
import { RouteFactory, RouteServiceProvider } from "@proxy/RouteFactory";
import { PublicRouteGuard } from "@guards/PublicRouteGuard";
import { IGlobalFieldContainer } from "./SystemGlobal";
const annotationSG = require("@annotated/SystemGlobal");
import { EventEmitter } from "events";
import { TreeParserProvider, RouteGuardManager } from "@/System";
import { BasePayload, $SYMB, $TUPLE_SPACE, EventBus } from "@/System";
import { PayloadFactoryProvider } from "@proxy/ExpressRequest/Express";

/**
 * Globales
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 */
export class AppServices {
  static readonly ConfigManager: string = "ConfigManager";
  static readonly RouteFactory: string = "RouteFactory";
  static readonly RouteGuardManager: string = "RouteGuardManager";
  static readonly ProxyFacade: string = "ProxyFacade";
  static readonly ProxyService: string = "ProxyService";
  static readonly helloworld: string = "helloworld";
  static readonly PayloadFactory: string = "PayloadFactory";
  static readonly SystemEnvironmentData: string = "SystemEnvironmentData";
  static readonly ROUTES_MIDDLEWARE: string = "routes";
  static readonly MICROSERVICES_MIDDLEWARE: string = "microservices";
  static readonly DECLARATIONS_MIDDLEWARE: string = "declarations";
  static readonly ServiceManager: string = "ServiceManager";
  static readonly TreeParserProvider: string = "TreeParserProvider";
  static readonly ___MENU_TREE_GUARD___: string = "___MENU_TREE_GUARD___";
  static readonly __PAYLOAD__: string = "__PAYLOAD__";
}

export enum AppServicesEvent {
  RouteWrapper = "RouteWrapperInitialized",
  ServiceManager = "ServiceManagerInitialized"
}

export class Globals {
  static readonly ON_READY: string = "ON_READY";
  static readonly EV = new EventEmitter();

  static bootstrap(serviceData: any) {
    serviceData = ServiceBootstrap.hasInstance()
      ? null
      : new JSONType<string, any>(serviceData);
    const theInstance = ServiceBootstrap.instance(serviceData);
    Globals.EV.emit(Globals.ON_READY, theInstance);
    EventBus.emit(Globals.ON_READY, theInstance);
    return theInstance;
  }

  static instance() {
    if (ServiceBootstrap.hasInstance()) {
      return ServiceBootstrap.instance(null);
    }
    return null;
  }
}

/**
 * Clase con operaciones staticas que retornar servicios.
 * La clase tiene constructor privado de modo que es un singleton que debe ser usado
 * con responsabilidad.
 *
 * Se accesa mediante el método static isntance:
 * - AppServiceContainer.instance.operaciondeseada();
 */
export class ServiceBootstrap {
  // almacena la instancia del singleton
  private static myowninstance = null;
  private smm: ServiceManagerMiddleware;
  /**
   * Devolvemos una sola instancia, si no existe se crea si existe se retorna.
   */
  static instance(defValues: IJSONType<string, any>): ServiceBootstrap {
    if (!ServiceBootstrap.hasInstance()) {
      ServiceBootstrap.myowninstance = new ServiceBootstrap(defValues);
    }
    return ServiceBootstrap.myowninstance;
  }

  /**
   * Retorna false si no posee instancia de lo contrario retorna true.
   */
  static hasInstance(): boolean {
    if (ServiceBootstrap.myowninstance === null) {
      return false;
    }
    return true;
  }

  /**
   * Eliminamos la posibilidad de construir una instancia
   */
  private constructor(private defValues: IJSONType<string, any>) {
    this.smm = new ServiceManagerMiddleware(defValues);
  }

  get serviceManager(): ServiceManager<string> {
    return this.smm.serviceManager;
  }
}

/**
 * Clase intermediaria que posee el service manager que utilizarán los decoradores.
 */
export class ServiceManagerMiddleware {
  private sm: SuperServiceManager<string>;

  constructor(private defValues: IJSONType<string, any>) {
    this.sm = new SuperServiceManager<string>();
    this.subscribeInitializer();
    this.initializeSM();
  }

  get serviceManager(): ServiceManager<string> {
    return this.sm;
  }

  initializeSM() {
    // SystemEnvironmentData
    const runningMode = process.env.RMODE;

    // ProxyFacade
    const facade = new ProxyFacade();

    // ConfigManager
    const systemGlobal: IGlobalFieldContainer = annotationSG.build(
      this.defValues.get("globals")
    );

    // ConfigManager should be the very first  services to be injected
    this.sm.add(AppServices.SystemEnvironmentData, systemGlobal);
    this.sm.addProvider(
      new ConfigManagerProvider(
        this.defValues.get("ConfigManager"),
        systemGlobal.projectRoot
      )
    );
    this.sm.addProvider(new RouteServiceProvider());
    this.sm.addProvider(new PayloadFactoryProvider(runningMode));

    //  RouteGuardManager
    const routeGuardManager = new RouteGuardManager();
    routeGuardManager.add(new PublicRouteGuard(), 100);
    this.sm
      .add(AppServices.helloworld, "HELLO WORLD")
      .add(AppServices.ProxyFacade, facade);

    this.sm.add(AppServices.RouteGuardManager, routeGuardManager);

    // SYSTEM TUPLE SPACE
    $TUPLE_SPACE.addService($SYMB.$GLOBAL, $SYMB.$SERVICE_MANAGER, this.sm);
    $TUPLE_SPACE.addService($SYMB.$HEADER, $SYMB.$PAYLOAD, new BasePayload({}));
    $TUPLE_SPACE.addService($SYMB.$GLOBAL, $SYMB.$EVENT, EventBus);
  }

  subscribeInitializer() {
    Globals.EV.on(Globals.ON_READY, $instance => {
      const sm = $instance.serviceManager;
      sm.remove(AppServices.TreeParserProvider);
      sm.add(
        AppServices.TreeParserProvider,
        new TreeParserProvider(sm.get(AppServices.ConfigManager))
      );
    });
  }
}
