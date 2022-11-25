import { Controller, Get, Req } from "@nestjs/common";
import { Request } from "express";
import { authInstance } from "../auth/auth.class";
import { tarifasInstance } from "./tarifas.class";

@Controller("tarifas")
export class TarifasController {
  /* Eze 4.0 */
  @Get("getTarifasEspeciales")
  async getTarifasEspeciales(@Req() req: Request) {
    try {
      const token = authInstance.getToken(req);
      const parametros = await authInstance.getParametros(token);

      if (parametros) {
        return await tarifasInstance.getTarifasEspeciales(parametros.database);
      }
      throw Error(
        "Error, autenticación errónea en tarifas/getTarifasEspeciales"
      );
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
