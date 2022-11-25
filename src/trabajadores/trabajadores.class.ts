import { recHit } from "../conexion/mssql";

export class DependientasClass {
  /* Eze 4.0 */
  async getTrabajadores(database: string) {
    const res = await recHit(
      database,
      "select Codi as idTrabajador, Codi as _id, nom as nombre, memo as nombreCorto from dependentes"
    );
    if (res.recordset.length > 0) return res.recordset;

    throw Error("Error, no hay trabajadores");
  }
}
export const dependientasInstance = new DependientasClass();
