const sql = require("mssql");
import { PASSWORD_SERVER, URL_SERVER, USER_SERVER } from "../secrets";

export async function recHit(
  database: string,
  consultaSQL: string
): Promise<any> {
  const config = {
    user: USER_SERVER,
    password: PASSWORD_SERVER,
    server: URL_SERVER,
    database: database,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 10000,
    },
    requestTimeout: 10000,
  };

  const pool = await new sql.ConnectionPool(config).connect();

  const result = await pool.request().query(consultaSQL);
  sql.close();
  return result;

  // .catch((err) => {
  //   if (database.toLowerCase() === "fac_tena") {
  //     console.log(err);
  //     console.log("SQL: ", consultaSQL);
  //   }

  //   sql.close();
  // });
}

// sql.on("error", (err) => {
//   console.log("Evento error SQL: ", err);
// });

// export function recHit(database: string, query: string) {
//   const configNueva = {
//     user: USER_SERVER,
//     password: PASSWORD_SERVER,
//     server: URL_SERVER,
//     database: database,
//     pool: {
//       max: 10,
//       min: 0,
//       idleTimeoutMillis: 10000,
//     },
//     requestTimeout: 10000,
//     options: {
//         trustServerCertificate: true
//     }
//   };

//   return sql.connect(configNueva).then((pool) => {
//     return pool.query(query);
//   });
// }

// sql.on("error", (err) => {
//   console.log("Evento error SQL: ", err);
// });
