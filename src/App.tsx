import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import VideoStudio from './components/VideoStudio';
import ErrorAlert from './components/ErrorAlert';
import Welcome from './components/Welcome';
import useConnector from './hooks/useConnector';
import store from './store';
import halfmoon from 'halfmoon';
import Footer from './components/Footer';
import { useTranslation } from 'react-i18next';

const socialIntensiveDelay = 30000;

function App() {
  store.connector = useConnector();
  const [t] = useTranslation();

  useEffect(() => {
    setTimeout(() => {
      showSocialIntensive();
    }, socialIntensiveDelay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Display an alert
   */
  function showSocialIntensive() {
    // Built-in function
    halfmoon.initStickyAlert({
      title: t('commons.socialIntensiveTitle'),
      content: t('commons.socialIntensiveContent'),
      timeShown: 30000,
    });
  }

  return (
    <>
      {/* <ConnectorManager /> */}
      <div className="App">
        <div className="page-wrapper with-navbar">
          <NavBar />
          <div className="sticky-alerts"></div>
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
        <Footer />
      </div>
    </>
  );
}

export default App;
