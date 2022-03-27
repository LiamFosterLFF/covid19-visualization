import React, { useState, useEffect } from "react";

import TotalChart from "./TotalChart";
import DailyChart from "./DailyChart";

import { Grid, Button, Header } from "semantic-ui-react";
import { getFormattedDate, createGraphArrays } from "../../utilities";

const Charts = ({ data, dataType, country, date, setDate, resetDate }) => {
  const [graphArrays, setGraphArrays] = useState({});

  useEffect(() => {
    setGraphArrays(createGraphArrays(data));
  }, [data]);

  console.log(getFormattedDate());

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
