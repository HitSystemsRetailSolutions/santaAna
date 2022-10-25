import { getDb } from "../conexion/mongodb";
import { MesasInterface } from "./mesas.interface";

export async function getEstructuraMesas(licencia: MesasInterface["licencia"]) {
  const db = await getDb();
  const mesasCollection = db.collection<MesasInterface>("mesas");
  return await mesasCollection.findOne({ licencia });
}

export async function saveEstructuraMesas(
  licencia: MesasInterface["licencia"],
  arrayMesas: MesasInterface["estructura"]
) {
  const db = await getDb();
  const mesasCollection = db.collection<MesasInterface>("mesas");
  const resultado = await mesasCollection.replaceOne(
    { licencia: licencia },
    {
      licencia,
      estructura: arrayMesas,
    },
    { upsert: true }
  );
  console.log("debía haber llegado aquí: ", licencia, arrayMesas);
  return (
    resultado.acknowledged &&
    (resultado.modifiedCount > 0 || resultado.upsertedCount > 0)
  );
}
