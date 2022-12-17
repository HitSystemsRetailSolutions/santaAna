import { Controller, Body, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { logger } from "../logger/logger.class";
import { authInstance } from "../auth/auth.class";
import { ticketsInstance } from "./tickets.class";

@Controller("tickets")
export class TicketsController {
  @Post("enviarTicket")
  async enviarTicket(@Body() { ticket }, @Req() req: Request) {
    try {
      const token = authInstance.getToken(req);
      const parametros = await authInstance.getParametros(token);

      if (parametros)
        await ticketsInstance.insertarTicketsNueva(ticket, parametros);

      throw Error("Error en la autenticación de tickets/enviarTicket");
    } catch (err) {
      logger.Error("tickets/enviarTicket()", err);
      return false;
    }
  }
}
