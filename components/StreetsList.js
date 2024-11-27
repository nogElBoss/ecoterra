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
} from '@chakra-ui/react'

import { ArrowForwardIcon } from '@chakra-ui/icons'

export default function StreetsList({ streets, handleStreet }) {

    return (
        <>
            <Accordion allowMultiple>
                {streets != null && Object.keys(streets).map((type) => (
                    streets[type].length > 0 &&
                    <AccordionItem>
                        <h2>
                            <AccordionButton>
                                <Box as='span' flex='1' textAlign='left' fontFamily="bold">
                                    {type + " (" + streets[type].length + ")"}
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4} >
                            {streets[type].map((street, index) => (
                                <>
                                    <Flex
                                        borderBottom="1px"
                                        borderTop={index == 0 && "1px"}
                                        borderColor="gray.200"
                                        align="center"
                                        justify="space-between"
                                        px="10px"
                                        onClick={() => handleStreet(street.members)}

                                        _hover={{
                                            cursor: "pointer",
                                            backgroundColor: "#F5F5F5"
                                        }}
                                    >
                                        <Text my="7px" >{street.tags?.name ? street.tags?.name : street.tags?.ref}</Text>
                                        <ArrowForwardIcon boxSize="20px" />
                                    </Flex>

                                </>
                            ))}
                        </AccordionPanel>
                    </AccordionItem>
                ))}

            </Accordion>
        </>
    )
}