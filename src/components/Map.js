import React, { useState, useEffect } from 'react';
import componentJsonDictionary from '../topojsons/all-jsons.js'

import styled from 'styled-components'
import { VectorMap } from '@south-paw/react-vector-maps';

const Map = (props) => {

    
    const MapStyling = styled.div`
    svg{ 
        stroke: #fff;
        fill: rgb(29, 255, 0);
        height: 400px;
        position: relative;
        // top: 250px;
        // left: -450px;

        path {
        &:hover {
            fill: rgb(249, 0, 0);
            cursor: pointer;
        }
        }
    }`;
    

    const onClick = ({ target }) => {
        const id = target.attributes.id.value;
        if (id in componentJsonDictionary) {
            setComponent(<VectorMap {...componentJsonDictionary[id]}/>)
        } else {
            
        }
    }

    const backClick = () => {
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