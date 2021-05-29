import React, { useEffect, useState } from 'react';

const Statistics = ({ handleClick, data }) => {

    const [ statistics, setStatistics ] = useState({"confirmed": 0, "recovered": 0, "deaths": 0});
    useEffect(() => {
        const stats = {...statistics}
        // Find the most recent value for each province and add to totals for relevant dataset type
        Object.entries(data).forEach(([provinceName, provinceData]) => {
            Object.entries(provinceData).forEach(([dataType, dataSet]) => {
                // dataSet is of form [[date, total(str)]], so take last total of each and add it
                stats[dataType] += Number.parseInt(dataSet.slice(-1)[0][1]);
            })
        })
        setStatistics(stats)
    }, [data])

    return (
        <ul>
            {
                Object.entries(statistics).map(([statName, statValue]) => {
                    const statNameCapitalized = statName.charAt(0).toUpperCase() + statName.slice(1);
                    const statValueWithCommas = statValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    return (
                        <li onClick={() => handleClick(statName)} className={statName}>{`${statNameCapitalized}: ${statValueWithCommas}`}</li>

                    )
                })
            }
          {/* <li onClick={() => handleClick("confirmed")} className="confirmed">{`Confirmed: ${data.confirmed[country]}`}</li>
          <li onClick={() => handleClick("deaths")} className="deaths">{`Deaths: ${data.deaths[country]}`}</li>
          <li onClick={() => handleClick("recovered")} className="recovered">{`Recovered: ${data.recovered[country]}`}</li> */}
        </ul>
    )
}

export default Statistics;