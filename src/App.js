import { lazy, Suspense, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import Epic from "./components/Epic";
import Landing from "./components/Landing";
import Modal from "./components/Modal";
import { Section } from "./components/Section";
import { FullLoader, Loader } from "./components/spinner";

import { useInView } from "react-intersection-observer";
import { useIsFetching } from "react-query";
import { DeviceProvider } from "./contexts/deviceContext.js";
import { ModalProvider } from "./contexts/modalContext";
import { ParamProvider, useParamState } from "./contexts/paramContext";
import usePrevious from "./hooks/usePrevious";
import { Main } from "./components/Main";
import Background from "./components/Main/background";
import Search from "./components/Main/search";
import Genre from "./components/Main/genre";
const Watch = lazy(() => import("./components/watch"));



export default function  App () {
  let location = useLocation();
  let state = location?.state;

  const bg = state?.backgroundState || location;

  return (
    <ParamProvider>
      <DeviceProvider>
        <ModalProvider>
          <Suspense fallback={<FullLoader />}>
            {/* <Routes>
              <Route path="/browse" element={<Modal />} />
            </Routes> */}

            <Routes>
              <Route path="/" >
                <Route index element={<Navigate to="browse" />} replace></Route>
                <Route element={<Main />}>
                  <Route path="search" element={<Search />} />
                  <Route path="browse">
                    <Route index element={<Background />} />
                    <Route path="genre/:genreId" element={<Genre />} />
                  </Route>
                </Route>

                <Route path="/watch">
                  <Route path=":id" element={<Watch />} />
                </Route>

                <Route
                  path="*"
                  element={
                    <main style={{ padding: "1rem" }}>
                      <p>There's nothing here!</p>
                    </main>
                  }
                />
              </Route>
            </Routes>
          </Suspense>
        </ModalProvider>
      </DeviceProvider>
    </ParamProvider>
  );
};


