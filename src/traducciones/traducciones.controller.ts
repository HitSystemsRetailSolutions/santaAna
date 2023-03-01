import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { logger } from "../logger/logger.class";
import { authInstance } from "../auth/auth.class";
import { tarifasInstance } from "../tarifas/tarifas.class";

import { traduccionesInstance } from "./traducciones.class";

@Controller("traducciones")
export class TraduccionesController {
  @Get("getTraducciones")
  async getTraducciones(@Req() req: Request) {
    try {
      const parametros = await authInstance.getParametros(authInstance.getToken(req));
      if(!parametros)
        return {
          error: true,
          msg: 'Autenticación incorrecta'
        };

      return await traduccionesInstance.getTraducciones();
    } catch (err) {
      logger.Error('traducciones/getTraducciones()', err);
      return {
        error: true,
        msg: 'Error general'
      };
    }
  }

  @Get("getIdioma")
  async getIdioma(@Req() req: Request) {
    try {
      const parametros = await authInstance.getParametros(authInstance.getToken(req));
      if(!parametros)
        return {
          error: true,
          msg: 'Autenticación incorrecta'
        };

      return await traduccionesInstance.getIdioma(parametros);
    } catch (err) {
      logger.Error('traducciones/getIdioma()', err);
      return {
        error: true,
        msg: 'Error general'
      };
    }
  }
  @Post("setTraduccionesKeys")
  async setTraduccionesKeys(@Body() traducciones, @Req() req: Request) {
    try {
      const parametros = await authInstance.getParametros(authInstance.getToken(req));
      if(!parametros)
        return {
          error: true,
          msg: 'Autenticación incorrecta'
        };
      if(!traducciones || !traducciones.length)
        return {
          error: true,
          msg: 'El array de traducciones viene vacío.'
        }
      return await traduccionesInstance.setTraduccionesKeys(traducciones);
      
    } catch(err) {
      logger.Error('traducciones/setTraduccionesKeys()', err);
      return {
        error: true,
        msg: 'Error general'
      };
    }

  }
}
// async enviarMovimiento(
//     @Body() { movimiento }: { movimiento: MovimientosInterface },
//     @Req() req: Request
//   ) {
//     try {
//       const token = authInstance.getToken(req);
//       const parametros = await authInstance.getParametros(token);
//       if (parametros) {
//         return await movimientosInstance.insertarMovimiento(
//           parametros,
//           movimiento
//         );
//       }
//       throw Error("Autenticación incorrecta");
//     } catch (err) {
//       logger.Error("movimientos/enviarMovimiento()", err);
//       return false;
//     }
//   }