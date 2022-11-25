import { Controller, Post, Body } from "@nestjs/common";
import { menusInstance } from "../menus/menus.class";
import { articulosInstance } from "../articulos/articulos.class";
import { generalInstance } from "./general.class";
import { teclasInstance } from "../teclas/teclas.class";
import { dependientasInstance } from "../trabajadores/trabajadores.class";
import { familiasInstance } from "../familias/familias.class";
import { promocionesInstance } from "../promociones/promociones.class";
import { infoTicketInstance } from "../info-ticket/info-ticket.class";
import { clientesInstance } from "../clientes/clientes.class";

@Controller("datos")
export class DatosController {
  @Post("test")
  test(@Body() params) {
    generalInstance.getCodigoTiendaFromLicencia("Fac_Tena", 842).then((res) => {
      console.log(res);
    });
  }
  @Post("cargarTodo")
  async cargarTodo(@Body() { database, codigoTienda, licencia }) {
    try {
      if (database && codigoTienda && licencia) {
        let articulosAux = await articulosInstance.getArticulos(database);
        let tarifasEspeciales = await articulosInstance.getTarifaEspecialVieja(
          database,
          codigoTienda
        );
        const articulos =
          articulosInstance.fusionarArticulosConTarifasEspeciales(
            articulosAux,
            tarifasEspeciales
          );
        const menus = await menusInstance.getMenus(database, codigoTienda);
        const teclas = await teclasInstance.getTeclas(database, licencia);
        const dependientas = await dependientasInstance.getTrabajadores(
          database
        );
        const familias = await familiasInstance.getFamilias(database);
        const promociones = await promocionesInstance.getPromocionesNueva(
          database,
          codigoTienda
        );
        const parametrosTicket = await infoTicketInstance.getInfoTicket(
          database,
          codigoTienda
        );
        const clientes = await clientesInstance.getClientes(database);
        const dobleMenus = await menusInstance.getDobleMenus(
          database,
          codigoTienda
        );

        return {
          articulos,
          menus,
          teclas,
          dependientas,
          familias,
          promociones,
          parametrosTicket,
          clientes,
          dobleMenus,
        };
      }
      throw Error("Error, faltan datos en datos/cargarTodo");
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
