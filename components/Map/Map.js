import 'leaflet/dist/leaflet.css';
import style from '../../styles/Home.module.css';
import { MapContainer, TileLayer, useMapEvents, Marker, Polyline, ZoomControl, Polygon, GeoJSON } from 'react-leaflet';
import React, { useRef } from 'react';

function MapEvents({ onCoordinatesChange }) {
    useMapEvents({
        click(e) {
            onCoordinatesChange(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

function Map({ onCoordinatesChange, activeOption, polygonPoints, segmentPoints, streetPoints, markers, showSatelliteLayer, geoJson, userLocation }) {

    const customMarkerIcon = '/images/marker.png';

    const mapRef = useRef(null);

    const convertPointsToSegments = (points) => {
        const segments = [];
        for (let i = 0; i < points.length - 1; i++) {
            segments.push([points[i], points[i + 1]]);
        }
        return segments;
    };

    // Converte a lista de pontos em segmentos de reta
    const segments = convertPointsToSegments(segmentPoints);
    const streetSegments = streetPoints.map(convertPointsToSegments)

    return (
        <div ref={mapRef}>
            <MapContainer className={style.map} center={[userLocation.latitude, userLocation.longitude]} zoom={10} scrollWheelZoom={true} zoomControl={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {showSatelliteLayer &&
                    <TileLayer
                        attribution='&copy; <a href="https://www.esri.com">Esri</a>'
                        url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />
                }

                {showSatelliteLayer &&
                    <TileLayer
                        attribution='&copy; <a href="https://www.esri.com">Esri</a>'
                        url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                    />
                }

                <MapEvents onCoordinatesChange={onCoordinatesChange} />
                {activeOption === 3 && polygonPoints.length >= 1 && (
                    <Polygon positions={polygonPoints} color="green" />
                )}
                {activeOption === 2 && segments.map((segment, index) => (
                    <Polyline key={index} positions={segment} color="green" />
                ))}

                {/* {(activeOption === 5 && streetSegments.length > 0) && streetSegments.flat().map((segment, index) => (
                    <Polyline key={index} positions={segment} color="red" />
                ))} */}

                {(activeOption === 5 && streetSegments.length > 0) &&
                    <Polyline positions={streetPoints} color="red" />
                }

                {(activeOption == 2 || activeOption == 1) && markers.length > 0 && (
                    <Marker position={[markers[0].lat, markers[0].lng]} icon={L.icon({ iconUrl: customMarkerIcon, iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] })} />
                )}

                {geoJson != null &&
                    <GeoJSON data={geoJson}></GeoJSON>
                }

                <ZoomControl position="topleft" style={{ marginTop: "100px" }} />
            </MapContainer>
        </div>

    );
}

export default Map;