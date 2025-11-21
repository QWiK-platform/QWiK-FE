import React from "react";
import "./Deploy.css";

const Deploy = () => {
  return (
    <section className="deploy-section">
      <div className="wrap">
        <div className="input-box">
          <input
            type="text"
            className="repository-url"
            placeholder="본인 소유의 레포지토리 링크를 입력해주세요."
          />
          <button className="post-repository-btn impact">배포</button>
        </div>
        <div className="log-container eng">
          <p>code building</p>
        </div>
      </div>
    </section>
  );
};

export default Deploy;
