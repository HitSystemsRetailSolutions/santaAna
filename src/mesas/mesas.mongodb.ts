import { getDb } from "../conexion/mongodb";
import { MesasInterface } from "./mesas.interface";

export async function getEstructuraMesas(licencia: MesasInterface["licencia"]) {
  const db = await getDb();
  const mesasCollection = db.collection<MesasInterface>("mesas");
  return await mesasCollection.findOne({ licencia });
}
