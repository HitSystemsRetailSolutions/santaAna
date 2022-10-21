import { recHit } from "../conexion/mssql";
import { TokensCollection } from "./auth.interface";
import * as schAuth from "./auth.mongodb";
export class AuthClass {
  async getParametros(token: TokensCollection["token"]) {
    const parametros = await schAuth.getParametros(token);
    if (parametros) return parametros;
    return await this.getParametrosHit(token);
  }

  private async getParametrosHit(token: TokensCollection["token"]) {
    const resultado = await recHit(
      "Hit",
      `SELECT bbdd as database, licencia, token FROM tocGameInfo WHERE token = '${token}'`
    );
    if (
      resultado.recordset &&
      resultado.recordset.length === 1 &&
      resultado.recordset[0].token === token
    )
      return await this.addToken(token); ESTOY CAMBIANDO QUE SOLO SE NECESITE EL TOKEN PARA HACER UNA PETICIÓN
    return false;
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
