/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import Loader from "../components/Loader";
import { allTerms } from "../data/terms/termsIndex";
import "./Terms.css";

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

// 사용자 약관 동의일 이후 업데이트된 약관들 찾기
function getUpdatedTerms(userTermsDate) {
  if (!userTermsDate) {
    // 신규 사용자 → 모든 약관
    return Object.values(allTerms);
  }

  const userDateNum = dateToNumber(userTermsDate);
  const updatedTerms = [];

  Object.values(allTerms).forEach((term) => {
    const effectiveDateNum = dateToNumber(term.effectiveDate);
    if (userDateNum < effectiveDateNum) {
      updatedTerms.push(term);
    }
  });

  return updatedTerms;
}

// 약관 동의 API 호출 (수정됨)
async function agreeToTerms() {
  try {
    const response = await client.patch("/user/term", {
      terms: getKoreanToday(), // 한국 시간 기준
    });
    return response.data;
  } catch (error) {
    console.error("약관 동의 에러:", error);
    throw error;
  }
}

const Terms = () => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [termsToShow, setTermsToShow] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTerms, setCurrentTerms] = useState(null);
  const [agreeing, setAgreeing] = useState(false);
  const [allAgreed, setAllAgreed] = useState(false);
  const [individualAgreements, setIndividualAgreements] = useState({});
  const navigate = useNavigate();

  // 사용자 정보 불러오기
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setUserLoading(true);
        const response = await client.get("/user");
        setUser(response.data);

        const updatedTerms = getUpdatedTerms(response.data.terms);
        setTermsToShow(updatedTerms);

        // 동의할 약관이 없으면 바로 대시보드로
        if (updatedTerms.length === 0) {
          navigate("/dashboard");
          return;
        }

        const initialAgreements = {};
        updatedTerms.forEach((_, index) => {
          initialAgreements[index] = false;
        });
        setIndividualAgreements(initialAgreements);
      } catch (error) {
        console.error("❌ 유저 API 에러:", error);
        // 사용자 정보 로드 실패 시 메인으로
        navigate("/");
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleTermsAgreement = (index, isChecked) => {
    setIndividualAgreements((prev) => ({
      ...prev,
      [index]: isChecked,
    }));
  };

  const handleAllAgreed = (isChecked) => {
    setAllAgreed(isChecked);

    const newIndividualAgreements = {};
    termsToShow.forEach((_, index) => {
      newIndividualAgreements[index] = isChecked;
    });
    setIndividualAgreements(newIndividualAgreements);
  };

  useEffect(() => {
    const allChecked = Object.values(individualAgreements).every(
      (agreed) => agreed,
    );
    const hasAnyAgreement = Object.keys(individualAgreements).length > 0;

    setAllAgreed(allChecked && hasAnyAgreement);
  }, [individualAgreements]);

  const canProceed =
    Object.values(individualAgreements).every((agreed) => agreed) &&
    Object.keys(individualAgreements).length > 0;

  const handleAgree = async () => {
    if (!canProceed) {
      // 미동의 시 메인으로 이동
      alert("서비스 이용에 제한이 있습니다.\n약관에 동의해주세요.");
      navigate("/");
      return;
    }

    try {
      setAgreeing(true);
      await agreeToTerms();
      navigate("/dashboard");
    } catch (error) {
      // API 실패 시 고객센터 연결
      alert("약관 동의 처리에 실패했습니다.\n고객센터로 연결됩니다.");
      window.open(
        "https://docs.google.com/forms/d/e/1FAIpQLSfJhkSXZJR6tr_AI9cBpqpRRLOT_YA5uhFuVBK4X4iyu-akXA/viewform",
        "_blank",
      );
    } finally {
      setAgreeing(false);
    }
  };

  // 모달 열기
  const handleOpenTermsModal = (term) => {
    setCurrentTerms(term);
    setModalOpen(true);
  };

  // 모달 닫기
  const handleCloseTermsModal = () => {
    setModalOpen(false);
    setCurrentTerms(null);
  };

  // 첫 사용자인지 판단
  const isFirstTimeUser = !user?.terms;

  // 로딩 중일 때
  if (userLoading) {
    return (
      <section className="terms-section">
        <div className="wrap">
          <Loader text="사용자 정보 확인 중..." />
        </div>
      </section>
    );
  }

  return (
    <section className="terms-section">
      <div className="wrap">
        <div className="title-box">
          <h4>안녕하세요,</h4>
          <div className="logo-box">
            <div className="img-box">
              <img src="/logo-qwik.png" alt="qwik logo" />
            </div>
            <p>입니다.</p>
          </div>
          <p className="explain-text">
            {isFirstTimeUser
              ? "서비스 이용을 위해 약관에 동의해주세요."
              : "약관이 업데이트되었습니다."}
          </p>
        </div>

        <div className="terms-container">
          {termsToShow.map((term, index) => (
            <div key={index} className="service-terms-container">
              <div className="agreement-container">
                <div className="input-box">
                  <input
                    type="checkbox"
                    id={`terms-${index}`}
                    className="custom-checkbox"
                    checked={individualAgreements[index] || false}
                    onChange={(e) =>
                      handleTermsAgreement(index, e.target.checked)
                    }
                  />
                  <label htmlFor={`terms-${index}`} className="checkbox-label">
                    {term.title} 동의 (필수)
                  </label>
                </div>
                <button
                  className="view-terms-btn"
                  onClick={() => handleOpenTermsModal(term)}
                >
                  약관 보기
                  <i className="fa-solid fa-angle-right"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="total-agree-container">
          <div className="input-box">
            <input
              type="checkbox"
              id="all-agreed"
              className="custom-checkbox"
              checked={allAgreed}
              onChange={(e) => handleAllAgreed(e.target.checked)}
            />
            <label htmlFor="all-agreed" className="checkbox-label">
              전체 동의
            </label>
          </div>
        </div>

        <div className="btn-box">
          <button
            className="patch-terms-btn accent"
            onClick={handleAgree}
            disabled={agreeing}
          >
            {agreeing ? "처리 중..." : "동의하고 QWiK 이용하기"}
          </button>
        </div>
      </div>

      {/* 약관 상세 모달 */}
      {modalOpen && currentTerms && (
        <div className="modal-bg">
          <div className="modal-popup term-open-modal">
            <p className="term-title">{currentTerms.title}</p>
            <p className="term-updated-date">
              시행일: {currentTerms.effectiveDate}
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
                className="term-close-btn accent"
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

export default Terms;
