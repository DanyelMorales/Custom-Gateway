import * as express from "express";
import * as Mods from "@utils/ModuleManager";
import * as RouteRegister from "@utils/RouteRegister";
import { ServiceManager } from "@servicemanager";
import { Authenticator } from "./Authenticator";
import { AppServices } from "@app/System";
const AuthHelper = require("@auth/annotated/Auth");
import {
  IAuthenticator,
  IAuthenticationProfile,
  IAuthenticationFacade
} from "@auth/Auth";
import { AuthProfile } from "./AuthProfile";
import { AuthRouteGuard, AuthRouteMethodGuard } from "./AuthRouteGuard";
import { Authorization } from "./Authorization";
import { MenuGuard } from "./TreeMenuGuard";
import { $SYMB, $TUPLE_SPACE, RouteGuardManager } from "@/System";
import EventBus  from "@utils/EventBus";
import { ProxyEvents } from "@app/modules/Proxy/ProxyEvents";
 
/**
 * @author Daniel Vera Morales
 */
export class AuthModule implements Mods.IModule, Mods.IHttpModule {
  private authFacade: IAuthenticationFacade<string, string>;
  private authorization: Authorization;

  /**
   * > se añade el authenticador y se activa en el sistema.
   * > se registra el Authorization helper, para verificar permisos
   * @param sm
   */
  serviceManager(sm: ServiceManager<string>): void {
    this.authFacade = AuthHelper.factory(sm, new Authenticator());
    this.authorization = new Authorization(this.authFacade);
    sm.add(AppServices.___MENU_TREE_GUARD___, new MenuGuard(this.authFacade));

    (<RouteGuardManager>sm.get(AppServices.RouteGuardManager))
      .add(new AuthRouteGuard(this.authorization), 50)
      .add(new AuthRouteMethodGuard(this.authorization), 60);
    
      EventBus.addFilter(ProxyEvents.BEFORE_SEND, (data)=>{
        const payload =  data["payload"];
        if(payload.headers.hasOwnProperty("authorization") || payload.headers.hasOwnProperty("Authorization")){
          delete payload.headers["authorization"];
          delete payload.headers["Authorization"];
        }
        return data;
      });
  }

  /**1
   *
   * @param app
   */
  register(app: any, router: any): void {
    const self = this;
    router.post("/authenticate", function(req, res) {
      const authProfile = new AuthProfile(req);
      self.authFacade
        .asyncAuthenticate(authProfile)
        .then(result => {
          res.json(result);
        })
        .catch(data => {
          res.status(401).json(data);
        });
    });
  }
}
