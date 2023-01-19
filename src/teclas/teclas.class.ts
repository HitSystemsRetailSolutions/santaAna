import { recHit } from "../conexion/mssql";

export class TeclasClass {
  /* TODAS LAS TECLAS, de TODOS los TECLADOS de una tienda en concreto */

  /* Eze 4.0 */
  async getTeclas(database: string, licencia: number) {
    const res = await recHit(
      database,
      `SELECT Data, Ambient as nomMenu, (select EsSumable from articles where codi = article) as esSumable, (select nom from articles where codi = article) as nombreArticulo, article as idArticle, pos, color FROM TeclatsTpv WHERE Llicencia = ${licencia} AND Data = (select MAX(Data) FROM TeclatsTpv WHERE Llicencia = ${licencia} )`
    );

    if (res?.recordset?.length > 0) {



      let data = res.recordset;
      const articulosId = data.map((j) => j.idArticle);
      const sql = `SELECT CodiArticle, Valor FROM ArticlesPropietats WHERE Variable = 'ES_SUPLEMENT'`;
      const res2 = await recHit(database, sql);

      if (res2?.recordset?.length > 0) {
        const suplementos = res2.recordset;
        for (let item in articulosId) {
          const id = articulosId[item];
          const supsId = suplementos
            .filter((i) => i.Valor == id)
            .map((ii) => ii.CodiArticle);
          if (supsId.length > 0) {
            const objIndex = data.findIndex((j) => j.idArticle === id);
            data[objIndex].suplementos = supsId;
          }
        }
        return data;
      }




      return res.recordset
    };
    return [];
  }
}
export const teclasInstance = new TeclasClass();
