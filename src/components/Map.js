import React, { useState, useEffect } from 'react';
import componentJsonDictionary from '../topojsons/all-jsons.js';

import styled from 'styled-components'
import { VectorMap } from '@south-paw/react-vector-maps';
import countryNameDictionary from '../countryNameDictionary.js';
import Rainbow from 'rainbowvis.js';



const Map = (props) => {
    const onClick = ({ target }) => {
        const id = target.attributes.id.value;
        if (id in componentJsonDictionary) {
            props.setCountry(countryNameDictionary[id])
            setComponent(<VectorMap {...componentJsonDictionary[id]}/>)
        } else {
            
        }
    }

    const [component, setComponent] = useState(<VectorMap {...componentJsonDictionary["worldLowRes"]} layerProps={{ onClick }} />);
    
    // Make a lookup dictionary (Easier to lookup by IDs vs country names, b/c capitalization)
    const countryIdDictionary = {};
    for (let [key, value] of Object.entries(countryNameDictionary)) {
        countryIdDictionary[value] = key;
    }
    
    let provinceFills = "";
    if ((props.country === "world") && (Object.keys(props.data).length !== 0)) { // Before data has loaded, object will be empty
        console.log("a", props.country, props.data["world"][props.dataType].statistics, props.data);
        
        for (let [key, value] of Object.entries(props.data["world"][props.dataType].statistics)) { // Get statistics of recent deaths
            const id = countryIdDictionary[key];
            if (id !== undefined) { // Object is in dictionary (not a boat or small country etc)
                
                // Fill country with color going from green (low proportionate rise in cases) to red (high rise)
                // Percentage as a percentage of 30%, representing a doubling time of 2.5 days 
                const rise = (value.total > 0) ? ((value.increase/value.total) / .15) : 0; 

                // Set a custom color gradient from 0=green to 100=red
                const rainbow = new Rainbow();
                rainbow.setSpectrum('#2eff00', '#ff0000')
                
                let hueNo;
                if (props.dataType === "recovered") {
                    hueNo = 100 - rise*100;
                } else if (rise * 100 > 100) {
                    hueNo = 100;
                } else {
                    hueNo = rise * 100;
                }
                
                const hue = rainbow.colourAt(Math.floor(hueNo))
                
                provinceFills += `&[id="${id}"] {fill: #${hue}}`

            }
        }

    }
    
    const MapStyling = styled.div`
    width: 50%;
    float: left;
    svg{ 
        stroke: #fff;
        fill: grey;
        margin: 0% 5% ;

        path {
            ${provinceFills}
            &:hover {
                fill: rgb(249, 0, 0);
                cursor: pointer;
            }
        }
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