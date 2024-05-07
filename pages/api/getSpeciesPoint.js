import db from '../../db/db';

export default async function handler(req, res) {
    const { px, py } = req.query;
    try {
        /* const query = 'SELECT sci_name FROM(SELECT * FROM data_0 ORDER BY id ASC LIMIT 5) WHERE ST_Intersects(ST_SetSRID(ST_MakeLine(ST_MakePoint($1, $2),ST_MakePoint($1, $2)), 4326), geom) ;'; */
        const query = 'SELECT DISTINCT sci_name FROM data_0 WHERE ST_Intersects(ST_SetSRID(ST_MakeLine(ST_MakePoint($1, $2),ST_MakePoint($1, $2)), 4326), geom) ;';
        const result = await db.query(query, [px, py]);
        const data = result.rows;

        res.status(200).json(data);
    } catch (error) {
        console.error('Erro na obtenção de dados:', error);
        res.status(500).json({ error: 'Erro ao buscar dados do banco de dados.' });
    }
}