/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./ProgressBar.css";

const ProgressBar = ({ phase = 1, deploymentId = null, onComplete = null }) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [progressText, setProgressText] = useState("배포 준비 중");
  const [targetProgress, setTargetProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Phase별 설정
  const getPhaseConfig = (phase) => {
    const allSteps = [
      { progress: 5, message: "코드 검사" },
      { progress: 10, message: "용량 확인" },
      { progress: 20, message: "의존성 설치" },
      { progress: 60, message: "코드 빌드" },
      { progress: 80, message: "배포 준비" },
      { progress: 100, message: "배포 완료" },
    ];

    switch (phase) {
      case 1:
        return {
          steps: allSteps.slice(0, 2), // 0, 1번 (코드검사, 용량확인)
          interval: 1500,
          startIndex: 0,
        };
      case 2:
        return {
          steps: allSteps.slice(2, 5), // 2, 3, 4번 (의존성~배포준비)
          interval: 8000,
          startIndex: 2,
        };
      case 3:
        return {
          steps: allSteps.slice(5, 6), // 5번 (배포완료)
          interval: 0,
          startIndex: 5,
        };
      default:
        return { steps: [], interval: 0, startIndex: 0 };
    }
  };

  // Phase별 진행
  useEffect(() => {
    const config = getPhaseConfig(phase);
    if (config.steps.length === 0) return;

    let stepIndex = 0;
    setCurrentStepIndex(config.startIndex);

    const runSteps = () => {
      if (stepIndex < config.steps.length) {
        const currentStep = config.steps[stepIndex];
        setTargetProgress(currentStep.progress); // 이게 바뀌면 아래 useEffect 작동
        setProgressText(currentStep.message);
        stepIndex++;

        if (stepIndex < config.steps.length && config.interval > 0) {
          setTimeout(runSteps, config.interval);
        } else if (phase === 3 && onComplete) {
          setTimeout(() => {
            onComplete();
          }, 2000);
        }
      }
    };

    runSteps();
  }, [phase, onComplete]);

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
  phase: PropTypes.number,
  deploymentId: PropTypes.string,
  onComplete: PropTypes.func,
};

export default ProgressBar;
