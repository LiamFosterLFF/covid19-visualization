import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BarChart, Bar } from 'recharts';
import XAxis from 'recharts/lib/cartesian/XAxis';
import YAxis from 'recharts/lib/cartesian/YAxis';

const DailyChart = ({ data, dataType }) => {
  const [ chartData, setChartData ]  = useState({});

  const calculateDailyIncrease = (data) => {
    // Calculates the change between totals each day
    const dailyIncrease = [];
    for (let i = 1; i < data.length; i++) {
      const increase = Number.parseInt(data[i].total) - Number.parseInt(data[i-1].total);
      dailyIncrease.push({"date": data[i].date, "increase": increase})
    }
    return dailyIncrease
  }

  useEffect(() => {
    if (Object.keys(data).length !== 0) {
      setChartData(calculateDailyIncrease(data[dataType]));
    }
  }, [data])

  const ChartStyling = styled.div`
      svg{ 
          // height: 50%;
          // display: inlin;
          // top: 250px;
          // left: 850px;
          }
      }`;
  
  return (
    <ChartStyling>
      <BarChart width={600} height={200} data={chartData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Bar barSize={10} dataKey="increase" fill="#8884d8" />
      </BarChart>
    </ChartStyling>
  )
}

export default DailyChart;