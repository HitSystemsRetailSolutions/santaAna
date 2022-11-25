import { Body, Controller, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { authInstance } from "src/auth/auth.class";
import { menusInstance } from "./menus.class";

@Controller("menus")
export class MenusController {
  @Post("getMenus")
  async getMenus(@Body() { codigoTienda }, @Req() req: Request) {
    try {
      if (codigoTienda) {
        const token = authInstance.getToken(req);
        const parametros = await authInstance.getParametros(token);
        if (parametros) {
          return await menusInstance.getMenus(
            parametros.database,
            codigoTienda
          );
        }
        throw Error("Error, autenticación errónea en menus/getMenus");
      }
      throw Error("Error, faltan datos en menus/getMenus");
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
