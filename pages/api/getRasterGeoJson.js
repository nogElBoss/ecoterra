import fs from 'fs';
import db from '../../db/db';
import Terraformer from 'terraformer';
import WKT from 'terraformer-wkt-parser';

function convertGeoJSONToWKT(geojson) {
    if (geojson.type === 'FeatureCollection') {
        return geojson.features.map(feature => WKT.convert(new Terraformer.Primitive(feature.geometry))).join(';');
    } else if (geojson.type === 'Feature') {
        return WKT.convert(new Terraformer.Primitive(geojson.geometry));
    } else {
        return WKT.convert(new Terraformer.Primitive(geojson));
    }
}

export default async function handler(req, res) {
    const { geojson } = req.body;
    let wkt;

    try {
        wkt = convertGeoJSONToWKT(geojson);
        fs.writeFileSync('wkt_output.txt', wkt);

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

        // Objeto para armazenar os resultados
        let allResults = {};

        for (const table of tables) {
            // Atualizar a consulta SQL para usar o polígono
            const query = `
                SELECT (ST_DumpAsPolygons(ST_Clip(rast, ST_Transform(ST_SetSRID(ST_GeomFromText($1), 4326), 54009), true))).*
                FROM ${table}
                WHERE ST_Intersects(rast, ST_Transform(ST_SetSRID(ST_GeomFromText($1), 4326), 54009))
            ;`;

            // Executar a consulta com o WKT como parâmetro
            const result = await db.query(query, [wkt]);

            // Armazenar os resultados com base no nome da tabela
            allResults[table.replace('public.', '')] = result.rows;
        }

        // Enviar todos os resultados para o frontend
        res.status(200).json(allResults);
    } catch (error) {
        console.error('Erro na obtenção de dados:', error);
        res.status(500).json({ error: 'Erro ao buscar dados do banco de dados.' });
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '20mb',
        },
    },
}
