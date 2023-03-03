import { MovimientosInterface } from "./movimientos.interface";
import { fechaParaSqlServer } from "../funciones/fechas";
import { recHit } from "../conexion/mssql";
import { TokensCollection } from "src/auth/auth.interface";

function comprobarMovimiento(movimiento: MovimientosInterface) {
  let error = false;

  if (movimiento._id == null || movimiento._id == undefined) {
    error = true;
  }

  if (movimiento.tipo == null || movimiento.tipo == undefined) {
    error = true;
  }

  if (movimiento.valor == null || movimiento.valor == undefined) {
    error = true;
  }

  if (movimiento.concepto == null || movimiento.concepto == undefined) {
    error = true;
  }

  if (movimiento.idTrabajador == null || movimiento.idTrabajador == undefined) {
    error = true;
  }

  return error;
}

/* Elimina los caracteres especiales que rompen la consulta SQL */
function limpiarStringCaracteresEspeciales(cadena: string) {
  let cadenaLimpia = cadena.replace("'", " ");
  cadenaLimpia = cadenaLimpia.replace('"', " ");
  return cadenaLimpia;
}

function esSalida(movimiento: MovimientosInterface): boolean {
  switch (movimiento.tipo) {
    case "TARJETA":
    case "DATAFONO_3G":
    case "DEUDA":
    case "ENTREGA_DIARIA":
    case "TKRS_CON_EXCESO":
    case "SALIDA":
    case "TKRS_SIN_EXCESO":
      return true;
    case "ENTRADA_DINERO":
      return false;
    default:
      throw Error("Tipo de movimiento desconocido");
  }
}

class Movimientos {
  async insertarMovimiento(
    parametros: TokensCollection,
    movimiento: MovimientosInterface
  ) {
    if (!comprobarMovimiento(movimiento)) {
      let sql = "";
      let sqlBarras = "";
      let error = false;
      const fecha = fechaParaSqlServer(new Date(movimiento._id));
      const nombreTabla = `[V_Moviments_${fecha.year}-${fecha.month}]`;
      let concepto = movimiento.concepto;

      switch (movimiento.tipo) {
        case "TARJETA":
          concepto = `Pagat Targeta: ${movimiento.idTicket}`;
          break;
        case "TKRS_CON_EXCESO":
          concepto = `Excs.TkRs:  [${movimiento.idTicket}]`;
          break;
        case "TKRS_SIN_EXCESO":
          concepto = `Pagat TkRs:  [${movimiento.idTicket}]`;
          break;
        case "ENTREGA_DIARIA":
        case "ENTRADA_DINERO":
        case "DATAFONO_3G":
        case "SALIDA":
        case "DEUDA":
          concepto = `Deute client: ${movimiento.idTicket}`;
          break;
        default:
          error = true;
          break;
      }

      if (!error) {
        if (movimiento.codigoBarras != "" && movimiento.codigoBarras) {
          sqlBarras = `INSERT INTO CodisBarresReferencies (Num, Tipus, Estat, Data, TmSt, Param1, Param2, Param3, Param4) VALUES (${
            movimiento.codigoBarras
          }, 'Moviments', 'Creat', CONVERT(datetime, '${fecha.year}-${
            fecha.month
          }-${fecha.day} ${fecha.hours}:${fecha.minutes}:${
            fecha.seconds
          }', 120), CONVERT(datetime, '${fecha.year}-${fecha.month}-${
            fecha.day
          } ${fecha.hours}:${fecha.minutes}:${fecha.seconds}', 120), ${
            parametros.licencia
          }, ${movimiento.idTrabajador}, ${-movimiento.valor}, '${fecha.day}/${
            fecha.month
          }/${fecha.year} ${fecha.hours}:${fecha.minutes}:${fecha.seconds}');`;
        }
        sql = `
                    IF EXISTS (select  * from ${nombreTabla} WHERE botiga = ${
          parametros.codigoInternoTienda
        } AND Import = ${
          esSalida(movimiento) ? -movimiento.valor : movimiento.valor
        } AND Tipus_moviment = '${
          esSalida(movimiento) ? "O" : "A"
        }' AND Data = CONVERT(datetime, '${fecha.year}-${fecha.month}-${
          fecha.day
        } ${fecha.hours}:${fecha.minutes}:${fecha.seconds}', 120))
                        BEGIN
                            SELECT 'YA_EXISTE' as resultado
                        END
                    ELSE
                        BEGIN
                            DELETE FROM ${nombreTabla} WHERE Botiga = ${
          parametros.codigoInternoTienda
        } AND Data = CONVERT(datetime, '${fecha.year}-${fecha.month}-${
          fecha.day
        } ${fecha.hours}:${fecha.minutes}:${
          fecha.seconds
        }', 120) AND  Dependenta = ${movimiento.idTrabajador} AND Import = ${
          esSalida(movimiento) ? -movimiento.valor : movimiento.valor
        };
                            INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${
          parametros.codigoInternoTienda
        }, CONVERT(datetime, '${fecha.year}-${fecha.month}-${fecha.day} ${
          fecha.hours
        }:${fecha.minutes}:${fecha.seconds}', 120), ${
          movimiento.idTrabajador
        }, '${esSalida(movimiento) ? "O" : "A"}', ${
          esSalida(movimiento) ? -movimiento.valor : movimiento.valor
        }, '${limpiarStringCaracteresEspeciales(concepto)}'); 
                            ${sqlBarras} 
                            SELECT 'OK' as resultado
                        END
                    `;

        const res = await recHit(parametros.database, sql);
        if (
          res.recordset[0].resultado == "OK" ||
          (res.recordset[0].resultado === "YA_EXISTE" &&
            res.rowsAffected.length > 0)
        ) {
          return true;
        }
      }
    } else {
      throw Error("Formato de movimiento no es correcto");
    }
    return false;
  }
}

const movimientosInstance = new Movimientos();
export { movimientosInstance };
