"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Interpreta un arbol de json y genera un arbol recursivo
 * para ser interpretado como se desee.
 *
 * @author Daniel Vera Morales
 */
const JSONUtils_1 = require("@utils/JSONUtils");
/**
 *
 */
class TreeParser {
    /**
     * Parsea el arbol de un json
     * @param tree
     */
    parse(tree, guard) {
        if (!tree.has("leaves") || !tree.has("tree")) {
            throw Error("Leaves index or tree index not found");
        }
        this.leaves = new JSONUtils_1.JSONType(tree.get("leaves"));
        this.tree = new JSONUtils_1.JSONType(tree.get("tree"));
        this.parsed = new JSONUtils_1.JSONType();
        this.guard = guard;
        return this.createNode(this.tree.getAll());
    }
    isAllowedLeaf(item) {
        if (!item || !item.props || !item.props.data || !item.props.data.security) {
            return true;
        }
        if (this.guard && this.guard.isAllowed(item.props.data.security)) {
            return true;
        }
        return false;
    }
    /**
     * Crear un nodo
     * @param rawTree
     */
    createNode(rawTree) {
        const container = [];
        for (const nodeName in rawTree) {
            if (!rawTree.hasOwnProperty(nodeName) || !this.leaves.has(nodeName)) {
                continue;
            }
            // verificador de permisos
            const nodeBody = rawTree[nodeName];
            const leaf = this.createLeaf(nodeName);
            if (!this.isAllowedLeaf(leaf)) {
                continue;
            }
            if (nodeBody instanceof Array) {
                leaf["leaves"] = this.createSimpleLeaves(nodeBody);
            }
            else if (typeof nodeBody === "object") {
                leaf["leaves"] = this.createNode(nodeBody);
            }
            container.push(leaf);
        }
        return container;
    }
    /**
     * Genera hojas finales a partir de un arreglo
     *
     * @param leaves
     */
    createSimpleLeaves(leaves) {
        const container = [];
        for (const leave of leaves) {
            const leaf = this.createLeaf(leave);
            if (!this.isAllowedLeaf(leaf) || !this.leaves.has(leave)) {
                continue;
            }
            container.push(leaf);
        }
        return container;
    }
    /**
     * Crea una hoja final simple
     * @param name
     */
    createLeaf(name) {
        const container = {
            id: name,
            props: this.leaves.get(name)
        };
        return container;
    }
}
exports.TreeParser = TreeParser;
//# sourceMappingURL=TreeParser.js.map