export interface IJSONType<K, V> {
    put(key: K | string, value: V): void;
    remove(key: K): void;
    removeAll(): void;
    get(key: K): V;
    putAll(json: any): void;
    has(key: K): boolean;
}
/**
 * Simula el MAP de java para abstraer cualquier objeto JSON.
 *
 * Wrapper para JSON
 */
export class JSONType<K, V> implements IJSONType<K, V> {
    private data: any = {};

    constructor(private customdata: any = {}) {
        this.data = customdata;
    }

    getAll(): any {
        return this.data;
    }

    /**
     * Agrega un nuevo indice al mapa
     * @param key
     * @param value
     */
    put(key: K | string, value: V): void {
        this.data[key] = value;
    }

    /**
     * Remover un indice del mapa
     * @param key
     */
    remove(key: K): void {
        delete this.data[key];
    }

    /**
     * Vacía todos los indices del mapa
     */
    removeAll(): void {
        delete this.data;
        this.data = {};
    }

    /**
     * Retornar un indice del mapa
     * @param key
     */
    get(key: K, exceptional: boolean = false): V {
        if (typeof this.data[key] === "undefined") {
            if (exceptional) {
                throw Error("Key not found in configuration: " + key);
            }
            return null;
        }
        return this.data[key];
    }

    fetch(key: K, fallback: V): V {
        return this.get(key) || fallback;
    }

    defget(key: K): V | K {
        return this.get(key) || key;
    }

    /**
     * Agrega indices obteniendolos de un objeto json
     * @param json
     */
    putAll(json: any): void {
        for (const index in json) {
            if (json[index] !== null) {
                this.put(index, json[index]);
            }
        }
    }

    /**
 * Verifica si existe un indice en el mapa
 * @param key
 */
    has(key: K): boolean {
        return typeof this.data[key] === "undefined" ? false : true;
    }
}
