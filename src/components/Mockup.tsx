import React from 'react';
import '../styles/mockup.scss';
function Mockup() {
  return (
    <div className="mockup">
      <div className="row">
        <div className="col p-10">
          <img src={process.env.PUBLIC_URL + '/mockup/mockup-player.svg'} alt="mockup" className="mockup-img mockup-player" />
        </div>
        <div className="col p-20">
          <img src={process.env.PUBLIC_URL + '/mockup/mockup-tools.svg'} alt="mockup" className="mockup-img mockup-tools" />
        </div>
      </div>
      <div className="row">
        <div className="col shadow-container">
          <div className="mockup-shadow mockup-player-shadow"></div>
        </div>
        <div className="col shadow-container">
          <div className="mockup-shadow mockup-tools-shadow"></div>
        </div>
      </div>
    </div>
  );
}

export default Mockup;
