import LinkForm from './LinkForm';
import React from 'react';
import '../styles/welcome.scss';
import Mockup from './Mockup';

function Welcome() {
  return (
    <div className="row container mt-0 mt-md-10 welcome full-height">
      <div className="col">
        <LinkForm />
      </div>
      <div className="col d-none d-lg-block">
        <Mockup />
      </div>
    </div>
  );
}

export default Welcome;
