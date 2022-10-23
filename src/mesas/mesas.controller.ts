import { Controller, Post, Body } from "@nestjs/common";
import { authInstance } from "src/auth/auth.class";
import { mesasInstance } from "./mesas.class";

@Controller("mesas")
export class MesasController {
  @Post("getEstructuraMesas")
  async getEstructuraMesas(@Body() { token }) {
    try {
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
}
