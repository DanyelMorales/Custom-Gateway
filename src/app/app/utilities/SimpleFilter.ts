import { JSONType } from "./IJsonType";
/**
 * Filtra un resultado de modo que se pueda modificar.
 */
export class SimpleFilter<K> {
    protected filters: JSONType<K, (data) => any>;

    constructor() {
        this.filters = new JSONType<K, (data) => any>();
    }

    /**
     * Agrega un nuevo filtro basado en lambdas de tipo T
     * @param key 
     * @param value 
     */
    addFilter<T>(key: K, value: (data) => T): SimpleFilter<K> {
        this.filters.put(key, value);
        return this;
    }

    on(key: K, value: (data) => void): SimpleFilter<K> {
        this.filters.put(key, value);
        return this;
    }

    addFilterGuard(key: K, value: (data) => Boolean): SimpleFilter<K> {
        this.addFilter<Boolean>(key, value);
        return this;
    }

    reset(): SimpleFilter<K> {
        this.filters = new JSONType<K, (data) => any>();
        return this;
    }

    /**
     * @param key 
     * @param data 
     */
    trigger(key: K, data: any) {
        this.produceResult<any>(key, data);
    }

    /**
     * @param key
     * @param data indice 0 deberia ser el principal dato a retornar, el resto son opciones
     * @returns indice 0 del arreglo de argumentos que se ha pasado,
     * si no existe filtro alguno
     */
    applyFilter<R>(key: K, data: any): R {
        return <R>this.produceResult<R>(key, data);
    }

    /**
     * Produce un resultado booleano o retorna el dato
     * @param key  indice del filtro
     * @param data  datos a procesar 
     * @param useBool true si retornará bools de acuerdo a resultados o false si se usan datos de retorno
     */
    private produceResult<R>(key: K, data: any, useBool: boolean = false): R | boolean {
        const result: R = this.execFunction<R>(key, data);
        const isBadResult = (result === null || result === undefined || !result);
        if (useBool) {
            return (isBadResult) ? false : true;
        }
        else if (isBadResult) {
            return data;
        }
        return result;
    }

    /**
     * Ejecuta funciones almacenados como filtros.
     * @param key 
     * @param data 
     */
    private execFunction<R>(key: K, data: any): R {
        if (!this.filters.has(key)) {
            return data;
        }
        const fx: (data) => R = this.filters.get(key);
        const result: R = fx(data);
        return result;
    }

    /**
     * Siempre retorna un booleano 
     * @param key filtro a ejecutar 
     * @param data  datos a evaluar
     */
    applyGuard(key: K, data: any): Boolean {
        return this.produceResult<boolean>(key, data, true);
    }
}