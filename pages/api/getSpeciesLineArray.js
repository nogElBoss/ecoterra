import db from '../../db/db';

export default async function handler(req, res) {
    const { points } = req.body; // Receber a lista de pontos do corpo da solicitação

    try {
        // Construir a consulta dinamicamente para criar os segmentos de linha
        let query = 'SELECT DISTINCT sci_name FROM data_0 WHERE ';
        for (let i = 0; i < points.length - 1; i++) {
            query += `ST_Intersects(ST_SetSRID(ST_MakeLine(ST_MakePoint(${points[i].lon ? points[i].lon : points[i].lng}, ${points[i].lat}), ST_MakePoint(${points[i + 1].lon ? points[i + 1].lon : points[i + 1].lng}, ${points[i + 1].lat})), 4326), geom)`;
            if (i < points.length - 2) {
                query += ' OR '; // Adicionar 'OR' entre os segmentos de linha
            }
        }

        const result = await db.query(query);
        const data = result.rows;

        res.status(200).json(data);
    } catch (error) {
        console.error('Erro na obtenção de dados:', error);
        res.status(500).json({ error: 'Erro ao buscar dados do banco de dados.' });
    }
}