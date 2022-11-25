import { Controller, Get, Req } from "@nestjs/common";
import { Request } from "express";
import { authInstance } from "../auth/auth.class";
import { teclasInstance } from "./teclas.class";

@Controller("teclas")
export class TeclasController {
  @Get("descargarTeclados")
  async descargarTeclados(@Req() req: Request) {
    try {
      const token = authInstance.getToken(req);
      const parametros = await authInstance.getParametros(token);

      if (parametros) {
        return await teclasInstance.getTeclas(
          parametros.database,
          parametros.licencia
        );
      }
      throw Error("Error, autenticación errónea en teclas/descargarTeclados");
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
