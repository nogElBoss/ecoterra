
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
  Checkbox
} from '@chakra-ui/react'
import { useState, useEffect } from 'react';
import Map from '@/components/Map'
import ButtonOption from "@/components/ButtomOption"

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [activeOption, setActiveOption] = useState(0);
  const [reportState, setReportState] = useState(0);

  const [isPointActive, setIsPointActive] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [markerPosition2, setMarkerPosition2] = useState(null);

  const [point, setPoint] = useState({ x: null, y: null })

  const [line1, setLine1] = useState({ x: null, y: null })
  const [line2, setLine2] = useState({ x: null, y: null })

  const [data, setData] = useState({});

  const [isLoading, setIsLoading] = useState(false)

  const handleCoordinatesChange = (lat, lng) => {

    console.log("Latitude:", lat);
    console.log("Longitude:", lng);

    if (activeOption != 0) {
      if (activeOption == 1) {
        if (point && point.x == null && point.y == null) {
          setPoint({ x: lng, y: lat })
          setMarkerPosition({ lat, lng });
        }
      }
      else if (activeOption == 2) {
        if (line1.x == null && line1.y == null && line2.x == null && line2.y == null) {
          setLine1({ x: lng, y: lat })
          setMarkerPosition({ lat, lng });
        }
        else if (line1.x != null && line1.y != null && line2.x == null && line2.y == null) {
          setLine2({ x: lng, y: lat })
          setMarkerPosition2({ lat, lng });
        }
      }
    }
  };

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
        response = await fetch(`/api/${endpoint}Line?l1x=${line1.x}&l1y=${line1.y}&l2x=${line2.x}&l2y=${line2.y}`, {
          method: 'GET',
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
    setLine1({ x: null, y: null })
    setLine2({ x: null, y: null })

    setData({})
    setReportState(0)
  }

  function calculateMean(values) {
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
      await fetch("https://overpass-api.de/api/interpreter",
        {
          method: 'POST',
          body:
            `[out:json];
            way["highway"](around:1000, ${point.y}, ${point.x});
            out body;`
        }
      )
        .then(response => response.json())
        .then(data => {
          // Manipule os dados retornados conforme necessário
          console.log(data.elements);
          setData(prevState => ({
            ...prevState, // Mantenha as entradas existentes
            ["getStreets"]: data.elements // Adicione a nova entrada
          }));
        })
        .catch(error => {
          console.error('Erro ao fazer a solicitação:', error);
        });
      console.log("aqui")
    }

    setReportState(2)
  };

  const handleCheckboxChange = (newSelectedOptions) => {
    setSelectedOptions(newSelectedOptions);
  };

  // Armazena os nomes únicos das estradas
  const uniqueStreetNamesOrRefs = new Set();

  // Adiciona os nomes únicos das estradas ou referências ao conjunto
  if (!isLoading && reportState === 2 && selectedOptions.includes("streets")) {
    data["getStreets"].forEach((item) => {
      if (item.tags && item.tags.highway) {
        if (item.tags.name) {
          uniqueStreetNamesOrRefs.add(item.tags.name);
        } else if (item.tags.ref) {
          uniqueStreetNamesOrRefs.add(item.tags.ref);
        }
      }
    });
  }

  return (
    <>
      <div>
        <Map onCoordinatesChange={handleCoordinatesChange} markerPosition={markerPosition} markerPosition2={markerPosition2} isPointActive={activeOption == 1 && point && point.x != null && point.y != null} isPoint1Active={line1.x != null && line1.y != null} isPoint2Active={line2.x != null && line2.y != null} />
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

          <ButtonOption onClick={() => setActiveOption(1)} isDisabled={activeOption === 2} isActive={activeOption === 1} src={'/images/point.png'} />
          <ButtonOption onClick={() => setActiveOption(2)} isDisabled={activeOption === 1} isActive={activeOption === 2} src={'/images/line.png'} />
          <ButtonOption onClick={() => reset()} txt={"Reset"} />

        </Flex>

      </div>
      <Drawer onClose={onClose} isOpen={isOpen} size={"md"} closeOnOverlayClick={false}>
        <DrawerOverlay />
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
                      <Checkbox value="shp">Espécies presentes na área</Checkbox>
                      <Checkbox value="raster">Valor de índice de raridade de espécies</Checkbox>
                      <Checkbox value="streets">Estradas existentes na área</Checkbox>
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
            {!isLoading && reportState == 2 && selectedOptions.includes("raster") && activeOption == 2 && (
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
            {!isLoading && reportState === 2 && selectedOptions.includes("streets") && Array.from(uniqueStreetNamesOrRefs).map((nameOrRef) => (
              <Text key={nameOrRef}>- {nameOrRef}</Text>
            ))}




          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}