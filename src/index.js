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
// Chart labels/titles
// Chart hover lines
// Chart cartesian grid
// Does clicking types actually change anything?
// Probably some explanation of what is happening/can do
// Add province functionality
// Fix broken/grey countries
// Add map color legend
// Add Semantic UI Grid
// Semantic UI some sort of flexbox on the top bits
// Clean up all warning

// Nice to have
// Some way of scrolling back through the data - probably by clicking on chart
// Make app more performant so its not constantly pinging the server (useMemo)
// Pull all updating functionality out into a custom useeffect hook (call it useJHAPI or sth)
// 