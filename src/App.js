import React, { useState, useEffect } from 'react';
import './App.css';
import styled from 'styled-components'
import { LineChart, Line } from 'recharts';
import Map from "./components/Map";
import * as d3 from 'd3';
import countryNameDictionary from './countryNameDictionary.js';

function App() {
  
  const [calculatedData, setCalculatedData] = useState([])
  const [country, setCountry] = useState("world")
  const [countryData, setCountryData] = useState([])


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
            graphArray.push(dateKey)
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
    
    return allCountriesTotalData
  }


  useEffect(() => {
    const sumArray = [];

    d3.csv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv')
      .then((data) =>  {
        setCalculatedData(calculateStatistics(data))

      })
  }, [])

  

  const Chart = styled.div`
  svg{ 
    position: relative;
    top: 250px;
    left: 850px;
    }
  }
  `;

  useEffect(() => {
    if (calculatedData[country] !== undefined) {
      console.log(calculatedData[country], country);
      setCountryData(calculatedData[country].graphArray)
    }
  }, [calculatedData, country])

  return (
    <div className="App">
      <Map setCountry={setCountry} />
      <Chart>
        <LineChart width={400} height={400} data={countryData}>
          <Line type="monotone" dataKey="confirmed" stroke="#8884d8" />
        </LineChart>
      </Chart>
    </div>
  );
}

export default App;



