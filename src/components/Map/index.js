import React, { useState, useEffect, useRef } from "react";
import componentJsonDictionary from "../../topojsons/all-jsons.js";

import MapStyling from "./MapStyling";
import createMapTooltip from "./MapTooltip.js";
import { VectorMap } from "@south-paw/react-vector-maps";
import countryNameDictionary from "../../countryNameDictionary.js";
import { Button, Grid, Popup, Header } from "semantic-ui-react";
import {
  preprocessProvincialData,
  getProcessedUSData,
  capitalizeCountry,
  calculateMapStats,
  getProvinceColors,
} from "../../utilities";

const Map = (props) => {
  const [mapStats, setMapStats] = useState({});
  const [provinceColors, setProvinceColors] = useState({
    default: "",
    provinces: "",
  });
  const [map, setMap] = useState(componentJsonDictionary["worldLowRes"]);

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipText, setToolTipText] = useState("");
  const tooltipRef = useRef();

  useEffect(() => {
    if (Object.entries(props.data).length > 0) {
      if (props.country === "world") {
        setMapStats(calculateMapStats(preprocessProvincialData(props.data)));
      } else if (props.country === "united states") {
        // Handle US Data separately, it's a whole different chart and so is only fetched when called here
        getProcessedUSData().then((rawData) => {
          setMapStats(calculateMapStats(rawData));
        });
      } else {
        setMapStats(calculateMapStats(props.data));
      }
    }
  }, [props.data, props.country]);

  useEffect(() => {
    if (Object.keys(mapStats).length !== 0) {
      setProvinceColors(
        getProvinceColors({
          currentCountry: props.country,
          mapStats,
          countryNameDictionary,
        })
      );
    }
  }, [mapStats, props.country]);

  const onClick = ({ target }) => {
    const id = target.attributes.id.value;
    if (id in componentJsonDictionary) {
      props.setCountry(countryNameDictionary[id]);
      setMap(componentJsonDictionary[id]);
    } else {
    }
  };

  const onMouseEnter = ({ target }) => {
    const hoveredCountry = target.attributes.name.value.toLowerCase();

    setTooltipOpen(false);
    setToolTipText(createMapTooltip(props.country, hoveredCountry, mapStats));
    setTooltipOpen(true);
    tooltipRef.current = target;
  };

  const onMouseLeave = () => {
    setTooltipOpen(false);
  };

  const backClick = () => {
    props.setCountry("world");
    setMap(componentJsonDictionary["worldLowRes"]);
  };

  return (
    <Grid.Column width={8}>
      <MapStyling colors={provinceColors}>
        <div>
          <Header as="h1" textAlign="center">
            {capitalizeCountry(props.country)}
          </Header>
          {props.country === "world" ? (
            <div></div>
          ) : (
            <Button onClick={backClick}>World Map</Button>
          )}
        </div>
        <VectorMap
          {...map}
          layerProps={{ onClick, onMouseEnter, onMouseLeave }}
        />
        <Popup
          basic
          context={tooltipRef}
          position="bottom center"
          onClose={() => setTooltipOpen(false)}
          open={tooltipOpen}
        >
          {tooltipText}
        </Popup>
      </MapStyling>
    </Grid.Column>
  );
};

export default Map;
