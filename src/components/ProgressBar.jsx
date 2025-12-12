import React from "react";
import "./ProgressBar.css";

const ProgressBar = () => {
  return (
    <div className="progress-component">
      <div className="progress-container">
        <div className="text-box">
          <p className="progress-text">progress text</p>
          <p className="percent-num eng">NN%</p>
        </div>
        <div className="progress-bar">
          <div className="fill"></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
