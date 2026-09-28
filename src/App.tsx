import React, { useState, useCallback } from "react";
import { BrowserRouter as Router, Route, Navigate, Routes } from "react-router";

import Footer from "./components/Footer";
import Work from "./pages/WorkPage";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Ourthreedots from "./pages/portfolioPages/Ourthreedots";
import NoordhoekBagels from "./pages/portfolioPages/NoordhoekBagels";
import THC from "./pages/portfolioPages/THC";
import PortfolioPage from "./pages/portfolioPages/PortfolioPage";

import { LocationContext } from "./shared/context/LocationContext";
import { WORK } from "./shared/content";

const App: React.FC = () => {
  const [location, setLocation] = useState<string>("/work");

  const updateLocation = useCallback((loc: string) => {
    setLocation(loc);
  }, []);

  return (
    <LocationContext.Provider
      value={{
        location: location,
        updateLocation: updateLocation,
      }}
    >
      <Router>
        <Routes>
          {/* <Route element={<Work />} path="/" />
          <Route element={<About />} path="/about" /> */}
          <Route element={<Contact />} path="/" />
          {/* <Route element={<Ourthreedots />} path="/work/ourthreedots" />
          <Route element={<NoordhoekBagels />} path="/work/noordhoek-bagels" />
          <Route element={<THC />} path="/work/travelling-hipster-coaster" /> */}
          {WORK.items.map((item) => (
            <Route
              key={item.href}
              path={item.href}
              element={
                <PortfolioPage title={item.title} label={item.display.title} />
              }
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </Router>
    </LocationContext.Provider>
  );
};

export default App;
