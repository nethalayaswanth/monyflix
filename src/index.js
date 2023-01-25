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
const root = ReactDOM.createRoot(document.getElementById("root"));

const queryClient = new QueryClient();
const imagesClient=new ImagesClient()

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
