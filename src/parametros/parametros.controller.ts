import { Controller, Body, Post, Get, Req } from "@nestjs/common";
import { Request } from "express";
import { logger } from "../logger/logger.class";
import { authInstance } from "../auth/auth.class";
import { recHit } from "../conexion/mssql";
import { PASSWORD_INSTALLWIZARD } from "../secrets";
import { parametrosInstance } from "./parametros.class";

@Controller("parametros")
export class ParametrosController {
  /* Eze 4.0 */
  @Post("instaladorLicencia")
  async instaladorLicencia(@Body() { password, numLlicencia }) {
    try {
      if (password && numLlicencia) {
        if (password === PASSWORD_INSTALLWIZARD) {
          const sqlParaImprimir = `SELECT ll.Llicencia, ll.Empresa, ll.LastAccess, we.Db, ISNULL(ti.ultimoIdTicket, 0) as ultimoIdTicket, ti.token FROM llicencies ll LEFT JOIN Web_Empreses we ON ll.Empresa = we.Nom LEFT JOIN tocGameInfo ti ON ti.licencia = ${numLlicencia} WHERE ll.Llicencia = ${numLlicencia}`;
          const res1 = await recHit("Hit", sqlParaImprimir);
          const sqlParaImprimir2 = `SELECT Nom, Codi as codigoTienda FROM clients WHERE Codi = (SELECT Valor1 FROM ParamsHw WHERE Codi = ${res1.recordset[0].Llicencia})`;
          const data2 = await recHit(res1.recordset[0].Db, sqlParaImprimir2);

          if (res1.recordset.length === 1) {
            const dataF = await recHit(
              res1.recordset[0].Db,
              `SELECT * FROM paramstpv WHERE CodiClient = ${res1.recordset[0].Llicencia} `
            );

            let paramstpv = {};

            for (let index = 0; index < dataF.recordset.length; index++) {
              if (dataF.recordset[index].Valor == "Si") {
                paramstpv[dataF.recordset[index].Variable] =
                  dataF.recordset[index].Valor;
              }
            }

            return {
              licencia: parseInt(res1.recordset[0].Llicencia),
              nombreEmpresa: res1.recordset[0].Empresa,
              database: res1.recordset[0].Db,
              nombreTienda: data2.recordset[0].Nom,
              codigoTienda: data2.recordset[0].codigoTienda,
              ultimoTicket: res1.recordset[0].ultimoIdTicket,
              ...paramstpv,
              token: res1.recordset[0].token,
            };
          }
        }
        throw Error("Error en la autenticación del servidor");
      }
      throw Error("Error, faltan datos en parametros/instaladorLicencia");
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Get("getParametros")
  async parametros(@Req() req: Request) {
    try {
      const token = authInstance.getToken(req);
      const parametros = await authInstance.getParametros(token);
      if (parametros) {
        return await parametrosInstance.getParametros(parametros);
      }
      throw Error("Error, autenticación errónea en parametros/getParametros");
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
