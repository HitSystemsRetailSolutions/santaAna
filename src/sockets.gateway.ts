import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { cajasInstance } from "./cajas/cajas.class";
import { movimientosInstance } from "./movimientos/movimientos.class";
import { ticketsInstance } from "./tickets/tickets.class";
import { devolucionesInstance } from "./devoluciones/devoluciones.class";
import { fichajeInstance } from "./fichajes/fichajes.class";
import { Socket } from "dgram";

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
    transports: ["websocket", "polling"],
  },
  allowEIO3: true,
})
export class SocketsGateway {
  /* Controlador de sincronizar las devoluciones */
  @SubscribeMessage("sincroDevoluciones")
  async insertarDevoluciones(
    @MessageBody() params,
    @ConnectedSocket() client: Socket
  ) {
    if (params != undefined) {
      if (
        params.devolucion != undefined &&
        params.devolucion != null &&
        params.parametros != undefined &&
        params.parametros != null
      ) {
        devolucionesInstance.insertarDevoluciones(
          params.parametros,
          params.devolucion,
          client
        );
      } else {
        client.emit("resSincroDevoluciones", {
          error: true,
          mensaje: "SanPedro: devolucion o parametros indefinidos o null",
        });
      }
    } else {
      client.emit("resSincroDevoluciones", {
        error: true,
        mensaje:
          "SanPedro: Error en sockets > sincroDevoluciones. ¡Faltan datos!",
      });
    }
  }

  /* Controlador de fichajes */
  @SubscribeMessage("sincroFichajes")
  async insertarFichaje(
    @MessageBody() params,
    @ConnectedSocket() client: Socket
  ) {
    if (params != undefined) {
      if (
        params.fichaje != undefined &&
        params.fichaje != null &&
        params.parametros != undefined &&
        params.parametros != null &&
        params.parametros.database != null &&
        params.parametros.database != undefined
      ) {
        fichajeInstance.insertarFichaje(
          params.parametros,
          params.fichaje,
          client
        );
      } else {
        client.emit("resFichajes", {
          error: true,
          mensaje: "SanPedro: fichaje o parametros indefinidos o null",
        });
      }
    } else {
      client.emit("resFichajes", {
        error: true,
        mensaje: "SanPedro: Error en sockets > sincroFichajes. ¡Faltan datos!",
      });
    }
  }
}
