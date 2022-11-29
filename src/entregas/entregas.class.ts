import { IResult } from "mssql";
import { fechaParaSqlServer, tablasEntregas } from "src/funciones/fechas";
import { ParametrosInterface } from "src/parametros/parametros.interface";
import { recHit } from "../conexion/mssql";

export class EntregasClass {
  async getEntregas(
    database: ParametrosInterface["database"],
    codigoTienda: ParametrosInterface["codigoTienda"]
  ) {
    const res = await recHit(
      database,
      `SELECT nom FROM clients WHERE codi = ${codigoTienda}`
    );

    if (res) {
      const { nom } = res.recordset[0];
      const fecha = new Date();
      const {
        day: day_ini,
        month: month_ini,
        year: year_ini,
      } = fechaParaSqlServer(fecha);
      const ini = `${day_ini}/${month_ini}/${year_ini}`;
      fecha.setMonth(fecha.getMonth() - 1);
      const {
        day: day_fin,
        month: month_fin,
        year: year_fin,
      } = fechaParaSqlServer(fecha);
      const fin = `${day_fin}/${month_fin}/${year_fin}`;
      let sqlA = "";
      for (let i = 0; i <= 1; i++) {
        const { tabla_moviments, tabla_moviments_estat } = tablasEntregas(i);
        sqlA += `
                        SELECT m.botiga AS Botiga, m.data AS data, CONVERT(nvarchar, m.data, 103) + ' ' + CONVERT(nvarchar, m.data, 108) dataED, m.dependenta AS dependenta, m.tipus_moviment, m.import AS importe, m.motiu AS motiu, '${tabla_moviments}' AS tabla, e.estat AS estat, rtrim(cast(m.botiga as char) ) + rtrim(CONVERT(char,m.data,9)) + rtrim(cast (m.dependenta as char)) AS IdMov FROM ${tabla_moviments} m WITH (nolock) LEFT JOIN ${tabla_moviments_estat} e WITH (nolock) ON e.data = m.data AND e.botiga = m.botiga WHERE (m.tipus_moviment = 'O' OR m.tipus_moviment = 'A') AND (motiu LIKE 'Entrega Di%ria' OR motiu = 'Sortida de Canvi') AND m.botiga = ${codigoTienda} 
                    `;
        if (i === 0) sqlA += " UNION ";
      }
      const sql = `
                    SELECT isnull(c.nom, '?') AS nomBotiga, isnull(d.nom, '?') AS nomDependenta, s.* FROM (${sqlA}) s LEFT JOIN clients c WITH (nolock) ON s.botiga = c.codi LEFT JOIN dependentes d WITH (nolock) ON s.dependenta = d.codi WHERE data BETWEEN CONVERT(datetime, '${fin}', 103) AND CONVERT(datetime, '${ini}', 103) + CONVERT(datetime, '23:59:59', 8) AND s.estat IS NULL ORDER BY c.nom, s.data
                `;
      const res2 = await recHit(database, sql);

      if (res2.recordset.length) {
        let texto_a_imprimir = `${nom}\nImpreso ${ini}\nListado entregas pendientes\nFecha              Hora           Importe\n---------------------------------------------\n`;
        const data = res2.recordset;
        for (let i in data) {
          const dataFecha = data[i].dataED.split(" ");
          texto_a_imprimir += `${dataFecha[0]}        ${
            dataFecha[1]
          }        ${Math.abs(data[i].importe)} E\n`;
        }
        texto_a_imprimir += `---------------------------------------------\n`;
        texto_a_imprimir += `IMPORTE TOTAL: ${Math.abs(
          data.reduce((total, { importe }) => total + importe, 0)
        )} E\n`;
        texto_a_imprimir += `TOTAL BULTOS: ${data.length}`;
        return texto_a_imprimir;
      }
    }
    return "OK";
  }
}
export const entregasInstance = new EntregasClass();
