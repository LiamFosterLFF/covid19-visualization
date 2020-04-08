import React, { useState, useEffect } from 'react';
import './App.css';
import countryNameDictionary from './countryNameDictionary.js';

import Map from "./components/Map";
import TotalChart from "./components/TotalChart";
import DailyChart from "./components/DailyChart";

import * as d3 from 'd3';


const App = () => {
  
  const [calculatedData, setCalculatedData] = useState([])
  const [country, setCountry] = useState("world")
  const [countryDataTotal, setCountryDataTotal] = useState([]);
  const [countryDataDaily, setCountryDataDaily] = useState([]);



  const calculateStatistics = (data) => {
    // Get a list of all unique country namds
    const countryNameList = [];
    data.forEach((country) => {
      if ((country["Country/Region"] !== "") && !(countryNameList.includes(country["Country/Region"]))) {
        countryNameList.push(country["Country/Region"])
      }
    })

    
    // Cycle through list of countries and build an object containing all of them, arranged by name
    const allCountriesTotalData = {};
    let globalTotalInfected = 0; // Count a global total while cycling through countries
    const worldTimeSeries = {};
    countryNameList.forEach((country) => {
      const countryData = data.filter((obj) => obj["Country/Region"] === country)
      
      // Combine the data for all provinces for given Country
      const timeSeries = {};
      countryData.forEach((province) => {
          for (let [key, value] of Object.entries(province)) {
            if(!isNaN(key[0])) {
              timeSeries[key] = (timeSeries[key]) ? timeSeries[key] + Number(value): Number(value);
            }
          }
        })

        // Push totals to an object to be used in drawing the graph
        const graphArray = []; 
        for (let [key, value] of Object.entries(timeSeries)) {
            const dateKey = {country: country, date: key, confirmed: value };
            graphArray.push(dateKey);

            // Take this opportunity to also add up the daily totals for the whole world
            worldTimeSeries[key] = (worldTimeSeries[key]) ? worldTimeSeries[key] + Number(value): Number(value);
        }

        // Calculate rise per day by subtracting each new date from previous in graph array
        for (let i = 1; i < graphArray.length; i++) {
          graphArray[i]["increase"] = graphArray[i].confirmed - graphArray[i - 1].confirmed     
        }

        // Total infected for the most recent date
        const mostRecentDateStr = "4/7/20"
        const totalInfected = timeSeries[mostRecentDateStr]
        globalTotalInfected += totalInfected // Add national total to global total

        // Push to total object
        allCountriesTotalData[country.toLowerCase()] = { timeSeries, graphArray, totalInfected}
        
    })
    console.log(worldTimeSeries);
    
    // Push totals to an object to be used in drawing the graph for whole world
    const worldGraphArray = []; 
    for (let [key, value] of Object.entries(worldTimeSeries)) {
        const dateKey = {country: country, date: key, confirmed: value };
        worldGraphArray.push(dateKey);
    }

    // Calculate rise per day for whole world by subtracting each new date from previous in graph array
    for (let i = 1; i < worldGraphArray.length; i++) {
      worldGraphArray[i]["increase"] = worldGraphArray[i].confirmed - worldGraphArray[i - 1].confirmed     
    }

    allCountriesTotalData["world"] = {timeSeries: worldTimeSeries, graphArray: worldGraphArray, totalInfected: globalTotalInfected}

    return allCountriesTotalData
  }


  useEffect(() => {

    d3.csv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv')
      .then((data) =>  {
        setCalculatedData(calculateStatistics(data))

      })
  }, [])


  useEffect(() => {
    if (calculatedData[country] !== undefined) {
      console.log(calculatedData[country], country);
      setCountryDataTotal(calculatedData[country].graphArray);
      setCountryDataDaily(calculatedData[country].graphArray);
    }
  }, [calculatedData, country])

  return (
    <div className="App">
      <Map setCountry={setCountry} />
      <TotalChart data={countryDataTotal} /> 
      <DailyChart data={countryDataDaily} /> 
    </div>
  );
}

export default App;



