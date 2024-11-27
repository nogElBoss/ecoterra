import db from '../../db/db';

export default async function handler(req, res) {
    const { points } = req.body;  // Receber o array de pontos no corpo da requisição

    if (!Array.isArray(points) || points.length < 3) {
        return res.status(400).json({ error: 'Um polígono deve ter pelo menos três pontos.' });
    }

    try {
        // Verificar se o polígono está fechado (se o primeiro e o último ponto são iguais)
        const firstPoint = points[0];
        const lastPoint = points[points.length - 1];

        if (firstPoint.lat !== lastPoint.lat || firstPoint.lng !== lastPoint.lng) {
            // Adicionar o primeiro ponto ao final da lista para fechar o polígono
            points.push(firstPoint);
        }

        // Construir o polígono a partir do array de pontos
        const polygonCoords = points.map(point => `${point.lng} ${point.lat}`).join(', ');
        const polygonWKT = `POLYGON((${polygonCoords}))`;

        // Atualizar a consulta SQL para usar o polígono
        const query = `
            SELECT DISTINCT sci_name, class, category, marine
            FROM all_species 
            WHERE ST_Intersects(
                ST_SetSRID(ST_GeomFromText($1), 4326), 
                geom
            );
        `;

        // Executar a consulta com o polígono como parâmetro
        const result = await db.query(query, [polygonWKT]);
        const data = result.rows;

        res.status(200).json(data);
    } catch (error) {
        console.error('Erro na obtenção de dados:', error);
        res.status(500).json({ error: 'Erro ao buscar dados do banco de dados.' });
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
}
