import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { authInstance } from "src/auth/auth.class";
import { promocionesInstance } from "./promociones.class";

@Controller("promociones")
export class PromocionesController {
  /* Para tocGameV4 */
  @Get("getPromociones")
  async getPromociones(@Req() req: Request) {
    try {
      const token = req.headers.authorization;
      if (token) {
        const parametros = await authInstance.getParametros(token);
        return promocionesInstance.getPromocionesNueva(
          parametros.database,
          parametros.licencia
        );
      }
      throw Error("Falta autorización en getPromocionesNueva");
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
