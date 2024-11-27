import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Text,
    Flex,
    Heading
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export default function SpeciesOutput({ species }) {
    console.log(species);

    const [organizedSpecies, setOrganizedSpecies] = useState(null);

    const categoryColors = {
        "EX": "#000000", // Preto
        "EW": "#000000",
        "CR": "#CD3030",
        "EN": "#CD6630",
        "VU": "#CD6630",
        "NT": "#09804a",
        "CD": "#09804a",
        "LC": "#006666",
        "DD": "#ffffff",
        "NE": "#ffffff" // Branco
    };

    function organizeSpecies(species) {
        // Ordem das categorias
        const categoryOrder = {
            "EX": 1, "EW": 2, "CR": 3, "EN": 4, "VU": 5, "NT": 6, "CD": 7, "LC": 8, "DD": 9, "NE": 10
        };

        // Agrupar por se é marinho ou não marinho
        const marineGrouped = species.reduce((acc, specie) => {
            const marineStatus = specie.marine ? 'Marine' : 'Non-marine';
            if (!acc[marineStatus]) {
                acc[marineStatus] = {};
            }

            // Agrupar por classe dentro de cada grupo marinho/não marinho
            const classType = specie.class;
            if (!acc[marineStatus][classType]) {
                acc[marineStatus][classType] = [];
            }
            acc[marineStatus][classType].push(specie);

            return acc;
        }, {});

        // Ordenar as espécies dentro de cada classe pela categoria
        Object.keys(marineGrouped).forEach(marineStatus => {
            Object.keys(marineGrouped[marineStatus]).forEach(classType => {
                marineGrouped[marineStatus][classType].sort((a, b) => categoryOrder[a.category] - categoryOrder[b.category]);
            });
        });

        return marineGrouped;
    }

    // Ordem customizada das classes
    const classOrder = ["AMPHIBIA", "REPTILIA", "MAMMALS"];

    function sortClassesByCustomOrder(classes) {
        // Coloca as classes de acordo com a ordem definida em `classOrder`
        return classes.sort((a, b) => {
            const indexA = classOrder.indexOf(a);
            const indexB = classOrder.indexOf(b);

            // Se a classe não estiver na lista, coloca no final
            return (indexA !== -1 ? indexA : classOrder.length) - (indexB !== -1 ? indexB : classOrder.length);
        });
    }

    useEffect(() => {
        if (species != null) {
            const data = organizeSpecies(species);
            console.log(data);
            setOrganizedSpecies(data);
        }
    }, [species]);

    return (
        <>
            <Heading fontSize="20px" marginBlock="10px">Species present in the area</Heading>
            <Accordion allowMultiple>
                {organizedSpecies != null && Object.keys(organizedSpecies).map((marineStatus) => (
                    <AccordionItem key={marineStatus}>
                        <h2>
                            <AccordionButton>
                                <Box as='span' flex='1' textAlign='left' fontFamily="bold">
                                    {marineStatus} ({Object.values(organizedSpecies[marineStatus]).flat().length})
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            {sortClassesByCustomOrder(Object.keys(organizedSpecies[marineStatus])).map((classType) => (
                                <AccordionItem key={classType}>
                                    <h2>
                                        <AccordionButton>
                                            <Box as='span' flex='1' textAlign='left' fontFamily="bold">
                                                {classType} ({organizedSpecies[marineStatus][classType].length})
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4}>
                                        {organizedSpecies[marineStatus][classType].map((specie) => (
                                            <Flex key={specie.sci_name}>
                                                <Box mt="1px" mr="10px" bg={categoryColors[specie.category]} w="20px" h="20px" borderRadius="100%" borderWidth="2px" borderColor="gray.300" />
                                                <Text mb="5px">{specie.sci_name}, {specie.category}</Text>
                                            </Flex>
                                        ))}
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
