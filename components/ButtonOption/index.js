import {
    Button,
    Image,
    Text
} from '@chakra-ui/react'


const ButtonOption = ({ onClick, isDisabled, isActive, src, txt, label }) => {
    return (
        <Button
            flexDirection="column"
            onClick={onClick}
            isDisabled={isDisabled != null ? isDisabled : false}
            isActive={isActive != null ? isActive : false}
            w="100px"
            h={txt ? "40px" : "100px"}
            mb={5}
            bg={txt ? "red.600" : "darkGreen"}
            borderRadius={"10px"}
            color={txt ? "white" : "lightGreen"}
            fontSize="20px"
            _active={
                txt ?
                    { background: "red.700" }
                    :
                    { background: "selectedGreen" }
            }
            _hover={
                txt ?
                    { background: "red.700" }
                    :
                    { background: "selectedGreen" }
            }
        >
            {src && <Image src={src} h="50%" mb="20px" />}
            {txt}

            {label &&

                <Text
                    position="absolute"
                    bottom="8px"
                    fontSize="10px"
                    color="white"
                >
                    {label}
                </Text>
            }
        </Button>
    );
};

export default ButtonOption;