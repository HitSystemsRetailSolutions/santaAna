import { recHit } from "../conexion/mssql";

export class InfoTicketClass {
  /* Eze 4.0 */
  async getInfoTicket(database: string, codigoTienda: number) {
    const res = await recHit(
      database,
      `select Variable AS nombreDato, Valor AS valorDato from paramsTpv where CodiClient = ${codigoTienda} AND (Variable = 'Capselera_1' OR Variable = 'Capselera_2')`
    );

    if (res?.recordset?.length > 0) return res.recordset;
    return false;
  }
}
export const infoTicketInstance = new InfoTicketClass();
