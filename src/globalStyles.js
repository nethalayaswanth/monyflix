import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  *, *:before, *:after {
    box-sizing: border-box;
  }


  html, body {
     font-family:  -apple-system, BlinkMacSystemFont, -webkit-system-font, "Malgun Gothic", "Segoe UI", "Helvetica Neue", Helvetica, sans-serif
    ;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #333333;
    font-size:  62.5%;
    user-select:none;
    user-zoom:none;
   

}

a, blockquote, body, code, dd, div, dl, dt, embed, fieldset, footer, form, h1, h2, h3, h4, h5, h6, header, html, img, legend, li, ol, p, pre, section, table, td, th, ul {
    user-select: none;
    -webkit-user-drag: none;
    margin: 0px;
    padding: 0px;
}

a {
   
    cursor: pointer;
    text-decoration: none;
    background:transparent;
}
button{
  margin: 0;
    padding: 0;
    border: none;
    border-radius: 0;
    font: inherit;
    color: inherit;
    background: none;
    appearance: none;
}

:root{
--secondary-color:rgba(0, 0, 0, 0.56);
--primary-color:rgba(0, 0, 0, 0.88);
 --controller-width:0px;
  --swiper-padding:25px;
  --metaData-padding:25px;
  --nav-height:42px;

 @media only screen and (min-width: 740px) {
  --controller-width:40px;
  --swiper-padding:0px;
  --metaData-padding:40px;
   --nav-height:56px;
  }
}




`;
