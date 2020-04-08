import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import styled from 'styled-components'
import { LineChart, Line } from 'recharts';
import Map from "./components/Map";

function App() {
  

  const Chart = styled.div`
  svg{ 
    position: relative;
    left: 850px;
    }
  }
  `;

  const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}, {name: 'Page B', uv: 300, pv: 2400, amt: 2400}, {name: 'Page C', uv: 200, pv: 2400, amt: 2400}, {name: 'Page D', uv: 300, pv: 2400, amt: 2400}, {name: 'Page E', uv: 200, pv: 2400, amt: 2400}]



  return (
    <div className="App">
      <Map />
      <Chart>
        {/* <LineChart width={400} height={400} data={data}>
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        </LineChart> */}
      </Chart>
    </div>
  );
}

export default App;
