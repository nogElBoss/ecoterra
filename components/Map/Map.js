// components/map/Map.js

// ... (importações existentes)

import 'leaflet/dist/leaflet.css';
import style from '../../styles/Home.module.css';
import { MapContainer, TileLayer, useMapEvents, Marker, Polyline, ZoomControl } from 'react-leaflet';
import React, { useState } from 'react';

function MapEvents({ onCoordinatesChange }) {
    useMapEvents({
        click(e) {
            onCoordinatesChange(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

function Map({ onCoordinatesChange, isPointActive, markerPosition, markerPosition2, isPoint1Active, isPoint2Active }) {
    // Caminho relativo para a imagem a partir do diretório 'public'
    const customMarkerIcon = '/images/marker.png';

    return (
        <MapContainer className={style.map} center={[-20.67390526467283, -54.62402343750001]} zoom={7} scrollWheelZoom={true} zoomControl={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapEvents onCoordinatesChange={onCoordinatesChange} />
            {isPointActive && markerPosition && (
                <>
                    <Marker position={markerPosition} icon={L.icon({ iconUrl: customMarkerIcon, iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] })} title='teste' />
                </>
            )}
            {isPoint1Active && markerPosition && (
                <>
                    <Marker position={markerPosition} icon={L.icon({ iconUrl: customMarkerIcon, iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] })} title='teste' />
                </>
            )}
            {isPoint2Active && markerPosition2 && (
                <>
                    <Marker position={markerPosition2} icon={L.icon({ iconUrl: customMarkerIcon, iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] })} title='teste' />
                </>
            )}
            {isPoint2Active && isPoint1Active && (
                <>
                    <Polyline positions={[markerPosition, markerPosition2]} color="green" />
                </>
            )}
            <ZoomControl position="topleft" style={{ marginTop: "100px" }} />
        </MapContainer>
    );
}

export default Map;