import React, { useState, useEffect } from 'react';
import componentJsonDictionary from '../topojsons/all-jsons.js'

import styled from 'styled-components'
import { VectorMap } from '@south-paw/react-vector-maps';
import countryNameDictionary from '../countryNameDictionary.js';

const Map = (props) => {
    
    // Make a lookup dictionary (Easier to lookup by IDs vs country names, b/c capitalization)
    const countryIdDictionary = {};
    for (let [key, value] of Object.entries(countryNameDictionary)) {
        countryIdDictionary[value] = key;
    }
    
    let provinceFills = "";
    if ((Object.keys(props.data).length !== 0)) { // Before data has loaded, object will be empty
        for (let [key, value] of Object.entries(props.data[props.dataType].statistics)) { // Get statistics of recent deaths
            const id = countryIdDictionary[key];
            if (id !== undefined) { // Object is in dictionary (not a boat or small country etc)
                // Fill country with color going from green (low proportionate rise in cases) to red (high rise)
                // Percentage as a percentage of 30%, representing a doubling time of 2.5 days 
                const rise = (value.increase/value.total) / .2; 
                // Starts from a high yellow to full red
                let hue = rise * 100;
                if (props.dataType !== "recovered") {
                    hue = 100 - (rise*100)
                } 
                console.log(props.dataType === "recovered");
                
                provinceFills += `&[id="${id}"] {fill: hsl(${hue}, 100%, 50%)}`

            }
        }

    }
    // const test = '&[id="br"] {fill: rgb(255, 0, 0)} &[aria-label="Argentina"] {fill: rgb(255, 0, 0)}'
    
    const MapStyling = styled.div`
    svg{ 
        stroke: #fff;
        fill: grey;
        height: 300px;
        position: relative;
        // top: 250px;
        // left: -450px;
        display: inline;

        path {
            ${provinceFills}
            &:hover {
                fill: rgb(249, 0, 0);
                cursor: pointer;
            }
        }
    }`;
    

    const onClick = ({ target }) => {
        const id = target.attributes.id.value;
        if (id in componentJsonDictionary) {
            props.setCountry(countryNameDictionary[id])
            setComponent(<VectorMap {...componentJsonDictionary[id]}/>)
        } else {
            
        }
    }

    const backClick = () => {
        props.setCountry("world")
        setComponent(<VectorMap {...componentJsonDictionary["worldLowRes"]} layerProps={{ onClick }} />)
    }


    const [component, setComponent] = useState(<VectorMap {...componentJsonDictionary["worldLowRes"]} layerProps={{ onClick }} />);

    return (
        <MapStyling>
            <button onClick={backClick}>World Map</button>
            {component}
        </MapStyling>
    )
}

export default Map;