import db from '../../db/db';

export default async function handler(req, res) {
    const { px, py } = req.query;

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
        // Objeto para armazenar os resultados de cada tabela
        let results = {};

        // Loop para percorrer cada tabela
        for (const table of tables) {
            const query = `
                SELECT ST_Value(rast, ST_Transform(ST_SetSRID(ST_MakePoint($2,$1), 4326), 54009)) AS valor_raster
                FROM ${table};
            `;

            const result = await db.query(query, [py, px]);
            results[table.replace('public.', '')] = result.rows[0]?.valor_raster || null;
        }

        // Envia todos os resultados para o frontend
        res.status(200).json(results);
    } catch (error) {
        console.error('Erro na obtenção de dados:', error);
        res.status(500).json({ error: 'Erro ao buscar dados do banco de dados.' });
    }
}
