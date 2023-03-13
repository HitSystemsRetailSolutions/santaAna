import { Controller, Body, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { logger } from "../logger/logger.class";
import { authInstance } from "../auth/auth.class";
import { ticketsInstance } from "./tickets.class";
import { SuperTicketInterface } from "./tickets.interface";

@Controller("tickets")
export class TicketsController {
  @Post("enviarTicket")
  async enviarTicket(@Body() ticket, @Req() req: Request) {
    try {
      console.log("sinna",ticket,"string", ticket.superTicket["newSuperticket"]);
      const token = authInstance.getToken(req);
      const parametros = await authInstance.getParametros(token);
      let newticket: SuperTicketInterface = undefined;
      if (parametros) {
        if (ticket.superTicket["newSuperticket"] == undefined) {
          newticket = ticket.superTicket;
          return await ticketsInstance.insertarTicketsNueva(
            newticket,
            parametros
          );
        } else {
          return await ticketsInstance.insertarTicketsNueva(ticket.superTicket, parametros);
        }
      }

      throw Error("Error en la autenticación de tickets/enviarTicket");
    } catch (err) {
      logger.Error("tickets/enviarTicket()", err);
      return false;
    }
  }
}
