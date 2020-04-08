import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LineChart, Line } from 'recharts';

const TotalChart = ({data}) => {
    
    const ChartStyling = styled.div`
        svg{ 
            // display: inline;
            // top: 250px;
            // left: 850px;
            }
        }`;
    
    return (
      <ChartStyling>
        <LineChart width={400} height={400} data={data}>
          <Line type="monotone" dataKey="confirmed" stroke="#8884d8" />
        </LineChart>
      </ChartStyling>
    )
}

export default TotalChart;