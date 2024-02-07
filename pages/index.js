import Map from '../components/Map'
import { Flex, Button, Image, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure, Spinner, Text } from '@chakra-ui/react'
import { useState, useEffect } from 'react';

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [activeOption, setActiveOption] = useState(0);

  const [isPointActive, setIsPointActive] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [markerPosition2, setMarkerPosition2] = useState(null);

  const [point, setPoint] = useState({ x: null, y: null })

  const [line1, setLine1] = useState({ x: null, y: null })
  const [line2, setLine2] = useState({ x: null, y: null })

  const [data, setData] = useState([]);

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

  async function fetchData() {
    try {
      let response
      if (activeOption == 1) {
        setIsLoading(true)
        response = await fetch(`/api/getRasterPoint?px=${point.x}&py=${point.y}`, {
          method: 'GET',
        });
        setIsLoading(false)
      }
      else if (activeOption == 2) {
        setIsLoading(true)
        response = await fetch(`/api/getRasterLine?l1x=${line1.x}&l1y=${line1.y}&l2x=${line2.x}&l2y=${line2.y}`, {
          method: 'GET',
        });
        setIsLoading(false)
      }


      if (response.ok) {
        const result = await response.json();
        setData(result);
        console.log(result)
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
          fetchData()
          onOpen()
        }
      }
      if (activeOption == 2) {
        if (line1.x != null && line1.y != null && line2.x != null && line2.y != null) {
          fetchData()
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



  return (
    <>
      <div>
        <Map onCoordinatesChange={handleCoordinatesChange} markerPosition={markerPosition} markerPosition2={markerPosition2} isPointActive={activeOption == 1 && point && point.x != null && point.y != null} isPoint1Active={line1.x != null && line1.y != null} isPoint2Active={line2.x != null && line2.y != null} />
        <Flex
          display={isOpen ? "none" : "flex"}
          position="absolute"
          bottom="0"
          w="100vw"
          h="120px"
          zIndex="5000"
          style={{
            background: 'linear-gradient(to top, rgba(22, 22, 22, 1), rgba(22,22, 22, 0))',
          }}
          align={"end"}
          justify={"center"}
          gap={"50px"}
        >
          <Button isDisabled={activeOption == 2 && "false"} isActive={activeOption == 1 && "true"} w="140px" h="140px" mb={5} colorScheme='green' borderRadius={15} onClick={() => setActiveOption(1)}><Image h="50%" src='/images/point.png' /></Button>
          <Button isDisabled={activeOption == 1 && "false"} isActive={activeOption == 2 && "true"} w="140px" h="140px" mb={5} colorScheme='green' borderRadius={15} onClick={() => setActiveOption(2)}><Image h="60%" src='/images/line.png' /></Button>
          <Button w="140px" h="140px" mb={5} colorScheme='green' borderRadius={15} fontSize={25} onClick={() => reset()}>Reset</Button>
        </Flex>
      </div>
      <Drawer onClose={onClose} isOpen={isOpen} size={"md"} closeOnOverlayClick={false}>
        <DrawerOverlay />
        <DrawerContent zIndex="111111">
          <DrawerCloseButton onClick={() => handleClose()} />
          <DrawerHeader>{`Report`}</DrawerHeader>
          <DrawerBody>
            <Flex display={isLoading ? "flex" : "none"} w="100%" h="200px" align="center" justify="center">
              <Spinner h="50px" w="50px" color="green" />
            </Flex>
            {/* {!isLoading && data.map((item) => (
              <li key={item.id}>{item.sci_name}</li>
            ))} */}
            {!isLoading && activeOption == 1 && data.map((item) => (
              <Text key={item.id}>{item.valor_raster}</Text>
            ))}
            {!isLoading && activeOption == 2 && (
              <>
                <Text>Media: {calculateMean(data.map(item => item.val)).toFixed(2)}</Text>
                <Text>Mediana: {calculateMedian(data.map(item => item.val)).toFixed(2)}</Text>
                <Text>Variancia: {calculateVariance(data.map(item => item.val)).toFixed(2)}</Text>
                <Text mb="30px">Desvio padrão: {calculateStandardDeviation(data.map(item => item.val)).toFixed(2)}</Text>
                {data.map((item) => (
                  <Text key={item.id}>{item.val}</Text>
                ))}
              </>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}