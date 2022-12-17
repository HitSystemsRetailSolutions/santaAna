import { ClientesInterface } from "../clientes/clientes.interface";
import { ArticulosInterface } from "../articulos/articulos.interface";
import { FormaPago, MovimientosInterface } from "../movimientos/movimientos.interface";
import { ObjectId } from "mongodb";

export interface TicketsInterface {
  _id: number;
  timestamp: number;
  total: number;
  cesta: CestasInterface;
  idTrabajador: number;
  idCliente: ClientesInterface["id"];
  consumoPersonal?: boolean;
  enviado: boolean;
}
export interface SuperTicketInterface extends TicketsInterface {
  tipoPago: FormaPago;
  movimientos: MovimientosInterface[];
}

export interface CestasInterface {
  _id: ObjectId;
  timestamp: number;
  detalleIva: DetalleIvaInterface;
  lista: ItemLista[];
  modo: ModoCesta;
  idCliente: ClientesInterface["id"];
  nombreCliente?: string;
  indexMesa?: boolean;
}

export type ItemLista = {
  idArticulo: number;
  nombre: string;
  unidades: number;
  subtotal: number;
  arraySuplementos: ArticulosInterface["_id"][];
  promocion: {
    idPromocion: string;
    idArticuloPrincipal: number;
    cantidadArticuloPrincipal: number;
    idArticuloSecundario: number;
    cantidadArticuloSecundario: number;
    precioRealArticuloPrincipal: number;
    precioRealArticuloSecundario: number;
    unidadesOferta: number;
    tipoPromo: TiposPromociones;
  };
  gramos: number;
  regalo: boolean;
};

export type DetalleIvaInterface = {
  base1: number;
  base2: number;
  base3: number;
  valorIva1: number;
  valorIva2: number;
  valorIva3: number;
  importe1: number;
  importe2: number;
  importe3: number;
};

export type TiposPromociones = "COMBO" | "INDIVIDUAL";
export type ModoCesta = "VENTA" | "CONSUMO_PERSONAL" | "DEVOLUCION";
// export interface TicketsInterface {
//     _id: number,
//     timestamp: number,
//     total: number,
//     lista: {
//         _id: number,
//         nombre: string,
//         promocion: {
//             _id: string,
//             esPromo: boolean,
//             infoPromo?: {
//                 idPrincipal: number,
//                 cantidadPrincipal: number,
//                 idSecundario: number,
//                 cantidadSecundario: number,
//                 precioRealPrincipal: number,
//                 precioRealSecundario: number,
//                 unidadesOferta: number,
//                 tipoPromo: string
//             }
//         },
//         subtotal: number,
//         unidades: number,
//         suplementosId?: []
//     }[],
//     tipoPago: string,
//     idTrabajador: number,
//     tiposIva: {
//         base1: number,
//         base2: number,
//         base3: number,
//         valorIva1: number,
//         valorIva2: number,
//         valorIva3: number,
//         importe1: number,
//         importe2: number,
//         importe3: number
//     },
//     enviado: boolean,
//     enTransito: boolean,
//     intentos: number,
//     comentario: string,
//     cliente?: string,
//     infoClienteVip?: {
//         esVip: boolean,
//         nif: string,
//         nombre: string,
//         cp: string,
//         direccion: string,
//         ciudad: string
//     },
//     cantidadTkrs?: number,
//     regalo?: boolean,
//     anulado: boolean
// }
