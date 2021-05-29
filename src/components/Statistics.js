import React, { useEffect, useState } from 'react';
import { Grid } from 'semantic-ui-react';

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

    const [ hoveredStat, setHoveredStat ] = useState("")
    const handleHover = (e) => {
        setHoveredStat(e.target.className.split(" ").slice(-1)[0]);
    }

    return (
        <Grid.Row columns="centered" divided>
            {/* <Grid.Column/> */}
            {Object.entries(statistics).map(([statName, statValue]) => {
                    const statNameCapitalized = statName.charAt(0).toUpperCase() + statName.slice(1);
                    const statValueWithCommas = statValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    return (
                        <Grid.Column 
                            width={3} 
                            className={statName}
                            onClick={() => handleClick(statName)} 
                            onMouseEnter={(e) => handleHover(e)}
                            onMouseLeave={() => setHoveredStat("")}
                            style={{"font-size": (hoveredStat === statName) ? "large": "medium"}}
                        >
                            {`${statNameCapitalized}: ${statValueWithCommas}`}
                        </Grid.Column>

                    )
                })}
            {/* <Grid.Column/> */}
        </Grid.Row>
    )
}

export default Statistics;