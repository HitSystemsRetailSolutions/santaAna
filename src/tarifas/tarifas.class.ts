import { ParametrosInterface } from "src/parametros/parametros.interface";
import { recHit } from "../conexion/mssql";

export class TarifasClass {
  /* Eze 4.0 */
  async getTarifaTienda(
    database: ParametrosInterface["database"],
    codigoCliente: ParametrosInterface["codigoTienda"]
  ) {
    const res = await recHit(
      database,
      `SELECT Codi as id, PREU as precioConIva FROM TarifesEspecials WHERE TarifaCodi = (select [Desconte 5] from clients where Codi = ${codigoCliente}) AND TarifaCodi <> 0`
    );

    if (res?.recordset?.length > 0) return res.recordset;
    return [];
  }
  /* Eze 4.0 */
  async getTarifasEspeciales(database: string): Promise<any> {
    const sql =
      "SELECT te.Codi as idArticulo, te.PREU AS precioConIva, cc.Valor as idClienteFinal FROM TarifesEspecials te LEFT JOIN clients cl ON te.TarifaCodi = cl.[Desconte 5] LEFT JOIN ConstantsClient cc ON cl.Codi = cc.Codi AND cc.Variable = 'CFINAL' WHERE cc.Valor IS NOT NULL AND cc.Valor <> ''";
    return (await recHit(database, sql)).recordset;
  }
}

export const tarifasInstance = new TarifasClass();
