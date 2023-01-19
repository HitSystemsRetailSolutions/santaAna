import { recHit } from "src/conexion/mssql";
import { fechaParaSqlServer } from "src/funciones/fechas";
import { ParametrosInterface } from "src/parametros/parametros.interface";
import { DevolucionesInterface } from "./devoluciones.interface";

class DevolucionesClass {
  datosCorrectosParametros(parametros: ParametrosInterface) {
    let error = false;
    let mensaje = "";

    if (parametros != undefined && parametros != null) {
      /* Comprobación database */
      if (parametros.database == null || parametros.database == undefined) {
        error = true;
        mensaje += "database es null o undefined\n";
      } else if (typeof parametros.database != "string") {
        error = true;
        mensaje += "database no es tipo string\n";
      } else if (parametros.database.length == 0) {
        error = true;
        mensaje += "database está vacío\n";
      }

      /* Comprobación codigoTienda */
      if (
        parametros.codigoTienda == null ||
        parametros.codigoTienda == undefined
      ) {
        error = true;
        mensaje += "codigoTienda es null o undefined\n";
      }

      /* Comprobación licencia */
      if (parametros.licencia == null || parametros.licencia == undefined) {
        error = true;
        mensaje += "licencia es null o undefined\n";
      }
      /* Comprobación nombreTienda */
      if (
        parametros.nombreTienda == null ||
        parametros.nombreTienda == undefined
      ) {
        error = true;
        mensaje += "nombreTienda es null o undefined\n";
      }
    } else {
      error = true;
      mensaje += "parametros en si no está definido o nulo\n";
    }

    return { error, mensaje };
  }
  async insertarDevoluciones(
    parametros: ParametrosInterface,
    devolucion: DevolucionesInterface,
    server: any
  ) {
    let error = false;
    let mensaje = "";
    const resParametros = this.datosCorrectosParametros(parametros);
    if (resParametros.error == false) {
      let sqlServit = " ";
      let sqlTornat = "";
      const infoTime = fechaParaSqlServer(new Date(devolucion.timestamp));
      let nombreTablaServit = `[Servit-${infoTime.year.substring(2)}-${
        infoTime.month
      }-${infoTime.day}]`;
      let nombreTablaTornat = `[V_Tornat_${infoTime.year}-${infoTime.month}]`;
      for (let j = 0; j < devolucion.cesta.lista.length; j++) {
        let devolucionActual = devolucion;
        if (typeof devolucionActual.cesta.lista[j] === "object") {
          let idArticulo = null;

          if (typeof devolucionActual.cesta.lista[j].idArticulo === "number") {
            if (!devolucionActual.cesta.lista[j].promocion) {
              idArticulo = devolucionActual.cesta.lista[j].idArticulo;
              sqlTornat += `INSERT INTO ${nombreTablaTornat} (Botiga, Data, Dependenta, Num_tick, Estat, Plu, Quantitat, Import, Tipus_venta) VALUES (${parametros.codigoTienda}, CONVERT(datetime, '${infoTime.year}-${infoTime.month}-${infoTime.day} ${infoTime.hours}:${infoTime.minutes}:${infoTime.seconds}', 120), ${devolucion.idTrabajador}, 0, '', ${devolucionActual.cesta.lista[j].idArticulo}, ${devolucionActual.cesta.lista[j].unidades}, ${devolucionActual.cesta.lista[j].subtotal}, 'V');`;
              sqlServit += `INSERT INTO ${nombreTablaServit} VALUES (newid(), CONVERT(datetime, '${infoTime.year}-${infoTime.month}-${infoTime.day} ${infoTime.hours}:${infoTime.minutes}:${infoTime.seconds}', 120), 'Botiga ${parametros.nombreTienda}', ${parametros.codigoTienda}, ${idArticulo}, ${idArticulo}, 'AUTO', 'AUTO', 0, ${devolucionActual.cesta.lista[j].unidades}, 0, '', 0, 2, '', '', 0, '', '', '')`;
            }
          }
        }
      }
      const sql = `
                    IF NOT EXISTS (SELECT * FROM ${nombreTablaTornat} WHERE botiga = ${
        parametros.codigoTienda
      } AND Plu = ${
        devolucion.cesta.lista[0].idArticulo
      } AND Data = CONVERT(datetime, '${infoTime.year}-${infoTime.month}-${
        infoTime.day
      } ${infoTime.hours}:${infoTime.minutes}:${infoTime.seconds}', 120))
                        BEGIN
                            ${sqlTornat + sqlServit}
                            SELECT 'OK' as resultado;
                        END
                    ELSE
                    BEGIN
                        SELECT 'YA_EXISTE' as resultado;
                    END
                `;

      try {
        const res = await recHit(parametros.database, sql);
        if (res.recordset.length > 0) {
          if (res.recordset[0].resultado === "YA_EXISTE") {
            devolucion["intentaRepetir"] = "YES";
            devolucion.enviado = true;
          } else if (res.recordset[0].resultado === "OK") {
            devolucion.enviado = true;
          } else {
            server.emit("resSincroDevoluciones", {
              error: true,
              mensaje:
                "SanPedro: Error, caso incontrolado. Respuesta desconocida.",
              devolucion,
              idDevolucionProblematica: devolucion._id,
            });
          }
        } else {
          server.emit("resSincroDevoluciones", {
            error: true,
            mensaje: "SanPedro: ERROR en recHit 1. recordset.length = 0",
            idDevolucionProblematica: devolucion._id,
          });
        }
      } catch (err) {
        console.log(err);
        server.emit("resSincroDevoluciones", {
          error: true,
          mensaje: "SanPedro: SQL ERROR 1. Mirar log",
          devolucion,
          idDevolucionProblematica: devolucion._id,
        });
      }

      if (!error) {
        server.emit("resSincroDevoluciones", { error: false, devolucion });
      }
    } else {
      // DEVOLVER TAL CUAL LA DEVOLUCIÓN PORQUE NO SE HA MODIFICADO NADA DEBIDO A UN ERROR
      devolucion["comentario"] = resParametros.mensaje;
      server.emit("resSincroDevoluciones", {
        error: true,
        devolucion,
        mensaje: devolucion["comentario"],
      });
    }
  }
}

const devolucionesInstance = new DevolucionesClass();
export { devolucionesInstance };
