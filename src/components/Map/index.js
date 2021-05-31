import React, { useState, useEffect } from 'react';
import componentJsonDictionary from '../../topojsons/all-jsons.js';

import styled from 'styled-components'
import { VectorMap } from '@south-paw/react-vector-maps';
import countryNameDictionary from '../../countryNameDictionary.js';
import Rainbow from 'rainbowvis.js';
import { Button, Grid } from 'semantic-ui-react'

const Map = (props) => {

    const [ mapStats, setMapStats ] = useState({})
    const [ provinceColors, setProvinceColors ] = useState("");
    const [ map, setMap ] = useState(componentJsonDictionary["worldLowRes"]);

    const calculateMapStats = (countryData) => {
        const provinceStats = {};
        console.log(countryData);
        Object.entries(countryData).forEach(([provinceName, provinceData]) => {
            if (provinceData.confirmed) {
                const mostRecentTotal = provinceData.confirmed.slice(-1)[0][1];
                const tenDaysAgoTotal = provinceData.confirmed.slice(-10)[0][1];
                const numberOfNewInfections = mostRecentTotal - tenDaysAgoTotal;
                const rateOfChange = (numberOfNewInfections)/mostRecentTotal;
                const maxRedValue = 20000;
                provinceStats[provinceName] = (rateOfChange*numberOfNewInfections)/(maxRedValue/100)
            }
        })
        return provinceStats;
    }

    const preprocessData = (countryData) => {
        // Three countries (aus, can, china) are special cases that do not have nationwide statistics - create these
        if (props.country === "world") {
            const specialCaseCountries = ["Australia", "China", "Canada"];
            specialCaseCountries.forEach((country) => {
                const nationwideData = {"confirmed": [], "recovered": [], "deaths": []}
                // Find all the provinces for that country
                Object.entries(countryData).filter(([provinceName, provinceData]) => {
                    if (provinceName.split(',')[0] === country) {
                        // Cycle through datasets and combine them
                        Object.entries(provinceData).forEach(([dataType, dataSet]) => {
                            for (let i = 0; i < dataSet.length; i++) {
                                // Push in item from dataset if no point yet exists, else add totals together
                                const dataPoint = nationwideData[dataType][i]
                                if (dataPoint) {
                                    const newTotal = Number.parseInt(nationwideData[dataType][i][1]) + Number.parseInt(dataSet[i][1]);
                                    nationwideData[dataType][i][1] = newTotal;
                                } else {
                                    nationwideData[dataType].push(dataSet[i])
                                }
                            }
                        })
                    }
                })
                countryData[country] = nationwideData
                console.log(country, nationwideData, countryData);
            })
        }

        return countryData
    }

    useEffect(() => {
        if (Object.entries(props.data).length > 0) {
            setMapStats(calculateMapStats(preprocessData(props.data)))
        }
    }, [props.data])

    useEffect(() => {
        if (Object.keys(mapStats).length !== 0) {
            let newProvinceColors = "";

            // Invert dictionary to make lookup dictionary (Easier to lookup by IDs vs country names, b/c capitalization)
            const countryIdDictionary = {};
            for (let [key, value] of Object.entries(countryNameDictionary)) {
                countryIdDictionary[value] = key;
            }

            // Set a custom color gradient from 0=green to 100=red
            const rainbow = new Rainbow();
            rainbow.setSpectrum('#29e229', '#ddd623', '#e72a2a')

            Object.entries(mapStats).forEach(([provinceName, provinceStat]) => {
                const provinceId = countryIdDictionary[provinceName.toLowerCase()];
                if (provinceId !== undefined) { // Object is in dictionary (not a boat or small country etc)
                    const hue = rainbow.colourAt(Math.floor(provinceStat))
                    newProvinceColors += `&[id="${provinceId}"] {fill: #${hue}}`
                }
            })
            setProvinceColors(newProvinceColors)
        }
    }, [mapStats])

    const onClick = ({ target }) => {
        const id = target.attributes.id.value;
        if (id in componentJsonDictionary) {
            props.setCountry(countryNameDictionary[id])
            setMap(componentJsonDictionary[id])
        } else {
            
        }
    }
    
    const backClick = () => {
        props.setCountry("world")
        setMap(componentJsonDictionary["worldLowRes"])
    }

    const MapStyling = styled.div`
    path {
        ${provinceColors}
        &:hover {
            opacity: 0.5;
            cursor: pointer;
        }
    }
    svg { 
        stroke: #fff;
        fill: grey;
        margin: 0% 5% ;
    }
`;

    return (
        <Grid.Column width={8}>
            <MapStyling>
                {(props.country === "world") ? <div></div> : <Button onClick={backClick}>World Map</Button>}
                <VectorMap 
                    {...map} 
                    layerProps={{ onClick }} 
                />
            </MapStyling>

        </Grid.Column>
    )
}

export default Map;
