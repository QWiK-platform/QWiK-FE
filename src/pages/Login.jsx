import React from "react";

const Login = () => {
  const handleGitHubLogin = () => {
    const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID || "임시값";
    const redirectUri = `${window.location.origin}/auth/callback`;
    const gitHubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user,public_repo`;

    window.location.href = gitHubAuthUrl;
  };

  return (
    <section className="login-page">
      <div className="wrap">
        <button onClick={handleGitHubLogin}>GitHub으로 로그인하기</button>
      </div>
    </section>
  );
};

export default Login;
