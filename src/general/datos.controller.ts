import { Controller, Post, Body, Req } from "@nestjs/common";
import { menusInstance } from "../menus/menus.class";
import { articulosInstance } from "../articulos/articulos.class";
import { teclasInstance } from "../teclas/teclas.class";
import { dependientasInstance } from "../trabajadores/trabajadores.class";
import { familiasInstance } from "../familias/familias.class";
import { promocionesInstance } from "../promociones/promociones.class";
import { clientesInstance } from "../clientes/clientes.class";
import { Request } from "express";
import { authInstance } from "../auth/auth.class";
import { tarifasInstance } from "../tarifas/tarifas.class";

@Controller("datos")
export class DatosController {
  /* Eze 4.0 */
  @Post("cargarTodo")
  async cargarTodo(@Body() { codigoTienda }, @Req() req: Request) {
    try {
      if (codigoTienda) {
        const token = authInstance.getToken(req);
        const parametros = await authInstance.getParametros(token);
        console.log(token, parametros);
        if (parametros) {
          let articulosAux = await articulosInstance.getArticulos(
            parametros.database
          );
          let tarifaTienda = await tarifasInstance.getTarifaTienda(
            parametros.database,
            codigoTienda
          );

          const articulos =
            articulosInstance.fusionarArticulosConTarifasEspeciales(
              articulosAux,
              tarifaTienda
            );
          const menus = await menusInstance.getMenus(
            parametros.database,
            codigoTienda
          );
          const teclas = await teclasInstance.getTeclas(
            parametros.database,
            parametros.licencia
          );
          const dependientas = await dependientasInstance.getTrabajadores(
            parametros.database
          );
          const familias = await familiasInstance.getFamilias(
            parametros.database
          );
          const promociones = await promocionesInstance.getPromocionesNueva(
            parametros.database,
            codigoTienda
          );

          const allClients = await clientesInstance.getClientes(
            parametros.database
          );

          const clientesAlbaran = await clientesInstance.getClientesAlbaran(
            parametros.database
          );

          const clientes = clientesInstance.fusionarClientes(
            allClients,
            clientesAlbaran
          );

          const tarifasEspeciales = await tarifasInstance.getTarifasEspeciales(
            parametros.database
          );
          return {
            articulos,
            menus,
            teclas,
            dependientas,
            familias,
            promociones,
            clientes,
            tarifasEspeciales,
          };
        }
        throw Error("Error, autenticación errónea en datos/cargarTodo");
      }
      throw Error("Error, faltan datos en datos/cargarTodo");
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
