import React, { useState, useEffect } from 'react';

import TotalChart from "./TotalChart";
import DailyChart from "./DailyChart";

import { Grid } from 'semantic-ui-react';

const Charts = ({ data, dataType, country }) => {

    const [ graphArrays, setGraphArrays ] = useState({});

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

    useEffect(() => {
        setGraphArrays(createGraphArrays(data))
    }, [data])

    return (
        <Grid.Column className="charts" width={8} >
          <TotalChart country={country} data={graphArrays} /> 
          <DailyChart country={country} data={graphArrays} dataType={dataType}/> 
        </Grid.Column>
    )
}

export default Charts;

// style = {{ width: "50%", float: "right", textAlign: "right"}}