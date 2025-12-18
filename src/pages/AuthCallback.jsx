import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import "./AuthCallback.css";

async function sendCodeToBackend(code) {
  try {
    const response = await client.post("/auth/github/callback", { code });
    return response.data;
  } catch (error) {
    // 디버깅
    console.error("OAuth 콜백 에러:", error);
    throw error;
  }
}

const AuthCallback = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  useEffect(() => {
    let executed = false; // 중복 실행 방지

    const handleCallback = async () => {
      if (executed) return; // 이미 실행됐으면 종료
      executed = true;

      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        try {
          const result = await sendCodeToBackend(code);

          if (result.access_token) {
            localStorage.setItem("token", result.access_token);
            setIsLoggedIn(true);
            navigate("/dashboard");
          } else {
            console.error("로그인 실패");
            navigate("/");
          }
        } catch (error) {
          console.error("에러 확인됨", error);
          navigate("/");
        }
      }
    };

    handleCallback();
  }, []);

  return (
    <section className="auth-section">
      <div className="wrap">
        <div className="lds-spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <p>GitHub에서 정보를 연동중입니다.</p>
      </div>
    </section>
  );
};

export default AuthCallback;
