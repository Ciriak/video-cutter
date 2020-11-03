import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import VideoStudio from './components/VideoStudio';
import ErrorAlert from './components/ErrorAlert';
import ConnectorManager from './components/ConnectorManager';
import { useTranslation } from 'react-i18next';
import Welcome from './components/Welcome';
function App() {
  //force focus on main input
  document.onclick = () => {
    const inp = document.getElementById('link-input');
    if (!inp) return;
    inp.focus();
  };

  const [t] = useTranslation();

  return (
    <>
      <ConnectorManager />
      <div className="App">
        <div className="page-wrapper with-navbar">
          <NavBar />

          <div className="content-wrapper">
            <ErrorAlert />

            <Switch>
              {/* <Route path="/about">
                <About />
              </Route> */}
              <Route path="/link">
                <VideoStudio />
              </Route>
              <Route exact path="/">
                <Welcome />
              </Route>
            </Switch>
          </div>
        </div>
        <footer>
          <span className="credits">
            {t('commons.madeBy')}{' '}
            <a href="https://cyriaque.net" rel="noopener noreferrer" target="_blank">
              Cyriaque Delaunay
            </a>
          </span>
        </footer>
      </div>
    </>
  );
}

export default App;
