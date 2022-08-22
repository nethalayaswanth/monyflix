import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { GlobalStyles } from "./globalStyles";
import cache from "./cache";
import { ReactQueryDevtools } from "react-query/devtools";


import { BrowserRouter } from "react-router-dom";
const root = ReactDOM.createRoot(document.getElementById("root"));

const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache,
});

const queryClient = new QueryClient();
root.render(
  <ApolloProvider client={client}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <GlobalStyles />
      </BrowserRouter>

      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals( 
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
