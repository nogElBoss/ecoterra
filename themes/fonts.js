import { Global } from '@emotion/react'

const Fonts = () => (
  <Global
    styles={`
      @font-face {
        font-family: 'Heading Font';
        src: url('./fonts/Montserrat-Bold.ttf');
        font-display: swap;
      }
      @font-face {
        font-family: 'Bold Font';
        src: url('./fonts/Montserrat-Medium.ttf');
        font-display: swap;
      }
      @font-face {
        font-family: 'Body Font';
        src: url('./fonts/Montserrat-Light.ttf');
        font-display: swap;
      }
      `}
  />
)

export default Fonts
