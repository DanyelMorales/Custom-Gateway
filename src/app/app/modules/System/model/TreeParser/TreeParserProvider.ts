import {
  ITreeParser,
  TreeParser,
  ITree,
  ITreeParserProvider,
  ITreeGuard
} from "./TreeParser";
import { IMenuItem, IMenuSecurity } from "./MenuTree";
import sm = require("@annotated/ServiceManager");
import { AppServices } from "@system";
import { IGlobalFieldContainer } from "@app/SystemGlobal";
import { JsonWrapper, JsonReader } from "@utils/JSONUtils";
import { JSONType } from "@utils/JSONUtils";

const AuthHelper = require("@auth/annotated/Auth");
export class TreeParserProvider implements ITreeParserProvider<IMenuItem> {
  private parser: ITreeParser<IMenuItem> = null;

  constructor(private configManager) {
    this.parser = new TreeParser();
  }

  /**
   *
   */
  getTree(treeGuard: ITreeGuard): ITree<IMenuItem>[] {
    const jsonType = new JSONType(
      this.configManager.getWrapper("menu-tree").toJSON()
    );
    return this.parser.parse(jsonType, treeGuard);
  }
}
