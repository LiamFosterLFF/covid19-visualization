import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BarChart, Bar } from 'recharts';

const DailyChart = (props) => {
  let chartData = {};

  if (Object.keys(props.data).length !== 0) {
    chartData = props.data[props.dataType].graphArray
  }


  const ChartStyling = styled.div`
      svg{ 
          // display: inline;
          // top: 250px;
          // left: 850px;
          }
      }`;
  
  return (
    <ChartStyling>
      <BarChart width={400} height={400} data={chartData}>
        <Bar barSize={10} dataKey="increase" fill="#8884d8" />
      </BarChart>
    </ChartStyling>
  )
}

export default DailyChart;