import { TokensCollection } from "src/auth/auth.interface";
import { recHit } from "src/conexion/mssql";
import { logger } from "src/logger/logger.class";
import { fechaParaSqlServer } from "../funciones/fechas";
import { CajaSincro } from "./cajas.interface";

function datosCorrectosParametros(parametros: TokensCollection) {
  if (parametros) {
    if (parametros.database == null || parametros.database == undefined) {
      return false;
    } else if (typeof parametros.database != "string") {
      return false;
    } else if (parametros.database.length == 0) {
      return false;
    }

    if (
      parametros.codigoInternoTienda == null ||
      parametros.codigoInternoTienda == undefined
    ) {
      return false;
    }

    if (parametros.licencia == null || parametros.licencia == undefined) {
      return false;
    }

    return true;
  }
  return false;
}

class CajasClass {
  /* Guarda una caja en el SQL WEB */
  async insertarCajas(parametros: TokensCollection, infoCaja: CajaSincro) {
    if (datosCorrectosParametros(parametros)) {
      const fechaInicio = fechaParaSqlServer(new Date(infoCaja.inicioTime));
      const fechaFinal = fechaParaSqlServer(new Date(infoCaja.finalTime));
      let sqlZGJ = "";
      let sqlW = "";
      let sqlWi = "";
      let sqlO = "";
      let sqlAna = "";
      let sqlAna2 = "";
      let sqlPrevisiones = "";
      let nombreTabla =
        "[V_Moviments_" + fechaFinal.year + "-" + fechaFinal.month + "]";

      sqlZGJ = `
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaFinal.year}-${fechaFinal.month}-${fechaFinal.day} ${fechaFinal.hours}:${fechaFinal.minutes}:${fechaFinal.seconds}', 120), ${infoCaja.idDependientaCierre}, 'DATAFONO_3G', ${infoCaja.totalDatafono3G}, '');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaFinal.year}-${fechaFinal.month}-${fechaFinal.day} ${fechaFinal.hours}:${fechaFinal.minutes}:${fechaFinal.seconds}', 120), ${infoCaja.idDependientaCierre}, 'Z', ${infoCaja.calaixFetZ}, '');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaFinal.year}-${fechaFinal.month}-${fechaFinal.day} ${fechaFinal.hours}:${fechaFinal.minutes}:${fechaFinal.seconds}', 120), ${infoCaja.idDependientaCierre}, 'G', ${infoCaja.nClientes}, '');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaFinal.year}-${fechaFinal.month}-${fechaFinal.day} ${fechaFinal.hours}:${fechaFinal.minutes}:${fechaFinal.seconds}', 120), ${infoCaja.idDependientaCierre}, 'J', ${infoCaja.descuadre}, '');
                `;
      sqlW = `
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaFinal.year}-${fechaFinal.month}-${fechaFinal.day} ${fechaFinal.hours}:${fechaFinal.minutes}:${fechaFinal.seconds}', 120), ${infoCaja.idDependientaCierre}, 'W', ${infoCaja.detalleCierre[0].valor}, 'En : 0.01');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaFinal.year}-${fechaFinal.month}-${fechaFinal.day} ${fechaFinal.hours}:${fechaFinal.minutes}:${fechaFinal.seconds}', 120), ${infoCaja.idDependientaCierre}, 'W', ${infoCaja.detalleCierre[1].valor}, 'En : 0.02');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaFinal.year}-${fechaFinal.month}-${fechaFinal.day} ${fechaFinal.hours}:${fechaFinal.minutes}:${fechaFinal.seconds}', 120), ${infoCaja.idDependientaCierre}, 'W', ${infoCaja.detalleCierre[2].valor}, 'En : 0.05');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaFinal.year}-${fechaFinal.month}-${fechaFinal.day} ${fechaFinal.hours}:${fechaFinal.minutes}:${fechaFinal.seconds}', 120), ${infoCaja.idDependientaCierre}, 'W', ${infoCaja.detalleCierre[3].valor}, 'En : 0.1');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaFinal.year}-${fechaFinal.month}-${fechaFinal.day} ${fechaFinal.hours}:${fechaFinal.minutes}:${fechaFinal.seconds}', 120), ${infoCaja.idDependientaCierre}, 'W', ${infoCaja.detalleCierre[4].valor}, 'En : 0.2');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaFinal.year}-${fechaFinal.month}-${fechaFinal.day} ${fechaFinal.hours}:${fechaFinal.minutes}:${fechaFinal.seconds}', 120), ${infoCaja.idDependientaCierre}, 'W', ${infoCaja.detalleCierre[5].valor}, 'En : 0.5');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaFinal.year}-${fechaFinal.month}-${fechaFinal.day} ${fechaFinal.hours}:${fechaFinal.minutes}:${fechaFinal.seconds}', 120), ${infoCaja.idDependientaCierre}, 'W', ${infoCaja.detalleCierre[6].valor}, 'En : 1');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaFinal.year}-${fechaFinal.month}-${fechaFinal.day} ${fechaFinal.hours}:${fechaFinal.minutes}:${fechaFinal.seconds}', 120), ${infoCaja.idDependientaCierre}, 'W', ${infoCaja.detalleCierre[7].valor}, 'En : 2');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaFinal.year}-${fechaFinal.month}-${fechaFinal.day} ${fechaFinal.hours}:${fechaFinal.minutes}:${fechaFinal.seconds}', 120), ${infoCaja.idDependientaCierre}, 'W', ${infoCaja.detalleCierre[8].valor}, 'En : 5');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaFinal.year}-${fechaFinal.month}-${fechaFinal.day} ${fechaFinal.hours}:${fechaFinal.minutes}:${fechaFinal.seconds}', 120), ${infoCaja.idDependientaCierre}, 'W', ${infoCaja.detalleCierre[9].valor}, 'En : 10');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaFinal.year}-${fechaFinal.month}-${fechaFinal.day} ${fechaFinal.hours}:${fechaFinal.minutes}:${fechaFinal.seconds}', 120), ${infoCaja.idDependientaCierre}, 'W', ${infoCaja.detalleCierre[10].valor}, 'En : 20');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaFinal.year}-${fechaFinal.month}-${fechaFinal.day} ${fechaFinal.hours}:${fechaFinal.minutes}:${fechaFinal.seconds}', 120), ${infoCaja.idDependientaCierre}, 'W', ${infoCaja.detalleCierre[11].valor}, 'En : 50');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaFinal.year}-${fechaFinal.month}-${fechaFinal.day} ${fechaFinal.hours}:${fechaFinal.minutes}:${fechaFinal.seconds}', 120), ${infoCaja.idDependientaCierre}, 'W', ${infoCaja.detalleCierre[12].valor}, 'En : 100');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaFinal.year}-${fechaFinal.month}-${fechaFinal.day} ${fechaFinal.hours}:${fechaFinal.minutes}:${fechaFinal.seconds}', 120), ${infoCaja.idDependientaCierre}, 'W', ${infoCaja.detalleCierre[13].valor}, 'En : 200');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaFinal.year}-${fechaFinal.month}-${fechaFinal.day} ${fechaFinal.hours}:${fechaFinal.minutes}:${fechaFinal.seconds}', 120), ${infoCaja.idDependientaCierre}, 'W', ${infoCaja.detalleCierre[14].valor}, 'En : 500');
            `;
      sqlWi = `
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaInicio.year}-${fechaInicio.month}-${fechaInicio.day} ${fechaInicio.hours}:${fechaInicio.minutes}:${fechaInicio.seconds}', 120), ${infoCaja.idDependientaCierre}, 'Wi', ${infoCaja.detalleApertura[0].valor}, 'En : 0.01');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaInicio.year}-${fechaInicio.month}-${fechaInicio.day} ${fechaInicio.hours}:${fechaInicio.minutes}:${fechaInicio.seconds}', 120), ${infoCaja.idDependientaCierre}, 'Wi', ${infoCaja.detalleApertura[1].valor}, 'En : 0.02');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaInicio.year}-${fechaInicio.month}-${fechaInicio.day} ${fechaInicio.hours}:${fechaInicio.minutes}:${fechaInicio.seconds}', 120), ${infoCaja.idDependientaCierre}, 'Wi', ${infoCaja.detalleApertura[2].valor}, 'En : 0.05');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaInicio.year}-${fechaInicio.month}-${fechaInicio.day} ${fechaInicio.hours}:${fechaInicio.minutes}:${fechaInicio.seconds}', 120), ${infoCaja.idDependientaCierre}, 'Wi', ${infoCaja.detalleApertura[3].valor}, 'En : 0.1');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaInicio.year}-${fechaInicio.month}-${fechaInicio.day} ${fechaInicio.hours}:${fechaInicio.minutes}:${fechaInicio.seconds}', 120), ${infoCaja.idDependientaCierre}, 'Wi', ${infoCaja.detalleApertura[4].valor}, 'En : 0.2');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaInicio.year}-${fechaInicio.month}-${fechaInicio.day} ${fechaInicio.hours}:${fechaInicio.minutes}:${fechaInicio.seconds}', 120), ${infoCaja.idDependientaCierre}, 'Wi', ${infoCaja.detalleApertura[5].valor}, 'En : 0.5');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaInicio.year}-${fechaInicio.month}-${fechaInicio.day} ${fechaInicio.hours}:${fechaInicio.minutes}:${fechaInicio.seconds}', 120), ${infoCaja.idDependientaCierre}, 'Wi', ${infoCaja.detalleApertura[6].valor}, 'En : 1');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaInicio.year}-${fechaInicio.month}-${fechaInicio.day} ${fechaInicio.hours}:${fechaInicio.minutes}:${fechaInicio.seconds}', 120), ${infoCaja.idDependientaCierre}, 'Wi', ${infoCaja.detalleApertura[7].valor}, 'En : 2');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaInicio.year}-${fechaInicio.month}-${fechaInicio.day} ${fechaInicio.hours}:${fechaInicio.minutes}:${fechaInicio.seconds}', 120), ${infoCaja.idDependientaCierre}, 'Wi', ${infoCaja.detalleApertura[8].valor}, 'En : 5');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaInicio.year}-${fechaInicio.month}-${fechaInicio.day} ${fechaInicio.hours}:${fechaInicio.minutes}:${fechaInicio.seconds}', 120), ${infoCaja.idDependientaCierre}, 'Wi', ${infoCaja.detalleApertura[9].valor}, 'En : 10');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaInicio.year}-${fechaInicio.month}-${fechaInicio.day} ${fechaInicio.hours}:${fechaInicio.minutes}:${fechaInicio.seconds}', 120), ${infoCaja.idDependientaCierre}, 'Wi', ${infoCaja.detalleApertura[10].valor}, 'En : 20');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaInicio.year}-${fechaInicio.month}-${fechaInicio.day} ${fechaInicio.hours}:${fechaInicio.minutes}:${fechaInicio.seconds}', 120), ${infoCaja.idDependientaCierre}, 'Wi', ${infoCaja.detalleApertura[11].valor}, 'En : 50');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaInicio.year}-${fechaInicio.month}-${fechaInicio.day} ${fechaInicio.hours}:${fechaInicio.minutes}:${fechaInicio.seconds}', 120), ${infoCaja.idDependientaCierre}, 'Wi', ${infoCaja.detalleApertura[12].valor}, 'En : 100');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaInicio.year}-${fechaInicio.month}-${fechaInicio.day} ${fechaInicio.hours}:${fechaInicio.minutes}:${fechaInicio.seconds}', 120), ${infoCaja.idDependientaCierre}, 'Wi', ${infoCaja.detalleApertura[13].valor}, 'En : 200');
                INSERT INTO ${nombreTabla} (Botiga, Data, Dependenta, Tipus_moviment, Import, Motiu) VALUES (${parametros.codigoInternoTienda}, CONVERT(datetime, '${fechaInicio.year}-${fechaInicio.month}-${fechaInicio.day} ${fechaInicio.hours}:${fechaInicio.minutes}:${fechaInicio.seconds}', 120), ${infoCaja.idDependientaCierre}, 'Wi', ${infoCaja.detalleApertura[14].valor}, 'En : 500');
                `;
      sqlAna = `INSERT INTO feinesafer VALUES (newid(), 'VigilarAlertes', 0, 'Caixa', '[${fechaInicio.day}-${fechaInicio.month}-${fechaInicio.year} de ${fechaInicio.hours}:${fechaInicio.minutes} a ${fechaFinal.hours}:${fechaFinal.minutes}]', '[${parametros.codigoInternoTienda}]', '${infoCaja.descuadre}', '${infoCaja.calaixFetZ}', getdate());`;
      sqlAna2 = `insert into feinesafer values (newid(), 'SincroMURANOCaixaOnLine', 0, '[${parametros.codigoInternoTienda}]', '[${fechaInicio.day}-${fechaInicio.month}-${fechaInicio.year} ${fechaInicio.hours}:${fechaInicio.minutes}:${fechaInicio.seconds}]', '[${fechaFinal.day}-${fechaFinal.month}-${fechaFinal.year} ${fechaFinal.hours}:${fechaFinal.minutes}:${fechaFinal.seconds}]', '[${infoCaja.primerTicket},${infoCaja.ultimoTicket}]', '[${infoCaja.calaixFetZ}]', getdate());`;
      sqlPrevisiones = `INSERT INTO feinesafer values (newid(), 'PrevisionsVendesDiari', 0, '${
        fechaFinal.day
      }/${fechaFinal.month}/${fechaFinal.year}', '${
        parametros.codigoInternoTienda
      }', '${
        Number(fechaFinal.hours) < 16 ? "MATI" : "TARDA"
      }', '' ,'', GETDATE());`;
      let sqlCompleta =
        sqlZGJ + sqlW + sqlWi + sqlAna + sqlAna2 + sqlPrevisiones;

      /* Primero comprobamos que no se repita la caja */
      /* IMPORTANTE: NO MODIFICAR LOS MENSAJES DEL SELECT!!! */
      const sqlRepeticion = `
                DECLARE @ultimaCajaV4 VARCHAR(255);
                IF EXISTS (select * from tocGameInfo where licencia = ${parametros.licencia} AND codigoInternoTienda = ${parametros.codigoInternoTienda})
                    BEGIN
                        SELECT @ultimaCajaV4 = ultimaCajaV4 FROM tocGameInfo WHERE licencia = ${parametros.licencia} AND codigoInternoTienda = ${parametros.codigoInternoTienda}
                        IF ('${infoCaja._id}' > @ultimaCajaV4)
                            BEGIN
                                IF NOT EXISTS (select * from [${parametros.database}].[dbo].${nombreTabla} where botiga = ${parametros.codigoInternoTienda} AND Data = CONVERT(datetime, '${fechaInicio.year}-${fechaInicio.month}-${fechaInicio.day} ${fechaInicio.hours}:${fechaInicio.minutes}:${fechaInicio.seconds}', 120))
                                    BEGIN
                                        UPDATE tocGameInfo SET ultimaCajaV4 = '${infoCaja._id}' WHERE licencia = ${parametros.licencia} AND codigoInternoTienda = ${parametros.codigoInternoTienda} 
                                        SELECT 'OK' as resultado
                                    END
                                ELSE
                                    BEGIN
                                        SELECT 'NOP' as resultado, 'Ya existe o es antigua' as mensaje
                                    END
                            END
                        ELSE
                            BEGIN
                                SELECT 'NOP' as resultado, 'Ya existe o es antigua' as mensaje
                            END
                    END
                ELSE
                    BEGIN
                        SELECT 'NOP' as resultado, 'No existe la fila para esta tienda en tocGameInfo' as mensaje
                    END
                `;

      let resSqlRepeticion = null;
      let errorSalir = false;
      resSqlRepeticion = await recHit("hit", sqlRepeticion);

      if (errorSalir == false) {
        if (resSqlRepeticion.recordset.length == 1) {
          if (
            resSqlRepeticion.recordset[0].resultado == "OK" ||
            (resSqlRepeticion.recordset[0].resultado == "NOP" &&
              resSqlRepeticion.recordset[0].mensaje == "Ya existe o es antigua")
          ) {
            const aux = await recHit(parametros.database, sqlCompleta);
            if (aux.rowsAffected.length > 0) {
              this.guardar3G(infoCaja.totalDatafono3G, parametros.nombreTienda);
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  /* Función que pide Jesus temporalmente (3G) */
  async guardar3G(cantidad3G: number, nombreTienda: string) {
    try {
      const sql = `
      INSERT INTO info_datafono_manual (tienda, cantidad) VALUES ('${nombreTienda}', ${cantidad3G})
      `;
      await recHit("Fac_Tena", sql);
    } catch (err) {
      logger.Error("cajas.class/enviarCorreo", err.message);
    }
  }
}
const cajasInstance = new CajasClass();
export { cajasInstance };
