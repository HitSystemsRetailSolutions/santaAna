import { recHit } from "../conexion/mssql";
import { fechaParaSqlServer } from "src/funciones/fechas";
import { logger } from "../logger/logger.class";
import { ParametrosInterface } from "../parametros/parametros.interface";
import { SuperTicketInterface, TicketsInterface } from "./tickets.interface";
import { TokensCollection } from "../auth/auth.interface";

class TicketsClass {
  construirCampoOtros(ticket: SuperTicketInterface) {
    let campoOtros = "";

    if (ticket.tipoPago == "TARJETA") campoOtros = "[Visa]";

    if (ticket.tipoPago == "TKRS")
      campoOtros += `[TkRs:${
        ticket.movimientos[0].valor + ticket.movimientos[1].valor
      }]`;

    if (ticket.idCliente && ticket.idCliente != "")
      campoOtros += `[Id:${ticket.idCliente}]`;

    return campoOtros;
  }

  /* Eze 4.0 preparando */
  async insertarTicketsNueva(
    ticket: SuperTicketInterface,
    parametros: TokensCollection
  ) {
    let sql = "";

    const infoTime = fechaParaSqlServer(new Date(ticket.timestamp));
    const nombreTabla = `[V_Venut_${infoTime.year}-${infoTime.month}]`;

    /* Recorro la cesta del ticket */
    for (let j = 0; j < ticket.cesta.lista.length; j++) {
      const campoOtros = this.construirCampoOtros(ticket);

      /* Inicio consumo personal. En Hit no se utiliza el id normal del trabajador para el consumo personal */
      let idFinalTrabajadorAux = null;
      let idFinalTrabajador = null;

      if (ticket.tipoPago === "CONSUMO_PERSONAL") {
        idFinalTrabajadorAux = await recHit(
          parametros.database,
          `SELECT valor FROM dependentesExtes WHERE id = ${ticket.idTrabajador} AND nom = 'CODICFINAL'`
        );
        idFinalTrabajador = `[Id:${idFinalTrabajadorAux.recordset[0].valor}]`;
      }
      /* Final consumo personal */

      /* Obtener el ID a insertar, si es tipo promocion combo, habrá dos inserts. El campo es 'plu' */
      let idArticulo = null;

      idArticulo = ticket.cesta.lista[j].idArticulo;
      sql += ` INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Num_tick, Estat, Plu, Quantitat, Import, Tipus_venta, FormaMarcar, Otros) VALUES (${
        parametros.codigoInternoTienda
      }, CONVERT(datetime, '${infoTime.year}-${infoTime.month}-${
        infoTime.day
      } ${infoTime.hours}:${infoTime.minutes}:${infoTime.seconds}', 120), ${
        ticket.idTrabajador
      }, ${ticket._id}, '', ${idArticulo}, ${ticket.cesta.lista[j].unidades}, ${
        ticket.tipoPago === "CONSUMO_PERSONAL"
          ? 0
          : ticket.cesta.lista[j].subtotal
      }, '${ticket.tipoPago === "CONSUMO_PERSONAL" ? "Desc_100" : "V"}', 0, '${
        ticket.tipoPago === "CONSUMO_PERSONAL" ? idFinalTrabajador : campoOtros
      }');`;
    }

    sql = `
                    DELETE FROM ${nombreTabla} WHERE botiga = ${parametros.codigoInternoTienda} AND Num_tick = ${ticket._id};
                    ${sql}
                `;
    await recHit(parametros.database, sql);

    ticket.enviado = true;
    const sql2 = `IF EXISTS (SELECT * FROM tocGameInfo WHERE licencia = ${
      parametros.licencia
    }) 
          BEGIN
              IF ((SELECT ultimoIdTicket FROM tocGameInfo WHERE licencia = ${
                parametros.licencia
              }) < ${ticket._id})
                  BEGIN
                      UPDATE tocGameInfo SET ultimoIdTicket = ${
                        ticket._id
                      }, ultimaConexion = ${Date.now()}, nombreTienda = '${
      parametros.nombreTienda
    }' WHERE licencia = ${parametros.licencia}
                    END
                END
        ELSE
            BEGIN
                INSERT INTO tocGameInfo (licencia, bbdd, ultimoIdTicket, codigoInternoTienda, nombreTienda, token, version, ultimaConexion) 
                    VALUES (${parametros.licencia}, '${parametros.database}', ${
      ticket._id
    }, ${parametros.codigoInternoTienda}, '${
      parametros.nombreTienda
    }', NEWID(), '4.0.0', ${Date.now()})
                                        END`;
    await recHit("Hit", sql2);

    return true;
  }
}
const ticketsInstance = new TicketsClass();
export { ticketsInstance };
