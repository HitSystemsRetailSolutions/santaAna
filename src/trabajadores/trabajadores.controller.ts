import { Controller, Get, Req } from "@nestjs/common";
import { Request } from "express";
import { authInstance } from "../auth/auth.class";

import { dependientasInstance } from "./trabajadores.class";

@Controller("trabajadores")
export class TrabajadoresController {
  /* Eze 4.0 */
  @Get("getTrabajadores")
  async descargarTrabajadores(@Req() req: Request) {
    try {
      const token = authInstance.getToken(req);
      const parametros = await authInstance.getParametros(token);
      if (parametros) {
        return await dependientasInstance.getTrabajadores(parametros.database).then((res)=>{
          return { error: false, info: res };
        }).catch((err) => {
          console.log(err);
          return { error: true, mensaje: 'SanPedro: dependientas/descargar error catch' };
        });
      }
      throw Error(
        "Error, autenticación errónea en trabajadores/getTrabajadores"
      );
    } catch (err) {
      console.log(err);
      return { error: true, mensaje: 'SanPedro: dependientas/descargar faltan todos los datos' };
    }
  }
}
