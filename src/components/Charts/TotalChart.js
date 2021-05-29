import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid , Legend, Tooltip } from 'recharts';

const TotalChart = ({ data }) => {

  // Combine all three dataTypes into single items with all three values
  const [ lineData, setLineData ] = useState([])
  useEffect(() => {
    if (Object.keys(data).length !== 0) {
      const ld = []
      for (let i = 0; i < data["confirmed"].length; i++) {
        ld.push({
          "date": data["confirmed"][i].date,
          "confirmed": data["confirmed"][i].total,
          "recovered": data["recovered"][i].total,
          "deaths": data["deaths"][i].total,
        });
      }
      setLineData(ld)
    }
  }, [data])

  const handleTickFormat = (number) => {
    return (number/1000000).toString() + 'M';
  }

  const handleTooltipFormat = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip formatter={(value) => handleTooltipFormat(value)}/>
        <Legend verticalAlign="top" height={36}/>
        <XAxis dataKey="date" />
        <YAxis 
          tickFormatter={(tick) => handleTickFormat(tick)} 
          label={{ value: "Total Overall Cases", offset: 10, angle: -90, position: 'insideBottomLeft' }}
        /> 
        <Area type="monotone" dataKey="confirmed" stroke="#8884d8" fill="#8884d8"/>
        <Area type="monotone" dataKey="deaths" stroke="#f72e2e" fill="#f72e2e" />
        <Area type="monotone" dataKey="recovered" stroke="#54ed40" fill="#54ed40" />
      </AreaChart>
    </ChartStyling>
  )
}

export default TotalChart;