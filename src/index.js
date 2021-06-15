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
// Make text on top prettier 
// Map should be all of color on main chart if no provincial data
// Need a cursor for chart and some sort of indicator of clickability
// Clean up all warning

// Nice to have
// Make app more performant so its not constantly pinging the server (useMemo)
// Pull all updating functionality out into a custom useeffect hook (call it useJHAPI or sth)
// Some countries lack maps, possibly a way to fix this? If not no big deal
//    Possible solution: Tooltip text shows if map available, stats etc, if data available
//    Currently no data for : North Korea, turkmenistan, western sahara
