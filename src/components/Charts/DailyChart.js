import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, CartesianGrid } from 'recharts';
import XAxis from 'recharts/lib/cartesian/XAxis';
import YAxis from 'recharts/lib/cartesian/YAxis';

const DailyChart = ({ data, dataType }) => {
  const [ chartData, setChartData ]  = useState({});
  console.log(data, chartData);
  const calculateDailyIncrease = (data) => {
    const dailyIncrease = [];
    if (data.length > 0) {
      // Calculates the change between totals each day
      // First one starts from 0 so just push the total
      dailyIncrease.push({"date": data[0].date, "increase": Number.parseInt(data[0].total)})
      for (let i = 1; i < data.length; i++) {
        const increase = Number.parseInt(data[i].total) - Number.parseInt(data[i-1].total);
        if (increase > 0) {
          dailyIncrease.push({"date": data[i].date, "increase": increase})
        }
      }
    }
    return dailyIncrease
  }

  useEffect(() => {
    if (Object.keys(data).length !== 0) {
      setChartData(calculateDailyIncrease(data[dataType]));
    }
  }, [data, dataType])

  const handleTickFormat = (number) => {
    if (number > 1000000) {
      return (number/1000000).toString() + 'M';
    } else if (number > 1000) {
      return (number/1000).toString() + 'K';
    } else {
      return number.toString();
    }
  }

  const ChartStyling = styled.div`
      svg{ 
          // height: 50%;
          // display: inlin;
          // top: 250px;
          // left: 850px;
          }
      }`;

  const yAxisDict = {
    "confirmed": "New Confirmed Cases",
    "recovered": "Daily Recovered",
    "deaths": "Daily Deceased",
  }
  
  return (
    <div>
      {/* <h3>Title</h3> */}
      <ChartStyling>
        <BarChart width={600} height={200} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis 
            tickFormatter={(tick) => handleTickFormat(tick)}
            label={{ value: yAxisDict[dataType], offset: 15, angle: -90, position: 'insideBottomLeft' }}
          />
          <Bar barSize={10} dataKey="increase" fill="#8884d8" />
        </BarChart>
      </ChartStyling>
    </div>
  )
}

export default DailyChart;