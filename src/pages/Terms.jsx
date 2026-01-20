import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import { allTerms, TERMS_TYPES } from "../data/terms/termsIndex";
import "./Terms.css";

const Terms = () => {
  const navigate = useNavigate();

  // 상태 관리
  const [userTermsDate, setUserTermsDate] = useState(null);
  const [requiredTerms, setRequiredTerms] = useState([]);
  const [agreements, setAgreements] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 한국 시간 기준 오늘 날짜
  const getKoreanToday = () => {
    const now = new Date();
    const koreanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);

    const year = koreanTime.getUTCFullYear();
    const month = String(koreanTime.getUTCMonth() + 1).padStart(2, "0");
    const day = String(koreanTime.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // 날짜를 숫자로 변환 (비교용)
  const dateToNumber = (dateStr) => {
    if (!dateStr) return 0;
    return parseInt(dateStr.replace(/-/g, ""));
  };

  // 동의 필요한 약관 판단
  const getRequiredTerms = (userDate) => {
    if (!userDate) {
      // 신규 사용자 → 모든 약관
      return Object.entries(allTerms);
    }

    const userDateNum = dateToNumber(userDate);

    // 기존 사용자 → 시행일이 동의일보다 늦은 약관만
    return Object.entries(allTerms).filter(([key, termData]) => {
      const effectiveDate = dateToNumber(termData.effectiveDate);
      return userDateNum < effectiveDate;
    });
  };

  // 초기 데이터 로드
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await client.get("/user");
        const userData = response.data;

        setUserTermsDate(userData.terms);
        const required = getRequiredTerms(userData.terms);
        setRequiredTerms(required);

        // 초기 동의 상태 설정
        const initialAgreements = {};
        required.forEach(([key, termData]) => {
          initialAgreements[key] = false;
        });
        setAgreements(initialAgreements);
      } catch (error) {
        console.error("사용자 정보 로드 실패:", error);
        alert("사용자 정보를 불러올 수 없습니다.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // 개별 약관 동의 처리
  const handleTermAgreement = (termKey, checked) => {
    setAgreements((prev) => ({
      ...prev,
      [termKey]: checked,
    }));
  };

  // 전체 동의 처리
  const handleAllAgreement = (checked) => {
    const newAgreements = {};
    requiredTerms.forEach(([key]) => {
      newAgreements[key] = checked;
    });
    setAgreements(newAgreements);
  };

  // 전체 동의 상태 확인
  const isAllAgreed =
    requiredTerms.length > 0 && requiredTerms.every(([key]) => agreements[key]);

  // 약관 동의 완료 처리
  const handleSubmitAgreements = async () => {
    if (!isAllAgreed) {
      alert("서비스 이용에 제한이 있습니다.\n약관에 동의해주세요.");
      navigate("/");
      return;
    }

    setSubmitting(true);

    try {
      await client.patch("/user/terms", {
        terms: getKoreanToday(),
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("약관 동의 실패:", error);
      alert("약관 동의 처리에 실패했습니다.\n고객센터로 연결됩니다.");
      window.open(
        "https://docs.google.com/forms/d/e/1FAIpQLSfJhkSXZJR6tr_AI9cBpqpRRLOT_YA5uhFuVBK4X4iyu-akXA/viewform",
        "_blank",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // 약관 항목 토글
  const handleTermToggle = (termKey, sectionId) => {
    // 약관 내용 토글 로직 (기존과 동일)
  };

  if (loading) {
    return (
      <section className="terms-section">
        <div className="wrap">
          <div className="loading">약관 정보를 불러오는 중...</div>
        </div>
      </section>
    );
  }

  // 동의할 약관이 없으면 바로 대시보드로
  if (requiredTerms.length === 0) {
    navigate("/dashboard");
    return null;
  }

  return (
    <section className="terms-section">
      <div className="wrap">
        <div className="terms-header">
          <h1>서비스 이용약관</h1>
          <p>QWiK 서비스 이용을 위해 다음 약관에 동의해주세요.</p>
        </div>

        {/* 전체 동의 체크박스 */}
        <div className="terms-all-agreement">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isAllAgreed}
              onChange={(e) => handleAllAgreement(e.target.checked)}
            />
            <span className="checkmark"></span>
            전체 약관에 동의합니다
          </label>
        </div>

        {/* 약관 목록 */}
        <div className="terms-list">
          {requiredTerms.map(([termKey, termData]) => (
            <div key={termKey} className="term-item">
              <div className="term-header">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={agreements[termKey] || false}
                    onChange={(e) =>
                      handleTermAgreement(termKey, e.target.checked)
                    }
                  />
                  <span className="checkmark"></span>
                  <span className="term-title">{termData.title}</span>
                  <span className="required-badge">필수</span>
                </label>
              </div>

              <div className="term-content">
                <div className="term-meta">
                  <span>최종 수정일: {termData.lastUpdated}</span>
                  <span>시행일: {termData.effectiveDate}</span>
                </div>

                {/* 약관 내용 (기존 구조 활용) */}
                {termData.sections?.map((section) => (
                  <div key={section.id} className="term-section">
                    <div
                      className="section-header"
                      onClick={() => handleTermToggle(termKey, section.id)}
                    >
                      <span>{section.title}</span>
                      <i
                        className={`fa-solid ${section.isOpen ? "fa-chevron-up" : "fa-chevron-down"}`}
                      ></i>
                    </div>
                    {section.isOpen && (
                      <div className="section-content">
                        <pre>{section.content}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 서비스 이용 버튼 */}
        <div className="terms-submit">
          <button
            className={`submit-btn ${isAllAgreed ? "active" : "disabled"}`}
            onClick={handleSubmitAgreements}
            disabled={!isAllAgreed || submitting}
          >
            {submitting ? "처리 중..." : "QWiK 서비스 이용하기"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Terms;
