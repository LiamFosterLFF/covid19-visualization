import React, { useState, useEffect } from 'react';

import TotalChart from "./TotalChart";
import DailyChart from "./DailyChart";

const Charts = ({ data, dataType}) => {

    const createGraphArrays = (countryData) => {
        // Combine the data for all provinces for given country, and produces an object the graphs can work with
        const graphArrays = {"confirmed": [], "recovered": [], "deaths": []};
        Object.entries(countryData).forEach(([provinceName, provinceData]) => {
            Object.entries(provinceData).forEach(([dataType, dataSet]) => {
                dataSet.forEach(([date, total], i) => {
                    if (graphArrays[dataType][i]) {
                        graphArrays[dataType][i] = {...graphArrays[dataType][i],  total: graphArrays[dataType][i].total + Number(total)}
                    } else {
                        graphArrays[dataType][i] = { "date": date, "total": Number(total) }
                    }
                })
            })
        })
        
        return graphArrays;
    }

    //     const createGraphArray = (timeSeries) => {
    //         console.log(timeSeries);
    //         // Calculate total for all countries to an object to be used in drawing the graph
    //         const graphArray = {"confirmed": [], "recovered": [], "deaths": []}; 
    //         Object.entries(timeSeries).forEach(([dataType, dataSet]) => {
    //             Object.entries(dataSet).forEach(([date, total]) => {
    //                 const graphArrayObject = { date: date, total: total };
    //                 graphArrays[dataType].push(graphArrayObject);


    //             })
    //         })
    //         return graphArray;
    //     }
        

    //         const timeSeries = mergeTimeSeries(data);
    //         graphArrays[dataType] = createGraphArray(timeSeries)

    //     return graphArrays;
    // }



    const [ graphArrays, setGraphArrays ] = useState({});
    useEffect(() => {
        setGraphArrays(createGraphArrays(data))
    }, [data])

    return (
        <div className="charts" style = {{ width: "50%", float: "right", textAlign: "right"}}>
          <TotalChart data={graphArrays} /> 
          <DailyChart data={graphArrays} dataType={dataType}/> 
        </div>
    )
}

export default Charts;