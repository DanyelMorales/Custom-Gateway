/**
 * Extrae substrings de una cadena  y los almacena para posteriormente sustituirlo 
 * 
 * @author Daniel Vera Morales
 */
const nodeURL = require("url");
export class Interpolator {
    private expansion: string;

    /**
     * Delimitador que se usara para dividir y reconstruir cadenas
     * @param delim 
     */
    constructor(private delim: string) { }

    private filterNullArr(haystack: string[]): string[] {
        return haystack.filter(n => n !== null && n !== "" && n !== undefined);
    }

    private reset() {
        this.expansion = null;
    }

    /**
     * Divide la cadena en dos partes utilizando un delimitador,
     * reconstruyendo las subcadenas y retornando un arreglo de cadenas armadas.
     * @param path 
     * @param slice 
     */
    private extractInterpolated(path: string, slice: number = 1) {
        const endpointParts = this.filterNullArr(path.split(this.delim))
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
    eval(path: string, slice: number = 1): string[] {
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
    expand(prepend: string): string {
        if (this.expansion) {
            return nodeURL.resolve(prepend + "/", this.expansion);
        }
        return prepend;
    }
}
