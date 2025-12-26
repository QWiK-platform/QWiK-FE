import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./ProgressBar.css";

const ProgressBar = ({
  targetProgress = 0,
  progressText = "progress text",
  duration = 1500,
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  // targetProgress가 변경될 때마다 부드럽게 애니메이션
  useEffect(() => {
    let startTime = null;
    let startValue = displayProgress;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (targetProgress - startValue) * easeOut;

      setDisplayProgress(Math.round(currentValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    if (targetProgress !== displayProgress) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [targetProgress, duration]);

  return (
    <div className="progress-component">
      <div className="progress-container">
        <div className="text-box">
          <p className="progress-text">{progressText}</p>
          <p className="percent-num eng">{displayProgress}%</p>
        </div>
        <div className="progress-bar">
          <div
            className="fill"
            style={{
              width: `${displayProgress}%`,
              transition: "width 0.1s ease-out",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  targetProgress: PropTypes.number,
  progressText: PropTypes.string,
  duration: PropTypes.number,
};

export default ProgressBar;
