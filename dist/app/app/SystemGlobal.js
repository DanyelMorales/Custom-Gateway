"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SystemGlobal {
    constructor(map) {
        this.map = map;
        this.nodePath = require("path");
        this.pathToRoot = this.map.get("pathToRoot", true);
    }
    get projectRoot() {
        return this.nodePath.resolve(this.pathToRoot);
    }
    get sysRoot() {
        const dirName = this.map.defget("dist");
        return this.nodePath.join(this.projectRoot, dirName);
    }
    get front() {
        const dirName = this.map.defget("public");
        return this.nodePath.join(this.sysRoot, dirName);
    }
    get backend() {
        const dirName = this.map.defget("app");
        return this.nodePath.join(this.sysRoot, dirName);
    }
    get package() {
        const dirName = this.map.defget("package");
        const pkg = this.nodePath.join(this.projectRoot, dirName);
        return require(pkg);
    }
    get declarations() {
        const dirName = this.map.defget("declarations");
        const pkg = this.nodePath.join(this.projectRoot, dirName);
        return require(pkg);
    }
    get critical() {
        const dirName = this.map.defget("critical");
        return this.nodePath.join(this.projectRoot, dirName);
    }
}
exports.SystemGlobal = SystemGlobal;
//# sourceMappingURL=SystemGlobal.js.map