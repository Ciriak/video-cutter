import React from 'react';
import ReactDOM from 'react-dom';
import './style.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import halfmoon from 'halfmoon';
import { BrowserRouter as Router } from 'react-router-dom';
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

halfmoon.onDOMContentLoaded();
halfmoon.toggleDarkMode();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
