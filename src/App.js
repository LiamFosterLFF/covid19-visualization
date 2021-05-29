import React, { useState, useEffect } from 'react';
import './App.css';
// import countryNameDictionary from './countryNameDictionary.js';

import Statistics from './components/Statistics';
import Map from "./components/Map";
import Charts from "./components/Charts";

import * as d3 from 'd3';
import { sort } from 'd3';


const App = () => {
  
  const [ data, setData ] = useState({data: {}, isFetching: true})
  const [ country, setCountry ] = useState("world")
  const [ countryData, setCountryData ] = useState({});
  const [ dataType, setDataType ] = useState("confirmed")

  // const calculateStatistics = (data, dataType, returnObj) => {

  //   const getCountryNameList = (data) => {
  //     // Create a list of all unique country names from the dataset
  //     const countryNameList = [];
  //     data.forEach((country) => {
  //         if ((country["Country/Region"] !== "") && !(countryNameList.includes(country["Country/Region"].toLowerCase()))) {
  //             countryNameList.push(country["Country/Region"].toLowerCase())
  //         }
  //     })
  //     return countryNameList;
  //   }

  //   const getMostRecentDateStr = (data) => {
  //     // Picks out most recent date string from the dataset
  //     let maxDateTime = 0;
  //     for (let d of data.columns) {
  //       const dateTime = (new Date(d)).getTime(); // Create a date object and convert to dateTime
  //       if (!isNaN(dateTime)) { // Check if dateTime is valid
  //         if (dateTime > maxDateTime) { // Check if more recent
  //           maxDateTime = dateTime
  //         }
  //       }
  //     }
  //     const d = new Date(maxDateTime)
  //     const mostRecentDateStr = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear() - 2000}`; // Set to valid format for chart
  
  //     return mostRecentDateStr;
  //   }

  //   const createCountriesTimeSeries = (countryNameList) => {
  //     const countriesTimeSeries = {};
  //     countryNameList.forEach((country) => {
  //         // Filter and combine the data for all provinces for given Country
  //         const countryData = data.filter((obj) => obj["Country/Region"].toLowerCase() === country)
  //         const timeSeries = {};
    
  //         countryData.forEach((province) => {
  //             for (let [key, value] of Object.entries(province)) {
  //                 if(!isNaN(key[0])) {
  //                     timeSeries[key] = (timeSeries[key]) ? timeSeries[key] + Number(value): Number(value);
  //                 }
  //             }
  //         })
  //         countriesTimeSeries[country] = timeSeries;
  //     })
  //     return countriesTimeSeries;
  //   }

  //   const createCountriesGraphArray = (countriesTimeSeries) => {
  //     // Calculate total for all countries to an object to be used in drawing the graph
  //     const countriesGraphArray = {};
  //     for (let [country, timeSeries] of Object.entries(countriesTimeSeries)) {
  //         const graphArray = []; 
  //         for (let [date, dailyTotal] of Object.entries(timeSeries)) {
  //             const graphArrayObject = { country: country, date: date, total: dailyTotal };
  //             graphArray.push(graphArrayObject);
  //         }

  //         // Find total for each day and subtract previous day's from it to find the increase in number of cases
  //         for (let i = 1; i < graphArray.length; i++) {
  //           graphArray[i]["increase"] = graphArray[i].total - graphArray[i-1].total;  
  //         }

  //         countriesGraphArray[country] = graphArray;
  //     }
  //     return countriesGraphArray;
  //   }

  //   // const createCountriesStatistics = (countriesGraphArray) => {
  //   //   const countriesDailyIncrease = {};
  //   //   for (let [country, graphArray] of Object.entries(countriesGraphArray)) {
  //   //     const dailyIncreases = [];
  //   //     for (let i = 1; i < graphArray.length; i++) {
  //   //       dailyIncreases.push(graphArray[i].total - graphArray[i-1].total);  
  //   //     }
  //   //     countriesDailyIncrease[country] = dailyIncreases;
  //   //   }
  //   //   return countriesDailyIncrease;
  //   // }


  //   const createWorldTimeSeries = (countriesTimeSeries) => {
  //     // Creata a time series object for all the countries combined into one
  //     const worldTimeSeries = {}; 
  //     for (let [, timeSeries] of Object.entries(countriesTimeSeries)) {
  //       for (let [date, dailyTotal] of Object.entries(timeSeries)) {
  //         worldTimeSeries[date] = (worldTimeSeries[date]) ? worldTimeSeries[date] + Number(dailyTotal): Number(dailyTotal);
  //       }
  //     }
  //     return worldTimeSeries;
  //   }

  //   const createWorldGraphArray = (worldTimeSeries) => {
  //     // Push totals to an object to be used in drawing the graph for whole world
  //     const worldGraphArray = []; 
  //     for (let [date, dailyTotal] of Object.entries(worldTimeSeries)) {
  //         const graphArrayObject = {country: "world", date: date, total: dailyTotal };
  //         worldGraphArray.push(graphArrayObject);
  //     }
  //     // Calculate rise per day for whole world by subtracting each new date from previous in graph array
  //     for (let i = 1; i < worldGraphArray.length; i++) {
  //       worldGraphArray[i]["increase"] = worldGraphArray[i].total - worldGraphArray[i - 1].total     
  //     }
  //     return worldGraphArray;
  //   }


  //   const createWorldStatistics = (countriesTimeSeries, mostRecentDateStr, countriesGraphArray, worldTimeSeries, worldGraphArray) => {
  //     const worldStatistics = {};
  //     for (let [country, timeSeries] of Object.entries(countriesTimeSeries)) {
  //       worldStatistics[country] = {
  //         "total": timeSeries[mostRecentDateStr],
  //         "increase": countriesGraphArray[country].slice(-1)[0]
  //       }
  //     }
  //     // Set statistics for entire world
  //     const worldTotal = worldTimeSeries[mostRecentDateStr];
  //     const worldIncrease = worldGraphArray[worldGraphArray.length - 1]["increase"];
  //     worldStatistics["world"] = {
  //       "total": worldTimeSeries[mostRecentDateStr],
  //       "increase": worldGraphArray[worldGraphArray.length - 1]["increase"]
  //     };
  //     worldStatistics["world"]["provinces"] = worldStatistics;

  //     return worldStatistics;
  //   }
        
    
        

  //   const countryNameList = getCountryNameList(data);
  //   const countriesTimeSeries = createCountriesTimeSeries(countryNameList);
    
    
    
  //   const mostRecentDateStr = getMostRecentDateStr(data);
  //   const countriesGraphArray = createCountriesGraphArray(countriesTimeSeries);
  //   console.log(countriesGraphArray);
  //   const wworldTimeSeries = createWorldTimeSeries(countriesTimeSeries);
  //   const wworldGraphArray = createWorldGraphArray(wworldTimeSeries)
  //   const wworldStatistics = createWorldStatistics(countriesTimeSeries, mostRecentDateStr, countriesGraphArray, wworldTimeSeries, wworldGraphArray);
    
    
  //   const worldTimeSeries = {}; // Creata a time series object for all the countries combined into one
  //   // Also create objects containing the totals and most recent daily increase
  //   const worldStatistics = {};
  //   countryNameList.forEach((country) => {
  //     const countryData = data.filter((obj) => obj["Country/Region"].toLowerCase() === country)
      
  //     // Combine the data for all provinces for given Country
  //     const timeSeries = {};

  //     countryData.forEach((province) => {
  //         for (let [key, value] of Object.entries(province)) {
  //           if(!isNaN(key[0])) {
  //             timeSeries[key] = (timeSeries[key]) ? timeSeries[key] + Number(value): Number(value);
  //           }
  //         }
  //       })

  //       // Push totals to an object to be used in drawing the graph
  //       const graphArray = []; 
  //       for (let [key, value] of Object.entries(timeSeries)) {
  //           const dateKey = { country: country, date: key, total: value };
  //           graphArray.push(dateKey);

  //           // Take this opportunity to also add up the daily totals for the whole world
  //           worldTimeSeries[key] = (worldTimeSeries[key]) ? worldTimeSeries[key] + Number(value): Number(value);
            
  //       }

  //       // Calculate rise per day by subtracting each new date from previous in graph array
  //       for (let i = 1; i < graphArray.length; i++) {
  //         graphArray[i]["increase"] = graphArray[i].total - graphArray[i - 1].total    
  //       }
 
  //       // Set provincial statistics for that country (if from a certain list)
  //       // statistics[country] = {};
  //       // statistics[country]["increase"] = graphArray[graphArray.length - 1]["increase"];

  //       // const statistics = {};

  //       // if (["Australia", "Canada", "China"].contains country["Country/State"] !== "") {
  //       //   statistics[province["Province/State"]] = {};
  //       //   statistics[province["Province/State"]]["total"] = province[mostRecentDateStr];
  //       //   const secondMostRecentDateStr = "4/9/20";
  //       //   statistics[province["Province/State"]]["increase"] = province[mostRecentDateStr] - province[secondMostRecentDateStr];

  //       //   console.log(statistics);
  //       // }

  //       // Set world statistics on that country
  //       worldStatistics[country] = {};
  //       const total = timeSeries[mostRecentDateStr];
  //       worldStatistics[country]["total"] = total;
  //       worldStatistics[country]["increase"] = graphArray[graphArray.length - 1]["increase"];

  //       // Push to returned object, with update for that specific data type
  //       returnObj[country] = (returnObj[country]) ? returnObj[country] : {};
  //       returnObj[country][dataType] = { timeSeries, graphArray, total}
        
  //   })
    

  //   // Push totals to an object to be used in drawing the graph for whole world
  //   const worldGraphArray = []; 
  //   for (let [key, value] of Object.entries(worldTimeSeries)) {
  //       const dateKey = {country: country, date: key, total: value };
  //       worldGraphArray.push(dateKey);
  //   }

  //   // Calculate rise per day for whole world by subtracting each new date from previous in graph array
  //   for (let i = 1; i < worldGraphArray.length; i++) {
  //     worldGraphArray[i]["increase"] = worldGraphArray[i].total - worldGraphArray[i - 1].total     
  //   }


  //   // Set statistics for entire world
  //   const worldTotal = worldTimeSeries[mostRecentDateStr];
  //   const worldIncrease = worldGraphArray[worldGraphArray.length - 1]["increase"];
  //   worldStatistics["world"] = {};
  //   worldStatistics["world"]["total"] = worldTotal;
  //   worldStatistics["world"]["increase"] = worldIncrease;
  //   worldStatistics["world"]["provinces"] = worldStatistics;

  //   // Push totals for whole world to world property of returned object
  //   returnObj["world"] = (returnObj["world"]) ? returnObj["world"] : {};
  //   returnObj["world"][dataType] = { 'timeSeries': worldTimeSeries, 'graphArray': worldGraphArray, "statistics" : worldStatistics, "total": worldTotal, "increase": worldIncrease }

  //   return returnObj
  // }

  // const xcreateAPI = (data, dataType) => {
  //   console.log(data);
  //   const getCountryNameList = (data) => {
  //     // Create a list of all unique country names from the dataset
  //     const countryNameList = [];
  //     data.forEach((country) => {
  //         if ((country["Country/Region"] !== "") && !(countryNameList.includes(country["Country/Region"].toLowerCase()))) {
  //             countryNameList.push(country["Country/Region"].toLowerCase())
  //         }
  //     })
  //     return countryNameList;
  //   }

  //   const createCountriesTimeSeries = (countryNameList) => {
  //     const countriesTimeSeries = {};
  //     countryNameList.forEach((country) => {
  //         // Filter and combine the data for all provinces for given country
  //         const countryData = data.filter((obj) => obj["Country/Region"].toLowerCase() === country)
  //         const timeSeries = {};
    
  //         countryData.forEach((province) => {
  //             for (let [date, total] of Object.entries(province)) {
  //                 if(!isNaN(date[0])) {
  //                     timeSeries[date] = (timeSeries[date]) ? timeSeries[date] + Number(total): Number(total);
  //                 }
  //             }
  //         })
  //         countriesTimeSeries[country] = timeSeries;
  //     })
  //     return countriesTimeSeries;
  //   }

  //   const createWorldTimeSeries = (countriesTimeSeries) => {
  //     // Creata a time series object for all the countries combined into one
  //     const worldTimeSeries = {}; 
  //     for (let [, timeSeries] of Object.entries(countriesTimeSeries)) {
  //       for (let [date, dailyTotal] of Object.entries(timeSeries)) {
  //         worldTimeSeries[date] = (worldTimeSeries[date]) ? worldTimeSeries[date] + Number(dailyTotal): Number(dailyTotal);
  //       }
  //     }
  //     return worldTimeSeries;
  //   }

  //   const countriesTimeSeries = createCountriesTimeSeries(getCountryNameList(data));
  //   countriesTimeSeries["world"] = createWorldTimeSeries(countriesTimeSeries);
  //   const returnObject = {
  //     [dataType]: countriesTimeSeries
  //   }
  //   return returnObject;

  // }

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




  const getSingularDataType = async (dataType) => { // Sets one data type at a time, saves on copy/paste
    const rawData = await d3.csv(`https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_${dataType}_global.csv`)
    
    return { [dataType]: rawData }

  }

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

  // const [ statistics, setStatistics ] = useState({"confirmed": 0, "recovered": 0, "deaths": 0})
  // const createStatistics = (data) => {
  //   const getMostRecentDateStr = (data) => {
  //     // Picks out most recent date string from the dataset
  //     let maxDateTime = 0;
  //     for (let [date,] of Object.entries(data)) {
  //       const dateTime = (new Date(date)).getTime(); // Create a date object and convert to dateTime
  //       if (!isNaN(dateTime)) { // Check if dateTime is valid
  //         if (dateTime > maxDateTime) { // Check if more recent
  //           maxDateTime = dateTime
  //         }
  //       }
  //     }
  //     const d = new Date(maxDateTime)
  //     const mostRecentDateStr = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear() - 2000}`; // Set to valid format for chart
  
  //     return mostRecentDateStr;
  //   }

  //   const stats = {};
  //   const mostRecentDateStr = getMostRecentDateStr(data["confirmed"]["world"]);
  //   for (let [dataType,] of Object.entries(data)) {
  //     stats[dataType] = {}
  //     stats[dataType] = data[dataType][country][mostRecentDateStr];
  //   }

  //   return stats;
  // }

  useEffect(() => {
    getData().then(rawData => {
      setData({rawData, isFetching:false})
    })
  }, [])

  const [ countryTimeSeries, setCountryTimeSeries ] = useState({})
  useEffect(() => {
    if (!data.isFetching) {
      setCountryTimeSeries(() => {
        if (country === "world") {
          return createCountryTimeSeries(data.rawData)
        } else {
          const countryData = {}
          Object.entries(data.rawData).forEach(([dataType, dataSet]) => {
            countryData[dataType] = dataSet.filter((obj) => obj["Country/Region"].toLowerCase() === country)
          })
          return createCountryTimeSeries(countryData)
        }
      })
    }
  }, [data, country])

  // const [totalTitles, setTotalTitles] = useState({ confirmed: "Confirmed", deaths: "Deaths", recovered: "Recovered"})

  // useEffect(() => {
  //   if (!apiData.isFetching) {
  //     setCountryData({
  //       "confirmed": apiData.data.confirmed[country],
  //       "recovered": apiData.data.recovered[country],
  //       "deaths": apiData.data.deaths[country],
  //     })
  //     setStatistics(() => createStatistics(apiData.data))

  //   }
    
      
  //     // setTotalTitles({ 
  //     //   confirmed: `Confirmed: ${apiData["world"].confirmed.statistics[country].total}`,
  //     //   deaths: `Deaths: ${apiData["world"].deaths.statistics[country].total}`,
  //     //   recovered: `Recovered: ${apiData["world"].recovered.statistics[country].total}`
  //     // });
      
  // }, [apiData, country])

  return (
    <div className="App">
      <div className="top-bar" >
        <Statistics data={countryTimeSeries} handleClick={setDataType}/>
      </div>
      <div className="map-and-charts">
        <Map setCountry={setCountry} country={country} data={countryTimeSeries}/>
        <Charts data={countryTimeSeries} dataType={dataType}/> 
      </div>
    </div>
  );
}

export default App;



