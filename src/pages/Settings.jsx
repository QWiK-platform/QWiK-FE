import React from "react";
import "./Settings.css";

const Setting = () => {
  return (
    <section className="my-page-section">
      <div className="wrap">
        <div className="user-profile-container">
          <h2 className="user-name">USER NAME</h2>
          <a href="#" target="_tap">
            git hub url
          </a>
        </div>
        <div className="plan-container">
          <p>
            사용 중인 요금제: <span className="plan-name">PLAN NAME</span>
          </p>
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
