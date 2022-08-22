import React, {
  useRef,
  useState,
  createContext,
  useReducer,
  useCallback,
  useContext,
  useMemo,
} from "react";

import { gql, useQuery } from "@apollo/client";
import Carousel from "../Carousel";

import queries from "../../requests/queries";
import { Container, Image, Gradient, Wrapper } from "./views";
import Card from "../Card";
import Youtube from "../Youtube";
import { useEpicState, EpicProvider } from "./context";
import EpicContainer from "./EpicContainer";

export default function Epic(props) {
 

  return (
    <EpicProvider>
    <EpicContainer {...props} />
    </EpicProvider>
  );
}
