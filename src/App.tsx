import React, { useEffect } from 'react';
import NavBar from './components/NavBar';
import VideoStudio from './components/VideoStudio';
import ErrorAlert from './components/ErrorAlert';
import Welcome from './components/Welcome';
import halfmoon from 'halfmoon';
import Footer from './components/Footer';
import { useTranslation } from 'react-i18next';
import useJob from './hooks/useJob';

const socialIntensiveDelay = 30000;

function App() {
  const [t] = useTranslation();
  const { job } = useJob();

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
            {job.file && <VideoStudio />}
            {!job.file && <Welcome />}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
