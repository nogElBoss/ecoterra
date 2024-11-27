import { Box, ScaleFade } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const LoadingBar = ({ isLoading, duration }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setWidth(0);
      const interval = setInterval(() => {
        setWidth((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100; // Para garantir que chegue a 100%
          }
          return prev + (100 / (duration * 10)); // Incrementa a cada 100ms
        });
      }, 100);

      return () => clearInterval(interval);
    } else {
      setWidth(0); // Reseta a barra quando não está carregando
    }
  }, [isLoading, duration]);

  return (
    <Box position="relative" width="100%" height="4px" bg="gray.200">
      <ScaleFade in={isLoading}>
        <Box
          position="absolute"
          height="100%"
          bg="blue.500"
          width={`${width}%`}
          transition="width 0.1s ease-in-out"
        />
      </ScaleFade>
    </Box>
  );
};

export default LoadingBar;
