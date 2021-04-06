import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *,
  *::before {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body, html {
    overflow: hidden;
    position: relative;
    margin: 0;
    padding: 0;
    height: 100vh; /* Fallback for browsers that do not support Custom Properties */
    height: calc(var(--vh, 1vh) * 100); 
    background: #1a000d; 
    ${'' /* ${({ theme }) => theme.body}; */}
    font-size: 62.5%;
    transition: all 1s linear;
  }
`

export default GlobalStyles