import {
    Flex,
    Image,
    Link
} from '@chakra-ui/react'


const Header = ({ onClick, isDisabled, isActive, src, txt }) => {
    return (
        <Flex
            position="absolute"
            top="0"
            h="70px"
            w="100vw"
            zIndex="1000"
            alignItems="center"
            justify="space-between"
            background="linear-gradient(to top, transparent 0%, rgba(0, 0, 0, 1) 100%);"
        >
            <Flex align="center" justify="center" gap="40px" color="white">
                <Link fontFamily="bold" fontSize="22px" href="/">
                    <Image src="images/logo.png" h="40px" ml="20px" />
                </Link>

                <Link fontFamily="bold" fontSize="22px" href="/info">Info</Link>
            </Flex>

            <Image src="images/logosFcul.png" h="40px" mr="20px" />
        </Flex>
    );
};

export default Header;