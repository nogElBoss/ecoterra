import db from '../../db/db';

export default async function handler(req, res) {
    const { points } = req.body;

    if (!points || !Array.isArray(points) || points.length < 2) {
        return res.status(400).json({ error: 'É necessário fornecer um array de pelo menos dois pontos.' });
    }

    // Lista de tabelas raster
    const tables = [
        'public.amphibians_sr',
        'public.amphibians_thr',
        'public.mammals_sr',
        'public.mammals_thr',
        'public.reptiles_sr',
        'public.reptiles_thr',
        'public.birds_sr',
        'public.birds_thr',
        'public.combined_sr',
        'public.combined_thr'
    ];

    try {
        let allResults = [];

        // Loop sobre cada par de pontos consecutivos
        for (let i = 0; i < points.length - 1; i++) {
            const startPoint = points[i];
            const endPoint = points[i + 1];

            // Objeto para armazenar os resultados de todas as tabelas para o par de pontos atual
            let geometriesForPair = {};

            for (const table of tables) {
                const query = `
                    SELECT (ST_DumpAsPolygons(ST_Clip(rast, ST_Transform(ST_SetSRID(ST_MakeLine(ST_MakePoint(${startPoint.lng}, ${startPoint.lat}), ST_MakePoint(${endPoint.lng}, ${endPoint.lat})), 4326), 54009), true))).*
                    FROM ${table}
                    WHERE ST_Intersects(rast, ST_Transform(ST_SetSRID(ST_MakeLine(ST_MakePoint(${startPoint.lng}, ${startPoint.lat}), ST_MakePoint(${endPoint.lng}, ${endPoint.lat})), 4326), 54009))
                `;

                const result = await db.query(query);

                // Armazenar os resultados com base no nome da tabela
                geometriesForPair[table.replace('public.', '')] = result.rows;
            }

            // Adiciona os resultados para o par de pontos ao array total
            allResults.push(geometriesForPair);
        }

        // Envia todos os resultados para o frontend
        res.status(200).json(allResults);
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
