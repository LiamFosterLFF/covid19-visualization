import React, { useState, useEffect } from "react";

import TotalChart from "./TotalChart";
import DailyChart from "./DailyChart";

import { Grid, Button, Header } from "semantic-ui-react";

const Charts = ({ data, dataType, country, date, setDate, resetDate }) => {
  const [graphArrays, setGraphArrays] = useState({});

  const createGraphArrays = (countryData) => {
    // Combine the data for all provinces for given country, and produces an object the graphs can work with
    const graphArrays = { confirmed: [], recovered: [], deaths: [] };
    Object.entries(countryData).forEach(([provinceName, provinceData]) => {
      Object.entries(provinceData).forEach(([dataType, dataSet]) => {
        dataSet.forEach(([date, total], i) => {
          if (graphArrays[dataType][i]) {
            graphArrays[dataType][i] = {
              ...graphArrays[dataType][i],
              total: graphArrays[dataType][i].total + Number(total),
            };
          } else {
            graphArrays[dataType][i] = { date: date, total: Number(total) };
          }
        });
      });
    });

    return graphArrays;
  };

  useEffect(() => {
    setGraphArrays(createGraphArrays(data));
  }, [data]);

  const getFormattedDate = () => {
    const presentDateObj = new Date();
    const day = presentDateObj.getDate();
    const month = presentDateObj.getMonth() + 1;
    const year = presentDateObj.getFullYear().toString().slice(2);
    return `${month}/${day}/${year}`;
  };

  return (
    <Grid.Column className="charts" width={8} style={{ maxHeight: "50vh" }}>
      <Header as="h2" textAlign="center">
        Date: {date !== null ? date : getFormattedDate()}
      </Header>
      {date !== null ? (
        <Button onClick={() => resetDate()}>Revert to Present Date</Button>
      ) : (
        ""
      )}
      <TotalChart country={country} data={graphArrays} setDate={setDate} />
      <DailyChart
        country={country}
        data={graphArrays}
        dataType={dataType}
        setDate={setDate}
      />
    </Grid.Column>
  );
};

export default Charts;

// style = {{ width: "50%", float: "right", textAlign: "right"}}
