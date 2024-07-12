import 'leaflet/dist/leaflet.css';
import style from '../../styles/Home.module.css';
import { MapContainer, TileLayer, useMapEvents, Marker, Polyline, ZoomControl, Polygon } from 'react-leaflet';
import React, { useState, useRef } from 'react';
import domtoimage from 'dom-to-image';
import { jsPDF } from 'jspdf';

const logo = "images/logo.png"

const species = [
    {
        "sci_name": "Cerdocyon thous",
        "class": "MAMMALIA",
        "category": "LC"
    },
    {
        "sci_name": "Chrysocyon brachyurus",
        "class": "MAMMALIA",
        "category": "NT"
    },
    {
        "sci_name": "Conepatus chinga",
        "class": "MAMMALIA",
        "category": "LC"
    },
    {
        "sci_name": "Eira barbara",
        "class": "REPTILIA",
        "category": "LC"
    },
    {
        "sci_name": "Galictis cuja",
        "class": "MAMMALIA",
        "category": "LC"
    },
    {
        "sci_name": "Herpailurus yagouaroundi",
        "class": "REPTILIA",
        "category": "LC"
    },
    {
        "sci_name": "Leopardus colocolo",
        "class": "MAMMALIA",
        "category": "NT"
    },
    {
        "sci_name": "Leopardus guttulus",
        "class": "MAMMALIA",
        "category": "VU"
    },
    {
        "sci_name": "Leopardus pardalis",
        "class": "MAMMALIA",
        "category": "LC"
    },
    {
        "sci_name": "Leopardus wiedii",
        "class": "AMPHIBIA",
        "category": "NT"
    },
    {
        "sci_name": "Lycalopex vetulus",
        "class": "MAMMALIA",
        "category": "NT"
    },
    {
        "sci_name": "Nasua nasua",
        "class": "REPTILIA",
        "category": "LC"
    },
    {
        "sci_name": "Potos flavus",
        "class": "AMPHIBIA",
        "category": "LC"
    },
    {
        "sci_name": "Puma concolor",
        "class": "MAMMALIA",
        "category": "LC"
    },
    {
        "sci_name": "Speothos venaticus",
        "class": "REPTILIA",
        "category": "NT"
    }
];

function MapEvents({ onCoordinatesChange }) {
    useMapEvents({
        click(e) {
            onCoordinatesChange(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

function Map({ onCoordinatesChange, activeOption, polygonPoints, segmentPoints, markers, showSatelliteLayer }) {

    const mapRef = useRef(null);

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

    const handleDownloadPDF = async () => {
        try {
            const dataUrl = await domtoimage.toPng(mapRef.current);
            const pdf = new jsPDF();

            // Adiciona a imagem do logo
            const logoImg = new Image();
            logoImg.src = logo;

            logoImg.onload = () => {
                const logoWidth = 50;
                const logoHeight = (logoImg.height / logoImg.width) * logoWidth;  // Calcula a altura proporcional

                let currentY = 10; // Posição inicial Y

                const addPageIfNecessary = (heightToAdd) => {
                    if (currentY + heightToAdd > pdf.internal.pageSize.height - 10) {
                        pdf.addPage();
                        currentY = 10; // Reinicia a posição Y para o topo da nova página
                        return true;
                    }
                    return false;
                };

                pdf.addImage(logoImg, 'PNG', 10, currentY, logoWidth, logoHeight);
                currentY += logoHeight + 10; // Atualiza a posição Y após adicionar a imagem do logo

                // Adiciona a data e hora atuais
                const currentDate = new Date();
                const day = String(currentDate.getDate()).padStart(2, '0');
                const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                const year = currentDate.getFullYear();
                const hours = String(currentDate.getHours()).padStart(2, '0');
                const minutes = String(currentDate.getMinutes()).padStart(2, '0');
                const formattedDate = `${day}/${month}/${year} ${hours}h:${minutes}m`;

                addPageIfNecessary(10); // Verifica se há espaço para a data e hora
                pdf.setFontSize(10);
                pdf.text(formattedDate, 150, 20);

                // Adiciona a imagem do mapa
                const img = new Image();
                img.src = dataUrl;

                img.onload = () => {
                    const imgWidth = 190; // Largura máxima do PDF
                    const imgHeight = (img.height / img.width) * imgWidth; // Calcula a altura proporcional

                    addPageIfNecessary(imgHeight + 20); // Verifica se há espaço para a imagem do mapa
                    pdf.addImage(img, 'PNG', 10, currentY, imgWidth, imgHeight);
                    currentY += imgHeight + 10; // Atualiza a posição Y após adicionar a imagem do mapa

                    // Adiciona o título "Species present in the area"
                    addPageIfNecessary(10); // Verifica se há espaço para o título
                    pdf.setFontSize(14);
                    pdf.text('Species present in the area:', 10, currentY);
                    currentY += 10; // Atualiza a posição Y após adicionar o título

                    // Adiciona a lista de espécies organizada por classe
                    const speciesByClass = groupSpeciesByClass(species);
                    Object.keys(speciesByClass).forEach((className) => {
                        addPageIfNecessary(20); // Verifica se há espaço para o título da classe
                        pdf.setFontSize(10); // Define o tamanho da fonte para a lista de espécies
                        pdf.text(className, 10, currentY);
                        currentY += 5; // Atualiza a posição Y após adicionar o título da classe

                        pdf.setFontSize(8); // Define um tamanho menor para os itens da lista de espécies
                        speciesByClass[className].forEach((speciesItem) => {
                            addPageIfNecessary(8); // Verifica se há espaço para cada item da lista
                            const text = `${speciesItem.sci_name}, ${speciesItem.category}`;
                            pdf.text(text, 15, currentY);
                            currentY += 5; // Atualiza a posição Y após adicionar cada item da lista
                        });

                        currentY += 5; // Espaço entre as classes
                    });

                    pdf.save('map.pdf');
                };
            };
        } catch (error) {
            console.error('Oops, something went wrong!', error);
        }
    };




    const groupSpeciesByClass = (species) => {
        const groupedSpecies = {};

        species.forEach((speciesItem) => {
            if (!groupedSpecies[speciesItem.class]) {
                groupedSpecies[speciesItem.class] = [];
            }
            groupedSpecies[speciesItem.class].push(speciesItem);
        });

        // Ordena as espécies por sci_name dentro de cada classe
        Object.keys(groupedSpecies).forEach((className) => {
            groupedSpecies[className].sort((a, b) => {
                if (a.sci_name < b.sci_name) {
                    return -1;
                }
                if (a.sci_name > b.sci_name) {
                    return 1;
                }
                return 0;
            });
        });

        return groupedSpecies;
    };

    return (
        <>
            <button onClick={handleDownloadPDF} style={{ position: 'absolute', zIndex: 1000 }}>
                Download Map
            </button>
            <div ref={mapRef}>
                <MapContainer className={style.map} center={[-20.67390526467283, -54.62402343750001]} zoom={7} scrollWheelZoom={true} zoomControl={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {showSatelliteLayer &&
                        <TileLayer
                            attribution='&copy; <a href="https://www.esri.com">Esri</a>'
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />}

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
            </div>

        </>
    );
}

export default Map;