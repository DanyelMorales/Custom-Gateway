import { AUTH_EVENTS, AUTHORIZATION_EVENTS } from "../Auth/Events";
import * as express from "express";
import * as Mods from "@utils/ModuleManager";
import { AppServices } from "@system";
import { Log } from "@root/SystemLog";
import { ServiceManager } from "@servicemanager";
import { IGlobalFieldContainer } from "@app/SystemGlobal";
import { TreeParserProvider, ITreeGuard, $SYMB, $TUPLE_SPACE } from "@/System";
import { EventBus } from "@/System";

type Blocks = "MENU";
export class BlockModule implements Mods.IModule, Mods.IHttpModule {
  private log: Log.Message = Log.Message.instance();
  private treeParserProvider: TreeParserProvider;
  private treeGuard: ITreeGuard;
  private sm: ServiceManager<string>;

  constructor() {
    this.log
      .is()
      .success()
      .action(Log.MessageAction.USER_SYS_ACTION)
      .printf("Blocks", "Blocks", "Initializing");
  }

  register(app: any, router: any): void {
    const self = this;
    router.get("/blocks/:type", (req, res) => {
      $TUPLE_SPACE.getService($SYMB.$HEADER, $SYMB.$PAYLOAD).data = req;
      $TUPLE_SPACE.addService($SYMB.$HEADER, $SYMB.$REQUEST, res);
      const response = self.getblock(req.params.type.toUpperCase());
      if (!response) {
        res.status(408).send();
      } else {
        res.status(200).json(response);
      }
    });
  }

  private getblock(type: Blocks) {
    if (type === "MENU") {
      return this.treeParserProvider.getTree(this.treeGuard);
    }
    return null;
  }

  serviceManager(serviceManager: ServiceManager<string>): void {
    this.treeParserProvider = serviceManager.get(
      AppServices.TreeParserProvider
    );
    this.treeGuard = serviceManager.get(AppServices.___MENU_TREE_GUARD___);
  }
}
