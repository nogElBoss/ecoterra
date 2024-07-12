// components/HorizontalRuler.js
import { Box, Flex, Text } from '@chakra-ui/react';

const Ruler = ({ maximo, minimo, valor }) => {
    // Calcula a largura da marcação do valor
    const calculateMarkerWidth = () => {
        const valuePosition = valor / maximo;
        return `${valuePosition * 100}%`;
    };

    return (
        <Flex
            alignItems="center"
            justify="space-between"
            width="90%"
            h="50px"
            bg="green"
            margin="100px"
            position="relative"
            bgImage="linear-gradient(90deg, rgba(0,134,255,1) 0%, rgba(31,163,97,1) 18%, rgba(255,237,24,1) 51%, rgba(218,0,0,1) 100%)"
        >
            <Flex
                alignItems="center"
                justify="center"
                h="150%"
                ml={calculateMarkerWidth}
                position="absolute"
            >
                <Flex
                    alignItems="center"
                    justify="space-between"
                    width="3px"
                    h="100%"
                    bg="black"
                    ml="0"
                />
                <Text textAlign="center" lineHeight="17px" position="absolute" top="110%">
                    Raster value: <br></br>  <b>{valor}</b>
                </Text>

            </Flex>
            <Flex alignItems="center" justify="space-between" width="3px" h="110%" bg="black" ml="'0'%" position="absolute" />
            <Flex alignItems="center" justify="space-between" width="3px" h="110%" bg="black" ml="100%" position="absolute" />
        </Flex>
    );
};

export default Ruler;
