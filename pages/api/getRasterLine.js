import db from '../../db/db';

export default async function handler(req, res) {
    const { points } = req.query;

    if (!points || points.length < 4 || points.length % 2 !== 0) {
        return res.status(400).json({ error: 'O array de pontos deve conter um número par de coordenadas (mínimo 4).' });
    }

    try {
        // Constrói segmentos de reta a partir dos pontos
        const segments = [];
        for (let i = 0; i < points.length - 2; i += 2) {
            segments.push(`ST_MakeLine(ST_MakePoint(${points[i]}, ${points[i + 1]}), ST_MakePoint(${points[i + 2]}, ${points[i + 3]}))`);
        }

        // Concatena todos os segmentos de reta em uma única geometria MultiLineString
        const multilineString = `ST_Collect(ARRAY[${segments.join(', ')}])`;

        const query = `
            SELECT (ST_DumpAsPolygons(ST_Clip(rast, ST_Transform(ST_SetSRID(${multilineString}, 4326), 54009), true))).*
            FROM public.data_1
            WHERE ST_Intersects(rast, ST_Transform(ST_SetSRID(${multilineString}, 4326), 54009))
        ;`;

        const result = await db.query(query);
        const data = result.rows;

        res.status(200).json(data);
    } catch (error) {
        console.error('Erro na obtenção de dados:', error);
        res.status(500).json({ error: 'Erro ao buscar dados do banco de dados.' });
    }
}
