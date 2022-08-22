import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  *, *:before, *:after {
    box-sizing: border-box;
  }
  html, body {
     font-family: -apple-system, 
                BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #333333;
    //font-size:  62.5%;
}
button{
  margin: 0;
    padding: 0;
    border: none;
    border-radius: 0;
    font: inherit;
    color: inherit;
    background: none;
    appearance: none
}



`;

