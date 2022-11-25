import { TokensCollection } from "../auth/auth.interface";
import { recHit } from "../conexion/mssql";

export class ParametrosClass {
    /* Eze 4.0 */
  public async getParametros(parametros: TokensCollection) {
    const dataF = await recHit(
      parametros.database,
      `SELECT * FROM paramstpv WHERE CodiClient = ${parametros.licencia} `
    );

    let paramstpv = {};

    for (let i = 0; i < dataF.recordset.length; i++) {
      if (dataF.recordset[i].Valor == "Si") {
        paramstpv[dataF.recordset[i].Variable] =
          dataF.recordset[i].Valor;
      }
    }
    return paramstpv;
  }
}

export const parametrosInstance = new ParametrosClass();
