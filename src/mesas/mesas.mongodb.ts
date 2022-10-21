import { ObjectId } from "mongodb";
import { getDb } from "../conexion/mongodb";
import { MesasInterface } from "./mesas.interface";

export async function getEstructuraMesas(
  id: ObjectId,
  licencia: MesasInterface["licencia"]
) {
  const db = await getDb();
  const mesasCollection = db.collection<MesasInterface>("mesas");
  return await mesasCollection.findOne({ _id: new ObjectId(id), licencia });
}
