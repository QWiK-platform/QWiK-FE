import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import client from "../api/client";
import Tooltip from "../components/Tooltip";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [userLoading, setUserLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const navigate = useNavigate();

  // 유저 API 호출
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setUserLoading(true);
        const response = await client.get("/user/");

        if (response.status === 200) {
          setUser(response.data);
          console.log("✅ 유저 데이터:", response.data);
        }
      } catch (error) {
        console.error("❌ 유저 API 에러:", error);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, []);

  // 프로젝트 API 호출
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setProjectsLoading(true);
        const response = await client.get("/dashboard");

        if (response.status === 200) {
          setProjects(response.data.projects);
          console.log("✅ 대시보드 더미데이터:", response.data.projects);
        }
      } catch (error) {
        console.error("❌ 대시보드 API 에러:", error);
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // 로딩 체크
  if (userLoading) {
    return (
      <section className="dashboard-section">
        <div className="wrap">
          <div className="loading">사용자 정보 로딩 중...</div>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="dashboard-section">
        <div className="wrap">
          <div className="loading">사용자 정보를 불러올 수 없습니다.</div>
        </div>
      </section>
    );
  }

  // 유틸리티 함수들
  const formatStorage = (bytes) => {
    const mb = Math.round(bytes / 1048576);

    // if (mb >= 1000) {
    //   const gb = mb / 1000;
    //   return gb % 1 === 0 ? `${gb} GB` : `${gb.toFixed(1)} GB`;
    // }

    return `${mb} MB`;
  };

  const calculateUsagePercentage = (used, total) => {
    if (!used || !total) return 0;
    return Math.min((used / total) * 100, 100);
  };

  const calculateTotalUsage = (usageType) => {
    if (!projects || projects.length === 0) return 0;

    return projects.reduce((total, project) => {
      const projectUsage = project.usage?.[usageType] || 0; // MB 단위
      return total + projectUsage;
    }, 0);
  };

  const getBarClass = (percentage) => {
    if (percentage >= 90) return "danger";
    if (percentage >= 70) return "warning";
    return "";
  };

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

  const formatCommitMessage = (message) => {
    return message || "초기 배포";
  };

  const handleAddProject = () => {
    if (canAddMore) {
      navigate("/deploy");
    } else {
      navigate("/pricing");
    }
  };

  const handleProjectClick = (project) => {
    navigate(`/project/${project.project_id}`);
  };

  // 계산 값들
  const totalProjects = projects?.length || 0;
  const activeProjects = projects?.filter((p) => p.status === true).length || 0;
  const inactiveProjects = totalProjects - activeProjects;

  const maxProjects = user?.plan?.projects || 0;
  const canAddMore = totalProjects < maxProjects;

  // 사용량 계산 (실제 계산된 값 사용)
  const totalStorageUsed = calculateTotalUsage("storage_used");
  const totalTrafficUsed = calculateTotalUsage("traffic_used");

  // 제한량
  const storageLimit = (user?.plan?.storage / 1048576) * user?.plan?.projects;
  const trafficLimit = user?.plan?.traffic / 1048576;

  // 퍼센티지
  const storagePercentage = calculateUsagePercentage(
    totalStorageUsed,
    storageLimit
  );
  const trafficPercentage = calculateUsagePercentage(
    totalTrafficUsed,
    trafficLimit
  );

  return (
    <section className="dashboard-section">
      <div className="wrap">
        {/* 사용자 정보 */}
        <div className="user-info-container">
          <div className="info-text-container">
            <h3 className="title-text">
              <span className="tab-block">{user.username} 님의 </span>
              <span className="tab-block">서비스 이용 현황입니다.</span>
              {/* <span className="membership-badge">{user.plan.name}</span> */}
            </h3>
            <p>
              <span className="tab-block">
                배포한 프로젝트는 {totalProjects}개이며,{" "}
              </span>
              <span className="tab-block">
                현재 활성화 프로젝트는 {activeProjects}개,{" "}
              </span>
              <span className="tab-block">
                비활성화 프로젝트는 {inactiveProjects}
                개입니다.
              </span>
            </p>
          </div>

          {/* 리소스 사용량 */}
          <div className="resource-container">
            <div className="storage-container">
              <div className="text-box">
                <div className="title-box">
                  <p className="title">스토리지 사용량</p>
                  <Tooltip content="총 용량 = 프로젝트 당 스토리지 × 프로젝트 배포 가능 개수">
                    <i className="fa-solid fa-circle-info"></i>
                  </Tooltip>
                </div>
                <p className="usage eng">
                  <span className="used">{Math.round(totalStorageUsed)}</span>/
                  <span className="total">{Math.round(storageLimit)}</span>
                  <span> MB</span>
                </p>
              </div>
              <div className="bar-box">
                <div
                  className={`fill-bar ${getBarClass(storagePercentage)}`}
                  style={{ width: `${storagePercentage}%` }}
                ></div>
              </div>
            </div>
            <div className="traffic-container">
              <div className="text-box">
                <div className="title-box">
                  <p className="title">트래픽 사용량</p>
                  <Tooltip content="트래픽 초과시 프로젝트 전체 비활성화될 수 있습니다.">
                    <i className="fa-solid fa-circle-info"></i>
                  </Tooltip>
                </div>
                <p className="usage eng">
                  <span className="used">{Math.round(totalTrafficUsed)}</span>/
                  <span className="total">
                    {formatStorage(user.plan.traffic)}
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
        </div>
        {/* 프로젝트 목록 */}
        <div className="project-list-container">
          <p className="project-counter eng">
            {totalProjects} / {maxProjects}
          </p>
          <div className="project-list-box">
            {/* 프로젝트 로딩 */}
            {projectsLoading && (
              <div className="project-box">
                <p>프로젝트 로딩 중...</p>
              </div>
            )}

            {/* 프로젝트 목록 */}
            {!projectsLoading &&
              projects.map((project) => (
                <div
                  key={project.project_id}
                  className="project-box eng pos-rel"
                  onClick={() => handleProjectClick(project)}
                  style={{ cursor: "pointer" }}
                >
                  <span className="git-repository">
                    {user.username}/{project.repo_name}
                  </span>
                  <span
                    className={`status ${
                      project.status ? "active" : "inactive"
                    }`}
                  ></span>
                  <p className="project-title">{project.repo_name}</p>
                  {/* 추후 domain -> subdomain 으로 변경 */}
                  <p className="project-url">{project.subdomain}</p>
                  <p className="version">
                    ver.{" "}
                    <span>
                      {formatCommitMessage(
                        project.commit_message,
                        project.reload_at
                      )}
                    </span>
                  </p>
                  <div className="date-box">
                    <p className="origin">
                      최초 <span>{formatDate(project.created_at)}</span>
                    </p>
                    {project.reload_at && (
                      <>
                        <span>/</span>
                        <p className="update">
                          마지막{" "}
                          <span>{formatDate(project.reload_at, true)}</span>
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
