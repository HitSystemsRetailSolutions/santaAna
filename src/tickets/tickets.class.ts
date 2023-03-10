import { recHit } from "../conexion/mssql";
import { fechaParaSqlServer } from "src/funciones/fechas";
import { SuperTicketInterface, TicketsInterface } from "./tickets.interface";
import { TokensCollection } from "../auth/auth.interface";

class TicketsClass {
  construirCampoOtros(ticket: SuperTicketInterface) {
    let campoOtros = "";

    if (ticket.tipoPago == "TARJETA") campoOtros = "[I][C:-"+ticket.total+"][Visa]";

    if (ticket.tipoPago == "TKRS")
      campoOtros += `[TkRs:${
        ticket.movimientos[0].valor + ticket.movimientos[1].valor
      }]`;

    if (ticket.idCliente && ticket.idCliente != "")
      campoOtros += `[Id:${ticket.idCliente}]`;

    return campoOtros;
  }

  /* Eze 4.0 */
  async getIdEspecialTrabajador(
    database: TokensCollection["database"],
    idTrabajador: SuperTicketInterface["idTrabajador"]
  ): Promise<string> {
    const res = await recHit(
      database,
      `SELECT valor FROM dependentesExtes WHERE id = ${idTrabajador} AND nom = 'CODICFINAL'`
    );

    if (res.recordset.length > 0) return res.recordset[0].valor;
    return null;
  }

  /* Eze 4.0 preparando */
  async insertarTicketsNueva(
    ticket : SuperTicketInterface,
    parametros: TokensCollection
  ) {
    let sql = "";

    const infoTime = fechaParaSqlServer(new Date(ticket.timestamp));
    const nombreTabla = `[V_Venut_${infoTime.year}-${infoTime.month}]`;
    /* Recorro la cesta del ticket */
    for (let j = 0; j < ticket.cesta.lista.length; j++) {
      const campoOtros = this.construirCampoOtros(ticket);

      let idFinalTrabajador = null;
      if (ticket.cesta.modo === "CONSUMO_PERSONAL") {
        const idEspecial = await this.getIdEspecialTrabajador(
          parametros.database,
          ticket.idTrabajador
        );
        if (idEspecial) idFinalTrabajador = `[Id:${idEspecial}]`;
        else
          throw Error("No se ha podido obtener el idEspecial del trabajador");
      }

      let idArticulo = null;
      idArticulo = ticket.cesta.lista[j].idArticulo;
      sql += ` INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Num_tick, Estat, Plu, Quantitat, Import, Tipus_venta, FormaMarcar, Otros) VALUES (${
        parametros.codigoInternoTienda
      }, CONVERT(datetime, '${infoTime.year}-${infoTime.month}-${
        infoTime.day
      } ${infoTime.hours}:${infoTime.minutes}:${infoTime.seconds}', 120), ${
        ticket.idTrabajador
      }, ${ticket._id}, '', ${idArticulo}, ${ticket.cesta.lista[j].unidades}, ${
        ticket.cesta.modo === "CONSUMO_PERSONAL"
          ? 0
          : ticket.cesta.lista[j].subtotal
      }, '${ticket.cesta.modo === "CONSUMO_PERSONAL" ? "Desc_100" : "V"}', 0, '${
        ticket.cesta.modo === "CONSUMO_PERSONAL" ? idFinalTrabajador : campoOtros
      }');`;
    }
    sql = `
                    DELETE FROM ${nombreTabla} WHERE botiga = ${parametros.codigoInternoTienda} AND Num_tick = ${ticket._id};
                    ${sql}
                `;
    const resSql = await recHit(parametros.database, sql);
    resSql.rowsAffected;
    await this.actualizarUltimo(parametros, ticket._id);
    return true;
  }

  /* Eze 4.0 */
  async actualizarUltimo(
    parametros: TokensCollection,
    idTicket: TicketsInterface["_id"]
  ) {
    const sql2 = `IF EXISTS (SELECT * FROM tocGameInfo WHERE licencia = ${
      parametros.licencia
    }) 
          BEGIN
              IF ((SELECT ultimoIdTicket FROM tocGameInfo WHERE licencia = ${
                parametros.licencia
              }) < ${idTicket})
                  BEGIN
                      UPDATE tocGameInfo SET ultimoIdTicket = ${idTicket}, ultimaConexion = ${Date.now()}, nombreTienda = '${
      parametros.nombreTienda
    }' WHERE licencia = ${parametros.licencia}
                    END
                END
        ELSE
            BEGIN
                INSERT INTO tocGameInfo (licencia, bbdd, ultimoIdTicket, codigoInternoTienda, nombreTienda, token, version, ultimaConexion) 
                    VALUES (${parametros.licencia}, '${
      parametros.database
    }', ${idTicket}, ${parametros.codigoInternoTienda}, '${
      parametros.nombreTienda
    }', NEWID(), '4.0.0', ${Date.now()})
                                        END`;
    await recHit("Hit", sql2);
  }
}
const ticketsInstance = new TicketsClass();
export { ticketsInstance };
