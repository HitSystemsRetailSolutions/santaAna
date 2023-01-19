import { Controller, Post, Req, Body } from "@nestjs/common";
import { Request } from "express";
import { authInstance } from "../auth/auth.class";
import { logger } from "../logger/logger.class";
import { movimientosInstance } from "./movimientos.class";
import { MovimientosInterface } from "./movimientos.interface";

@Controller("movimientos")
export class MovimientosController {
  @Post("enviarMovimiento")
  async enviarMovimiento(
    @Body() { movimiento }: { movimiento: MovimientosInterface },
    @Req() req: Request
  ) {
    try {
      const token = authInstance.getToken(req);
      const parametros = await authInstance.getParametros(token);
      if (parametros) {
        return await movimientosInstance.insertarMovimiento(
          parametros,
          movimiento
        );
      }
      throw Error("Autenticación incorrecta");
    } catch (err) {
      logger.Error("movimientos/enviarMovimiento()", err);
      return false;
    }
  }
}
