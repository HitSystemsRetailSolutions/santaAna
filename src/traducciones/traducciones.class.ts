import { ParametrosInterface } from '../parametros/parametros.interface';
import { recHit } from '../conexion/mssql';

export class TraduccionesClass {
    async getTraducciones() {
        const res = await recHit('hit', 'SELECT * FROM traducciones');
        if (!res || !res.recordset || !res.recordset.length) return [];
    
        let { recordset: data } = res;

        return Object.values(data.reduce((acc, item) => {
            if (!acc[item.traduccion_key]) {
                acc[item.traduccion_key] = {
                    key: item.traduccion_key,
                    languages: [{ [item.idioma]: item.texto }],
                };
                return acc;
            }
            acc[item.traduccion_key].languages.push({
                [item.idioma]: item.texto,
            });
            return acc;
        }, {}));
    }

    async setTraduccionesKeys(traducciones: any) {
        let data = {
            error: false,
            msg: 'Se han insertado todas las traducciones!'
        };
        for(let traduccion of traducciones) {
            try {
                const sql = `INSERT INTO traducciones (traduccion_key, idioma, texto) VALUES ('${traduccion.key}', 'es', '${traduccion.value}')`;
                await recHit('hit', sql);
            } catch(err) {
                data.error = true;
                data.msg = err;
            }
        }
        return data;
    }
}
export const traduccionesInstance = new TraduccionesClass();


