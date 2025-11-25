import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import "./AuthCallback.css";

async function sendCodeToBackend(code) {
  // 보내기 전 데이터 확인
  console.log("=== 전송 데이터 확인 ===");
  console.log("보낼 code:", code);
  console.log("code 길이:", code?.length);
  console.log("code에 특수문자:", /[^a-zA-Z0-9]/.test(code));
  console.log("JSON.stringify 결과:", JSON.stringify({ code: code }));

  try {
    const response = await client.post("/auth/github/callback", { code });
    return response.data;
  } catch (error) {
    console.error("fetch 과정에서 에러:", error);
    throw error;
  }
}

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let executed = false; // 중복 실행 방지

    const handleCallback = async () => {
      if (executed) return; // 이미 실행됐으면 종료
      executed = true;

      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      console.log("code", code);
      console.log("code 타입:", typeof code);
      if (code) {
        try {
          const result = await sendCodeToBackend(code);

          console.log("백엔드 응답:", result);

          if (result.access_token) {
            localStorage.setItem("token", result.access_token);
            console.log(result.access_token);
            // navigate("/dashboard");
          } else {
            console.error("로그인 실패");
            // navigate("/");
          }
        } catch (error) {
          console.error("에러 확인됨", error);
          // navigate("/");
        }
      }
    };

    handleCallback();
  }, []);

  return (
    <section className="auth-section">
      <div className="wrap">
        <div class="lds-spinner">
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
