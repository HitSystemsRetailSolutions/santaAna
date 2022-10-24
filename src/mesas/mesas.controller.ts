import { Controller, Post, Body, Req, Get } from "@nestjs/common";
import { Request } from "express";
import { authInstance } from "src/auth/auth.class";
import { mesasInstance } from "./mesas.class";

@Controller("mesas")
export class MesasController {
  @Get("getEstructuraMesas")
  async getEstructuraMesas(@Req() req: Request) {
    try {
      const token = req.headers.authorization;
      if (token) {
        const parametros = await authInstance.getParametros(token);
        return await mesasInstance.getEstructuraMesas(parametros.licencia);
      }
      throw Error(
        "Error, faltan parámetros en getEstructuraMesas() mesas.controller"
      );
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  @Post("saveMesas")
  async saveMesas(@Body() { arrayMesas }, @Req() req: Request) {
    try {
      const token = req.headers.authorization;
      if (token && arrayMesas && arrayMesas.length === 50) {
        const parametros = await authInstance.getParametros(token);
        return await mesasInstance.saveMesas(parametros.licencia, arrayMesas);
      }
      throw Error(
        "Error, faltan parámetros o son incorrectos en saveMesas mesas.controller.ts"
      );
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
