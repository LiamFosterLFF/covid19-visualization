import React, { useState, useEffect } from 'react';
import { BarChart, Bar, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import XAxis from 'recharts/lib/cartesian/XAxis';
import YAxis from 'recharts/lib/cartesian/YAxis';

const DailyChart = ({ data, dataType, country, setDate }) => {
  const [ chartData, setChartData ]  = useState([]);
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

  const yAxisDict = {
    "confirmed": `New Confirmed Cases (${capitalizedCountry})`,
    "recovered": `Daily Recovered (${capitalizedCountry})`,
    "deaths": `Daily Deceased (${capitalizedCountry})`,
  }

  
  
  return (
    <ResponsiveContainer height="50%">
      <BarChart data={chartData} onClick={(e) => setDate(e.activePayload[0].payload.date)} style={{"cursor": "pointer"}}>
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip content={<CustomTooltip/>} />
        <XAxis dataKey="date" />
        <YAxis 
          tickFormatter={(tick) => handleTickFormat(tick)}
          label={{ value: yAxisDict[dataType], offset: 15, angle: -90, position: 'insideBottomLeft' }}
        />
        <Bar barSize={10} dataKey="increase" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default DailyChart;