import React, { useState } from "react";
import "./Deploy.css";
import client from "../api/client";
import ProgressBar from "../components/ProgressBar";

const Deploy = () => {
  const [step, setStep] = useState(1);
  const [deployStatus, setDeployStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // eslint-disable-line no-unused-vars
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [deployResult, setDeployResult] = useState(null); // eslint-disable-line no-unused-vars

  const handleDeploy = async () => {
    if (!repositoryUrl.trim()) {
      alert("레포지토리 URL을 입력해주세요!");
      return;
    }

    setStep(2);

    try {
      console.log("📤 보내는 데이터:", { github_url: repositoryUrl });

      const response = await client.post("/deploy", {
        github_url: repositoryUrl,
      });

      console.log("✅ API 응답:", response.data);

      setDeployResult(response.data);
      setStep(3);

      if (response.data.status === "success") {
        setDeployStatus("success");
      } else {
        setDeployStatus("failure");
        setErrorMessage(response.data.message || "배포 실패");
      }
    } catch (error) {
      console.error("❌ API 에러:", error.response?.data);
      setStep(3);
      setDeployStatus("failure");
      setErrorMessage(error.response?.data?.message || "API 호출 실패");
    }
  };

  return (
    <section className={`deploy-section step-${step}`}>
      {/* 🎮 임시 리모컨 (개발용)
      <div
        style={{
          position: "fixed",
          top: "150px",
          right: "80px",
          background: "#fff",
          border: "2px solid #ccc",
          padding: "10px",
          borderRadius: "8px",
          zIndex: 1000,
          fontSize: "12px",
        }}
      >
        <div style={{ marginBottom: "5px", fontWeight: "bold" }}>
          🎮 Dev Remote (Step: {step}, Status: {deployStatus || "none"})
        </div>
        <button
          onClick={() => {
            setStep(1);
            setDeployStatus(null);
          }}
        >
          1단계
        </button>
        <button
          onClick={() => {
            setStep(2);
            setDeployStatus(null);
          }}
        >
          2단계
        </button>
        <button
          onClick={() => {
            setStep(3);
            setDeployStatus("success");
          }}
        >
          성공
        </button>
        <button
          onClick={() => {
            setStep(3);
            setDeployStatus("failure");
          }}
        >
          실패
        </button>
      </div> */}
      <div className="wrap">
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

        {step === 2 && <ProgressBar mockMode={true} />}

        {step === 3 && deployStatus === "success" && (
          <div className="result-container success">
            <div className="text-box">
              <p className="success-message title-text">
                배포가 완료되었습니다!
              </p>
              <p>githubname-reponame.qw1k.me로 배포되었어요.</p>
              <p>확인하러 가볼까요?</p>
            </div>
            <div className="btn-box">
              <button className="move-to-site main">사이트로 이동</button>
              <button className="move-to-detail accent">
                상세페이지로 이동
              </button>
            </div>
          </div>
        )}

        {step === 3 && deployStatus === "failure" && (
          <div className="result-container failure">
            <div className="text-box">
              <p className="failure-message title-text">배포가 실패했어요.</p>
              <p>error code message handling</p>
            </div>
            <div className="btn-box">
              <button
                className="retry-btn accent"
                onClick={() => {
                  setStep(1);
                  setDeployStatus(null);
                  setErrorMessage("");
                }}
              >
                재시도
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Deploy;
