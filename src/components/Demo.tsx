import React from 'react';
import '../styles/demo.scss';
import { exampleVideos } from '../utils';
function Demo() {
  function generateVideoStyle(index: number): React.CSSProperties {
    let horProp = 'left';
    let vertProp = 'top';

    const ratio = Math.floor(Math.random() * 20);
    const catHor = Math.floor(Math.random() * 2);
    const catVert = Math.floor(Math.random() * 2);
    if (catHor % 2 === 0) {
      horProp = 'right';
    }

    if (catVert % 2 !== 0) {
      vertProp = 'bottom';
    }

    return {
      [horProp]: `${ratio * 10}px`,
      [vertProp]: `${ratio * 5}px`,
      transform: `scale(1.${ratio / 2})`,
      animationDelay: `${0.1 * ratio}s`,
    };
  }

  return (
    <div className="demo">
      {exampleVideos.map((video, index) => {
        return <div key={index} className="floating-video" style={generateVideoStyle(index)}></div>;
      })}
    </div>
  );
}

export default Demo;
