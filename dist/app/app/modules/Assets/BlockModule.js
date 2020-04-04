"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _system_1 = require("@system");
const SystemLog_1 = require("@root/SystemLog");
const System_1 = require("@/System");
class BlockModule {
    constructor() {
        this.log = SystemLog_1.Log.Message.instance();
        this.log
            .is()
            .success()
            .action(SystemLog_1.Log.MessageAction.USER_SYS_ACTION)
            .printf("Blocks", "Blocks", "Initializing");
    }
    register(app, router) {
        const self = this;
        router.get("/blocks/:type", (req, res) => {
            System_1.$TUPLE_SPACE.getService(System_1.$SYMB.$HEADER, System_1.$SYMB.$PAYLOAD).data = req;
            System_1.$TUPLE_SPACE.addService(System_1.$SYMB.$HEADER, System_1.$SYMB.$REQUEST, res);
            const response = self.getblock(req.params.type.toUpperCase());
            if (!response) {
                res.status(408).send();
            }
            else {
                res.status(200).json(response);
            }
        });
    }
    getblock(type) {
        if (type === "MENU") {
            return this.treeParserProvider.getTree(this.treeGuard);
        }
        return null;
    }
    serviceManager(serviceManager) {
        this.treeParserProvider = serviceManager.get(_system_1.AppServices.TreeParserProvider);
        this.treeGuard = serviceManager.get(_system_1.AppServices.___MENU_TREE_GUARD___);
    }
}
exports.BlockModule = BlockModule;
//# sourceMappingURL=BlockModule.js.map