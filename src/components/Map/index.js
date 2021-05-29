import React, { useState, useEffect } from 'react';
import componentJsonDictionary from '../../topojsons/all-jsons.js';

import styled from 'styled-components'
import { VectorMap } from '@south-paw/react-vector-maps';
import countryNameDictionary from '../../countryNameDictionary.js';
import Rainbow from 'rainbowvis.js';

const Map = (props) => {

    const [ mapStats, setMapStats ] = useState({})
    const [ provinceColors, setProvinceColors ] = useState("");
    const [ map, setMap ] = useState(componentJsonDictionary["worldLowRes"]);

    const calculateMapStats = (countryData) => {
        const provinceStats = {};
        Object.entries(countryData).forEach(([provinceName, provinceData]) => {
            if (provinceData.confirmed) {
                const mostRecentTotal = provinceData.confirmed.slice(-1)[0][1];
                const tenDaysAgoTotal = provinceData.confirmed.slice(-10)[0][1];
                const numberOfNewInfections = mostRecentTotal - tenDaysAgoTotal
                const rateOfChange = (numberOfNewInfections)/mostRecentTotal;
                const maxRedValue = 20000;
                provinceStats[provinceName] = (rateOfChange*numberOfNewInfections)/(maxRedValue/100)
            }
        })
        return provinceStats;
    }

    useEffect(() => {
        setMapStats(calculateMapStats(props.data))
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
            fill: rgb(249, 0, 0);
            cursor: pointer;
        }
    }
    width: 50%;
    float: left;
    svg{ 
        stroke: #fff;
        fill: grey;
        margin: 0% 5% ;

        
    }`;

    return (
        <div>
            <MapStyling>
                <button onClick={backClick}>World Map</button>
                <VectorMap {...map} layerProps={{ onClick }} />
            </MapStyling>

        </div>
    )
}

export default Map;