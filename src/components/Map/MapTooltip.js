import React from "react";
import { Popup } from "semantic-ui-react";
import { capitalizeCountry } from "../../utilities";

const createMapTooltip = (country, province, mapStats) => {
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
          <div>Ten Days New Cases {formatNumbers(tenDaysNewInfections)}</div>
          <div>Rate of Change {rateOfChange.toFixed(2)}</div>
          {country === "world" ? <div>Click Country for More Details</div> : ""}
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

export default createMapTooltip;
