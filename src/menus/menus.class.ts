import { recHit } from "../conexion/mssql";

export class MenusClass {
  /* Eze 4.0 */
  async getMenus(database: string, codigoCliente: number) {
    const res = await recHit(
      database,
      `SELECT DISTINCT Ambient as nomMenu FROM TeclatsTpv WHERE Llicencia = ${codigoCliente} AND Data = (select MAX(Data) FROM TeclatsTpv WHERE Llicencia = ${codigoCliente} )`
    );

    if (res?.recordset.length > 0) return res.recordset;
    return false;
  }
}
export const menusInstance = new MenusClass();
