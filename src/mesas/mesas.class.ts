import { ObjectId } from "mongodb";
import { MesasInterface } from "./mesas.interface";
import * as schMesas from "./mesas.mongodb";

export class MesasClass {
  async getEstructuraMesas(licencia: MesasInterface["licencia"]) {
    return await schMesas.getEstructuraMesas(licencia);
  }

  async saveMesas(
    licencia: MesasInterface["licencia"],
    arrayMesas: MesasInterface["estructura"]
  ) {
    return await schMesas.saveEstructuraMesas(licencia, arrayMesas);
  }
}
export const mesasInstance = new MesasClass();
