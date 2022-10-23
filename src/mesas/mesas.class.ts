import { ObjectId } from "mongodb";
import { MesasInterface } from "./mesas.interface";
import * as schMesas from "./mesas.mongodb";

export class MesasClass {
  async getEstructuraMesas(licencia: MesasInterface["licencia"]) {
    return await schMesas.getEstructuraMesas(licencia);
  }
}
export const mesasInstance = new MesasClass();
