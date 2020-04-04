"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TreeParser_1 = require("./TreeParser");
const JSONUtils_1 = require("@utils/JSONUtils");
const AuthHelper = require("@auth/annotated/Auth");
class TreeParserProvider {
    constructor(configManager) {
        this.configManager = configManager;
        this.parser = null;
        this.parser = new TreeParser_1.TreeParser();
    }
    /**
     *
     */
    getTree(treeGuard) {
        const jsonType = new JSONUtils_1.JSONType(this.configManager.getWrapper("menu-tree").toJSON());
        return this.parser.parse(jsonType, treeGuard);
    }
}
exports.TreeParserProvider = TreeParserProvider;
//# sourceMappingURL=TreeParserProvider.js.map