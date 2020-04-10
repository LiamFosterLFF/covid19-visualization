import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AreaChart, Area, XAxis, YAxis } from 'recharts';

const TotalChart = (props) => {
  let lineData;
  if (Object.keys(props.data).length !== 0) {
    lineData = [...props.data.confirmed.graphArray]
    
    
    for (let i = 0; i < lineData.length; i++) {
      lineData[i]["deaths"] = props.data.deaths.graphArray[i].total
      lineData[i]["recovered"] = props.data.recovered.graphArray[i].total
    }
  }
  
  
  const ChartStyling = styled.div`
      svg{ 
          // height: 50%;
          // display: inline;
          // top: 250px;
          // left: 850px;
          }
      }`;
  
  return (
    <ChartStyling>
      <AreaChart width={600} height={200} data={lineData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Area type="monotone" dataKey="total" stroke="#8884d8" fill="#8884d8"/>
        <Area type="monotone" dataKey="deaths" stroke="#f72e2e" fill="#f72e2e" />
        <Area type="monotone" dataKey="recovered" stroke="#54ed40" fill="#54ed40" />
      </AreaChart>
    </ChartStyling>
  )
}

export default TotalChart;