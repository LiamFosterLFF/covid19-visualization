import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BarChart, Bar } from 'recharts';
import XAxis from 'recharts/lib/cartesian/XAxis';
import YAxis from 'recharts/lib/cartesian/YAxis';

const DailyChart = (props) => {
  let chartData = {};

  if (Object.keys(props.data).length !== 0) {
    chartData = props.data[props.dataType].graphArray
  }


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