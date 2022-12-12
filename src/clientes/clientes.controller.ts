import { Controller, Post, Body, Get, Req } from "@nestjs/common";
import { authInstance } from "../auth/auth.class";
import { UtilesModule } from "../utiles/utiles.module";
import { clientesInstance } from "./clientes.class";
import { Request } from "express";
import { logger } from "../logger/logger.class";

@Controller("clientes")
export class ClientesController {
  /* Eze 4.0 */
  @Post("getClientConfig")
  async getClientConfig(@Body() { idClienteFinal }, @Req() req: Request) {
    try {
      if (idClienteFinal) {
        const token = authInstance.getToken(req);
        const parametros = await authInstance.getParametros(token);
        if (parametros) {
          return await clientesInstance.getClientConfig(
            parametros.database,
            idClienteFinal
          );
        }
        throw Error("Error, autenticación errónea en clientes/esVip");
      }
      throw Error("Error, faltan datos en clientes/esVip");
    } catch (err) {
      logger.Error("getClientConfig", err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Get("getClientesFinales")
  async getClientesFinales(@Req() req: Request) {
    try {
      const token = authInstance.getToken(req);
      const parametros = await authInstance.getParametros(token);
      if (parametros) {
        const allClients = await clientesInstance.getClientes(
          parametros.database
        );
        const clientesAlbaran = await clientesInstance.getClientesAlbaran(
          parametros.database
        );
        return clientesInstance.fusionarClientes(allClients, clientesAlbaran);
      }
      throw Error(
        "Error, autenticación errónea en clientes/getClientesFinales"
      );
    } catch (err) {
      logger.Error("getClientesFinales", err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Post("resetPuntosCliente")
  async resetPuntosCliente(@Body() { idClienteFinal }, @Req() req: Request) {
    try {
      if (!idClienteFinal)
        throw Error("Faltan datos en clientes/resetPuntosCliente");
      const token = authInstance.getToken(req);
      const parametros = await authInstance.getParametros(token);
      if (parametros) {
        return await clientesInstance.resetPuntosCliente(
          parametros.database,
          idClienteFinal
        );
      }
      throw Error("Error, autenticación errónea");
    } catch (err) {
      logger.Error("resetPuntosCliente", err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Post("getPuntosCliente")
  async getPuntosCliente(@Body() { idClienteFinal }, @Req() req: Request) {
    try {
      if (idClienteFinal) {
        const token = authInstance.getToken(req);
        const parametros = await authInstance.getParametros(token);
        if (parametros) {
          return await clientesInstance.getPuntosClienteFinal(
            parametros.database,
            idClienteFinal
          );
        }
        throw Error("Autenticación incorrecta en clientes/getPuntosCliente");
      }
      throw Error("Faltan datos en clientes/getPuntosCliente");
    } catch (err) {
      logger.Error("getPuntosCliente", err);
      return false;
    }
  }

  /* Eze 4.0 */
  @Post("crearNuevoCliente")
  async crearNuevoCliente(
    @Body() { idTarjetaCliente, nombreCliente, idCliente },
    @Req() req: Request
  ) {
    try {
      if (
        UtilesModule.checkVariable(idTarjetaCliente, nombreCliente, idCliente)
      ) {
        const token = authInstance.getToken(req);
        const parametros = await authInstance.getParametros(token);
        if (parametros) {
          return await clientesInstance.crearNuevoCliente(
            idTarjetaCliente,
            nombreCliente,
            idCliente,
            parametros.database
          );
        }
        throw Error("Autenticación incorrecta en clientes/crearNuevoCliente");
      }
      throw Error("Faltan datos en clientes/crearNuevoCliente");
    } catch (err) {
      logger.Error("crearNuevoCliente", err);
      return false;
    }
  }
}
