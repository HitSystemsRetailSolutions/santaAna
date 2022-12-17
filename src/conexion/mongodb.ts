import { MongoClient } from "mongodb";
import { MONGO_USER, MONGO_PASSWORD, MONGO_SERVER } from "../secrets";
const uri = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_SERVER}:27017/dbname?authSource=solucionesit365`;

const client = new MongoClient(uri);
const conexion = client.connect();

export async function getDb() {
  return (await conexion).db("solucionesit365");
}
