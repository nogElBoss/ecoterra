// components/map/Map.js

// ... (importações existentes)

import 'leaflet/dist/leaflet.css';
import style from '../../styles/Home.module.css';
import { MapContainer, TileLayer, useMapEvents, Marker, Polyline } from 'react-leaflet';
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
        <MapContainer className={style.map} center={[-20.67390526467283, -54.62402343750001]} zoom={7} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZ24xNjEwIiwiYSI6ImNsbnJvY3UwczFlZ3QycXM2aWVqemVqaDMifQ.k9BgfJBMu8xmoywb-mWbpg"
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
        </MapContainer>
    );
}

export default Map;