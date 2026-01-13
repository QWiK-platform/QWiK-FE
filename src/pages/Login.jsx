import React from "react";
import "./Login.css";

const Login = () => {
  // 로그인 핸들링
  const handleGitHubLogin = () => {
    const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID || "임시값";
    const redirectUri = `${window.location.origin}/auth/callback`;
    const gitHubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user,public_repo`;

    window.location.href = gitHubAuthUrl;
  };

  return (
    <section className="login-section">
      <div className="wrap">
        <div className="login-container">
          <div className="info-container">
            {/* <p className="slogun-text">간편하고 빠른 배포의 시작,</p> */}
            <p className="slogun-text">빠른 배포의 쉬운 시작,</p>
            <div className="img-box">
              <img src="/logo-qwik.svg" alt="QWiK 로고" />
            </div>
          </div>
          <div className="btn-box" onClick={handleGitHubLogin}>
            <i className="fab fa-github"></i>
            <button>GitHub으로 시작하기</button>
          </div>
          <p className="login-explain">
            QWiK에서는 GitHub Repository와의 원활한 연결을 위해,<br></br> GitHub
            로그인만 제공하고 있습니다.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
