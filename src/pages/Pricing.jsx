import React from "react";
import "./Pricing.css";
import { planList } from "../data/pricing/planList";

const Pricing = () => {
  // planList 객체를 배열로 변환하고 sortId로 정렬
  const plansArray = Object.entries(planList)
    .map(([key, plan]) => ({
      id: key,
      planName: key,
      ...plan,
    }))
    .sort((a, b) => a.sortId - b.sortId);

  // 혜택 목록 생성 함수
  const getBenefits = (plan) => {
    const benefits = [
      `프로젝트 최대 ${plan.projects}개 배포`,
      `프로젝트 당 스토리지 ${plan.projectCapacity} MB 제공`,
      `계정 당 총 메모리 ${plan.memory} MB 제공`,
      `계정 당 총 트래픽 ${plan.traffic} MB 제공`,
    ];

    if (plan.domains > 0) {
      benefits.push("도메인 연결 가능");
    }

    if (plan.extraBenefit?.traffic) {
      benefits.push(`트래픽 ${plan.extraBenefit.traffic} 추가 1회 무료`);
    }

    return benefits;
  };

  return (
    <section className="pricing-section">
      <div className="wrap">
        <div className="text-box">
          <p className="title">
            <span className="eng">QWiK</span>에서는 요금제에 따라
            <br />더 많은 혜택을 제공하고 있습니다.
          </p>
        </div>
        <div className="plan-container">
          {plansArray.map((planItem) => (
            <div key={planItem.id} className="plan-box pos-rel">
              {planItem.isPopular && <div className="popular-badge">인기</div>}
              <span className="title">{planItem.planName}</span>
              <div className="explanation-box">{planItem.description}</div>
              <ul className="benefit-container">
                {getBenefits(planItem).map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>

              <div className="price-container">
                <div className="price">
                  {planItem.amount === null ? (
                    <span className="tbd">TBD</span>
                  ) : planItem.amount === 0 ? (
                    <span className="free">무료</span>
                  ) : (
                    <>
                      <span className="amount">
                        ₩{planItem.amount.toLocaleString()}
                      </span>
                      <span className="period">/월</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
