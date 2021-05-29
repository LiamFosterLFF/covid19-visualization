import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
    <App />,
  document.getElementById('root')
);



// Bugs
// Axes getting cut off on charts
// Colors are bad, should be infection as percent of pop
// Are totals getting calculated right? Above could be total-recovered as %pop
// Does not work for individual states, obviously kind of a crapshoot there but states should color when clicking country
// Check if new countries updated
// Label the things that are represented by map Colors
// Choices for map colorings?
// World map button should disappear
// CLean up layout with bootstrap
// Have things pop up on maps when hovering
// Responsivity with the design/resizing

// Nice to have
// Some way of scrolling back through the data
// Make app more performant so its not constantly pinging the server
// Pull all updating functionality out into a custom useeffect hook (call it useJHAPI or sth)