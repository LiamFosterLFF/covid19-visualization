import React, { useState, useEffect } from "react";
import "./App.css";
import { Grid } from "semantic-ui-react";

import Statistics from "./components/Statistics";
import Map from "./components/Map";
import Charts from "./components/Charts";

import { getAllDataTypes, getCountryData } from "./requests";
import { createCountryTimeSeries, filterCountryDataByDate } from "./utilities";

const App = () => {
  const [data, setData] = useState({ data: {}, isFetching: true });
  const [USData] = useState({ data: {}, isFetching: true });
  const [country, setCountry] = useState("world");
  const [dataType, setDataType] = useState("confirmed");
  const [countryData, setCountryData] = useState({
    original: {},
    timeLimited: {},
  });
  const [dateLimit, setDateLimit] = useState(null);

  useEffect(() => {
    getAllDataTypes().then((rawData) => {
      setData({ rawData, isFetching: false });
    });
  }, []);

  // Create time series for all countries based on raw data (for use in components)

  // Side effect for changing country based on clicking on map
  useEffect(() => {
    // Create countryData, if for world, do for all countries, each country functions as a "province"
    if (!data.isFetching) {
      const originalCountryData = createCountryTimeSeries(
        getCountryData(data, country)
      );
      setCountryData({
        original: originalCountryData,
        timeLimited: originalCountryData,
      });
    }
  }, [country, data, USData]);

  // Side effect for changing date based on clicking on chart
  useEffect(() => {
    if (dateLimit !== null) {
      setCountryData((currentData) => ({
        ...currentData,
        timeLimited: filterCountryDataByDate(countryData, dateLimit),
      }));
    }
  }, [dateLimit, countryData.original]);

  const handleDateReset = () => {
    setDateLimit(null);
    const originalCountryData = countryData.original;
    setCountryData({
      original: originalCountryData,
      timeLimited: originalCountryData,
    });
  };

  return (
    <div className="App">
      <Statistics data={countryData.timeLimited} handleClick={setDataType} />
      <Grid stackable columns={2}>
        <Map
          setCountry={setCountry}
          country={country}
          data={countryData.timeLimited}
        />
        <Charts
          country={country}
          data={countryData.timeLimited}
          dataType={dataType}
          date={dateLimit}
          resetDate={handleDateReset}
          setDate={setDateLimit}
        />
      </Grid>
    </div>
  );
};

export default App;

// Write a userducer that can replace all of the timeseries/statistics functionality, and can be passed down into all the children more simply (just state + dispatch)
// Then possibly could even rewrite this to perform the async data functionality (it would have to be set with this so probably you have to do it anyway?)
