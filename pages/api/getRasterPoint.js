import db from '../../db/db';

export default async function handler(req, res) {
    const { px, py } = req.query;

    try {
        const query = `
            SELECT ST_Value(rast, ST_Transform(ST_SetSRID(ST_MakePoint($2,$1), 4326), 54009)) AS valor_raster
            FROM public.data_1;
            `;

        const result = await db.query(query, [py, px]);
        const data = result.rows;

        res.status(200).json(data);
    } catch (error) {
        console.error('Erro na obtenção de dados:', error);
        res.status(500).json({ error: 'Erro ao buscar dados do banco de dados.' });
    }
}
