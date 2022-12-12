import { ParametrosInterface } from "../parametros/parametros.interface";
import { recHit } from "../conexion/mssql";
import {
  ClientesInterface,
  ClientesAlbaranInterface,
} from "./clientes.interface";

export class Clientes {
  /* Eze 4.0 */
  async getClientConfig(database: string, idClienteFinal: string) {
    let objEnviar = {
      esVip: false,
      pagaEnTienda: true,
      datosCliente: null,
      idCliente: null,
      puntos: 0,
    };
    const sql = `
            DECLARE @idCliente int;
            IF EXISTS (SELECT * FROM ConstantsClient WHERE Variable = 'CFINAL' AND Valor = '${idClienteFinal}')
                BEGIN
                    SELECT @idCliente = Codi FROM ConstantsClient WHERE Variable = 'CFINAL' AND Valor = '${idClienteFinal}'
                    IF EXISTS (SELECT * FROM ConstantsClient WHERE Variable = 'EsClient' AND Valor = 'EsClient' AND Codi = @idCliente)
                        BEGIN
                            IF EXISTS (SELECT * FROM ConstantsClient WHERE Variable = 'NoPagaEnTienda' AND Valor = 'NoPagaEnTienda' AND Codi = @idCliente)
                                SELECT 1 as esVIP, 0 as pagaEnTienda, @idCliente as idCliente
                            ELSE
                                SELECT 1 as esVIP, 1 as pagaEnTienda, @idCliente as idCliente 	
                        END
                    ELSE
                        BEGIN
                            IF EXISTS (SELECT * FROM ConstantsClient WHERE Variable = 'NoPagaEnTienda' AND Valor = 'NoPagaEnTienda' AND Codi = @idCliente)
                                SELECT 0 as esVIP, 0 as pagaEnTienda, @idCliente as idCliente, Punts AS puntos FROM punts WHERE idClient = '${idClienteFinal}'
                            ELSE
                                SELECT 0 as esVIP, 1 as pagaEnTienda, @idCliente as idCliente, Punts AS puntos FROM punts WHERE idClient = '${idClienteFinal}'
                        END
                END
            ELSE
                IF EXISTS (SELECT 0 as esVIP, 1 as pagaEnTienda, Punts AS puntos FROM punts WHERE idClient = '${idClienteFinal}')
                    BEGIN
                        SELECT 0 as esVIP, 1 as pagaEnTienda, Punts AS puntos FROM punts WHERE idClient = '${idClienteFinal}'
                    END
                ELSE
                    BEGIN
                        SELECT 0 as esVIP, 1 as pagaEnTienda, 0 AS puntos
                    END
        `;
    const res = await recHit(database, sql);
    const recordset = res.recordset;
    if (recordset.length === 0) return false;

    if (recordset[0].idCliente) {
      if (recordset[0].idCliente == 0 || recordset[0].idCliente == "0") {
        recordset[0].pagaEnTienda = 1;
        recordset[0].esVip = 0;
      }
    }

    if (recordset[0].esVIP == 0) {
      // NORMAL
      objEnviar.esVip = false;
      if (recordset[0].pagaEnTienda == 0) {
        objEnviar.pagaEnTienda = false;
      }
      return objEnviar;
    } else if (recordset[0].esVIP == 1) {
      // VIP
      objEnviar.esVip = true;
      const res2 = await recHit(
        database,
        `SELECT Nom as nombre, Nif as nif, Adresa as direccion, Ciutat as ciudad, Cp as cp FROM Clients WHERE Codi = (SELECT TOP 1 Codi FROM ConstantsClient WHERE Valor = '${idClienteFinal}' AND Variable = 'CFINAL')`
      );
      objEnviar.datosCliente = res2.recordset[0];
      objEnviar.idCliente = recordset[0].idCliente;
      if (recordset[0].pagaEnTienda == 0) objEnviar.pagaEnTienda = false;

      return objEnviar;
    }
    return false;
  }

  /* Eze 4.0 */
  async getClientes(database: string): Promise<ClientesInterface[]> {
    const res = await recHit(
      database,
      "select Id as id, Nom as nombre, IdExterna as tarjetaCliente from ClientsFinals WHERE Id IS NOT NULL AND Id <> ''"
    );
    if (res.recordset?.length > 0) {
      return res.recordset;
    }
    return null;
  }

