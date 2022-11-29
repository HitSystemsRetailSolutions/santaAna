import { Controller, Get, Req } from "@nestjs/common";
import { Request } from "express";
import { authInstance } from "../auth/auth.class";
import { logger } from "../logger/logger.class";
import { entregasInstance } from "./entregas.class";

@Controller("entregas")
export class EntregasController {
  @Get("getEntregas")
  async getEntregas(@Req() req: Request) {
    try {
      const token = authInstance.getToken(req);
      const parametros = await authInstance.getParametros(token);
      if (parametros) {
        return await entregasInstance.getEntregas(
          parametros.database,
          parametros.licencia
        );
      }
      throw Error("Error, autenticación errónea en getEntregas");
    } catch (err) {
      logger.Error("getEntregas", err);
      return false;
    }
  }
}
