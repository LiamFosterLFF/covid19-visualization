import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";
import countryNameDictionary from "./countryNameDictionary";

const App = () => {
  const countryNames = Object.values(countryNameDictionary);
  countryNames.push("world");
  return (
    <BrowserRouter>
      <Routes>
        {countryNames.map((countryName, index) => {
          return (
            <Route
              key={index}
              path={`/${countryName}`}
              element={<MainPage country={countryName} />}
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
