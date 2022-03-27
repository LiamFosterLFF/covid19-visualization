import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainPage from "./components/MainPage";
import countryNameDictionary from "./countryNameDictionary";
import { formatCountryNameCamelCase } from "./utilities";

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
              path={`/${formatCountryNameCamelCase(countryName)}`}
              element={<MainPage country={countryName} />}
            />
          );
        })}
        <Route path="*" element={<Navigate to="/world" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
