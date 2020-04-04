"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Extrae substrings de una cadena  y los almacena para posteriormente sustituirlo
 *
 * @author Daniel Vera Morales
 */
const nodeURL = require("url");
class Interpolator {
    /**
     * Delimitador que se usara para dividir y reconstruir cadenas
     * @param delim
     */
    constructor(delim) {
        this.delim = delim;
    }
    filterNullArr(haystack) {
        return haystack.filter(n => n !== null && n !== "" && n !== undefined);
    }
    reset() {
        this.expansion = null;
    }
    /**
     * Divide la cadena en dos partes utilizando un delimitador,
     * reconstruyendo las subcadenas y retornando un arreglo de cadenas armadas.
     * @param path
     * @param slice
     */
    extractInterpolated(path, slice = 1) {
        const endpointParts = this.filterNullArr(path.split(this.delim));
        const basePart = endpointParts.slice(0, slice).join(this.delim);
        const newParts = endpointParts.slice(slice, endpointParts.length);
        newParts.unshift(basePart);
        return newParts;
    }
    /**
     * Evalua, analiza y extrae una parte del  string, almacenando el resto para
     * una sustitución posterior.
     *
     * @param path
     * @param slice
     */
    eval(path, slice = 1) {
        this.reset();
        const interpolated = this.extractInterpolated(path, slice);
        const basePart = interpolated.shift();
        if (interpolated.length > 0) {
            this.expansion = interpolated.join(this.delim);
        }
        return [basePart, this.expansion];
    }
    /**
     * Substituye la parte base de la cadena evaluda y le añade el parametro prepend.
     * @returns la cadena substituida
     * @param prepend
     */
    expand(prepend) {
        if (this.expansion) {
            return nodeURL.resolve(prepend + "/", this.expansion);
        }
        return prepend;
    }
}
exports.Interpolator = Interpolator;
//# sourceMappingURL=Interpolator.js.map