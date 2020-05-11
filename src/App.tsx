import React, { useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Work from "./pages/WorkPage";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Ourthreedots from "./pages/portfolioPages/Ourthreedots";

import { LocationContext } from "./shared/context/LocationContext";

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
        <NavBar />
        <Switch>
          <Route component={Work} path="/" exact />
          <Route component={About} path="/about" exact />
          <Route component={Contact} path="/contact" exact />
          <Route component={Ourthreedots} path="/work/ourthreedots" exact />
          <Redirect to="/" />
        </Switch>
        <Footer />
      </Router>
    </LocationContext.Provider>
  );
};

export default App;
