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
          console.log("traza 1");
          let articulosAux = await articulosInstance.getArticulos(
            parametros.database
          );
          console.log("traza 2");
          let tarifaTienda = await tarifasInstance.getTarifaTienda(
            parametros.database,
            codigoTienda
          );
          console.log("traza 3");
          const articulos =
            articulosInstance.fusionarArticulosConTarifasEspeciales(
              articulosAux,
              tarifaTienda
            );
            console.log("traza 4");
          const menus = await menusInstance.getMenus(
            parametros.database,
            codigoTienda
          );
          console.log("traza 5");
          const teclas = await teclasInstance.getTeclas(
            parametros.database,
            parametros.licencia
          );
          console.log("traza 6");
          const dependientas = await dependientasInstance.getTrabajadores(
            parametros.database
          );
          console.log("traza 7");
          const familias = await familiasInstance.getFamilias(
            parametros.database
          );
          console.log("traza 8");
          const promociones = await promocionesInstance.getPromocionesNueva(
            parametros.database,
            codigoTienda
          );
          console.log("traza 9");
          const allClients = await clientesInstance.getClientes(
            parametros.database
          );
          console.log("traza 10");
          const clientesAlbaran = await clientesInstance.getClientesAlbaran(
            parametros.database
          );
          console.log("traza 11");
          const clientes = clientesInstance.fusionarClientes(
            allClients,
            clientesAlbaran
          );
          console.log("traza 12");
          const tarifasEspeciales = await tarifasInstance.getTarifasEspeciales(
            parametros.database
          );
          console.log("traza 13");
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
