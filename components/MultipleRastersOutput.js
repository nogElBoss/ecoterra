import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Text,
    Flex,
    Heading,
    Image
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Ruler from './Ruler';

export default function MultipleRastersOutput({ data }) {
    const [organizedData, setOrganizedData] = useState(null);

    const classMapping = {
        "amphibians": "Amphibians",
        "mammals": "Mammals",
        "reptiles": "Reptiles",
        "birds": "Birds",
        "combined": "Combined"
    };

    const rulerValues =
    {
        "All Species": {
            "Amphibians": { max: 153.00, mean: 13.98 },
            "Mammals": { max: 223.00, mean: 54.55 },
            "Reptiles": { max: 178.00, mean: 35.23 },
            "Birds": { max: 783.00, mean: 189.93 },
            "Combined": { max: 18.00, mean: 0.18 }
        },
        "Threatened Species": {
            "Amphibians": { max: 61.00, mean: 2.36 },
            "Mammals": { max: 37.00, mean: 3.98 },
            "Reptiles": { max: 33.00, mean: 3.07 },
            "Birds": { max: 38.00, mean: 6.38 },
            "Combined": { max: 105.00, mean: 11.14 }
        }
    }

    function organizeData(data) {
        const organized = {
            "All Species": {},
            "Threatened Species": {}
        };

        data.forEach(entry => {
            Object.keys(entry).forEach(key => {
                const className = key.replace(/_sr|_thr/g, ''); // Remove "_sr" ou "_thr" para obter o nome da classe
                const category = key.includes('_thr') ? "Threatened Species" : "All Species";
                const displayClassName = classMapping[className];

                if (!organized[category][displayClassName]) {
                    organized[category][displayClassName] = [];
                }

                const values = Array.isArray(entry[key]) ? entry[key] : [{ val: entry[key] }];

                // Adicionar os valores "val" à classe correspondente
                values.forEach(item => {
                    if (item.val !== null) {
                        organized[category][displayClassName].push(item.val);
                    }
                });
            });
        });

        return organized;
    }

    function calculateMean(values) {
        const filteredValues = values.filter(value => value !== null);
        if (filteredValues.length === 0) return 0;
        const sum = filteredValues.reduce((acc, value) => acc + value, 0);
        return sum / filteredValues.length;
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

    useEffect(() => {
        if (data != null) {
            const organized = organizeData(data);
            setOrganizedData(organized);
        }
    }, [data]);

    return (
        <>
            <Heading fontSize="20px" marginBlock="10px">Species Data</Heading>
            <Accordion allowMultiple>
                {organizedData != null && Object.keys(organizedData).map((category) => (
                    <AccordionItem key={category}>
                        <h2>
                            <AccordionButton>
                                <Box as='span' flex='1' textAlign='left' fontWeight="bold">
                                    {category}
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            {Object.keys(organizedData[category]).map((className) => (
                                <AccordionItem key={className}>
                                    <h2>
                                        <AccordionButton>
                                            <Box as='span' flex='1' textAlign='left' fontWeight="bold">
                                                {className}
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4}>
                                        <Flex align="center" mt="5px">
                                            <Image
                                                mr="10px"
                                                src="images/triangle.png"
                                                h="13px"
                                            />
                                            <Text>Obtained mean value: <b>{calculateMean(organizedData[category][className]).toFixed(2) + " ± " + calculateStandardDeviation(organizedData[category][className]).toFixed(2)}</b></Text>
                                        </Flex>

                                        <Flex align="center" mt="5px">
                                            <Image
                                                mr="10px"
                                                src="images/circle.png"
                                                h="13px"
                                            />
                                            <Text>Global mean: <b>{rulerValues[category][className].mean}</b> </Text>
                                        </Flex>

                                        <Flex align="center" mt="5px">
                                            <Text>Global maximum: <b>{rulerValues[category][className].max}</b> </Text>
                                        </Flex>
                                        <Flex w="100%" align="center" justify="center" mt="30px">
                                            <Ruler maximo={rulerValues[category][className].max.toFixed(2)} minimo={0} valor={calculateMean(organizedData[category][className]).toFixed(2)} media={rulerValues[category][className].mean} />
                                        </Flex>
                                    </AccordionPanel>
                                </AccordionItem>
                            ))}
                        </AccordionPanel>
                    </AccordionItem>
                ))}
            </Accordion>
        </>
    );
}
