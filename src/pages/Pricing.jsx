import React from "react";
import "./Pricing.css";

const Pricing = () => {
  const planList = [
    {
      id: 1,
      sortId: 1,
      planName: "STARTER",
      description: "QWIK에 기입한 회원 누구나 사용할 수 있습니다.",
      benefits: [
        "프로젝트 최대 3개 배포",
        "프로젝트 당 용량 200MB 제한",
        "계정 당 총 트래픽 3G 제한",
      ],
      amount: 0,
      period: "월",
      isPopular: false,
    },
    {
      id: 2,
      sortId: 2,
      planName: "BASIC",
      description:
        "개인 작업자에게 적합한 요금제로, 보다 많은 프로젝트를 배포할 수 있습니다.",
      benefits: [
        "프로젝트 최대 7개 배포",
        "프로젝트 당 용량 500MB 제한",
        "계정 당 총 트래픽 20G 제한",
        "도메인 연결 가능",
      ],
      amount: 4400,
      period: "월",
      isPopular: true,
    },
    {
      id: 3,
      sortId: 3,
      planName: "PRO",
      description:
        "여러 프로젝트를 동시에 진행하는 팀 규모에 적합한 요금제로, 가장 많은 프로젝트를 배포할 수 있으며, 추가 트래픽을 제공합니다.",
      benefits: [
        "프로젝트 최대 15개 배포",
        "프로젝트 당 용량 500MB 제한",
        "계정 당 총 트래픽 50G 제한",
        "트래픽 10G 추가 1회 무료",
        "도메인 연결 가능",
      ],
      amount: 7700,
      period: "월",
      isPopular: false,
    },
  ];

  return (
    <section className="pricing-section">
      <div className="wrap">
        <div className="text-box">
          <p className="title">
            <span className="eng">QWiK</span>에서는 요금제에 따라<br></br> 더
            많은 혜택을 제공하고 있습니다.
          </p>
        </div>
        <div className="plan-container">
          {planList
            .sort((a, b) => a.sortId - b.sortId)
            .map((planItem) => (
              <div key={planItem.id} className="plan-box">
                {planItem.isPopular && (
                  <div className="popular-badge">인기</div>
                )}
                <span className="title">{planItem.planName}</span>
                <div className="explanation-box">{planItem.description}</div>

                <ul className="benefit-container">
                  {planItem.benefits.map((benefit, index) => (
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
                        <span className="period">/{planItem.period}</span>
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
