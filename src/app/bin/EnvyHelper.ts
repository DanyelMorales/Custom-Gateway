/**
 * Ayudante para resolver y comparar el entorno de ejecución actual.
 * @author Daniel Vera Morales
 */
import { Environment } from "./Environments";
export default function() {
  this.isEnvy = (env: Environment) => {
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
    return Environment[envvar];
  };
}
