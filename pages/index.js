
import {
  Flex,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Spinner,
  Text,
  FormControl,
  FormLabel,
  CheckboxGroup,
  Stack,
  Checkbox,
  Switch,
  Heading
} from '@chakra-ui/react'
import { useState, useEffect, useRef } from 'react';
import Map from '@/components/Map'
import ButtonOption from "@/components/ButtonOption"
import shp from 'shpjs';
import LoadFile from "@/components/LoadFile"
import SpeciesOutput from '@/components/SpeciesOutPut';
import Ruler from '@/components/Ruler';
import domtoimage from 'dom-to-image';
import { jsPDF } from 'jspdf';
import StreetsList from '@/components/StreetsList';
import { useRouter } from 'next/router';
import LoadingBar from '@/components/LoadingBar';
import RastersOutput from '@/components/RastersOutput';
import MultipleRastersOutput from '@/components/MultipleRastersOutput';

import { ArrowForwardIcon } from '@chakra-ui/icons'
const logo = "/images/logo.png"


export default function Home() {

  const mapRef = useRef(null)

  const router = useRouter()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [errorOnLocation, setErrorOnLocation] = useState(null);

  const [activeOption, setActiveOption] = useState(0);
  const [reportState, setReportState] = useState(0);

  const [markers, setMarkers] = useState([]);
  const [geoJson, setGeoJson] = useState(null)
  //const [markerPosition2, setMarkerPosition2] = useState(null);


  const [point, setPoint] = useState({ x: null, y: null })

  const [line1, setLine1] = useState({ x: null, y: null })
  const [line2, setLine2] = useState({ x: null, y: null })
  const [segmentPoints, setSegmentPoints] = useState([]);

  const [streetPoints, setStreetPoints] = useState([]);

  const [polygonPoints, setPolygonPoints] = useState([]);


  const [data, setData] = useState({});

  const [streetsSpecies, setStreetsSpecies] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      setTimeout(setShowSpinner(false), 1000)
    }
    else {
      setShowSpinner(true)
    }
  }, [isLoading]);

  const [showSatelite, setShowSatelite] = useState(false)

  const [showStreets, setShowStreets] = useState([])

  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorOnLocation('Geolocation is not supported by your browser');
      return;
    }

    const handleSuccess = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    };

    const handleError = (error) => {
      setLocation({
        latitude: -20.67390526467283,
        longitude: -54.62402343750001,
      });
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);
  }, []);

  const handleCoordinatesChange = (lat, lng) => {

    console.log("Latitude:", lat);
    console.log("Longitude:", lng);

    if (activeOption != 0) {
      if (activeOption == 1) {
        if (point && point.x == null && point.y == null) {
          setPoint({ x: lng, y: lat })
          addMarker(lat, lng)
        }
      }
      else if (activeOption == 2) {
        addSegmentPoint(lat, lng)
        addMarker(lat, lng)

      }
      else if (activeOption === 3 && !isOpen) {
        addPolygonPoint(lat, lng);
        addMarker(lat, lng)
      }
    }
  };

  const addPolygonPoint = (lat, lng) => {
    setPolygonPoints(prevPoints => [...prevPoints, { lat, lng }]);
  };

  const addMarker = (lat, lng) => {
    setMarkers(prevPoints => [...prevPoints, { lat, lng }]);
    console.log(markers)
  };

  const deleteMarker = () => {
    setMarkers(prevPoints => {
      const updatedMarkers = [...prevPoints];
      updatedMarkers.pop();
      return updatedMarkers;
    });
    console.log(markers)
  };

  const deletePolygonPoint = (lat, lng) => {
    setPolygonPoints(prevPoints => {
      const updatePolyPoints = [...prevPoints];
      updatePolyPoints.pop()
      return updatePolyPoints
    });
    console.log(polygonPoints)
  };

  const addSegmentPoint = (lat, lng) => {
    setSegmentPoints(prevPoints => [...prevPoints, { lat, lng }]);
  };

  const addStreetPoints = (newPoints) => {
    setStreetPoints(prevPoints => [...prevPoints, newPoints]);
  };

  const deleteSegmentPoint = () => {
    setSegmentPoints(prevPoints => {
      const updatedMarkers = [...prevPoints];
      updatedMarkers.pop();
      return updatedMarkers;
    });
  };

  const handleDeletePoint = () => {
    deleteSegmentPoint()
    deleteMarker()
  }

  const handleDeletePolyPoint = () => {
    deletePolygonPoint()
  }

  const handleClose = () => {
    onClose()
    reset()

  };

  async function fetchData(endpoint) {
    try {
      let response
      console.log(activeOption)
      if (activeOption == 1) {
        setIsLoading(true)
        response = await fetch(`/api/${endpoint}Point?px=${point.x}&py=${point.y}`, {
          method: 'GET',
        });
        setIsLoading(false)
      }
      else if (activeOption == 2 || activeOption == 5) {
        console.log(segmentPoints)
        setIsLoading(true)
        response = await fetch(`/api/${endpoint}LineArray`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ points: segmentPoints })
        });
        setIsLoading(false)
      }
      else if (activeOption == 3) {
        console.log(polygonPoints)
        setIsLoading(true)
        response = await fetch(`/api/${endpoint}Polygon`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ points: polygonPoints })
        });
        setIsLoading(false)
      }
      else if (activeOption == 4) {
        setIsLoading(true)
        response = await fetch(`/api/${endpoint}GeoJson`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ geojson: geoJson })
        });
        setIsLoading(false)
      }



      if (response.ok) {

        const result = await response.json();
        console.log(result)

        setData(prevState => ({
          ...prevState, // Mantenha as entradas existentes
          [endpoint]: result // Adicione a nova entrada
        }));
      } else {
        console.error('Erro na resposta da API:', response.status);
      }
    } catch (error) {
      console.error('Erro na obtenção de dados:', error);
    }
  }


  useEffect(() => {
    if (activeOption != 0) {
      if (activeOption == 1) {
        if (point && point.x != null && point.y != null) {
          //fetchData()
          onOpen()
        }
      }
      if (activeOption == 2) {
        if (line1.x != null && line1.y != null && line2.x != null && line2.y != null) {
          //fetchData()
          onOpen()
        }
      }
      if (activeOption == 4) {
        onOpen()
      }
    }
  }, [activeOption, point, line1, line2]);

  useEffect(() => {
    console.log(reportState)
  }, [reportState]);



  const reset = () => {
    setActiveOption(0)
    setPoint({ x: null, y: null })
    setPolygonPoints([])
    setSegmentPoints([])
    setMarkers([])

    setData({})
    setReportState(0)
    setStreetsSpecies([])

    setSelectedOptions([])
    setShowStreets([])
    setStreetPoints([])
    setGeoJson(null)

    setIsLoading(false)
    setShowSpinner(false)
  }

  const goBack = () => {
    setData({})
    setReportState(0)
    setStreetsSpecies([])
    setSelectedOptions([])
    setShowStreets([])
    setStreetPoints([])
    setGeoJson(null)
    if (activeOption == 5) {
      setActiveOption(3)
    }
  }



  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Opções selecionadas:", selectedOptions);

    if (selectedOptions.includes("shp")) {
      await fetchData("getSpecies")
      console.log(data)
    }
    if (selectedOptions.includes("raster")) {
      console.log("aqui")
      await fetchData("getRaster")
    }



    setReportState(reportState + 1)
  };

  const handlePolygonSelection = async (option) => {

    setSelectedOptions([option])

    if (option == "streets") {
      console.log("fds")
      setIsLoading(true)
      console.log(polygonPoints)
      const polygonCoordinates = polygonPoints.map(point => `${point.lat} ${point.lng}`).join(' ');
      const overpassQuery = `[out:json];
                             relation(poly:"${polygonCoordinates}");
                             out geom;`;

      await fetch("https://overpass-api.de/api/interpreter", {
        method: 'POST',
        body: overpassQuery
      })
        .then(response => response.json())
        .then(async data => {
          await setData(prevState => ({
            ...prevState,
            ["getStreets"]: data.elements
          }));
          handleOrganizeStreets(data.elements)
          setIsLoading(false)
        })
        .catch(error => {
          console.error('Erro ao fazer a solicitação:', error);
          setIsLoading(false)
        });
    }
    if (option == "area") {
      console.log("fds")
      setReportState(reportState + 1)
    }


    setReportState(reportState + 1)
  };

  const handleCheckboxChange = (newSelectedOptions) => {
    setSelectedOptions(newSelectedOptions);
    console.log(selectedOptions)
  };

  const handleOrganizeStreets = (data) => {
    let list = {}
    list["Main Roads"] = []
    list["Solar Parks"] = []

    console.log(data)

    data.forEach((street) => {
      if (street.tags?.route == "forward" || street.tags?.route == "road") {
        list["Main Roads"].push(street)
      }
      else if (street.tags?.power == "plant") {
        list["Solar Parks"].push(street)
      }
    })

    setShowStreets(list)
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const convertedGeoJson = await shp(arrayBuffer);
      console.log(convertedGeoJson)
      setGeoJson(convertedGeoJson)
      setReportState(reportState + 1)

    }
  };

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
          const speciesByClass = groupSpeciesByClass(data["getSpecies"]);
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

  const handleStreet = (members) => {

    console.log(members)

    let toFetch = members.map(item => {
      if (item.geometry) {
        const firstPoint = item.geometry[0];
        return { lat: firstPoint.lat, lng: firstPoint.lon };
      }
      else if (item.type == "node") {
        return { lat: item.lat, lng: item.lon };
      }
    });

    let toDraw = members.map(item => {

      if (item.geometry) {
        return item.geometry.map(point => [point.lat, point.lon]);
      }
      else if (item.type == "node") {
        return [item.lat, item.lon];
      }
    });


    console.log(toFetch)
    console.log(toDraw)
    //chamarEndpoint(toFetch)
    setSegmentPoints(toFetch)
    setReportState(reportState + 1)
    setActiveOption(5)
    setStreetPoints(toDraw)
  }


  return (
    <>
      <div>
        <div ref={mapRef}>
          {location.latitude && location.longitude &&
            <Map
              onCoordinatesChange={handleCoordinatesChange}
              markers={markers}
              polygonPoints={polygonPoints}
              segmentPoints={segmentPoints}
              activeOption={activeOption}
              showSatelliteLayer={showSatelite}
              streetPoints={streetPoints}
              geoJson={geoJson}
              userLocation={location}
            />
          }
        </div>

        <Flex
          display={isOpen ? "none" : "flex"}
          position="absolute"
          bottom="0%"
          left="70px"
          h="fit-content"
          zIndex="5000"
          align={"start"}
          justify={"center"}
          direction="column"
        >

          <ButtonOption onClick={() => reset()} txt={"Reset"} />

          <ButtonOption onClick={() => setActiveOption(1)} isDisabled={activeOption != 1 && activeOption != 0} isActive={activeOption === 1} src={'/images/point.png'} label={"Select Point"} />

          <Flex position="relative">
            <ButtonOption onClick={() => setActiveOption(2)} isDisabled={activeOption != 2 && activeOption != 0} isActive={activeOption === 2} src={'/images/line.png'} label={"Draw Segments"} />
            <Flex
              top="5px"
              left="110px"
              position="absolute"
              direction="column"
              gap="10px"
            >
              <Button
                display={activeOption == 2 ? "flex" : "none"}
                onClick={onOpen}
                isDisabled={segmentPoints.length < 2}
                bg={"darkGreen"}
                borderRadius={"10px"}
                color={"white"}
                fontSize="20px"
                px="15px"
                w="fit-content"
                _active={
                  { background: "selectedGreen" }
                }
                _hover={
                  { background: "selectedGreen" }
                }
              >
                Done
              </Button>
              <Button
                display={activeOption == 2 ? "flex" : "none"}
                onClick={handleDeletePoint}
                isDisabled={segmentPoints.length < 1}
                bg={"darkGreen"}
                borderRadius={"10px"}
                color={"white"}
                fontSize="20px"
                px="15px"
                w="fit-content"
                _active={
                  { background: "selectedGreen" }
                }
                _hover={
                  { background: "selectedGreen" }
                }
              >
                Delete last point
              </Button>
            </Flex>

          </Flex>



          <Flex position="relative">
            <ButtonOption onClick={() => setActiveOption(3)} isDisabled={activeOption != 3 && activeOption != 0} isActive={activeOption === 3} src={'/images/poly.png'} label={"Draw Polygon"} />
            <Flex
              top="5px"
              left="110px"
              position="absolute"
              direction="column"
              gap="10px"
            >

              <Button
                display={activeOption == 3 ? "flex" : "none"}
                onClick={onOpen}
                isDisabled={polygonPoints.length < 3}
                h={"40px"}
                bg={"darkGreen"}
                borderRadius={"10px"}
                color={"white"}
                fontSize="20px"
                px="15px"
                w="fit-content"
                _active={
                  { background: "selectedGreen" }
                }
                _hover={
                  { background: "selectedGreen" }
                }
              >
                Done
              </Button>

              <Button
                display={activeOption == 3 ? "flex" : "none"}
                onClick={handleDeletePolyPoint}
                isDisabled={polygonPoints.length < 1}
                bg={"darkGreen"}
                borderRadius={"10px"}
                color={"white"}
                fontSize="20px"
                px="15px"
                w="fit-content"
                _active={
                  { background: "selectedGreen" }
                }
                _hover={
                  { background: "selectedGreen" }
                }
              >
                Delete last point
              </Button>
            </Flex>



          </Flex>

          <ButtonOption onClick={() => setActiveOption(4)} isDisabled={activeOption != 4 && activeOption != 0} isActive={activeOption === 4} src={'/images/upload.png'} label={"Upload Shapefile"} />

          <Flex
            mb="20px"
            h="fit-content"
            zIndex="1000"
            align={"center"}
            justify={"center"}
            bg="darkGreen"
            px="20px"
            py="5px"
            gap="10px"
          >
            <Text fontSize="25px" fontWeight="bold" color="white">Satelite:</Text>
            <Switch onChange={() => setShowSatelite(!showSatelite)} size='md' />
          </Flex>
        </Flex>

      </div>
      <Drawer
        onClose={onClose}
        isOpen={isOpen}
        size={"md"}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isFullHeight={false}
      >
        <DrawerContent zIndex="1">
          <DrawerCloseButton onClick={() => handleClose()} />
          <DrawerHeader fontFamily="bold" mt="">
            <Flex justify="space-between" align="center">

            </Flex>
          </DrawerHeader>
          <DrawerBody mb="110px">


            {activeOption == 4 && reportState == 0
              ?
              <>
                <FormLabel fontSize="20px" fontFamily="bold">{reportState + 1 + " - "}Drag your shapefile as a zip or select it from your computer:</FormLabel><Flex display={reportState == 0 ? "flex" : "none"} w="100%">
                  {/* <input type="file" accept=".shp" onChange={handleFileUpload} /> */}
                  <LoadFile onChange={handleFileUpload}></LoadFile>
                </Flex>
              </>
              :
              <>
                <Flex display={(reportState == 0 && (activeOption != 3 && activeOption != 5)) || (reportState == 1 && activeOption == 3 && selectedOptions.includes("area")) || (reportState == 2 && activeOption == 5) || (reportState == 1 && activeOption == 4) ? "flex" : "none"}>
                  <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <FormControl id="checkboxGroup">
                      <FormLabel fontSize="20px" fontFamily="bold">{reportState + 1 + " - "}Select the layers you desire to analyse:</FormLabel>
                      <CheckboxGroup value={selectedOptions} onChange={handleCheckboxChange}>
                        <Stack spacing={3} direction="column">
                          {[1, 2, 3, 4, 5].includes(activeOption) &&
                            <Checkbox value="shp">Species present in the area</Checkbox>}

                          {[1, 2, 3, 4, 5].includes(activeOption) &&
                            <Checkbox value="raster">Species rarity raster data</Checkbox>}

                        </Stack>
                      </CheckboxGroup>
                    </FormControl>
                  </form>
                </Flex>

                <Flex display={reportState == 0 && activeOption == 3 ? "flex" : "none"}>
                  <form style={{ width: '100%' }}>
                    <FormControl id="checkboxGroup">
                      <FormLabel fontSize="20px" fontFamily="bold">{reportState + 1 + " - "}Choose what you want to analyze:</FormLabel>

                      <Flex
                        borderBottom="1px"
                        borderColor="gray.200"
                        align="center"
                        justify="space-between"
                        px="10px"
                        onClick={() => handlePolygonSelection('area')}

                        _hover={{
                          cursor: "pointer",
                          backgroundColor: "#F5F5F5"
                        }}
                      >
                        <Text my="7px" >Drawn area</Text>
                        <ArrowForwardIcon boxSize="20px" />
                      </Flex>

                      <Flex
                        borderBottom="1px"
                        borderTop={"1px"}
                        borderColor="gray.200"
                        align="center"
                        justify="space-between"
                        px="10px"
                        onClick={() => handlePolygonSelection('streets')}

                        _hover={{
                          cursor: "pointer",
                          backgroundColor: "#F5F5F5"
                        }}
                      >
                        <Text my="7px" >Specific infrastructure present in the area</Text>
                        <ArrowForwardIcon boxSize="20px" />
                      </Flex>
                    </FormControl>
                  </form>
                </Flex>

                <Flex
                  position="absolute"
                  bottom={"0"}
                  w="100%"
                  pt="20px"
                  pb="50px"
                  left="0"
                  align="center"
                  justify="center"
                  gap="10px"
                  borderTop="2px"
                  borderColor="#c7c7c7"
                  bg="white"
                >
                  <Button
                    onClick={goBack}
                    isDisabled={reportState > 0 ? false : true}
                    w="45%"
                    bg="darkGreen"
                    borderRadius="0"
                    color="white"
                    _hover={{
                      bg: "selectedGreen"
                    }}
                  >
                    &lt; Back
                  </Button>
                  <Button
                    w="45%"
                    bg="darkGreen"
                    onClick={handleSubmit}
                    borderRadius="0"
                    color="white"
                    _hover={{
                      bg: "selectedGreen"
                    }}
                    isDisabled={selectedOptions.length === 0 || ((reportState == 1 && (activeOption != 3 && activeOption != 4)) || (reportState == 2 && activeOption == 3))}
                  >
                    Forward &gt;
                  </Button>
                </Flex>
              </>
            }


            <Flex display={showSpinner ? "flex" : "none"} w="100%" h="200px" align="center" justify="center" direction="column" gap={"20px"}>
              <Spinner h="50px" w="50px" color="green" />
              <LoadingBar isLoading={isLoading} duration={20} />
            </Flex>

            {/* ESPECIES */}
            {!isLoading && ((reportState == 1 && activeOption != 3) || (reportState == 2 && activeOption == 3) || (reportState == 3 && activeOption == 5) || (reportState == 2 && activeOption == 4)) && (selectedOptions.includes("shp") || activeOption == 4) && data["getSpecies"] &&
              <SpeciesOutput species={data["getSpecies"]}></SpeciesOutput>
            }

            {/* RARIDADE */}
            {!isLoading && reportState == 1 && selectedOptions.includes("raster") && activeOption == 1 && data && data["getRaster"] &&

              <RastersOutput data={data["getRaster"]} />
            }
            {!isLoading && ((reportState == 1 && activeOption == 2) || (reportState == 2 && activeOption == 3) || (reportState == 3 && activeOption == 5) || (reportState == 2 && activeOption == 4)) && selectedOptions.includes("raster") && data["getRaster"] && (
              <MultipleRastersOutput data={data["getRaster"]} />
            )}

            {/* ESTRADAS */}

            {!isLoading && (reportState == 1 && activeOption == 3) && selectedOptions.includes("streets") && streetsSpecies.length == 0 &&
              <Text mb="20px" fontSize="20px" fontFamily="bold">2 - Select the desired infrastructure:</Text>
            }

            {!isLoading && (reportState == 1 && activeOption == 3) && selectedOptions.includes("streets") && streetsSpecies.length == 0 &&
              < StreetsList streets={showStreets} handleStreet={handleStreet} />
            }

            {!isLoading && reportState == 1 && selectedOptions.includes("streets") && streetsSpecies.length > 0 && streetsSpecies.map((specie) => (
              <Text>{specie.sci_name}</Text>
            ))}

            {!isLoading && ((reportState == 1 && activeOption != 3) || (reportState == 2 && activeOption == 3)) && (selectedOptions.includes("shp") || activeOption == 4) && data["getSpecies"] &&
              <Button
                mt="50px"
                onClick={handleDownloadPDF}
                isDisabled={reportState > 0 ? false : true}
                w="100%"
                bg="darkGreen"
                borderRadius="0"
                color="white"
                _hover={{
                  bg: "selectedGreen"
                }}
              >
                Download PDF
              </Button>
            }

          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}