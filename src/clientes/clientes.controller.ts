import { Controller, Post, Body, Get, Req } from "@nestjs/common";
import { authInstance } from "../auth/auth.class";
import { UtilesModule } from "../utiles/utiles.module";
import { articulosInstance } from "../articulos/articulos.class";
import { clientesInstance } from "./clientes.class";
import { Request } from "express";

@Controller("clientes")
export class ClientesController {
  /* Comprueba VIP y obitene los puntos del cliente también */
  @Post("comprobarVIP")
  comprobarVIP(@Body() params) {
    if (params.database != undefined && params.idClienteFinal != undefined) {
      return clientesInstance
        .comprobarVIP(params.database, params.idClienteFinal)
        .then((res: any) => {
          if (res.info != undefined) {
            if (res.info.idCliente != undefined && res.error == false) {
              return articulosInstance
                .getArticulosConTarifasEspeciales(
                  params.database,
                  res.info.idCliente
                )
                .then((articulosEspeciales) => {
                  if (articulosEspeciales.error == false) {
                    return {
                      error: false,
                      articulosEspeciales: articulosEspeciales.info,
                      info: res.info,
                    };
                  }
                  return { error: true, mensaje: articulosEspeciales.mensaje };
                })
                .catch((err) => {
                  console.log(err);
                  return {
                    error: true,
                    mensaje:
                      "SanPedro: Error en catch clientes/comprobarVIP getArticulosConTarifasEspeciales",
                  };
                });
            }
          }

          return res;
        })
        .catch((err) => {
          console.log(err);
          return {
            error: true,
            mensaje: "SanPedro: Error en clientes/comprobarVIP catch",
          };
        });
    }
    return {
      error: true,
      mensaje: "SanPedro: Faltan datos en clientes/comprobarVIP",
    };
  }

  /* Eze 4.0 */
  @Get("getClientesFinales")
  async getClientesFinales(@Req() req: Request) {
    try {
      const token = req.headers.authorization;
      const parametros = await authInstance.getParametros(token);
      if (parametros) {
        return await clientesInstance.getClientes(parametros.database);
      }
      throw Error("Error, autenticación errónea");
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  @Post("resetPuntosCliente")
  resetPuntosCliente(@Body() params) {
    if (params.idClienteFinal != undefined && params.database != undefined) {
      return clientesInstance
        .resetPuntosCliente(params.database, params.idClienteFinal)
        .then((res) => {
          if (res) {
            return { error: false };
          } else {
            return {
              error: true,
              mensaje:
                "SanPedro: Error, en clientes/resetPuntosCliente > resetPuntosCliente()",
            };
          }
        })
        .catch((err) => {
          return {
            error: true,
            mensaje:
              "SanPedro: Error, en clientes/resetPuntosCliente > resetPuntosCliente() CATCH",
          };
        });
    } else {
      return {
        error: true,
        mensaje: "SanPedro: Error, faltan datos en clientes/resetPuntosCliente",
      };
    }
  }

  /* Eze 4.0 */
  @Post("getPuntosCliente")
  async getPuntosCliente(@Body() { idClienteFinal }, @Req() req: Request) {
    try {
      if (idClienteFinal) {
        const token = req.headers.authorization;
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

  @Post("crearNuevoCliente")
  crearNuevoCliente(@Body() params) {
    if (
      UtilesModule.checkVariable(
        params.idTarjetaCliente,
        params.nombreCliente,
        params.idCliente,
        params.parametros
      )
    ) {
      return clientesInstance.crearNuevoCliente(
        params.idTarjetaCliente,
        params.nombreCliente,
        params.idCliente,
        params.parametros.database
      );
    } else {
      return {
        error: true,
        mensaje: "Error SanPedro: clientes/crearNuevoCliente FALTAN DATOS",
      };
    }
  }
}
