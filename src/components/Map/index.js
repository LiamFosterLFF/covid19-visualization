import React, { useState, useEffect } from 'react';
import componentJsonDictionary from '../../topojsons/all-jsons.js';

import styled from 'styled-components'
import { VectorMap } from '@south-paw/react-vector-maps';
import countryNameDictionary from '../../countryNameDictionary.js';
import Rainbow from 'rainbowvis.js';



const Map = (props) => {

    const [ mapStats, setMapStats ] = useState({})

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

    // const sortDataByDate = (data) => {
    //     if (data) {
    //         // Takes data (time series object for chosen country) and turns into sorted array of form [[date, value],]
    //         return (Object.entries(data).sort((a, b) => {
    //             // Split date strings into segments, then sort by Y, M, D (US format dates)
    //             const [aArr, bArr] = [a[0].split('/'), b[0].split('/')]
    //             const checkingOrder = [2, 0, 1];
    //             for (let i = 0; i < checkingOrder.length; i++) {
    //                 const c = checkingOrder[i];
    //                 const [aVal, bVal] = [Number.parseInt(aArr[c]), Number.parseInt(bArr[c])]
    //                 if (aVal > bVal) {
    //                     return 1;
    //                 } else if (bVal > aVal) {
    //                     return -1;
    //                 }
    //             }
    //             return 0
    //         }))
    //     }
    // }
    // console.log(mapData);

    const onClick = ({ target }) => {
        const id = target.attributes.id.value;
        if (id in componentJsonDictionary) {
            props.setCountry(countryNameDictionary[id])
            setComponent(<VectorMap {...componentJsonDictionary[id]}/>)
        } else {
            
        }
    }

    const [component, setComponent] = useState(<VectorMap {...componentJsonDictionary["worldLowRes"]} layerProps={{ onClick }} />);
    

    
    const [ provinceColors, setProvinceColors ] = useState("");

    useEffect(() => {
        if (Object.keys(mapStats).length !== 0) {
            let newProvinceColors = "";

            // Invert dictionary to make lookup dictionary (Easier to lookup by IDs vs country names, b/c capitalization)
            const countryIdDictionary = {};
            for (let [key, value] of Object.entries(countryNameDictionary)) {
                countryIdDictionary[value] = key;
            }
            console.log(countryIdDictionary);

            // Set a custom color gradient from 0=green to 100=red
            const rainbow = new Rainbow();
            rainbow.setSpectrum('#2eff00', '#ff0000')

            Object.entries(mapStats).forEach(([provinceName, provinceStat]) => {
                const provinceId = countryIdDictionary[provinceName.toLowerCase()];
                console.log(provinceName, provinceId);
                if (provinceId !== undefined) { // Object is in dictionary (not a boat or small country etc)
                    const hue = rainbow.colourAt(Math.floor(provinceStat))
                    newProvinceColors += `&[id="${provinceId}"] {fill: #${hue}}`
                }
            })
            console.log(newProvinceColors);
            setProvinceColors(newProvinceColors)
        }
    }, [mapStats])
    // if ((props.country === "world") && (Object.keys(props.data).length !== 0)) { // Before data has loaded, object will be empty
    //     // console.log("a", props.country, props.data["world"][props.dataType].statistics, props.data);
        
    //     for (let [key, value] of Object.entries(props.data["world"][props.dataType].statistics)) { // Get statistics of recent deaths
    //         const id = countryIdDictionary[key];
    //         if (id !== undefined) { // Object is in dictionary (not a boat or small country etc)
                
    //             // Fill country with color going from green (low proportionate rise in cases) to red (high rise)
    //             // Percentage as a percentage of 30%, representing a doubling time of 2.5 days 
    //             const rise = (value.total > 0) ? ((value.increase/value.total) / .15) : 0; 

    //             // Set a custom color gradient from 0=green to 100=red
    //             const rainbow = new Rainbow();
    //             rainbow.setSpectrum('#2eff00', '#ff0000')
                
    //             let hueNo;
    //             if (props.dataType === "recovered") {
    //                 hueNo = 100 - rise*100;
    //             } else if (rise * 100 > 100) {
    //                 hueNo = 100;
    //             } else {
    //                 hueNo = rise * 100;
    //             }
                
    //             const hue = rainbow.colourAt(Math.floor(hueNo))
                
    //             provinceFills += `&[id="${id}"] {fill: #${hue}}`

    //         }
    //     }

    // }


    
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
    

    
    const backClick = () => {
        props.setCountry("world")
        setComponent(<VectorMap {...componentJsonDictionary["worldLowRes"]} layerProps={{ onClick }} />)
    }



    return (
        <div>
            <MapStyling>
                <button onClick={backClick}>World Map</button>
                {component}
            </MapStyling>

        </div>
    )
}

export default Map;