import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import App from "./App";
import { GlobalStyles } from "./globalStyles";
import "./index.css";
import reportWebVitals from "./reportWebVitals";


import { BrowserRouter } from "react-router-dom";
import { ImagesClient, ImagesProvider } from './contexts/imageCachingContext';

const rootElement=document.getElementById("root");
// const modalRoot=document.createElement('span').setAttribute('id','modal-root')
// const videoRoot = document
//   .createElement("span")
//   .setAttribute("id", "video-root");
// rootElement.append(modalRoot, videoRoot);
const root = ReactDOM.createRoot(rootElement);

const queryClient = new QueryClient();
const imagesClient=new ImagesClient()

queryClient.setDefaultOptions({
  queries: {
    staleTime: 3600 * 1000,
    cacheTime: 3600 * 1000,
  },
});

root.render(
  <QueryClientProvider client={queryClient}>
    <ImagesProvider client={imagesClient}>
      <BrowserRouter>
       
        <App />
        <GlobalStyles />
      </BrowserRouter>

      <ReactQueryDevtools initialIsOpen />
    </ImagesProvider>
  </QueryClientProvider>
);

   
   
   
reportWebVitals();
