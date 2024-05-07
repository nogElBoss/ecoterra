import 'leaflet/dist/leaflet.css';
import style from '../../styles/Home.module.css';
import { MapContainer, TileLayer, useMapEvents, Marker, Polyline, ZoomControl, Polygon } from 'react-leaflet';
import React, { useState } from 'react';

function MapEvents({ onCoordinatesChange }) {
    useMapEvents({
        click(e) {
            onCoordinatesChange(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

function Map({ onCoordinatesChange, activeOption, polygonPoints, segmentPoints, markers, showSatelliteLayer }) {

    const customMarkerIcon = '/images/marker.png';

    const convertPointsToSegments = (points) => {
        const segments = [];
        for (let i = 0; i < points.length - 1; i++) {
            segments.push([points[i], points[i + 1]]);
        }
        return segments;
    };

    // Converte a lista de pontos em segmentos de reta
    const segments = convertPointsToSegments(segmentPoints);

    return (
        <MapContainer className={style.map} center={[-20.67390526467283, -54.62402343750001]} zoom={7} scrollWheelZoom={true} zoomControl={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {showSatelliteLayer &&
                <TileLayer
                    attribution='&copy; <a href="https://www.esri.com">Esri</a>'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
            }

            <MapEvents onCoordinatesChange={onCoordinatesChange} />
            {activeOption === 3 && polygonPoints.length >= 1 && (
                <>
                    <Polygon positions={polygonPoints} color="green" />
                </>
            )}
            {(activeOption === 2 || (activeOption === 3 && segments.length > 0)) && segments.map((segment, index) => (
                <Polyline key={index} positions={segment} color={activeOption == 3 ? "red" : "green"} />
            ))}
            {(activeOption == 2 || activeOption == 1) && markers.map((point, index) => (
                <Marker key={index} position={[point.lat, point.lng]} icon={L.icon({ iconUrl: customMarkerIcon, iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] })} />
            ))}
            <ZoomControl position="topleft" style={{ marginTop: "100px" }} />
        </MapContainer>
    );
}

export default Map;