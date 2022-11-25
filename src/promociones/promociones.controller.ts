import { Body, Controller, Get, Req } from "@nestjs/common";
import { Request } from "express";
import { authInstance } from "../auth/auth.class";
import { promocionesInstance } from "./promociones.class";

@Controller("promociones")
export class PromocionesController {
  /* Eze 4.0*/
  @Get("getPromociones")
  async getPromociones(@Req() req: Request) {
    try {
      const token = authInstance.getToken(req);
      const parametros = await authInstance.getParametros(token);

      if (parametros) {
        return await promocionesInstance.getPromocionesNueva(
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
