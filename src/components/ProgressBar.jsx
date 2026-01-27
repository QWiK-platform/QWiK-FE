import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import "./ProgressBar.css";

const ProgressBar = ({
  phase = 1,
  deploymentId = null,
  deployStatus = null,
  domainReady = false,
  onComplete = null,
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [progressText, setProgressText] = useState("배포 준비 중");
  const [targetProgress, setTargetProgress] = useState(0);
  const [buildingStartTime, setBuildingStartTime] = useState(null);
  const [buildingTimer, setBuildingTimer] = useState(null);

  // 단계별 진행률 매핑
  const getProgressByStatus = useCallback((status) => {
    const statusMap = {
      Queued: { progress: 20, message: "빌드 대기" },
      Building: { progress: 40, message: "의존성 설치" },
      Success: { progress: 90, message: "도메인 등록" },
      Failed: { progress: 0, message: "빌드 실패" },
    };
    return statusMap[status] || { progress: 0, message: "준비 중" };
  }, []);

  // Phase 1: 초기 단계
  useEffect(() => {
    if (phase === 1) {
      setTargetProgress(5);
      setProgressText("레포지토리 검사");

      const timer = setTimeout(() => {
        setTargetProgress(10);
        setProgressText("용량 검사");
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Phase 2: deployment ID 받음
  useEffect(() => {
    if (phase === 2 && deploymentId) {
      setTargetProgress(15);
      setProgressText("작업 대기 등록");
    }
  }, [phase, deploymentId]);

  // Phase 3: 실제 배포 진행
  useEffect(() => {
    if (phase === 3 && deployStatus) {
      const statusInfo = getProgressByStatus(deployStatus);

      switch (deployStatus) {
        case "Queued":
          setTargetProgress(statusInfo.progress);
          setProgressText(statusInfo.message);
          break;

        case "Building":
          if (!buildingStartTime) {
            setBuildingStartTime(Date.now());
            setTargetProgress(40);
            setProgressText("의존성 설치");

            const timer = setTimeout(() => {
              setTargetProgress(80);
              setProgressText("코드 빌드");
            }, 4000);

            setBuildingTimer(timer);
          }
          break;

        case "Success":
          if (buildingTimer) {
            clearTimeout(buildingTimer);
            setBuildingTimer(null);
          }
          setTargetProgress(90);
          setProgressText("도메인 등록");
          break;

        case "Failed":
          setProgressText("빌드 실패");
          // TODO: 나중에 에러 메시지 받으면 처리
          break;

        default:
          console.warn(`알 수 없는 상태: ${deployStatus}`);
          break;
      }
    }
  }, [phase, deployStatus, buildingStartTime, getProgressByStatus]);

  // 도메인 준비 완료
  useEffect(() => {
    if (domainReady) {
      setTargetProgress(100);
      setProgressText("배포 완료");

      const completeTimer = setTimeout(() => {
        onComplete?.();
      }, 1000);

      return () => clearTimeout(completeTimer);
    }
  }, [domainReady, onComplete]);

  // 부드러운 애니메이션
  useEffect(() => {
    let startTime = null;
    let startValue = displayProgress;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / 1500, 1);

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
  }, [targetProgress]);

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
              transition: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  phase: PropTypes.number,
  deploymentId: PropTypes.string,
  deployStatus: PropTypes.string,
  domainReady: PropTypes.bool,
  onComplete: PropTypes.func,
};

export default ProgressBar;
