/**
 * Interpreta un arbol de json y genera un arbol recursivo
 * para ser interpretado como se desee.
 *
 * @author Daniel Vera Morales
 */
import { JSONType } from "@utils/JSONUtils";

export interface ITreeParserProvider<T> {
  getTree(treeGuard?: ITreeGuard): ITree<T>[];
}

/**
 *
 */
export interface ITreeParser<T> {
  parse(tree: JSONType<string, any>, guard?: ITreeGuard): ITree<T>[];
}

export interface ITreeGuard {
  isAllowed(item): boolean;
}

/**
 *
 */
export interface ITree<T> {
  id: string;
  props: T;
  leaves?: ITree<T>[];
}

/**
 *
 */
export class TreeParser<PROP_TYPE> implements ITreeParser<PROP_TYPE> {
  private leaves: JSONType<string, any>;
  private tree: JSONType<string, any>;
  private parsed: JSONType<string, any>;
  private guard: ITreeGuard;

  /**
   * Parsea el arbol de un json
   * @param tree
   */
  parse(tree: JSONType<string, any>, guard?: ITreeGuard): ITree<PROP_TYPE>[] {
    if (!tree.has("leaves") || !tree.has("tree")) {
      throw Error("Leaves index or tree index not found");
    }
    this.leaves = new JSONType<string, any>(tree.get("leaves"));
    this.tree = new JSONType<string, any>(tree.get("tree"));
    this.parsed = new JSONType<string, any>();
    this.guard = guard;
    return this.createNode(this.tree.getAll());
  }

  private isAllowedLeaf(item): boolean {
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
  private createNode(rawTree) {
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
      } else if (typeof nodeBody === "object") {
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
  private createSimpleLeaves(leaves: string[]) {
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
  private createLeaf(name: string): ITree<PROP_TYPE> {
    const container = {
      id: name,
      props: this.leaves.get(name)
    };
    return container;
  }
}
