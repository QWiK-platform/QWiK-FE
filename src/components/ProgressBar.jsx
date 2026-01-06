import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./ProgressBar.css";

const ProgressBar = ({ mockMode = true }) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [progressText, setProgressText] = useState("배포 준비 중");
  const [targetProgress, setTargetProgress] = useState(0);

  // 단계별 진행
  useEffect(() => {
    if (!mockMode) return;

    const steps = [
      { progress: 5, message: "코드 검사" },
      { progress: 10, message: "용량 확인" },
      { progress: 20, message: "의존성 설치" },
      { progress: 60, message: "코드 빌드" },
      { progress: 80, message: "배포 준비" },
      { progress: 100, message: "배포 완료" },
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setTargetProgress(steps[currentStep].progress);
        setProgressText(steps[currentStep].message);
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [mockMode]);

  // 숫자 부드럽게 애니메이션
  useEffect(() => {
    let startTime = null;
    let startValue = displayProgress;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / 1500, 1); // 1.5초 애니메이션

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
  }, [targetProgress]); // displayProgress 의존성 제거

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
              width: `${displayProgress}%`, // 숫자와 동기화
              transition: "none", // JS 애니메이션 사용
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  mockMode: PropTypes.bool,
};

export default ProgressBar;
