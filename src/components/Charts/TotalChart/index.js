import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  formatTicks,
  capitalizeCountry,
  getLineData,
} from "../../../utilities";
import TotalChartTooltip from "./TotalChartTooltip";

const TotalChart = ({ data, country, setDate }) => {
  // Combine all three dataTypes into single items with all three values
  const [lineData, setLineData] = useState([]);
  useEffect(() => {
    if (Object.keys(data).length !== 0) {
      setLineData(getLineData(data));
    }
  }, [data]);

  const capitalizedCountry = capitalizeCountry(country);

  const handleSetDate = (e) => {
    if (e !== null) {
      setDate(e.activePayload[0].payload.date);
    }
  };

  return (
    <ResponsiveContainer height="50%">
      <AreaChart
        data={lineData}
        onClick={(e) => handleSetDate(e)}
        style={{ cursor: "pointer" }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip content={<TotalChartTooltip />} />
        <Legend verticalAlign="top" height={36} />
        <XAxis dataKey="date" />
        <YAxis
          tickFormatter={(tick) => formatTicks(tick)}
          label={{
            value: `Total Overall Cases (${capitalizedCountry})`,
            offset: 10,
            angle: -90,
            position: "insideBottomLeft",
          }}
        />
        <Area
          type="monotone"
          dataKey="confirmed"
          stroke="#8884d8"
          fill="#8884d8"
        />
        <Area
          type="monotone"
          dataKey="deaths"
          stroke="#f72e2e"
          fill="#f72e2e"
        />
        <Area
          type="monotone"
          dataKey="recovered"
          stroke="#54ed40"
          fill="#54ed40"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TotalChart;
