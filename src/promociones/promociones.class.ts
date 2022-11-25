import { recHit } from "src/conexion/mssql";

export class PromocionesClass {
  /* Eze 4.0 */
  private async getPromocionesUgly(database: string, codigoCliente: number) {
    const sql = `SELECT Id as _id, Di as fechaInicio, Df as fechaFinal, D_Producte as principal, D_Quantitat as cantidadPrincipal, S_Producte as secundario, S_Quantitat as cantidadSecundario, S_Preu as precioFinal FROM ProductesPromocionats WHERE Client = ${codigoCliente}`;
    const res = await recHit(database, sql);

    if (res?.recordset?.length > 0) return res.recordset;
    return [];
  }

  /* Eze 4.0 */
  async getPromocionesNueva(database: string, codigoCliente: number) {
    let objPrincipal = null;
    let objSecundario = null;
    let promociones = [];

    promociones = await this.getPromocionesUgly(database, codigoCliente);

    for (let i = 0; i < promociones.length; i++) {
      if (promociones[i].principal.startsWith("F_")) {
        objPrincipal = await recHit(
          database,
          `select Codi as _id from articles where familia = '${promociones[
            i
          ].principal.substring(2)}'`
        );
        promociones[i].principal = objPrincipal.recordset.map(
          (item: any) => item._id
        );
      } else {
        promociones[i].principal = [Number(promociones[i].principal)];
      }

      if (promociones[i].secundario.startsWith("F_")) {
        objSecundario = await recHit(
          database,
          `select Codi as _id from articles where familia = '${promociones[
            i
          ].secundario.substring(2)}'`
        );
        promociones[i].secundario = objSecundario.recordset.map(
          (item: any) => item._id
        );
      } else {
        promociones[i].secundario = [Number(promociones[i].secundario)];
      }

      if (
        promociones[i].principal &&
        promociones[i].principal.length > 0 &&
        this.contieneAlgo(promociones[i].principal)
      ) {
        if (
          promociones[i].secundario &&
          promociones[i].secundario.length > 0 &&
          this.contieneAlgo(promociones[i].secundario)
        ) {
          promociones[i].tipo = "COMBO";
        } else {
          promociones[i].tipo = "INDIVIDUAL";
        }
      } else if (
        promociones[i].secundario &&
        promociones[i].secundario.length > 0 &&
        this.contieneAlgo(promociones[i].secundario)
      ) {
        promociones[i].tipo = "INDIVIDUAL";
      }
      objPrincipal = null;
      objSecundario = null;
    }

    return promociones;
  }

  private contieneAlgo(arrayParte: []) {
    if (arrayParte) {
      for (let i = 0; i < arrayParte.length; i++) {
        if (typeof arrayParte[i] == "number" && arrayParte[i] > 0) {
          return true;
        }
      }
    }
    return false;
  }
}
export const promocionesInstance = new PromocionesClass();
