import { extendTheme } from "@chakra-ui/react"

const breakpoints = {
  sm: '40em',
  md: '52em',
  lg: '64em',
  xl: '80em',
}

const theme = extendTheme({
  fonts: {
    heading: `'Heading Font', sans-serif`,
    bold: `'Bold Font', sans-serif`,
    body: `'Body Font', sans-serif`
  },
  colors: {
    lightGreen: '#59ba8b',
    darkGreen: '#244036',
    selectedGreen: '#366957'
  },
})

export default theme
