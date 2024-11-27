import db from '../../db/db';
import * as turf from '@turf/turf';

export default async function handler(req, res) {
    const { points } = req.body; // Receber a lista de pontos do corpo da solicitação

    // Função para simplificar a geometria
    function simplifyPoints(points, tolerance = 0.01) {
        // Verificar se o turf foi importado corretamente
        if (!turf.lineString || !turf.simplify) {
            throw new Error('Turf functions are not available');
        }

        // Criar uma linha com os pontos
        const line = turf.lineString(points.map(point => [point.lon || point.lng, point.lat]));

        // Simplificar a linha
        const simplified = turf.simplify(line, { tolerance, highQuality: true });

        // Converter a linha simplificada de volta para um array de pontos
        return simplified.geometry.coordinates.map(coord => ({ lng: coord[0], lat: coord[1] }));
    }

    try {
        // Simplificar a geometria da estrada
        const simplifiedPoints = simplifyPoints(points);

        // Criar a geometria da linha
        let lineString = `ST_SetSRID(ST_MakeLine(ARRAY[${simplifiedPoints.map(p => `ST_MakePoint(${p.lng}, ${p.lat})`).join(', ')}]), 4326)`;

        // Criar a query para a interseção
        let query = `
            SELECT DISTINCT sci_name, class, category, marine
            FROM all_species 
            WHERE ST_Intersects(${lineString}, geom)
        `;

        // Log da query para depuração
        console.log('Query:', query);

        const result = await db.query(query);

        res.status(200).json(result.rows);
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