  /* Eze 4.0 */
  async getClientesAlbaran(
    database: ParametrosInterface["database"]
  ): Promise<ClientesAlbaranInterface[]> {
    const resultado = await recHit(
      database,
      `SELECT cc1.Codi, cc2.Valor as idCliente, ISNULL(cc3.Valor, 1) as pagaEnTienda, cf.Nom as nombre, cf.IdExterna as idTarjeta FROM ConstantsClient cc1 LEFT JOIN ConstantsClient cc2 ON cc1.Codi = cc2.Codi AND cc2.Variable = 'CFINAL' LEFT JOIN ConstantsClient cc3 ON cc3.Codi = cc1.Codi AND cc3.Variable = 'NoPagaEnTienda' LEFT JOIN ClientsFinals cf ON cc2.Valor = cf.Id  WHERE cc1.Variable = 'EsClient' AND cc1.Valor = 'EsClient' AND cc2.Valor <> ''
    `
    );

    return resultado.recordset;
  }

  /* Eze 4.0 */
  fusionarClientes(
    allClients: ClientesInterface[],
    clientesAlbaran: ClientesAlbaranInterface[]
  ): ClientesInterface[] {
    const arrayFinalClientes: ClientesInterface[] = [];

    for (let i = 0; i < clientesAlbaran.length; i++) {
      for (let j = 0; j < allClients.length; j++) {
        if (clientesAlbaran[i].idCliente === allClients[j].id) {
          allClients[j] = {
            albaran: true,
            id: clientesAlbaran[i].idCliente,
            nombre: clientesAlbaran[i].nombre,
            noPagaEnTienda:
              clientesAlbaran[i].pagaEnTienda === "NoPagaEnTienda"
                ? true
                : false,
            tarjetaCliente: clientesAlbaran[i].idTarjeta,
          };
          break;
        }
      }
      arrayFinalClientes.push({
        albaran: true,
        id: clientesAlbaran[i].idCliente,
        nombre: clientesAlbaran[i].nombre,
        noPagaEnTienda:
          clientesAlbaran[i].pagaEnTienda === "NoPagaEnTienda" ? true : false,
        tarjetaCliente: clientesAlbaran[i].idTarjeta,
      });
    }

    return allClients.concat(arrayFinalClientes);
  }

  /* Eze 4.0 */
  async resetPuntosCliente(database: string, idClienteFinal: string) {
    const res = await recHit(
      database,
      `UPDATE Punts SET Punts = 0 WHERE idClient = '${idClienteFinal}'`
    );

    return res.rowsAffected[0] > 0 ? true : false;
  }

  /* Eze 4.0 */
  async getPuntosClienteFinal(
    database: string,
    idClienteFinal: string
  ): Promise<number> {
    const res = await recHit(
      database,
      `SELECT Punts AS puntos FROM punts WHERE idClient = '${idClienteFinal}'`
    );
    if (res.recordset.length === 1) {
      return res.recordset[0].puntos;
    }
    return null;
  }

  /* Eze 4.0 */
  async crearNuevoCliente(
    idTarjetaCliente: string,
    nombreCliente: string,
    idCliente: string,
    database: string
  ) {
    const sql = `
        IF EXISTS (SELECT * FROM ClientsFinals WHERE Id = '${idCliente}' OR Nom = '${nombreCliente}')
            BEGIN 
                SELECT 'YA_EXISTE' as resultado
            END
        ELSE
            BEGIN 
                INSERT INTO ClientsFinals VALUES ('${idCliente}', '${nombreCliente}', '', '', '', '', '', '', '${idTarjetaCliente}');
                INSERT INTO Punts (IdClient, Punts, data, Punts2, data2) VALUES ('${idCliente}', 0, GETDATE(), NULL, NULL);
                SELECT 'CREADO' as resultado;
            END    
        `;

    const res = await recHit(database, sql);

    if (res.recordset.length > 0) {
      if (
        res.recordset[0].resultado == "CREADO" ||
        res.recordset[0].resultado === "YA_EXISTE"
      ) {
        return true;
      }
    }
    return false;
  }
}
export const clientesInstance = new Clientes();
