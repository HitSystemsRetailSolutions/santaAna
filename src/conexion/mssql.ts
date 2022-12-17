import * as sql from "mssql";
import { PASSWORD_SERVER, URL_SERVER, USER_SERVER } from "../secrets";

export async function recHit(
  database: string,
  consultaSQL: string
) {
  const config = {
    user: USER_SERVER,
    password: PASSWORD_SERVER,
    server: URL_SERVER,
    database: database,
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 10000,
    },
    requestTimeout: 10000,
  };

  const pool = await new sql.ConnectionPool(config).connect();
  const result = await pool.request().query(consultaSQL);
  pool.close();
  return result;
}