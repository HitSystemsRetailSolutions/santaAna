import { getDb } from "../conexion/mongodb";
import { TokensCollection } from "./auth.interface";

/* Eze 4.0 */
export async function getParametros(token: TokensCollection["token"]) {
  const db = await getDb();
  const tokensCollection = db.collection<TokensCollection>("tokens");
  return await tokensCollection.findOne({ token });
}

/* Eze 4.0 */
export async function addToken(
  token: TokensCollection["token"],
  database: TokensCollection["database"],
  licencia: TokensCollection["licencia"]
) {
  const db = await getDb();
  const tokensCollection = db.collection<TokensCollection>("tokens");
  return (await tokensCollection.insertOne({ token, database, licencia }))
    .acknowledged;
}
