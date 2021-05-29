import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import './index.css';
import 'semantic-ui-css/semantic.min.css'

ReactDOM.render(
    <App />,
  document.getElementById('root')
);



// Bugs 
// Probably some explanation of what is happening/can do
// Add map color legend
// Add province functionality
// Fix broken/grey countries
// Add a breakpoint for charts and map
// Clean up all warning

// Nice to have
// Some way of scrolling back through the data - probably by clicking on chart
// Make app more performant so its not constantly pinging the server (useMemo)
// Pull all updating functionality out into a custom useeffect hook (call it useJHAPI or sth)
// 