import { JSONType } from "@utils/JSONUtils";

export interface IGlobalFieldContainer {
  projectRoot: string;
  sysRoot: string;
  front: string;
  backend: string;
  package: any;
  declarations: any;
  critical: string;
}

export class SystemGlobal implements IGlobalFieldContainer {
  private nodePath = require("path");
  private pathToRoot: string;

  constructor(private map: JSONType<string, string>) {
    this.pathToRoot = this.map.get("pathToRoot", true);
  }

  get projectRoot() {
    return this.nodePath.resolve(this.pathToRoot);
  }

  get sysRoot() {
    const dirName: string = this.map.defget("dist");
    return this.nodePath.join(this.projectRoot, dirName);
  }

  get front() {
    const dirName: string = this.map.defget("public");
    return this.nodePath.join(this.sysRoot, dirName);
  }

  get backend() {
    const dirName: string = this.map.defget("app");
    return this.nodePath.join(this.sysRoot, dirName);
  }

  get package() {
    const dirName: string = this.map.defget("package");
    const pkg = this.nodePath.join(this.projectRoot, dirName);
    return require(pkg);
  }

  get declarations() {
    const dirName: string = this.map.defget("declarations");
    const pkg = this.nodePath.join(this.projectRoot, dirName);
    return require(pkg);
  }

  get critical() {
    const dirName: string = this.map.defget("critical");
    return this.nodePath.join(this.projectRoot, dirName);
  }
}
