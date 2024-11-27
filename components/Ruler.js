// components/HorizontalRuler.js
import { Flex, Text, Image } from '@chakra-ui/react';

const Ruler = ({ maximo, minimo, valor, media }) => {
    // Calcula a largura da marcação do valor
    const calculateMarkerWidth = (v) => {
        let logMax = Math.log10(Number(maximo) + 1)
        let logValor = Math.log10(Number(v) + 1)
        let valuePosition = logValor / logMax;
        return `${valuePosition * 100}%`;
    };

    return (
        <Flex
            align="center"
            justify="space-between"
            h="5px"
            w="90%"
            bg="green"
            position="relative"
            bgImage="linear-gradient(90deg, rgba(0,134,255,1) 0%, rgba(31,163,97,1) 18%, rgba(255,237,24,1) 51%, rgba(218,0,0,1) 100%)"
            mb="20px"
        >
            <Flex
                alignItems="center"
                justify="center"
                ml={calculateMarkerWidth(media)}
                position="absolute"
                w="10px"
                zIndex={2}
            >
                <Image
                    src="images/circle.png"
                    ml="-8px"
                />
            </Flex>

            <Flex
                alignItems="center"
                justify="center"
                ml={calculateMarkerWidth(valor)}
                position="absolute"
                mb="10px"
                w="17px"
            >
                <Image
                    src="images/triangle.png"
                    ml="-15px"
                />
            </Flex>


            <Flex alignItems="center" justify="center" width="2px" h="250%" bg="black" ml="'0'%" position="absolute">
                {/* <Text textAlign="center" position="absolute" top="110%">
                    {minimo}
                </Text> */}
            </Flex>
            <Flex alignItems="center" justify="center" width="2px" h="250%" bg="black" ml="100%" position="absolute">
                {/* <Text textAlign="center" position="absolute" top="110%">
                    {maximo}
                </Text> */}
            </Flex>
            <Text
                right={0}
                bottom={"-20px"}
                position="absolute"
                fontSize={"10px"}
            >
                Log10 scale representation
            </Text>
        </Flex>
    );
};

export default Ruler;