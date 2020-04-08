import React, { useState, useEffect } from 'react';
import './App.css';
import styled from 'styled-components'
import { LineChart, Line } from 'recharts';
import Map from "./components/Map";
import * as d3 from 'd3';
import countryNameDictionary from './countryNameDictionary.js';

function App() {
  
  const [data, setData] = useState([])
  const [country, setCountry] = useState("world")

  useEffect(() => {
    console.log(country);


    const sumArray = [];

    d3.csv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv')
      .then((data) =>  {
        const fullCountryData = {};
        const countrySet = data.filter((set) => set["Country/Region"].toLowerCase() === country)

        countrySet.forEach((province) => {
          for (let [key, value] of Object.entries(province)) {
            if(!isNaN(key[0])) {
              fullCountryData[key] = (fullCountryData[key]) ? fullCountryData[key] + Number(value): Number(value);
            }
          }
        })

        for (let [key, value] of Object.entries(fullCountryData)) {
            const dateKey = {country: country, date: key, confirmed: value };
            sumArray.push(dateKey)
        }

        console.log(sumArray)
        setData(sumArray)

      })
  }, [country])


  const Chart = styled.div`
  svg{ 
    position: relative;
    top: 250px;
    left: 850px;
    }
  }
  `;



  return (
    <div className="App">
      <Map setCountry={setCountry} />
      <Chart>
        <LineChart width={400} height={400} data={data}>
          <Line type="monotone" dataKey="confirmed" stroke="#8884d8" />
        </LineChart>
      </Chart>
    </div>
  );
}

export default App;



