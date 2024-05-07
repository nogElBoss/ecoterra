
import {
  Flex,
  Button,
  Image,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
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
  Switch
} from '@chakra-ui/react'
import { useState, useEffect } from 'react';
import Map from '@/components/Map'
import ButtonOption from "@/components/ButtomOption"

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [activeOption, setActiveOption] = useState(0);
  const [reportState, setReportState] = useState(0);

  const [isPointActive, setIsPointActive] = useState(false);
  const [markers, setMarkers] = useState([]);
  //const [markerPosition2, setMarkerPosition2] = useState(null);


  const [point, setPoint] = useState({ x: null, y: null })

  const [line1, setLine1] = useState({ x: null, y: null })
  const [line2, setLine2] = useState({ x: null, y: null })
  const [segmentPoints, setSegmentPoints] = useState([]);

  const [polygonPoints, setPolygonPoints] = useState([]);


  const [data, setData] = useState({});

  const [streetsSpecies, setStreetsSpecies] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [showSatelite, setShowSatelite] = useState(false)

  const [nodes, setNodes] = useState([])

  const [showStreets, setShowStreets] = useState([])

  const [activeFilters, setActiveFilters] = useState([])



  const handleCoordinatesChange = (lat, lng) => {

    console.log("Latitude:", lat);
    console.log("Longitude:", lng);

    if (activeOption != 0) {
      if (activeOption == 1) {
        if (point && point.x == null && point.y == null) {
          setPoint({ x: lng, y: lat })
          //setMarkerPosition({ lat, lng });
          addMarker(lat, lng)
        }
      }
      else if (activeOption == 2) {
        /* if (line1.x == null && line1.y == null && line2.x == null && line2.y == null) {
          setLine1({ x: lng, y: lat })
          setMarkerPosition({ lat, lng });
        }
        else if (line1.x != null && line1.y != null && line2.x == null && line2.y == null) {
          setLine2({ x: lng, y: lat })
          setMarkerPosition2({ lat, lng });
        } */
        addSegmentPoint(lat, lng)
        addMarker(lat, lng)

      }
      else if (activeOption === 3) {
        addPolygonPoint(lat, lng);
        addMarker(lat, lng)
      }
    }
  };

  const handleDeleteMarker = () => {

  }

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

  const addSegmentPoint = (lat, lng) => {
    setSegmentPoints(prevPoints => [...prevPoints, { lat, lng }]);
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

  const handleClose = () => {
    onClose()
    reset()

  };

  async function fetchData(endpoint) {
    try {
      let response
      if (activeOption == 1) {
        setIsLoading(true)
        response = await fetch(`/api/${endpoint}Point?px=${point.x}&py=${point.y}`, {
          method: 'GET',
        });
        setIsLoading(false)
      }
      else if (activeOption == 2) {
        setIsLoading(true)
        response = await fetch('/api/getSpeciesLineArray', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ points: segmentPoints })
        });
        setIsLoading(false)
      }


      if (response.ok) {

        const result = await response.json();

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
    }
  }, [activeOption, point, line1, line2]);



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
    setActiveFilters([])
    setShowStreets([])
  }

  function calculahandlteMean(values) {
    const filteredValues = values.filter(value => value !== null);
    if (filteredValues.length === 0) return 0;
    const sum = filteredValues.reduce((acc, value) => acc + value, 0);
    return sum / filteredValues.length;
  }

  function calculateMedian(values) {
    const filteredValues = values.filter(value => value !== null);
    if (filteredValues.length === 0) return 0;

    const sortedValues = filteredValues.slice().sort((a, b) => a - b);
    const middleIndex = Math.floor(sortedValues.length / 2);

    if (sortedValues.length % 2 === 0) {
      return (sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2;
    } else {
      return sortedValues[middleIndex];
    }
  }

  function calculateVariance(values) {
    const filteredValues = values.filter(value => value !== null);
    if (filteredValues.length === 0) return 0;

    const mean = calculateMean(filteredValues);
    const squaredDifferences = filteredValues.map(value => Math.pow(value - mean, 2));
    const sumSquaredDifferences = squaredDifferences.reduce((acc, value) => acc + value, 0);
    return sumSquaredDifferences / filteredValues.length;
  }

  function calculateStandardDeviation(values) {
    const filteredValues = values.filter(value => value !== null);
    if (filteredValues.length === 0) return 0;

    const mean = calculateMean(filteredValues);
    const squaredDifferences = filteredValues.map(value => Math.pow(value - mean, 2));
    const sumSquaredDifferences = squaredDifferences.reduce((acc, value) => acc + value, 0);
    const variance = sumSquaredDifferences / filteredValues.length;
    const standardDeviation = Math.sqrt(variance);
    return standardDeviation;
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
      await fetchData("getRaster")
      console.log(data)
    }
    if (selectedOptions.includes("streets")) {
      setIsLoading(true)
      console.log(polygonPoints)
      const polygonCoordinates = polygonPoints.map(point => `${point.lat} ${point.lng}`).join(' ');
      const overpassQuery = `[out:json];
                             way(poly:"${polygonCoordinates}");
                             out body;`;

      await fetch("https://overpass-api.de/api/interpreter", {
        method: 'POST',
        body: overpassQuery
      })
        .then(response => response.json())
        .then(data => {
          console.log(data.elements);
          setData(prevState => ({
            ...prevState,
            ["getStreets"]: data.elements

          }));
          setIsLoading(false)
        })
        .catch(error => {
          console.error('Erro ao fazer a solicitação:', error);
          setIsLoading(false)
        });
    }


    setReportState(2)
  };

  const handleCheckboxChange = (newSelectedOptions) => {
    setSelectedOptions(newSelectedOptions);
    console.log(selectedOptions)
  };

  // Armazena os nomes únicos das estradas
  const uniqueStreetNamesOrRefs = new Set();
  const filters = new Set();

  // Adiciona os nomes únicos das estradas ou referências ao conjunto
  if (!isLoading && reportState === 2 && selectedOptions.includes("streets")) {
    data["getStreets"].forEach((item) => {
      if (item.tags && item.tags.highway) {
        if (item.tags.name) {
          uniqueStreetNamesOrRefs.add(item.tags.name);
          filters.add(item.tags.highway)

        } else if (item.tags.ref) {
          uniqueStreetNamesOrRefs.add(item.tags.ref);
          filters.add(item.tags.highway)
        }
      }
    });
    console.log(filters)
  }


  const handleFilterChange = async (newActiveFilters) => {
    console.log("aqui")
    await setActiveFilters(newActiveFilters);
    refreshStreets(newActiveFilters)
  };

  const refreshStreets = (newActiveFilters) => {
    console.log(newActiveFilters)
    setIsLoading(true)

    setShowStreets([])
    data["getStreets"].forEach((street) => {
      const highway = street.tags?.highway
      if (newActiveFilters.includes(highway)) {
        setShowStreets(prevStreets => [...prevStreets, street.tags.ref ? street.tags.ref : street.tags.name])
      }

    })

    setIsLoading(false)

  }

  const processStreetNodes = (name) => {
    let coordinatesRetrieved = false; // Variável de controle para verificar se as coordenadas já foram recuperadas

    data["getStreets"].forEach((item) => {
      if (item.tags && item.tags.highway) {
        if (item.tags.name) {
          if (item.tags.name == name && !coordinatesRetrieved) {
            coordinatesRetrieved = true; // Defina como true para evitar chamadas repetidas
            getCoordinatesForNodes(item.id);
          }
        } else if (item.tags.ref) {
          if (item.tags.ref == name && !coordinatesRetrieved) {
            coordinatesRetrieved = true; // Defina como true para evitar chamadas repetidas
            console.log("teste");
            getCoordinatesForNodes(item.id);
          }
        }
      }
    });
  };

  async function getCoordinatesForNodes(wayId) {
    setIsLoading(true)
    const coordinates = [];

    // Construa a consulta Overpass para obter as coordenadas dos nós da way especificada
    const query =
      `[out:json];
      way(${wayId});
      node(w);
      out;`;

    try {
      // Faça uma solicitação para a API Overpass
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query
      });

      // Verifique se a resposta é bem-sucedida
      if (!response.ok) {
        throw new Error("Erro ao fazer a solicitação à API Overpass");
      }

      // Analise a resposta JSON
      const dataHere = await response.json();



      data["getStreets"].forEach((street) => {
        if (street.id == wayId) {
          console.log(street.nodes)
          const nodes = street.nodes
          nodes.forEach((node) => {
            dataHere.elements.forEach((element) => {
              if (element.type === "node" && element.id == node) {
                const { lat, lon } = element;
                addSegmentPoint(lat, lon)
                addMarker(lat, lon)
                coordinates.push({ lat, lon });
              }
            });
          })
        }
      })

      // Extraia as coordenadas de cada node da resposta

      console.log(coordinates)


      chamarEndpoint(coordinates)
    } catch (error) {
      setIsLoading(false)
      console.error("Erro ao obter as coordenadas dos nodes:", error);
      return [];
    }
  }


  async function chamarEndpoint(points) {
    try {
      const response = await fetch('/api/getSpeciesLineArray', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ points: points })
      });

      if (!response.ok) {
        throw new Error('Erro ao chamar o endpoint: ' + response.statusText);
      }

      const data = await response.json();
      setStreetsSpecies(data)
      console.log(data);
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error('Erro ao chamar o endpoint:', error);
      throw error; // Propaga o erro para quem chamou a função
    }
  }


  return (
    <>
      <div>
        <Map
          onCoordinatesChange={handleCoordinatesChange}
          markers={markers}
          polygonPoints={polygonPoints}
          segmentPoints={segmentPoints}
          activeOption={activeOption}
          showSatelliteLayer={showSatelite}
        />
        <Flex
          display={isOpen ? "none" : "flex"}
          position="absolute"
          bottom="0%"
          left="30px"
          h="fit-content"
          zIndex="5000"
          align={"end"}
          justify={"center"}
          direction="column"
        >

          <ButtonOption onClick={() => setActiveOption(1)} isDisabled={activeOption != 1 && activeOption != 0} isActive={activeOption === 1} src={'/images/point.png'} />

          <Flex position="relative">
            <ButtonOption onClick={() => setActiveOption(2)} isDisabled={activeOption != 2 && activeOption != 0} isActive={activeOption === 2} src={'/images/line.png'} />
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
                w="100px"
                h={"40px"}
                bg={"darkGreen"}
                borderRadius={0}
                color={"white"}
                fontSize="20px"
                _active={
                  { background: "selectedGreen" }
                }
                _hover={
                  { background: "selectedGreen" }
                }
              >
                Concluir
              </Button>
              <Button
                display={activeOption == 2 ? "flex" : "none"}
                onClick={handleDeletePoint}
                isDisabled={segmentPoints.length < 1}
                w="230px"
                h={"40px"}
                bg={"darkGreen"}
                borderRadius={0}
                color={"white"}
                fontSize="20px"
                _active={
                  { background: "selectedGreen" }
                }
                _hover={
                  { background: "selectedGreen" }
                }
              >
                Apagar ultimo ponto
              </Button>
            </Flex>

          </Flex>



          <Flex position="relative">
            <ButtonOption onClick={() => setActiveOption(3)} isDisabled={activeOption != 3 && activeOption != 0} isActive={activeOption === 3} src={'/images/poly.png'} />
            <Button
              display={activeOption == 3 ? "flex" : "none"}
              top="30px"
              left="110px"
              position="absolute"
              onClick={onOpen}
              isDisabled={polygonPoints.length < 3}
              w="100px"
              h={"40px"}
              bg={"darkGreen"}
              borderRadius={0}
              color={"white"}
              fontSize="20px"
              _active={
                { background: "selectedGreen" }
              }
              _hover={
                { background: "selectedGreen" }
              }
            >
              Concluir
            </Button>
          </Flex>

          <ButtonOption onClick={() => reset()} txt={"Reset"} />

        </Flex>

        <Flex

          position="absolute"
          bottom="50px"
          right="30px"
          h="fit-content"
          zIndex="5000"
          align={"center"}
          justify={"center"}
          bg="darkGreen"
          px="20px"
          py="5px"
          gap="10px"
        >
          <Text fontSize="25px" fontWeight="bold" color="white">Satélite:</Text>
          <Switch onChange={() => setShowSatelite(!showSatelite)} size='md' />

        </Flex>

      </div>
      <Drawer onClose={onClose} isOpen={isOpen} size={"md"} closeOnOverlayClick={false}>
        <DrawerContent zIndex="111111">
          <DrawerCloseButton onClick={() => handleClose()} />
          <DrawerHeader fontFamily="bold">Relatório</DrawerHeader>
          <DrawerBody>


            <Flex display={reportState == 0 ? "flex" : "none"}>
              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <FormControl id="checkboxGroup">
                  <FormLabel>Selecione as camadas de informação para incluir no relatório:</FormLabel>
                  <CheckboxGroup value={selectedOptions} onChange={handleCheckboxChange}>
                    <Stack spacing={3} direction="column">
                      {[1, 2].includes(activeOption) &&
                        <Checkbox value="shp">Espécies presentes na área</Checkbox>
                      }

                      {[1, 2].includes(activeOption) &&
                        <Checkbox value="raster">Valor de índice de raridade de espécies</Checkbox>
                      }

                      {[3].includes(activeOption) &&
                        <Checkbox value="streets">Estradas existentes na área</Checkbox>
                      }
                    </Stack>
                  </CheckboxGroup>
                </FormControl>
                <Button
                  mt={"40px"}
                  w="100%"
                  bg="darkGreen"
                  type="submit"
                  borderRadius="0"
                  color="white"
                  _hover={{
                    bg: "selectedGreen"
                  }}
                  isDisabled={selectedOptions.length === 0}
                >
                  Avançar
                </Button>
              </form>
            </Flex>

            <Flex display={isLoading ? "flex" : "none"} w="100%" h="200px" align="center" justify="center">
              <Spinner h="50px" w="50px" color="green" />
            </Flex>

            {/* ESPECIES */}
            {!isLoading && reportState == 2 && selectedOptions.includes("shp") && data["getSpecies"].map((item) => (
              <Text key={item.id}>{item.sci_name}</Text>
            ))}

            {/* RARIDADE */}
            {!isLoading && reportState == 2 && selectedOptions.includes("raster") && activeOption == 1 && data && data["getRaster"].map((item) => (
              <Text key={item.id}>Valor do indice de raridade: {item.valor_raster}</Text>
            ))}
            {!isLoading && reportState == 2 && selectedOptions.includes("raster") && data["getStreets"] && activeOption == 2 && (
              <>
                <Text>Media: {calculateMean(data["getRaster"].map(item => item.val)).toFixed(2)}</Text>
                <Text>Mediana: {calculateMedian(data["getRaster"].map(item => item.val)).toFixed(2)}</Text>
                <Text>Variancia: {calculateVariance(data["getRaster"].map(item => item.val)).toFixed(2)}</Text>
                <Text mb="30px">Desvio padrão: {calculateStandardDeviation(data["getRaster"].map(item => item.val)).toFixed(2)}</Text>
                {data["getRaster"].map((item) => (
                  <Text key={item.id}>{item.val}</Text>
                ))}
              </>
            )}

            {/* ESTRADAS */}
            <CheckboxGroup value={activeFilters} onChange={handleFilterChange}>
              <Stack spacing={3} direction="column">
                {!isLoading && reportState === 2 && selectedOptions.includes("streets") && streetsSpecies.length == 0 && Array.from(filters).map((filter) => (
                  <Checkbox value={filter}>{filter}</Checkbox>
                ))}
              </Stack>
            </CheckboxGroup>

            {!isLoading && reportState === 2 && selectedOptions.includes("streets") && streetsSpecies.length == 0 && showStreets.map((nameOrRef) => (
              <Text key={nameOrRef} onClick={() => processStreetNodes(nameOrRef)}>- {nameOrRef}</Text>
            ))}
            {!isLoading && reportState === 2 && selectedOptions.includes("streets") && streetsSpecies.length > 0 && streetsSpecies.map((specie) => (
              <Text>- {specie.sci_name}</Text>
            ))}




          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}