import { Request } from "express";
import { recHit } from "../conexion/mssql";
import { TokensCollection } from "./auth.interface";
import * as schAuth from "./auth.mongodb";
const blacklist = [893]
export class AuthClass {
  public async getParametros(
    token: TokensCollection["token"]
  ): Promise<TokensCollection> {
    if (token === null || token === undefined) return null;
    let tokenLimpio = token.startsWith("Bearer ")
      ? token.replace("Bearer", "").trim()
      : token;
    const parametros = await schAuth.getParametros(tokenLimpio);
    if(blacklist.includes(parametros.licencia)){
      console.log("Licencia "+ parametros.licencia +" bloqueada")
      return undefined;
    }
    if (parametros) return parametros;
    const resultadoHit = await this.getParametrosHit(tokenLimpio);
    return resultadoHit;
  }

  private async getParametrosHit(
    token: TokensCollection["token"]
  ): Promise<TokensCollection> {
    const resultado = await recHit(
      "Hit",
      `SELECT bbdd, licencia, token, codigoInternoTienda, nombreTienda FROM tocGameInfo WHERE token = '${token}';`
    );
    if (
      resultado?.recordset?.length === 1 &&
      resultado?.recordset[0]?.token === token
    ) {
      if (blacklist.includes(resultado.recordset[0].licencia)) {
        console.log("Licencia "+ resultado.recordset[0].licencia +" bloqueada")
        return null;
      }
      const resInsert = await this.addToken(
        token,
        resultado.recordset[0].bbdd,
        resultado.recordset[0].licencia,
        resultado.recordset[0].codigoInternoTienda,
        resultado.recordset[0].nombreTienda
      );
        if (resInsert) {
          return {
            token: resultado.recordset[0].token,
            database: resultado.recordset[0].bbdd,
            licencia: resultado.recordset[0].licencia,
            codigoInternoTienda: resultado.recordset[0].codigoInternoTienda,
            nombreTienda: resultado.recordset[0].nombreTienda,
          };
        }
        throw Error(
          "Error, no se ha podido insertar el token de hit a sanpedro mongodb"
        );
      }
      throw Error("Error, token incorrecto o m??ltiples coincidencias");
    }

  private async addToken(
      token: TokensCollection["token"],
      database: TokensCollection["database"],
      licencia: TokensCollection["licencia"],
      codigoInternoTienda: TokensCollection["codigoInternoTienda"],
      nombreTienda: TokensCollection["nombreTienda"]
    ) {
    return await schAuth.addToken(
      token,
      database,
      licencia,
      codigoInternoTienda,
      nombreTienda
    );
  }

  public getToken(req: Request) {
    return req.headers.authorization;
  }
}
export const authInstance = new AuthClass();
