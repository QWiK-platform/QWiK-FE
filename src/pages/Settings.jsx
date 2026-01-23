import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";
import "./Settings.css";

const Setting = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await client.get("/dashboard/history");
        setUserData(response.data);
      } catch (error) {
        console.error("마이페이지 데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}`;
  };

  // 가장 최근 날짜 찾기
  const getLatestDate = (history) => {
    if (!history || history.length === 0) return "";

    const latestItem = history.reduce((latest, current) => {
      return new Date(current.created_at) > new Date(latest.created_at)
        ? current
        : latest;
    });

    return formatDate(latestItem.created_at);
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <section className="my-page-section">
      <div className="wrap">
        <div className="user-profile-container">
          <a
            href={`https://github.com/${userData?.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="github-url"
          >
            github.com/{userData?.username}
          </a>
          <p className="user-name eng">{userData?.username || "USER NAME"} </p>
        </div>

        <div className="plan-container">
          <p>
            사용 중인 요금제: <span className="plan-name">STARTER</span>{" "}
          </p>
          {/* <span>요금제 상향 유도</span> */}
        </div>

        <div className="deploy-history-container">
          <h4>전체 프로젝트 히스토리</h4>
          <div className="explain-container">
            <span>프로젝트 당 최근 10개까지만 확인할 수 있습니다.</span>
            <span className="eng">{getLatestDate(userData?.history)}</span>
          </div>
          <div className="total-history-container">
            {userData?.history && userData.history.length > 0 ? (
              // 히스토리가 있을 때
              <div className="history-box">
                {userData.history.map((item, index) => (
                  <div key={index} className="history-item">
                    <span className="update-date eng">
                      {formatDate(item.created_at)}
                    </span>
                    <span className={`update-type eng ${item.status}`}>
                      {item.status}
                    </span>
                    <span className="repo-name eng">{item.repo_name}</span>
                    <span className="update-content ellipsis-1">
                      {item.commit_message}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              // 히스토리가 없을 때
              <div className="no-history">
                <p className="notice-text">
                  배포된 내역이 없네요. 배포하러 가볼까요?
                </p>
                <Link to="/deploy" className="deploy-link">
                  배포하러 가기 <i className="fa-solid fa-angle-right"></i>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Setting;
