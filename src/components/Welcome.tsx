import LinkForm from './LinkForm';
import React from 'react';
import '../styles/welcome.scss';

function Welcome() {
  return (
    <div className="row container p-20 welcome">
      <div className="col-12 col-lg-6 offset-0 offset-lg-3">
        <LinkForm />
      </div>
    </div>
  );
}

export default Welcome;
