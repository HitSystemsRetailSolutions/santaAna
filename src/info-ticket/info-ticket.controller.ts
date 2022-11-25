import { Body, Controller, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { authInstance } from "../auth/auth.class";
import { infoTicketInstance } from "./info-ticket.class";

@Controller("infoTicket")
export class InfoTicketController {
  @Post("getInfoTicket")
  async getInfoTicket(@Body() { codigoTienda }, @Req() req: Request) {
    try {
      if (codigoTienda) {
        const token = authInstance.getToken(req);
        const parametros = await authInstance.getParametros(token);
        if (parametros) {
          return await infoTicketInstance.getInfoTicket(
            parametros.database,
            codigoTienda
          );
        }
        throw Error("Error, autenticación errónea en infoTicket/getInfoTicket");
      }
      throw Error("Error, faltan datos en infoTicket/getInfoTicket");
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
