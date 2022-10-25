import { IResult } from "mssql";
import { menusInstance } from "src/menus/menus.class";
import { recHit } from "../conexion/mssql";

export class TeclasClass {
  /* TODAS LAS TECLAS, de TODOS los TECLADOS de una tienda en concreto */

  getTeclas(database: string, licencia: number) {
    return recHit(
      database,
      `SELECT Data, Ambient as nomMenu, (select EsSumable from articles where codi = article) as esSumable, (select nom from articles where codi = article) as nombreArticulo, article as idArticle, pos, color FROM TeclatsTpv WHERE Llicencia = ${licencia} AND Data = (select MAX(Data) FROM TeclatsTpv WHERE Llicencia = ${licencia} )`
    )
      .then(async (res: IResult<any>) => {
        if (res) {
          let nombremenus = await this.getnombreMenu(database, licencia);
          //console.log(nombremenus)
          if (res.recordset.length > 0) {

            return res.recordset;
          }
        }
        return [];
      })
      .catch((err) => {
        console.log(err);
        return [];
      });
  }

  getnombreMenu(database: string, codigoCliente: number) {
    if (!menusInstance.checkDobleMenus(database, codigoCliente)) return [];
    return recHit(
      database,
      `SELECT Variable, Valor FROM ParamsTpv WHERE CodiClient = ${codigoCliente} AND Variable LIKE 'DosNivells%'`
    )
      .then(async (res) => {
        if (res) {
          if (res.recordset.length > 0) {
            const data = res.recordset;
            const dobleMenus = data.filter((o) => o.Valor !== "");

            let menu = {};
            for (
              let paramsindex = 0;
              paramsindex < dobleMenus.length;
              paramsindex++
            ) {
              menu[dobleMenus[paramsindex].Variable] =
                dobleMenus[paramsindex].Valor;
            }

            let menus = [];
            for (let index = 0; index < 7; index++) {
              if (menu[`DosNivells_${index}_Texte`] != "") {
                let id = `DosNivells_${index}`;
                let nombre = menu[`DosNivells_${index}_Texte`];
                let tag = menu[`DosNivells_${index}_Tag`];
                if (nombre === undefined) {
                  nombre = tag;
                }
                await menus.push({ id: id, nombre: nombre, tag: tag });
              }
            }
            // {
            //     id: nombresubstring(0, 12),
            //     nombre: item[1].Valor,
            //     tag: item[0].Valor,
            // }
            return menus;
          } else {
            return [];
          }
        } else {
          return [];
        }
      })
      .catch((err) => {
        console.log(err);
        return [];
      });
  }
}

//     getTeclas(database: string, licencia: number) {
//         return recHit(database, `SELECT Data, Ambient as nomMenu, (select EsSumable from articles where codi = article) as esSumable, (select nom from articles where codi = article) as nombreArticulo, article as idArticle, pos, color FROM TeclatsTpv WHERE Llicencia = ${licencia} AND Data = (select MAX(Data) FROM TeclatsTpv WHERE Llicencia = ${licencia} )`).then((res: IResult<any>) => {
//             if (res) {
//                 console.log(res)
//                 if (res.recordset.length > 0) {
//                     if(menusInstance.checkDobleMenus(database, licencia)) {
//                         return res.recordset.map(i => ({...i, nomMenu: i.nomMenu.substring(3)}));
//                     }
//                     return res.recordset;
//                 }
//             }
//             return [];
//         }).catch((err) => {
//             console.log(err);
//             return [];
//         });
//     }
// }
export const teclasInstance = new TeclasClass();
