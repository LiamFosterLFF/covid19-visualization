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
// No label on charts
// Does not work for individual states, obviously kind of a crapshoot there but states should color when clicking country
// Check if new countries updated
// Label the things that are represented by map Colors
// World map button should disappear
// CLean up layout with bootstrap
// Have things pop up on maps when hovering
// Responsivity with the design/resizing
// Clean up all warning

// Nice to have
// Some way of scrolling back through the data
// Make app more performant so its not constantly pinging the server
// Pull all updating functionality out into a custom useeffect hook (call it useJHAPI or sth)
//