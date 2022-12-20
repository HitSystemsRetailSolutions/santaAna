import { Body, Controller, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { authInstance } from "../auth/auth.class";
import { logger } from "../logger/logger.class";
import { cajasInstance } from "./cajas.class";
import { CajaSincro } from "./cajas.interface";

@Controller("cajas")
export class CajasController {
  /* Eze 4.0 */
  @Post("enviarCaja")
  async enviarCaja(
    @Body() { caja }: { caja: CajaSincro },
    @Req() req: Request
  ) {
    try {
      const token = authInstance.getToken(req);
      const parametros = await authInstance.getParametros(token);
      if (parametros) return await cajasInstance.insertarCajas(parametros, caja);

      throw Error("Autenticación fallida en cajas/enviarCaja");
    } catch (err) {
      logger.Error("cajas/enviarCaja()", err);
      return false;
    }
  }
}
