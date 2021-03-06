import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid , Legend, Tooltip, ResponsiveContainer } from 'recharts';

const TotalChart = ({ data, country, setDate }) => {

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



  const CustomTooltip = ({ active, payload, label }) => {
    const formatValue = (value) => {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{textAlign: "center", background: "rgba(255, 255, 255, 0.75)"}}>
          <div className="label">{`${label}`}</div>
          {payload.map((dataPoint, index) => {
            const dataType = dataPoint.name[0].toUpperCase() + dataPoint.name.slice(1);
            return <div className={dataType} key={index}> {`${dataType}: ${formatValue(dataPoint.value)}`} </div>
          })}
          <div className="desc">Click to set date back to {label}.</div>
        </div>
      );
    }
  
    return null;
  };


  const capitalizedCountry = country[0].toUpperCase() + country.slice(1)

  const handleSetDate = (e) => {
    if (e !== null) {
      setDate(e.activePayload[0].payload.date)
    }
  }

  return (
      <ResponsiveContainer height="50%">
        <AreaChart data={lineData} onClick={(e) => handleSetDate(e)} style={{"cursor": "pointer"}}>
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip content={<CustomTooltip/>} />
          <Legend verticalAlign="top" height={36}/>
          <XAxis dataKey="date" />
          <YAxis 
            tickFormatter={(tick) => handleTickFormat(tick)} 
            label={{ value: `Total Overall Cases (${capitalizedCountry})`, offset: 10, angle: -90, position: 'insideBottomLeft' }}
          /> 
          <Area type="monotone" dataKey="confirmed" stroke="#8884d8" fill="#8884d8"/>
          <Area type="monotone" dataKey="deaths" stroke="#f72e2e" fill="#f72e2e" />
          <Area type="monotone" dataKey="recovered" stroke="#54ed40" fill="#54ed40" />
        </AreaChart>
      </ResponsiveContainer>
  )
}

export default TotalChart;