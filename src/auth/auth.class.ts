import { recHit } from "../conexion/mssql";
import { TokensCollection } from "./auth.interface";
import * as schAuth from "./auth.mongodb";
export class AuthClass {
  async getParametros(
    token: TokensCollection["token"]
  ): Promise<TokensCollection> {
    let tokenLimpio = token.startsWith("Bearer ")
      ? token.replace("Bearer", "").trim()
      : token;
    const parametros = await schAuth.getParametros(tokenLimpio);
    if (parametros) return parametros;
    const resultadoHit = await this.getParametrosHit(tokenLimpio);
    return resultadoHit;
  }

  private async getParametrosHit(
    token: TokensCollection["token"]
  ): Promise<TokensCollection> {
    const resultado = await recHit(
      "Hit",
      `SELECT bbdd, licencia, token FROM tocGameInfo WHERE token = '${token}';`
    );
    if (
      resultado.recordset &&
      resultado.recordset.length === 1 &&
      resultado.recordset[0].token === token
    ) {
      const resInsert = await this.addToken(
        token,
        resultado.recordset[0].bbdd,
        resultado.recordset[0].licencia
      );
      if (resInsert) {
        return {
          token: resultado.recordset[0].token,
          database: resultado.recordset[0].bbdd,
          licencia: resultado.recordset[0].licencia,
        };
      }
      throw Error(
        "Error, no se ha podido insertar el token de hit a sanpedro mongodb"
      );
    }
    throw Error("Error, token incorrecto o múltiples coincidencias");
  }

  private async addToken(
    token: TokensCollection["token"],
    database: TokensCollection["database"],
    licencia: TokensCollection["licencia"]
  ) {
    return await schAuth.addToken(token, database, licencia);
  }
}
export const authInstance = new AuthClass();
