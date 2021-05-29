import React, { useState, useEffect } from 'react';

export const useFetch = () => {
    const calculateStatistics = (data, dataType, returnObj) => {
        const getCountryNameList = (data) => {
            // Create a list of all unique country names from the dataset
            const countryNameList = [];
            data.forEach((country) => {
                if ((country["Country/Region"] !== "") && !(countryNameList.includes(country["Country/Region"].toLowerCase()))) {
                    countryNameList.push(country["Country/Region"].toLowerCase())
                }
            })
            return countryNameList;
        }
        
        const getMostRecentDateStr = (data) => {
            // Picks out most recent date string from the dataset
            let maxDateTime = 0;
            for (let d of data.columns) {
              const dateTime = (new Date(d)).getTime(); // Create a date object and convert to dateTime
              if (!isNaN(dateTime)) { // Check if dateTime is valid
                if (dateTime > maxDateTime) { // Check if more recent
                  maxDateTime = dateTime
                }
              }
            }
            const d = new Date(maxDateTime)
            const mostRecentDateStr = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear() - 2000}`; // Set to valid format for chart
        
            return mostRecentDateStr;
        }

        const createCountriesTimeSeries = (countryNameList) => {
            const countriesTimeSeries = {};
            countryNameList.forEach((country) => {
                // Filter and combine the data for all provinces for given Country
                const countryData = data.filter((obj) => obj["Country/Region"].toLowerCase() === country)
                const timeSeries = {};
          
                countryData.forEach((province) => {
                    for (let [key, value] of Object.entries(province)) {
                        if(!isNaN(key[0])) {
                            timeSeries[key] = (timeSeries[key]) ? timeSeries[key] + Number(value): Number(value);
                        }
                    }
                })
                countriesTimeSeries[country] = timeSeries;
            })
            return countriesTimeSeries;
        }

        const createCountriesGraphArray = (countriesTimeSeries) => {
            const countriesGraphArray = {};
            countriesTimeSeries.forEach((country) => {
                // Calculate total for all countries to an object to be used in drawing the graph
                const graphArray = []; 
                const timeSeries = countriesWithTSAndGraphArray[country][dataType]["timeSeries"];
                for (let [key, value] of Object.entries(timeSeries)) {
                    const dateKey = { country: country, date: key, total: value };
                    graphArray.push(dateKey);
                }
                countryNameListWithTimeSeries[country][dataType]["graphArray"] = graphArray;
            })
        }



        const listOfCountries = getCountryNameList(data);
        const mostRecentDateStr = getMostRecentDateStr(data);
        const countriesWithTimeSeries = createCountriesTimeSeries(listOfCountries, dataType);
        const countriesWithTSAndGraphArray = createCountriesGraphArray(countriesWithTimeSeries, dataType)
        
        
        const worldTimeSeries = {}; // Create a time series object for all the countries combined into one
        // Also create objects containing the totals and most recent daily increase
        const worldStatistics = {};
        countryNameList.forEach((country) => {
    
            // Push totals to an object to be used in drawing the graph
            const graphArray = []; 
            for (let [key, value] of Object.entries(timeSeries)) {
                const dateKey = { country: country, date: key, total: value };
                graphArray.push(dateKey);
    
                // Take this opportunity to also add up the daily totals for the whole world
                worldTimeSeries[key] = (worldTimeSeries[key]) ? worldTimeSeries[key] + Number(value): Number(value);
                
            }
    
            // Calculate rise per day by subtracting each new date from previous in graph array
            for (let i = 1; i < graphArray.length; i++) {
              graphArray[i]["increase"] = graphArray[i].total - graphArray[i - 1].total    
            }
     
            // Set provincial statistics for that country (if from a certain list)
            // statistics[country] = {};
            // statistics[country]["increase"] = graphArray[graphArray.length - 1]["increase"];
    
            // const statistics = {};
    
            // if (["Australia", "Canada", "China"].contains country["Country/State"] !== "") {
            //   statistics[province["Province/State"]] = {};
            //   statistics[province["Province/State"]]["total"] = province[mostRecentDateStr];
            //   const secondMostRecentDateStr = "4/9/20";
            //   statistics[province["Province/State"]]["increase"] = province[mostRecentDateStr] - province[secondMostRecentDateStr];
    
            //   console.log(statistics);
            // }
    
            // Set world statistics on that country
            worldStatistics[country] = {};
            const total = timeSeries[mostRecentDateStr];
            worldStatistics[country]["total"] = total;
            worldStatistics[country]["increase"] = graphArray[graphArray.length - 1]["increase"];
    
            // Push to returned object, with update for that specific data type
            returnObj[country] = (returnObj[country]) ? returnObj[country] : {};
            returnObj[country][dataType] = { timeSeries, graphArray, total}
            
        })
        
    
        // Push totals to an object to be used in drawing the graph for whole world
        const worldGraphArray = []; 
        for (let [key, value] of Object.entries(worldTimeSeries)) {
            const dateKey = {country: country, date: key, total: value };
            worldGraphArray.push(dateKey);
        }
    
        // Calculate rise per day for whole world by subtracting each new date from previous in graph array
        for (let i = 1; i < worldGraphArray.length; i++) {
          worldGraphArray[i]["increase"] = worldGraphArray[i].total - worldGraphArray[i - 1].total     
        }
    
        // Set statistics for entire world
        const worldTotal = worldTimeSeries[mostRecentDateStr];
        const worldIncrease = worldGraphArray[worldGraphArray.length - 1]["increase"];
        worldStatistics["world"] = {};
        worldStatistics["world"]["total"] = worldTotal;
        worldStatistics["world"]["increase"] = worldIncrease;
        worldStatistics["world"]["provinces"] = worldStatistics;
    
        // Push totals for whole world to world property of returned object
        returnObj["world"] = (returnObj["world"]) ? returnObj["world"] : {};
        returnObj["world"][dataType] = { 'timeSeries': worldTimeSeries, 'graphArray': worldGraphArray, "statistics" : worldStatistics, "total": worldTotal, "increase": worldIncrease }
    
        return returnObj
      }
    
      const setSingularDataType = async (dataType, returnObj) => { // Sets one data type at a time, saves on copy/paste
        const data = await d3.csv(`https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_${dataType}_global.csv`)
        
        return calculateStatistics(data, dataType, returnObj);
    
      }
    
      const setAllData = async () => { // Sets all 3 data types
        const calculatedDataCopy = {}; 
        await Promise.all(
          [ setSingularDataType("confirmed", calculatedDataCopy),
          setSingularDataType("deaths", calculatedDataCopy),
          setSingularDataType("recovered", calculatedDataCopy)]
        )
        
        return calculatedDataCopy
    
      } 
    
    
      useEffect(() => {
        setAllData().then((data => setCalculatedData(data)))
      }, [])
    
    
      const [totalTitles, setTotalTitles] = useState({ confirmed: "Confirmed", deaths: "Deaths", recovered: "Recovered"})
    
      useEffect(() => {
        if (calculatedData[country]) {
          
          setCountryData(calculatedData[country]);
          
          setTotalTitles({ 
            confirmed: `Confirmed: ${calculatedData["world"].confirmed.statistics[country].total}`,
            deaths: `Deaths: ${calculatedData["world"].deaths.statistics[country].total}`,
            recovered: `Recovered: ${calculatedData["world"].recovered.statistics[country].total}`
          });
          
        }
      }, [calculatedData, country])
    
}