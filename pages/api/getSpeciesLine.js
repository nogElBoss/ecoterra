import db from '../../db/db';

export default async function handler(req, res) {
    const { l1x, l1y, l2x, l2y } = req.query;
    try {
        const query = 'SELECT DISTINCT sci_name, class, category, marine FROM all_species WHERE ST_Intersects(ST_SetSRID(ST_MakeLine(ST_MakePoint($1, $2),ST_MakePoint($3, $4)), 4326), geom);';
        const result = await db.query(query, [l1x, l1y, l2x, l2y]);
        const data = result.rows;

        res.status(200).json(data);
    } catch (error) {
        console.error('Erro na obtenção de dados:', error);
        res.status(500).json({ error: 'Erro ao buscar dados do banco de dados.' });
    }
}