/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import Loader from "../components/Loader";
import { allTerms } from "../data/terms/termsIndex";
import "./Terms.css";

// 사용자 약관 동의일 이후 업데이트된 약관들 찾기
function getUpdatedTerms(userTermsDate) {
  if (!userTermsDate) {
    // 첫 사용자면 모든 약관 반환
    return Object.values(allTerms);
  }

  const userDate = new Date(userTermsDate);
  const updatedTerms = [];

  Object.values(allTerms).forEach((term) => {
    const termDate = new Date(term.effectiveDate);
    if (termDate > userDate) {
      updatedTerms.push(term);
    }
  });

  console.log("업데이트된 약관들:", updatedTerms);
  return updatedTerms;
}

// 약관 동의 API 호출
async function agreeToTerms() {
  try {
    const response = await client.patch("/user/terms", {
      terms_agreed_date: new Date().toISOString(),
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
  const navigate = useNavigate();

  // 사용자 정보 불러오기
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setUserLoading(true);
        const response = await client.get("/user");
        setUser(response.data);

        // 보여줄 약관들 결정
        const updatedTerms = getUpdatedTerms(response.data.terms);
        setTermsToShow(updatedTerms);
      } catch (error) {
        console.error("❌ 유저 API 에러:", error);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, []);

  // 약관 동의 처리
  const handleAgree = async () => {
    try {
      setAgreeing(true);
      await agreeToTerms();
      navigate("/dashboard");
    } catch (error) {
      alert("약관 동의 중 오류가 발생했습니다.");
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
          <div className="img-box">
            <img src="/logo-qwik.png" alt="qwik logo" />
          </div>
          <h4>서비스 이용약관</h4>
          <p>
            {isFirstTimeUser
              ? "서비스 이용을 위해 약관에 동의해주세요"
              : "약관이 업데이트되었습니다"}
          </p>
        </div>

        <div className="terms-container">
          {termsToShow.map((term, index) => (
            <div key={index} className="service-terms-container">
              <div className="input-box">
                <input type="checkbox" />
                <label onClick={() => handleOpenTermsModal(term)}>
                  {term.title} 동의 (필수)
                  <i className="fa-solid fa-angle-right"></i>
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="total-agree-container">
          <div className="input-box">
            <input
              type="checkbox"
              checked={allAgreed}
              onChange={(e) => setAllAgreed(e.target.checked)}
            />
            <label>전체 동의</label>
          </div>
        </div>

        <div className="btn-box">
          <button
            className="patch-terms-btn accent"
            onClick={handleAgree}
            disabled={agreeing || !allAgreed}
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
