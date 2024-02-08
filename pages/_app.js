import '@/styles/globals.css'

import { ChakraProvider } from '@chakra-ui/react'
import Fonts from '../themes/fonts'
import theme from '../themes/theme'
import Header from "@/components/Header/index"

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Fonts />
      <Header />
      <Component {...pageProps} />
    </ChakraProvider>

  )
}
