// pages/index.js
import { Box, Heading, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Text, List, ListItem, Image, Flex } from "@chakra-ui/react";

export default function Home() {
    return (
        <Flex p={10} maxW="1200px" mx="auto" fontSize="15px" alignItems="center" direction="column">
            <Heading as="h1" size="xl" textAlign="center" mb={"70px"} mt="100px">
                Info
            </Heading>

            <Accordion allowMultiple w="100%">
                {/* Summary */}
                <AccordionItem fontSize="17px">
                    <h2>
                        <AccordionButton>
                            <Box flex="1" textAlign="left" fontSize="22px" fontFamily="bold">
                                Summary
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                        <Text>
                            This application is designed to be an effective tool in determining the potential environmental risk of existing energy and transportation infrastructures, as well as predicting the environmental risk in planning new infrastructures.
                        </Text>
                    </AccordionPanel>
                </AccordionItem>

                {/* Data Sources */}
                <AccordionItem fontSize="17px">
                    <h2>
                        <AccordionButton>
                            <Box flex="1" textAlign="left" fontSize="22px" fontFamily="bold">
                                Data Sources and Information in the Application
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                        <Text>
                            The application presents two types of data:
                        </Text>
                        <List spacing={3} mt={2}>
                            <ListItem>
                                - <strong>Geographic Presence of Species:</strong> This information shows species potentially affected in a given location, organized by their conservation status.
                            </ListItem>
                            <ListItem>
                                - <strong>Species Richness:</strong> Displayed as a graph in Log10 scale, this data shows the species richness level in a given location.
                            </ListItem>
                        </List>
                        <Text mt={3}>
                            All this information has been sourced from the IUCN Red List of Threatened Species website and is being used in a purely academic context.
                        </Text>
                    </AccordionPanel>
                </AccordionItem>

                {/* Tools */}
                <AccordionItem fontSize="17px">
                    <h2>
                        <AccordionButton>
                            <Box flex="1" textAlign="left" fontSize="22px" fontFamily="bold">
                                Tools
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                        <List spacing={3}>
                            <ListItem>
                                - <strong>Select Point:</strong> Mark a point on the map to obtain information for that specific location.
                            </ListItem>
                            <ListItem>
                                - <strong>Draw Segments:</strong> Draw a chain of straight-line segments to obtain information about the areas along the segments. This tool is intended for predicting future road infrastructures.
                            </ListItem>
                            <ListItem>
                                - <strong>Draw Polygon:</strong> Draw a polygon and choose to either retrieve information related to the drawn area or retrieve information about infrastructures present within that area.
                            </ListItem>
                            <ListItem>
                                - <strong>Upload Shapefile:</strong> Upload a shapefile to obtain information related to the uploaded area.
                            </ListItem>
                        </List>
                    </AccordionPanel>
                </AccordionItem>

                {/* Authors */}
                <AccordionItem fontSize="17px">
                    <h2>
                        <AccordionButton>
                            <Box flex="1" textAlign="left" fontSize="22px" fontFamily="bold">
                                Team
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                        <Text>
                            This work was conducted as part of the academic project ECOTERRA, developed by Gonçalo Nogueira (LASIGE), Fernando Ascensão (CE3C), Ana Paula Afonso (LASIGE), Carlos Duarte (LASIGE). The project is entirely owned by the Faculty of Sciences, University of Lisbon.
                        </Text>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
            <Image src="/images/logoDark.png" w="70%" mt="70px" />
        </Flex>
    );
}
