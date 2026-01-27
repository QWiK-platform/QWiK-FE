import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import Loader from "../components/Loader";
import { allTerms } from "../data/terms/termsIndex";
import "./AuthCallback.css";

// 프론트엔드 최신 약관 날짜 구하기
function getLatestTermsDate() {
  const dates = Object.values(allTerms).map((term) => term.effectiveDate);
  return dates.sort((a, b) => new Date(b) - new Date(a))[0]; // 가장 최근 날짜
}

// 약관 동의 필요한지 체크
function needsTermsAgreement(userTermsDate) {
  if (!userTermsDate) return true;

  const latestTermsDate = getLatestTermsDate();

  // 날짜 비교
  const userDate = new Date(userTermsDate);
  const latestDate = new Date(latestTermsDate);

  return userDate < latestDate;
}

async function sendCodeToBackend(code) {
  try {
    const response = await client.post("/auth/github/callback", { code });
    return response.data;
  } catch (error) {
    console.error("OAuth 콜백 에러:", error.response);
    throw error;
  }
}

// 사용자 정보 가져오기 (약관 동의일 포함)
async function getUserInfo() {
  try {
    const response = await client.get("/user");
    return response.data;
  } catch (error) {
    console.error("사용자 정보 가져오기 에러:", error.response);
    throw error;
  }
}

const AuthCallback = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  useEffect(() => {
    let executed = false;

    const handleCallback = async () => {
      if (executed) return;
      executed = true;

      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        try {
          const authResult = await sendCodeToBackend(code);

          if (authResult.access_token) {
            localStorage.setItem("token", authResult.access_token);
            setIsLoggedIn(true);

            // 사용자 정보 가져와서 약관 체크
            const userInfo = await getUserInfo();

            if (needsTermsAgreement(userInfo.terms)) {
              // 약관 동의 필요
              navigate("/terms");
            } else {
              // 약관 동의 완료, 대시보드로
              navigate("/dashboard");
            }
          } else {
            console.error("로그인 실패");
            navigate("/");
          }
        } catch (error) {
          console.error("에러 확인됨", error);
          navigate("/");
        }
      } else {
        navigate("/");
      }
    };

    handleCallback();
  }, [navigate, setIsLoggedIn]);

  return (
    <section className="auth-section">
      <div className="wrap">
        <Loader text="GitHub에서 정보를 연동중입니다." />
      </div>
    </section>
  );
};

AuthCallback.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired,
};

export default AuthCallback;
