import fs from 'fs';
import db from '../../db/db';
import Terraformer from 'terraformer';
import WKT from 'terraformer-wkt-parser';

// Função para converter GeoJSON para WKT
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

        // Salvar WKT em um arquivo
        fs.writeFileSync('wkt_output.txt', wkt);

        const query = `
            SELECT DISTINCT sci_name, class, category, marine
            FROM all_species 
            WHERE ST_Intersects(
                ST_SetSRID(ST_GeomFromText($1), 4326), geom
            );
        `;

        const result = await db.query(query, [wkt]);
        const data = result.rows;

        res.status(200).json(data);
    } catch (error) {
        console.error('Erro na obtenção de dados:', error);
        res.status(500).json({ error: 'Erro ao buscar dados do banco de dados.', wkt });
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '20mb',
        },
    },
}
