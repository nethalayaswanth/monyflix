import { lazy, Suspense, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { FullLoader, Loader } from "./components/spinner";

import { DeviceProvider } from "./contexts/deviceContext.js";
import { ModalProvider } from "./contexts/modalContext";
import { ParamProvider, useParamState } from "./contexts/paramContext";

import { Main } from "./components/Main";
import Background from "./components/Main/background";
import Search from "./components/Main/search";
import Genre from "./components/Main/genre";
import { DocumentInteractionProvider } from "./contexts/documentInteraction";
import Discover from "./components/Main/discover";
import { NotFound } from "./components/NotFound";

const Watch = lazy(() => import("./components/watch"));

export default function App() {

  return (
    <ParamProvider>
      <DocumentInteractionProvider>
        <DeviceProvider>
          <ModalProvider>
            <Suspense fallback={<FullLoader />}>
              <Routes>
                <Route path="/">
                  <Route
                    index
                    element={<Navigate to="browse" />}
                    replace
                  ></Route>
                  <Route element={<Main />}>
                    <Route path="search" element={<Search />} />
                    <Route path="browse">
                      <Route index element={<Background />} />
                      <Route path="genre/:genreId" element={<Genre />} />
                    </Route>
                    <Route path="discover">
                      <Route index element={<Discover />} />
                    </Route>
                  </Route>
                  <Route
                    path="*"
                    element={<NotFound/>
                    }
                  />
                </Route>
              </Routes>
            </Suspense>
          </ModalProvider>
        </DeviceProvider>
      </DocumentInteractionProvider>
    </ParamProvider>
  );
}
