import React, { useEffect, useState } from "react";
import { Grid, Popup } from "semantic-ui-react";
import {
  getStatisticsFromData,
  capitalize,
  addCommasToNumber,
} from "../utilities";
const textColors = {
  confirmed: "#8884d8",
  recovered: "#54ed40",
  deaths: "#f72e2e",
};

const Statistics = ({ handleClick, data }) => {
  const [statistics, setStatistics] = useState({
    confirmed: 0,
    recovered: 0,
    deaths: 0,
  });
  useEffect(() => {
    setStatistics(getStatisticsFromData(data));
  }, [data]);

  const [hoveredStat, setHoveredStat] = useState("");
  const handleHover = (e) => {
    setHoveredStat(e.target.className.split(" ").slice(-1)[0]);
  };

  return (
    <Grid columns="5" divided>
      <Grid.Column />
      {Object.entries(statistics).map(([statName, statValue], index) => {
        const statNameCapitalized = capitalize(statName);
        const statValueWithCommas = addCommasToNumber(statValue);
        return (
          <Grid.Column
            key={index}
            width={3}
            className={statName}
            onClick={() => handleClick(statName)}
            onMouseEnter={(e) => handleHover(e)}
            onMouseLeave={() => setHoveredStat("")}
            style={{
              fontSize: hoveredStat === statName ? "large" : "medium",
              cursor: "pointer",
              textAlign: "center",
              color: textColors[statName],
            }}
          >
            <Popup
              content="Click to change daily chart contents"
              basic
              trigger={
                <div>{`${statNameCapitalized}: ${statValueWithCommas}`}</div>
              }
            />
          </Grid.Column>
        );
      })}
      <Grid.Column />
    </Grid>
  );
};

export default Statistics;
