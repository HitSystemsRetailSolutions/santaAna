import { Controller, Post, Body } from "@nestjs/common";
import { authInstance } from "src/auth/auth.class";
import { mesasInstance } from "./mesas.class";

@Controller("mesas")
export class MesasController {
    @Post("getEstructuraMesas")
    getEstructuraMesas(@Body() { token }) {
        try {
            if (token && licencia && idConfiguracion) {
                if (authInstance.checkToken())
                    mesasInstance.getEstructuraMesas(idConfiguracion, licencia)
            }
            throw Error("Error, faltan parámetros en getEstructuraMesas() mesas.controller");
        } catch (err) {
            console.log(err);
            return null;
        }
    }
}
