import React, { useState } from "react";
import "./Login.css";
import { allTerms, TERMS_TYPES } from "../data/terms/termsIndex";

const Login = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTerms, setCurrentTerms] = useState(null);

  // 모달 핸들링
  const handleOpenTermsModal = (termsType) => {
    setCurrentTerms(allTerms[termsType]);
    setModalOpen(true);
  };

  const handleCloseTermsModal = (termsType) => {
    setModalOpen(false);
    setCurrentTerms(null);
  };

  // 로그인 핸들링
  const handleGitHubLogin = () => {
    const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID || "임시값";
    // const redirectUri = `${window.location.origin}/auth/github/callback`;
    const redirectUri = `${window.location.origin}/auth/callback`;
    const gitHubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user,public_repo`;
    // const gitHubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}`;

    window.location.href = gitHubAuthUrl;
  };

  return (
    <section className="login-section">
      <div className="wrap">
        <div className="login-container">
          <div className="info-container">
            <p className="slogun-text">간편한 자동배포의 시작,</p>
            <div className="img-box">
              <img src="/logo-qwik.svg" alt="QWiK 로고" />
            </div>
          </div>
          <div className="btn-box" onClick={handleGitHubLogin}>
            <i className="fab fa-github"></i>
            <button>GitHub으로 시작하기</button>
          </div>
          <div className="term-container">
            <p>
              QWiK은 GitHub 회원가입/로그인만 제공하며, 로그인시{" "}
              <span onClick={() => handleOpenTermsModal(TERMS_TYPES.SERVICE)}>
                서비스 이용약관
              </span>
              ,{" "}
              <span onClick={() => handleOpenTermsModal(TERMS_TYPES.PRIVACY)}>
                개인정보 처리방침
              </span>
              ,{" "}
              <span
                onClick={() => handleOpenTermsModal(TERMS_TYPES.REPOSITORY)}
              >
                GitHub 접근 권한
              </span>
              에 동의한 것으로 간주합니다.
            </p>
          </div>
        </div>
      </div>
      {modalOpen && currentTerms && (
        <div className="modal-bg">
          <div className="modal-popup term-open-modal">
            <p className="term-title">{currentTerms.title}</p>
            <p className="term-updated-date">
              마지막 수정일: {currentTerms.lastUpdated}
            </p>
            <div className="term-content-container">
              <div className="term-content-box">
                {currentTerms.subtitle ? (
                  <p className="sub-title">{currentTerms.subtitle}</p>
                ) : (
                  ""
                )}
                {currentTerms.sections.map((section) => (
                  <div key={section.id} className="term-content">
                    <h5>{section.title}</h5>
                    <pre className="term-text">{section.content}</pre>
                  </div>
                ))}
              </div>
            </div>
            <div className="btn-box">
              <button
                className="term-close-btn impact"
                onClick={handleCloseTermsModal}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Login;
