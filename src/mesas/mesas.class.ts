import { ObjectId } from "mongodb";
import { MesasInterface } from "./mesas.interface";
import * as schMesas from "./mesas.mongodb";
export class MesasClass {
  async getEstructuraMesas(id: ObjectId, licencia: MesasInterface["licencia"]) {
    return await schMesas.getEstructuraMesas(id, licencia);
  }
}
export const mesasInstance = new MesasClass();
