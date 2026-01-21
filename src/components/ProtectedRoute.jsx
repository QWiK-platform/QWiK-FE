import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import client from "../api/client";
import { allTerms } from "../data/terms/termsIndex";
import Loader from "./Loader";

// Terms 체크 로직 (Terms.js에서 분리)
const dateToNumber = (dateStr) => {
  if (!dateStr) return 0;
  return parseInt(dateStr.replace(/-/g, ""));
};

function getUpdatedTerms(userTermsDate) {
  if (!userTermsDate) {
    // 신규 사용자 → 시행된 모든 약관
    const today = getKoreanToday();
    const todayNum = dateToNumber(today);

    return Object.values(allTerms).filter((term) => {
      const effectiveDateNum = dateToNumber(term.effectiveDate);
      return todayNum >= effectiveDateNum; // 오늘 이미 시행된 약관만
    });
  }

  const userDateNum = dateToNumber(userTermsDate);
  const today = getKoreanToday();
  const todayNum = dateToNumber(today);
  const updatedTerms = [];

  Object.values(allTerms).forEach((term) => {
    const effectiveDateNum = dateToNumber(term.effectiveDate);

    // 사용자 동의일 < 시행일 && 오늘 >= 시행일
    if (userDateNum < effectiveDateNum && todayNum >= effectiveDateNum) {
      updatedTerms.push(term);
    }
  });

  console.log("업데이트된 약관들:", updatedTerms);
  return updatedTerms;
}

const ProtectedRoute = ({ children }) => {
  const [termsValid, setTermsValid] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTerms = async () => {
      try {
        const response = await client.get("/user");
        const updatedTerms = getUpdatedTerms(response.data.terms);

        console.log("🔍 약관 체크:", {
          userTermsDate: response.data.terms,
          updatedTermsCount: updatedTerms.length,
        });

        setTermsValid(updatedTerms.length === 0);
      } catch (error) {
        console.error("약관 체크 에러:", error);
        // API 에러 시에도 일단 통과 (네트워크 문제일 수 있음)
        setTermsValid(true);
      } finally {
        setLoading(false);
      }
    };

    checkTerms();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <Loader text="약관 확인 중..." />
      </div>
    );
  }

  // 약관 동의 필요 시 Terms로 이동
  if (!termsValid) {
    return <Navigate to="/terms" replace />;
  }

  return children;
};

export default ProtectedRoute;
