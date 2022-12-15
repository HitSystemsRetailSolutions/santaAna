import { recHit } from "../conexion/mssql";
import { ParametrosInterface } from "./parametros.interface";

export class ParametrosClass {
  /* Eze 4.0 */
  public async getParametros(licencia: ParametrosInterface["licencia"]) {
    const sqlParaImprimir = `SELECT ll.Llicencia, ll.Empresa, ll.LastAccess, we.Db, ISNULL(ti.ultimoIdTicket, 0) as ultimoIdTicket, ti.token FROM llicencies ll LEFT JOIN Web_Empreses we ON ll.Empresa = we.Nom LEFT JOIN tocGameInfo ti ON ti.licencia = ${licencia} WHERE ll.Llicencia = ${licencia}`;
    const res1 = await recHit("Hit", sqlParaImprimir);
    const sqlParaImprimir2 = `SELECT cl.Nom, cl.Codi as codigoTienda, pt.Valor as header, pt2.Valor as footer FROM clients cl LEFT JOIN paramsTpv pt ON cl.Codi = pt.CodiClient AND pt.Variable = 'Capselera_1' LEFT JOIN ParamsTpv pt2 ON cl.Codi = pt2.CodiClient AND pt2.Variable = 'Capselera_2' WHERE cl.Codi = (SELECT Valor1 FROM ParamsHw WHERE Codi = ${res1.recordset[0].Llicencia})`;
    const data2 = await recHit(res1.recordset[0].Db, sqlParaImprimir2);

    if (res1.recordset.length === 1) {
      const dataF = await recHit(
        res1.recordset[0].Db,
        `SELECT * FROM paramstpv WHERE CodiClient = ${res1.recordset[0].Llicencia} `
      );

      let paramstpv = {};

      for (let i = 0; i < dataF.recordset.length; i++) {
        if (dataF.recordset[i].Valor == "Si") {
          paramstpv[dataF.recordset[i].Variable] =
            dataF.recordset[i].Valor;
        }
      }

      return {
        licencia: parseInt(res1.recordset[0].Llicencia),
        nombreEmpresa: res1.recordset[0].Empresa,
        database: res1.recordset[0].Db,
        nombreTienda: data2.recordset[0].Nom,
        codigoTienda: data2.recordset[0].codigoTienda,
        ultimoTicket: res1.recordset[0].ultimoIdTicket,
        header: data2.recordset[0].header,
        footer: data2.recordset[0].footer,
        ...paramstpv,
        token: res1.recordset[0].token,
      };
    }
  }
}

export const parametrosInstance = new ParametrosClass();
