import { recHit } from "../conexion/mssql";

export class TeclasClass {
  /* TODAS LAS TECLAS, de TODOS los TECLADOS de una tienda en concreto */

  /* Eze 4.0 */
  async getTeclas(database: string, licencia: number) {
    const res = await recHit(
      database,
      `SELECT Data, Ambient as nomMenu, (select EsSumable from articles where codi = article) as esSumable, (select nom from articles where codi = article) as nombreArticulo, article as idArticle, pos, color FROM TeclatsTpv WHERE Llicencia = ${licencia} AND Data = (select MAX(Data) FROM TeclatsTpv WHERE Llicencia = ${licencia} )`
    );

    if (res?.recordset?.length > 0) return res.recordset;
    return [];
  }
}
export const teclasInstance = new TeclasClass();
