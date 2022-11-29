import { Controller, Get, Req } from "@nestjs/common";
import { Request } from "express";
import { logger } from "../logger/logger.class";
import { authInstance } from "../auth/auth.class";
import { tarifasInstance } from "../tarifas/tarifas.class";

import { articulosInstance } from "./articulos.class";

@Controller("articulos")
export class ArticulosController {
  @Get("descargarArticulos")
  async descargarArticulos(@Req() req: Request) {
    try {
      const token = authInstance.getToken(req);
      const parametros = await authInstance.getParametros(token);
      if (parametros) {
        const articulos = await articulosInstance.getArticulos(
          parametros.database
        );
        const tarifaEspecial = await tarifasInstance.getTarifaTienda(
          parametros.database,
          parametros.codigoInternoTienda
        );
        return articulosInstance.fusionarArticulosConTarifasEspeciales(
          articulos,
          tarifaEspecial
        );
      }
      throw Error(
        "Error, autenticación errónea en articulos/descargarArticulos"
      );
    } catch (err) {
      logger.Error("descargarArticulos", err);
      return false;
    }
  }
}
