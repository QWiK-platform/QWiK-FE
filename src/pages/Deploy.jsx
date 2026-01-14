import React, { useState, useEffect } from "react";
import "./Deploy.css";
import client from "../api/client";
import ProgressBar from "../components/ProgressBar";

const Deploy = () => {
  // 핵심 상태만 남기기
  const [step, setStep] = useState(1); // 1: 입력, 2: 진행, 3: 완료
  const [repositoryUrl, setRepositoryUrl] = useState("");

  // 배포 관련 상태
  const [deploymentId, setDeploymentId] = useState(null);
  const [deployStatus, setDeployStatus] = useState(null);
  const [domain, setDomain] = useState(null);
  const [domainReady, setDomainReady] = useState(false);
  const [projectId, setProjectId] = useState(null);

  // 진행 상태
  const [currentPhase, setCurrentPhase] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");

  // 폴링 정리용
  useEffect(() => {
    let pollingInterval = null;
    let domainInterval = null;

    // deploymentId가 있고 success가 아닐 때만 폴링
    if (
      deploymentId &&
      deployStatus !== "Success" &&
      deployStatus !== "Failed"
    ) {
      pollingInterval = setInterval(() => {
        pollDeployStatus();
      }, 5000);
    }

    // success이고 domain이 있지만 아직 준비 안됐을 때
    if (deployStatus === "Success" && domain && !domainReady) {
      domainInterval = setInterval(() => {
        checkDomainReady();
      }, 5000);
    }

    // cleanup
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
      if (domainInterval) clearInterval(domainInterval);
    };
  }, [deploymentId, deployStatus, domain, domainReady]);

  // 배포 시작
  const handleDeploy = async () => {
    if (!repositoryUrl.trim()) {
      alert("레포지토리 URL을 입력해주세요!");
      return;
    }

    setStep(2);
    setCurrentPhase(1);
    setErrorMessage("");

    try {
      const response = await client.post("/deploy", {
        repo_url: repositoryUrl,
      });

      const { deployment_id, project_id, domain, status } = response.data;
      setDeploymentId(deployment_id);
      setDomain(domain);
      setProjectId(project_id);
      setCurrentPhase(2);

      // 1초 후 Phase 3으로 이동 (실제 폴링 시작)
      setTimeout(() => {
        setCurrentPhase(3);
      }, 1000);
    } catch (error) {
      console.error("❌ 배포 시작 실패:", error);
      setErrorMessage(
        error.response?.data?.message || "배포 시작에 실패했습니다."
      );
      setStep(3);
      setDeployStatus("Failed");
    }
  };

  // 배포 상태 폴링
  const pollDeployStatus = async () => {
    if (!deploymentId) return;

    try {
      const response = await client.get(
        `/deploy/poll?deployment_id=${deploymentId}`
      );
      const status = response.data.status;

      setDeployStatus(status);

      if (status === "Success") {
        // 성공하면 도메인 체크 시작
        const domainFromApi = response.data.domain || domain;
        setDomain(domainFromApi);
      } else if (status === "Failed") {
        setStep(3);
        setErrorMessage(response.data.message || "빌드에 실패했습니다.");
      }
    } catch (error) {
      console.error("❌ 상태 폴링 에러:", error);
    }
  };

  // 도메인 준비 상태 체크
  const checkDomainReady = async () => {
    if (!domain) return;

    try {
      const response = await fetch(`https://${domain}.qw1k.cloud`, {
        method: "HEAD",
        mode: "cors",
        cache: "no-cache",
      });

      console.log("📊 상태코드:", response.status);
      console.log("📊 OK:", response.ok);

      if (response.status === 200) {
        console.log("🎉 200 OK - 준비 완료!");
        setDomainReady(true);
      } else if (response.status === 403) {
        console.log("❌ 403 Forbidden - 아직 대기");
      } else {
        console.log(`❌ ${response.status} - 계속 대기`);
      }
    } catch (error) {
      // 이제 진짜 네트워크 에러만 여기로 옴
      console.log("❌ 네트워크 에러:", error.message);
    }
  };

  // ProgressBar 완료 콜백
  const handleProgressComplete = () => {
    setStep(3);
  };

  // 새로고침 방지
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (step === 2) {
        e.preventDefault();
        e.returnValue = "배포가 진행 중입니다. 페이지를 떠나시겠습니까?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [step]);

  return (
    <section className={`deploy-section step-${step}`}>
      <div className="wrap">
        {/* 📝 입력 영역 */}
        <div className="input-container">
          <div className="input-box">
            <input
              type="text"
              className="repository-url"
              placeholder="본인 소유의 레포지토리 링크를 입력해주세요."
              value={repositoryUrl}
              onChange={(e) => setRepositoryUrl(e.target.value)}
              readOnly={step !== 1}
            />
            <button
              className={`post-repository-btn ${
                step === 1 ? "accent" : "disabled"
              }`}
              onClick={handleDeploy}
              disabled={step !== 1}
            >
              배포
            </button>
          </div>
        </div>

        {/* 📊 진행 상황 */}
        {step === 2 && (
          <div>
            <ProgressBar
              phase={currentPhase}
              deploymentId={deploymentId}
              deployStatus={deployStatus}
              domainReady={domainReady}
              onComplete={handleProgressComplete}
            />
          </div>
        )}

        {/* ✅ 성공 결과 */}
        {step === 3 && deployStatus === "Success" && domainReady && (
          <div className="result-container success">
            <div className="text-box">
              <p className="success-message title-text">
                배포가 완료되었습니다!
              </p>
              <p>{domain}.qw1k.cloud로 배포되었어요.</p>
              <p>확인하러 가볼까요?</p>
            </div>
            <div className="btn-box">
              <button
                className="move-to-site main"
                onClick={() =>
                  window.open(`https://${domain}.qw1k.cloud`, "_blank")
                }
              >
                사이트로 이동
              </button>
              <button
                className="move-to-detail accent"
                onClick={() => {
                  // 🔥 수정: projectId 저장 로직 추가 필요
                  window.location.href = `/project/${projectId}`;
                }}
              >
                상세페이지로 이동
              </button>
            </div>
          </div>
        )}

        {/* ❌ 실패 결과 */}
        {step === 3 && deployStatus === "Failed" && (
          <div className="result-container failure">
            <div className="text-box">
              <p className="error-message title-text">배포에 실패했습니다</p>
              <p>{errorMessage}</p>
              <p>다시 시도해주세요.</p>
            </div>
            <div className="btn-box">
              <button
                className="retry-btn accent"
                onClick={() => window.location.reload()}
              >
                다시 시도
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Deploy;
