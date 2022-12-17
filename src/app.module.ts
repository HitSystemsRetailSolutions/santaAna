import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { ClientesController } from "./clientes/clientes.controller";
import { ParametrosController } from "./parametros/parametros.controller";
import { DatosController } from "./general/datos.controller";
import { ArticulosController } from "./articulos/articulos.controller";
import { MenusController } from "./menus/menus.controller";
import { TeclasController } from "./teclas/teclas.controller";
import { TrabajadoresController } from "./trabajadores/trabajadores.controller";
import { FamiliasController } from "./familias/familias.controller";
import { PromocionesController } from "./promociones/promociones.controller";
import { SocketsGateway } from "./sockets.gateway";
import { TestController } from "./test/test.controller";
import { UtilesModule } from "./utiles/utiles.module";
import { EntregasController } from "./entregas/entregas.controller";
import { ImpresorasIpController } from "./impresoras-ip/impresoras-ip.controller";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { TarifasController } from "./tarifas/tarifas.controller";
import { TicketsController } from './tickets/tickets.controller';

@Module({
  imports: [
    UtilesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
    }),
  ],
  controllers: [
    ClientesController,
    ParametrosController,
    DatosController,
    ArticulosController,
    MenusController,
    TeclasController,
    TrabajadoresController,
    FamiliasController,
    PromocionesController,
    TestController,
    EntregasController,
    ImpresorasIpController,
    TarifasController,
    TicketsController,
  ],
  providers: [AppService, SocketsGateway],
})
export class AppModule {}
