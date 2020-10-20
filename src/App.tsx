import React from 'react';
import { Switch, Route } from 'react-router-dom';
import About from './components/About';
import NavBar from './components/NavBar';
import LinkForm from './components/LinkForm';
import VideoStudio from './components/VideoStudio';
function App() {
  return (
    <div className="App">
      <div className="page-wrapper with-navbar">
        <NavBar />

        <div className="content-wrapper">
          <Switch>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/link">
              <VideoStudio />
            </Route>
            <Route exact path="/">
              <LinkForm />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default App;
