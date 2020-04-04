"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Ayudante para resolver y comparar el entorno de ejecución actual.
 * @author Daniel Vera Morales
 */
const Environments_1 = require("./Environments");
function default_1() {
    this.isEnvy = (env) => {
        const envvar = process.env.RMODE;
        if (!envvar || !process.env.RMODE) {
            return false;
        }
        return envvar === process.env.RMODE;
    };
    this.getEnvy = () => {
        const envvar = process.env.RMODE;
        if (!process.env.RMODE) {
            return false;
        }
        return Environments_1.Environment[envvar];
    };
}
exports.default = default_1;
//# sourceMappingURL=EnvyHelper.js.map