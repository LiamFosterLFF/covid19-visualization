import React, { useState, useEffect, useRef } from "react";
import componentJsonDictionary from "../../topojsons/all-jsons.js";

import styled from "styled-components";
import { VectorMap } from "@south-paw/react-vector-maps";
import countryNameDictionary from "../../countryNameDictionary.js";
import Rainbow from "rainbowvis.js";
import { Button, Grid, Popup, Header } from "semantic-ui-react";
import {
  preprocessProvincialData,
  getProcessedUSData,
  capitalizeCountry,
  calculateMapStats,
} from "../../utilities";

const MapStyling = styled.div`
  path {
    ${(props) => props.colors.provinces}
    &:hover {
      opacity: 0.5;
      cursor: pointer;
    }
  }
  svg {
    stroke: #fff;
    fill: ${(props) => props.colors.default};
    margin: 0% 5%;
  }
`;

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
      let newProvinceColors = "";

      // Invert dictionary to make lookup dictionary (Easier to lookup by IDs vs country names, b/c capitalization)
      const countryIdDictionary = {};
      for (let [key, value] of Object.entries(countryNameDictionary)) {
        countryIdDictionary[value] = key;
      }

      // Set a custom color gradient from 0=green to 100=red
      const rainbow = new Rainbow();
      rainbow.setSpectrum("#29e229", "#ddd623", "#e72a2a");
      const defaultColorCountries = [
        "world",
        "canada",
        "australia",
        "china",
        "united states",
      ];
      const defaultColor = defaultColorCountries.includes(props.country)
        ? "grey"
        : "#" +
          rainbow.colourAt(Math.floor(mapStats[props.country].mapColorStat));
      Object.entries(mapStats).forEach(([provinceName, provinceStat]) => {
        const provinceId = countryIdDictionary[provinceName.toLowerCase()];
        if (provinceId !== undefined) {
          // Object is in dictionary (not a boat or small country etc)
          const hue = rainbow.colourAt(Math.floor(provinceStat.mapColorStat));
          newProvinceColors += `&[id="${provinceId}"] {fill: #${hue}}`;
        }
      });
      setProvinceColors({
        default: defaultColor,
        provinces: newProvinceColors,
      });
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
    const createTooltipContent = (country, province) => {
      const formatNumbers = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      };
      if (mapStats[province]) {
        const { mostRecentTotal, tenDaysNewInfections, rateOfChange } =
          mapStats[province];
        return (
          <>
            <Popup.Header>{capitalizeCountry(province)}</Popup.Header>
            <Popup.Content>
              <div>Most Recent Total {formatNumbers(mostRecentTotal)}</div>
              <div>
                Ten Days New Cases {formatNumbers(tenDaysNewInfections)}
              </div>
              <div>Rate of Change {rateOfChange.toFixed(2)}</div>
              {country === "world" ? (
                <div>Click Country for More Details</div>
              ) : (
                ""
              )}
            </Popup.Content>
          </>
        );
      } else {
        return (
          <>
            <Popup.Header>{capitalizeCountry(province)}</Popup.Header>
            <Popup.Content>
              <div>No Data Available</div>
            </Popup.Content>
          </>
        );
      }
    };
    const hoveredCountry = target.attributes.name.value.toLowerCase();

    setTooltipOpen(false);
    setToolTipText(createTooltipContent(props.country, hoveredCountry));
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
