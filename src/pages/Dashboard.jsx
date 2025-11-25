import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
// 유저 목업
import { mockUserData } from "../data/mockData";
// 플랜 정보
import { planList } from "../data/pricing/planList";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 현재 사용자 정보
  const currentUser = mockUserData[0];

  // 현재 사용자의 플랜 정보
  const currentPlan = planList[currentUser.membership.tier];
  const maxProjects = currentPlan?.projects || 0;

  // 계산된 값들
  const totalProjects = projects.length;
  const activeProjects = projects.filter(
    (project) => project.status === "active"
  ).length;
  const inactiveProjects = totalProjects - activeProjects;
  const remainingSlots = maxProjects - totalProjects;
  const canAddMore = remainingSlots > 0;

  // 사용률 계산
  const calculateUsagePercentage = (used, total) => {
    const usedValue = parseFloat(used.replace(/[A-Za-z]/g, ""));
    const totalValue = parseFloat(total.replace(/[A-Za-z]/g, ""));
    return Math.min((usedValue / totalValue) * 100, 100);
  };

  const memoryPercentage = calculateUsagePercentage(
    currentUser.membership.usage.memory,
    currentPlan?.memory
  );

  const trafficPercentage = calculateUsagePercentage(
    currentUser.membership.usage.traffic,
    currentPlan?.traffic
  );

  // 바 색상 결정
  const getBarClass = (percentage) => {
    if (percentage >= 90) return "danger";
    if (percentage >= 70) return "warning";
    return "";
  };

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

  // 커밋 메시지 정리
  const formatCommitMessage = (message, lastUpdated) => {
    if (!message) {
      return lastUpdated ? formatDate(lastUpdated, true) : "No update info";
    }
    const parts = message.split("\n");
    return parts.length > 1 ? parts[1] : message;
  };

  // 프로젝트 클릭 핸들러
  const handleProjectClick = (project) => {
    navigate(`/project/${project.repository_name}`);
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
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/projects");
        const data = await response.json();

        if (response.ok) {
          const userProjects = data.projects.filter(
            (project) => project.username === currentUser.username // username 속성 접근
          );

          const projectsWithStatus = userProjects.map((project) => ({
            ...project,
            status: "active",
          }));

          setProjects(projectsWithStatus);
          console.log("사용자 프로젝트:", projectsWithStatus);
        }
      } catch (error) {
        console.error("프로젝트 API 에러:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [currentUser.username]); // dependency 수정

  if (loading) {
    return (
      <section className="dashboard-section">
        <div className="wrap">
          <div className="loading">로딩 중...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-section">
      <div className="wrap">
        {/* 사용자 정보 */}
        <div className="info-text-container">
          <h3 className="title-text">
            {currentUser.username} 님의 서비스 이용 현황입니다.
            {/* <span className="membership-badge">
              {currentUser.membership.tier}
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
                <span className="used">
                  {currentUser.membership.usage.memory}
                </span>
                /<span className="total">{currentPlan?.memory}</span>
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
                <span className="used">
                  {currentUser.membership.usage.traffic}
                </span>
                /<span className="total">{currentPlan?.traffic}</span>
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
            {projects.map((project) => (
              <div
                key={project.repository_name}
                className="project-box eng"
                onClick={() => handleProjectClick(project)}
                style={{ cursor: "pointer" }}
              >
                <span className="git-repository">
                  {project.username}/{project.repository_name}
                </span>
                <span className={`status ${project.status || "active"}`}></span>
                <p className="project-title">{project.project_name}</p>
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
