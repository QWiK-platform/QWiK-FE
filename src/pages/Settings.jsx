import React from "react";

const Setting = () => {
  return (
    <section className="my-page-section">
      <div className="wrap">
        <h2>MY PAGE</h2>
        <div className="user-profile-container">
          <p className="user-name">USER NAME</p>
          <a href="#">git hub repository url</a>
        </div>
        <div className="plan-container">
          <p>
            사용 중인 요금제: <span className="plan-name">PLAN NAME</span>
          </p>
          <div className="usage-container">
            <div className="projesct-usage-container">
              <div className="pie-chart">
                <span>usage/total</span>
                green: active / red: inactive / total: per project / usage:
                deployed
              </div>
            </div>
            <div className="storage-usage-container">
              <div className="pie-chart">
                <span>usage/total</span>
                color changes per project
              </div>
            </div>
            <div className="traffic-usage-container">
              <div className="pie-chart">
                <span>usage/total</span>
                color changes per project
              </div>
            </div>
          </div>
          <span>요금제 상향 유도</span>
        </div>
        <div className="deploy-history-container">
          <h4>project history total</h4>
          <div className="explain-container">
            <span>프로젝트 당 최근 10개까지만 확인할 수 있습니다.</span>
            <span>last updated date</span>
          </div>
          <div className="history-box">
            <span className="update-date">YY.MM.DD HH:MM</span>
            <span className="update-type">bullet</span>
            <span className="udpate-content">update content</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Setting;
