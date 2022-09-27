import { Body, Controller, Post } from "@nestjs/common";
import { articulosInstance } from "../articulos/articulos.class";
import { UtilesModule } from "../utiles/utiles.module";

@Controller("tarifas")
export class TarifasController {
    @Post("getTarifasEspeciales")
    async getTarifasEspeciales(@Body() params) {
        try {
            if (UtilesModule.checkVariable(params.database)) {
                // Sin el await no sirve el catch !
                return await articulosInstance.getTarifasEspeciales(params.database);
            }
        } catch (err) {
            console.log(err);
            return null;
        }
    }
}
