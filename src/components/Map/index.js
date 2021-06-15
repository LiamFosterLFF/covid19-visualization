import React, { useState, useEffect, useRef } from 'react';
import componentJsonDictionary from '../../topojsons/all-jsons.js';

import styled from 'styled-components'
import { VectorMap } from '@south-paw/react-vector-maps';
import countryNameDictionary from '../../countryNameDictionary.js';
import Rainbow from 'rainbowvis.js';
import { Button, Grid, Popup } from 'semantic-ui-react'
import * as d3 from 'd3';

const MapStyling = styled.div`
    path {
        ${props => props.colors}
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


const Map = (props) => {

    const [ mapStats, setMapStats ] = useState({})
    const [ provinceColors, setProvinceColors ] = useState("");
    const [ map, setMap ] = useState(componentJsonDictionary["worldLowRes"]);

    const [ tooltipOpen, setTooltipOpen ] = useState(false)
    const [ tooltipText, setToolTipText ] = useState("")
    const tooltipRef = useRef()

    const calculateMapStats = (countryData) => {
        const provinceStats = {};
        Object.entries(countryData).forEach(([provinceName, provinceData]) => {
            if (provinceData.confirmed && provinceData.confirmed.length > 0) {
                const mostRecentTotal = provinceData.confirmed.slice(-1)[0][1];
                const tenDaysAgoTotal = provinceData.confirmed.slice(-10)[0][1];
                const numberOfNewInfections = mostRecentTotal - tenDaysAgoTotal;
                // Prevent divide by 0
                const rateOfChange = (mostRecentTotal==="0") ? 0 : (numberOfNewInfections)/(mostRecentTotal);
                const maxRedValue = 20000;
                provinceStats[provinceName] = {
                    mostRecentTotal,
                    tenDaysAgoTotal,
                    tenDaysNewInfections: numberOfNewInfections,
                    rateOfChange,
                    tooltipMapStat: rateOfChange * numberOfNewInfections,
                    mapColorStat: (rateOfChange*numberOfNewInfections)/(maxRedValue/100)
                }
            }
        })
        return provinceStats;
    }

    const getProcessedUSData = async () => {
        const getUSData = async () => {
            const rawData = await d3.csv(`https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv`)
            return rawData
          }
        
        const processUSData = (USData) => {
            // Need to clean the data a little bit, the dictionary keys don't match
            const processedData = {}
            USData.forEach((localDataSet) => {
                const stateName = `us, ${localDataSet["Province_State"]}`;
                const localData = Object.entries(localDataSet).filter(([key, entry]) => {
                    return !isNaN(key[0]) 
                })
                if (processedData[stateName]) {
                    localData.forEach((dataPoint, index) => {
                        const newTotal = Number.parseInt(processedData[stateName].confirmed[index][1]) + Number.parseInt(dataPoint[1]);
                        processedData[stateName].confirmed[index][1] = newTotal;
                    })
                } else {
                    processedData[stateName] = { confirmed: localData };
                }
            })
            return processedData
        }
        let processedData;
        await getUSData().then((data) => {
            processedData = processUSData(data)
        })
        return processedData;

    }

    const preprocessProvincialData = (countryData) => {
        // Three countries (aus, can, china) are special cases that do not have nationwide statistics - create these
            const specialCaseCountries = ["Australia", "China", "Canada"];
            specialCaseCountries.forEach((country) => {
                const nationwideData = {"confirmed": [], "recovered": [], "deaths": []}
                // Find all the provinces for that country
                Object.entries(countryData).forEach(([provinceName, provinceData]) => {
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
            })
        return countryData
    }

    useEffect(() => {
        if (Object.entries(props.data).length > 0) {
            if (props.country === "world") {
                setMapStats(calculateMapStats(preprocessProvincialData(props.data)))
            } else if (props.country === "us") {
                // Handle US Data separately, it's a whole different chart and so is only fetched when called here
                getProcessedUSData().then(rawData => {
                    setMapStats(calculateMapStats(rawData))
                })
            } else {
                setMapStats(calculateMapStats(props.data))
            }
        }
    }, [props.data, props.country])

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
                    const hue = rainbow.colourAt(Math.floor(provinceStat.mapColorStat))
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

    const onMouseEnter = ({ target }) => {
        const createTooltipContent = (country, province) =>{
            const { mostRecentTotal, tenDaysNewInfections, rateOfChange } = mapStats[province]
            return (<>
                <Popup.Header>{province}</Popup.Header>
                <Popup.Content>
                <div>Most Recent Total {mostRecentTotal}</div>
                <div>Ten Days New Cases {tenDaysNewInfections}</div>
                <div>Rate of Change {rateOfChange.toFixed(2)}</div>
                {(country === "world") ? <div>Click Country for More Details</div> : ""}
                </Popup.Content>
            </>)
        }
        const hoveredCountry = target.attributes.name.value
        if (mapStats[hoveredCountry]) {
            setTooltipOpen(false)
            setToolTipText(createTooltipContent(props.country, hoveredCountry));      
            setTooltipOpen(true)
            tooltipRef.current = target
        }
        
    }

    const onMouseLeave = () => {
        setTooltipOpen(false)
    }
    
    const backClick = () => {
        props.setCountry("world")
        setMap(componentJsonDictionary["worldLowRes"])
    }



    return (
        <Grid.Column width={8}>
            <MapStyling colors={provinceColors}>
                {(props.country === "world") ? <div></div> : <Button onClick={backClick}>World Map</Button>}
                <VectorMap {...map} layerProps={{ onClick, onMouseEnter, onMouseLeave }}/>
                <Popup basic context={tooltipRef} position='bottom center' onClose={() => setTooltipOpen(false)} open={tooltipOpen}>
                    {tooltipText}
                </Popup>
            </MapStyling>

        </Grid.Column>
    )
}

export default Map;