import { ParametrosInterface } from "../parametros/parametros.interface";
import { recHit } from "../conexion/mssql";

export class ArticulosClass {
  /* Eze 4.0 */
  async getArticulos(database: ParametrosInterface["database"]) {
    const res = await recHit(
      database,
      "SELECT Codi as _id, NOM as nombre, PREU as precioConIva, TipoIva as tipoIva, EsSumable as esSumable, Familia as familia, ISNULL(PreuMajor, 0) as precioBase FROM Articles"
    );

    if (res?.recordset?.length > 0) {
      let data = res.recordset;
      const articulosId = data.map((j) => j._id);
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
            const objIndex = data.findIndex((j) => j._id === id);
            data[objIndex].suplementos = supsId;
          }
        }
        return data;
      }
    }
    return [];
  }

  /* Eze 4.0 */
  async getTarifasEspeciales(database: string): Promise<any[]> {
    const sql =
      "SELECT te.Codi as idArticulo, te.PREU AS precioConIva, cc.Valor as idClienteFinal FROM TarifesEspecials te LEFT JOIN clients cl ON te.TarifaCodi = cl.[Desconte 5] LEFT JOIN ConstantsClient cc ON cl.Codi = cc.Codi AND cc.Variable = 'CFINAL' WHERE cc.Valor IS NOT NULL AND cc.Valor <> ''";
    return (await recHit(database, sql)).recordset;
  }

  /* Eze 4.0 */
  public fusionarArticulosConTarifasEspeciales(
    articulos,
    arrayTarifasEspeciales
  ) {
    if (arrayTarifasEspeciales.length > 0) {
      for (let i = 0; i < arrayTarifasEspeciales.length; i++) {
        for (let j = 0; j < articulos.length; j++) {
          if (articulos[j]._id === arrayTarifasEspeciales[i].id) {
            articulos[j].precioConIva = arrayTarifasEspeciales[i].precioConIva;
            break;
          }
        }
      }
    }
    return articulos;
  }
}
export const articulosInstance = new ArticulosClass();
