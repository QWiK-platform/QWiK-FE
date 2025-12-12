import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import client from "../api/client";
// 플랜 정보
// import { planList } from "../data/pricing/planList";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 날짜 포맷팅
  const formatDate = (dateString, includeTime = false) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    if (includeTime) {
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}.${month}.${day} ${hours}:${minutes}`;
    }
    return `${year}.${month}.${day}`;
  };

  // 프로젝트 클릭 핸들러
  const handleProjectClick = (project) => {
    navigate(`/project/${project.repo_name}`); // repository_name → repo_name
  };

  // 프로젝트 추가 버튼 클릭
  const handleAddProject = () => {
    if (canAddMore) {
      navigate("/deploy");
    } else {
      navigate("/pricing");
    }
  };

  // API 호출
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await client.get("/dashboard");

        if (response.status === 200) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error("대시보드 API 에러:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <section className="dashboard-section">
        <div className="wrap">
          <div className="loading">로딩 중...</div>
        </div>
      </section>
    );
  }

  // 계산된 값들
  const totalProjects = dashboardData?.projects?.length || 0;
  const activeProjects =
    dashboardData?.projects?.filter((p) => p.status === "active").length || 0;
  const inactiveProjects = totalProjects - activeProjects;

  // 플랜 정보 (API 데이터 직접 사용)
  const maxProjects = dashboardData?.plan_limits?.projects || 0;
  const canAddMore = totalProjects < maxProjects;

  // 메모리/트래픽 limit도 API 데이터 사용
  // const memoryLimit = `${dashboardData?.plan_limits?.memory}MB`;
  // const trafficLimit = `${dashboardData?.plan_limits?.traffic}GB`;

  // 사용률 계산 함수
  const calculateUsagePercentage = (used, total) => {
    if (!used || !total) return 0;
    return Math.min((used / total) * 100, 100);
  };

  const memoryPercentage = calculateUsagePercentage(
    dashboardData?.usage?.memory,
    dashboardData?.plan_limits?.memory
  );

  const trafficPercentage = calculateUsagePercentage(
    dashboardData?.usage?.traffic,
    dashboardData?.plan_limits?.traffic
  );

  // 바 색상 결정
  const getBarClass = (percentage) => {
    if (percentage >= 90) return "danger";
    if (percentage >= 70) return "warning";
    return "";
  };

  // 커밋 메시지 정리 함수
  const formatCommitMessage = (message, lastUpdated) => {
    if (!message) {
      return lastUpdated ? formatDate(lastUpdated, true) : "No update info";
    }
    const parts = message.split("\n");
    return parts.length > 1 ? parts[1] : message;
  };

  return (
    <section className="dashboard-section">
      <div className="wrap">
        {/* 사용자 정보 */}
        <div className="info-text-container">
          <h3 className="title-text">
            {dashboardData?.github_name} 님의 서비스 이용 현황입니다.
            {/* <span className="membership-badge">
              {dashboardData?.membership.tier}
            </span> */}
          </h3>
          <p>
            배포한 프로젝트는 {totalProjects}개이며, 현재 활성화 프로젝트는{" "}
            {activeProjects}개, 비활성화 프로젝트는 {inactiveProjects}개입니다.
          </p>
        </div>

        {/* 리소스 사용량 */}
        <div className="resource-container">
          <div className="memory-container">
            <div className="text-box">
              <p className="title">메모리 사용량</p>
              <p className="usage eng">
                <span className="used">{dashboardData?.usage?.memory}</span>/
                <span className="total">
                  {dashboardData?.plan_limits?.memory}
                </span>
                MB
              </p>
            </div>
            <div className="bar-box">
              <div
                className={`fill-bar ${getBarClass(memoryPercentage)}`}
                style={{ width: `${memoryPercentage}%` }}
              ></div>
            </div>
          </div>
          <div className="traffic-container">
            <div className="text-box">
              <p className="title">트래픽 사용량</p>
              <p className="usage eng">
                <span className="used">{dashboardData?.usage?.traffic}</span>/
                <span className="total">
                  {dashboardData?.plan_limits?.traffic}MB
                </span>
              </p>
            </div>
            <div className="bar-box">
              <div
                className={`fill-bar ${getBarClass(trafficPercentage)}`}
                style={{ width: `${trafficPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 프로젝트 목록 */}
        <div className="project-list-container">
          <p className="project-counter eng">
            {totalProjects} / {maxProjects}
          </p>
          <div className="project-list-box">
            {/* 기존 프로젝트들 */}
            {dashboardData?.projects?.map((project) => (
              <div
                key={project.project_id}
                className="project-box eng pos-rel"
                onClick={() => handleProjectClick(project)}
                style={{ cursor: "pointer" }}
              >
                <span className="git-repository">
                  {dashboardData?.github_name}/{project.repo_name}
                </span>
                <span className={`status ${project.status || "active"}`}></span>
                <p className="project-title">{project.repo_name}</p>
                <p className="project-url">{project.subdomain}</p>
                <p className="version">
                  ver.{" "}
                  <span>
                    {formatCommitMessage(
                      project.commit_message,
                      project.last_updated_at
                    )}
                  </span>
                </p>
                <div className="date-box">
                  <p className="origin">
                    최초 <span>{formatDate(project.created_at)}</span>
                  </p>
                  {project.last_updated_at && (
                    <>
                      <span>/</span>
                      <p className="update">
                        마지막{" "}
                        <span>{formatDate(project.last_updated_at, true)}</span>
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
            {/* 프로젝트 추가 버튼 */}
            <div
              className={`project-box ${canAddMore ? "available" : "full"}`}
              onClick={handleAddProject}
              style={{ cursor: "pointer" }}
            >
              <i className="fas fa-plus"></i>
              <p>
                {canAddMore
                  ? "프로젝트 배포하러 가기"
                  : "프로젝트를 더 배포하고 싶다면?"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
