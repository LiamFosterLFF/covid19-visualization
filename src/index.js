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
// Add province functionality
// Probably some explanation of what is happening/can do
// Add map color legend
// Clean up all warning

// Nice to have
// Some way of scrolling back through the data - probably by clicking on chart
// Make app more performant so its not constantly pinging the server (useMemo)
// Pull all updating functionality out into a custom useeffect hook (call it useJHAPI or sth)
// Hover text on map? for name of country, possibly data as well
// Some countries lack maps, possibly a way to fix this? If not no big deal
//    Possible solution: Tooltip text shows if map available, stats etc, if data available
//    Currently no data for : North Korea, turkmenistan, western sahara