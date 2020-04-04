/**
 * Posee los datos del microservicio invocado.
 *
 * Se resuelven las opciones utilizando:
 *  - el ns actual de las rutas (public, private)
 *  - el modo de ejecución del sistema (dev, dist)
 *  -
 *
 * @author Daniel Vera Morales <dvera at sunset.com.mx>
 */
export interface IMicroservice {
  getKey(key: string): string;
  getMode(): string;
  getNS(): string;
  getAuth(): any;
  getPath(): string;
}

export interface IMicroserviceFactory {
  build(): IMicroservice;
}
