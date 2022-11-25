import { Controller, Post, Body, Get, Req } from "@nestjs/common";
import { authInstance } from "../auth/auth.class";
import { UtilesModule } from "../utiles/utiles.module";
import { articulosInstance } from "../articulos/articulos.class";
import { clientesInstance } from "./clientes.class";
import { Request } from "express";

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
          return await clientesInstance.getClientConfig(parametros.database, idClienteFinal);
        }
        throw Error("Error, autenticación errónea en clientes/esVip");
      }
      throw Error("Error, faltan datos en clientes/esVip");
    } catch (err) {
      console.log(err);
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
        return await clientesInstance.getClientes(parametros.database);
      }
      throw Error("Error, autenticación errónea en clientes/getClientesFinales");
    } catch (err) {
      console.log(err);
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
      console.log(err);
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
      console.log(err);
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
      console.log(err);
      return false;
    }
  }
}
