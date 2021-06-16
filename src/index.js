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
// Clicking china, aus, canada, us causes a crash
// Clean up all warning

// Nice to have
// Some countries lack maps, possibly a way to fix this? If not no big deal
//    Possible solution: Tooltip text shows if map available, stats etc, if data available
//    Currently no data for : North Korea, turkmenistan, western sahara
