import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import XAxis from "recharts/lib/cartesian/XAxis";
import YAxis from "recharts/lib/cartesian/YAxis";
import DailyChartTooltip from "./DailyChartTooltip";
import {
  calculateDailyIncrease,
  formatTicks,
  capitalizeCountry,
} from "../../../utilities";

const yAxisDict = {
  confirmed: `New Confirmed Cases`,
  recovered: `Daily Recovered`,
  deaths: `Daily Deceased`,
};

const DailyChart = ({ data, dataType, country, setDate }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (Object.keys(data).length !== 0) {
      setChartData(calculateDailyIncrease(data[dataType]));
    }
  }, [data, dataType]);

  const capitalizedCountry = capitalizeCountry(country);

  const handleSetDate = (e) => {
    if (e !== null) {
      setDate(e.activePayload[0].payload.date);
    }
  };

  return (
    <ResponsiveContainer height="50%">
      <BarChart
        data={chartData}
        onClick={(e) => handleSetDate(e)}
        style={{ cursor: "pointer" }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip content={<DailyChartTooltip />} />
        <XAxis dataKey="date" />
        <YAxis
          tickFormatter={(tick) => formatTicks(tick)}
          label={{
            value: `${yAxisDict[dataType]} (${capitalizedCountry})`,
            offset: 15,
            angle: -90,
            position: "insideBottomLeft",
          }}
        />
        <Bar barSize={10} dataKey="increase" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DailyChart;
