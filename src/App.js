import React, { useState, useEffect } from 'react';
import './App.css';
import { Grid } from 'semantic-ui-react';

import Statistics from './components/Statistics';
import Map from "./components/Map";
import Charts from "./components/Charts";

import * as d3 from 'd3';

const App = () => {
  
  const [ data, setData ] = useState({data: {}, isFetching: true})
  const [ USData, ] = useState({data: {}, isFetching: true})
  const [ country, setCountry ] = useState("world")
  const [ dataType, setDataType ] = useState("confirmed")
  const [ countryData, setCountryData ] = useState({original: {}, timeLimited: {} })
  const [ dateLimit, setDateLimit ] = useState(null)


  const getSingularDataType = async (dataType) => { // Sets one data type at a time, saves on copy/paste
    let rawData = await d3.csv(`https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_${dataType}_global.csv`)

    return { [dataType]: rawData }
  }



  useEffect(() => {
    const getData = async () => { // Sets all 3 data types
      let returnObj = {}
      await Promise.all(
        [getSingularDataType("confirmed"),
        getSingularDataType("deaths"),
        getSingularDataType("recovered")]
      ).then(dataTypes => {
        for (let i = 0; i < dataTypes.length; i++) {
          returnObj = {...returnObj, ...dataTypes[i]}
        }
      })
      return returnObj
    }
    
    getData().then(rawData => {
      setData({rawData, isFetching:false})
    })
  }, [])

  const createCountryTimeSeries = (countryData) => {
    const createSortedTimeSeriesArray = (dataTypeProvinceData) => {
      // Takes time series object for chosen country and turns into sorted array of form [[date, value],]
      return dataTypeProvinceData.sort((a, b) => {
          // Split date strings into segments, then sort by Y, M, D (US format dates)
          const [aArr, bArr] = [a[0].split('/'), b[0].split('/')]
          const checkingOrder = [2, 0, 1];
          for (let i = 0; i < checkingOrder.length; i++) {
              const c = checkingOrder[i];
              const [aVal, bVal] = [Number.parseInt(aArr[c]), Number.parseInt(bArr[c])]
              if (aVal > bVal) {
                  return 1;
              } else if (bVal > aVal) {
                  return -1;
              }
          }
          return 0
      })
    }

    // Go through each of the provinces and create a separate entry for each; if none, will just do country as a whole
    const sortedTimeSeriesArrays = {}
    Object.entries(countryData).forEach(([dataType, provinces]) => {
      provinces.forEach((province) => {
        const provinceText = (province["Province/State"] === "") ? "" : `, ${province["Province/State"]}`;
        const provinceName = province["Country/Region"] + provinceText;
        const provinceData = Object.entries(province).filter(([key, value]) => !isNaN(key[0]))
        // Create province name in time series array if not already created
        sortedTimeSeriesArrays[provinceName] = (sortedTimeSeriesArrays[provinceName]) ? {...sortedTimeSeriesArrays[provinceName]} : {};
        sortedTimeSeriesArrays[provinceName][dataType] = createSortedTimeSeriesArray(provinceData);
      })
    });
    return sortedTimeSeriesArrays;
  }

  useEffect(() => {
    // Create countryData, if for world, do for all countries, each country functions as a "province"
    if (!data.isFetching) {
      const getCountryData = (data) => {
        if (country === "world") {
          return createCountryTimeSeries(data.rawData)
        } else {
          const countryData = {}
          Object.entries(data.rawData).forEach(([dataType, dataSet]) => {
            countryData[dataType] = dataSet.filter((obj) => obj["Country/Region"].toLowerCase() === country)
          })
          return createCountryTimeSeries(countryData)
        }
      }
      const originalCountryData = getCountryData(data)
      setCountryData({ original: originalCountryData, timeLimited: originalCountryData })
    }
  }, [data, country, USData])


  useEffect(() => {
    if (dateLimit !== null) {
      const newCountryData = {}
      const dateLimitObj = new Date(dateLimit)
      Object.entries(countryData.original).forEach(([provinceName, provinceData]) => {
        newCountryData[provinceName] = {}
        Object.entries(provinceData).forEach(([dataType, dataSet]) => {
          newCountryData[provinceName][dataType] = dataSet.filter(([date, ]) => dateLimitObj >= new Date(date))
        })
      })
      setCountryData((currentData) => ({ ...currentData, timeLimited: newCountryData }) );
    }
  }, [dateLimit])

  const handleDateReset = () => {
    setDateLimit(null)
    const originalCountryData = countryData.original
    setCountryData({ original: originalCountryData, timeLimited: originalCountryData })
  }

  return (
    <div className="App">
        <Statistics data={countryData.timeLimited} handleClick={setDataType}/>
      <Grid stackable columns={2}  style={{maxHeight: "1vh"}}>
          <Map setCountry={setCountry} country={country} data={countryData.timeLimited}/>
          <Charts country={country}data={countryData.timeLimited} dataType={dataType} showBackButton={dateLimit !== null} resetDate={handleDateReset} setDate={setDateLimit} /> 
      </Grid>

    </div>
  );
}

export default App;



