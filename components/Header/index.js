import {
    Flex,
    Image
} from '@chakra-ui/react'


const Header = ({ onClick, isDisabled, isActive, src, txt }) => {
    return (
        <Flex
            position="absolute"
            top="0"
            h="60px"
            w="100vw"
            bg="darkGreen"
            zIndex="1000"
            alignItems="center"
        >
            <Image src="images/logo.png" h="40px" ml="20px" />
        </Flex>
    );
};

export default Header;