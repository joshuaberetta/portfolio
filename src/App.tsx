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
        <NavBar />
        <Switch>
          <Route component={Work} path="/" exact />
          <Route component={About} path="/about" exact />
          <Route component={Contact} path="/contact" exact />
          {/* <Route component={Ourthreedots} path="/work/ourthreedots" exact />
          <Route
            component={NoordhoekBagels}
            path="/work/noordhoek-bagels"
            exact
          />
          <Route
            component={THC}
            path="/work/travelling-hipster-coaster"
            exact
          /> */}
          {WORK.items.map((item) => (
            <Route path={item.href} exact>
              <PortfolioPage title={item.title} label={item.display.title} />
            </Route>
          ))}
          <Redirect to="/" />
        </Switch>
        <Footer />
      </Router>
    </LocationContext.Provider>
  );
};

export default App;
