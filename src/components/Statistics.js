import React, { useEffect, useState } from 'react';
import { Grid, Popup } from 'semantic-ui-react';

const Statistics = ({ handleClick, data }) => {

    const [ statistics, setStatistics ] = useState({"confirmed": 0, "recovered": 0, "deaths": 0});
    useEffect(() => {
        const stats = {"confirmed": 0, "recovered": 0, "deaths": 0}
        // Find the most recent value for each province and add to totals for relevant dataset type
        Object.entries(data).forEach(([, provinceData]) => {
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

    const textColors = {"confirmed": "#8884d8", "recovered": "#54ed40", "deaths": "#f72e2e"}

    return (
        <Grid columns="5" divided>
            <Grid.Column/>
            {Object.entries(statistics).map(([statName, statValue], index) => {
                    const statNameCapitalized = statName.charAt(0).toUpperCase() + statName.slice(1);
                    const statValueWithCommas = statValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    return (
                        <Grid.Column 
                            key={index}
                            width={3} 
                            className={statName}
                            onClick={() => handleClick(statName)} 
                            onMouseEnter={(e) => handleHover(e)}
                            onMouseLeave={() => setHoveredStat("")}
                            style={{"fontSize": (hoveredStat === statName) ? "large": "medium", "cursor": "pointer", "textAlign": "center", "color": textColors[statName]}}
                        >
                        <Popup content='Click to change daily chart contents' basic trigger={
                            <div>{`${statNameCapitalized}: ${statValueWithCommas}`}</div>
                        } />

                        </Grid.Column>

                    )
                })}
            <Grid.Column/>
        </Grid>
    )
}

export default Statistics;