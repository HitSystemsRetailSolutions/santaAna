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
        if (password === PASSWORD_INSTALLWIZARD)
          return await parametrosInstance.getParametros(numLlicencia);

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
        return await parametrosInstance.getParametros(parametros.licencia);
      }
      throw Error("Error, autenticación errónea en parametros/getParametros");
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
