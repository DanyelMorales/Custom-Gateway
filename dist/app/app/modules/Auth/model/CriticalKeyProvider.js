"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const nodePath = require("path");
class CriticalKeyProvider {
    constructor(criticalPath, keys) {
        this.criticalPath = criticalPath;
        this.keys = keys;
        this.KEY_PRIVATE = "private";
        this.KEY_PUBLIC = "public";
        this.KEY_TYPE = "type";
        this.validate();
    }
    /**
     * @param index si es null se devuelven los keys en un json de lo contrario se retorna la llave que se requiere
     */
    validate() {
        if (!this.keys.get(this.KEY_PUBLIC) ||
            !this.keys.get(this.KEY_PRIVATE) ||
            !this.keys.get(this.KEY_TYPE)) {
            throw Error("public key or private key not defined in DECLARATIONS>critical>rs256");
        }
    }
    readFile(index) {
        const content = this.keys.get(index);
        const path = nodePath.join(this.criticalPath, content);
        return fs.readFileSync(path);
    }
    get privatek() {
        return this.readFile(this.KEY_PRIVATE);
    }
    get publick() {
        return this.readFile(this.KEY_PUBLIC);
    }
    get type() {
        return this.keys.get(this.KEY_TYPE);
    }
}
exports.CriticalKeyProvider = CriticalKeyProvider;
//# sourceMappingURL=CriticalKeyProvider.js.map