import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import client from "../api/client";
import Loader from "../components/Loader";
import Tooltip from "../components/Tooltip";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [userLoading, setUserLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] =
    useState("사용자 정보 로딩 중...");
  const [showDeployLoader, setShowDeployLoader] = useState(false);
  const [deployPollingActive, setDeployPollingActive] = useState(false);

  const navigate = useNavigate();

  // 배포 상태 체크 및 Dashboard 로드
  useEffect(() => {
    const isDeploying = localStorage.getItem("deploying");
    const deployStartTime = localStorage.getItem("deploy_started_at");

    if (isDeploying && deployStartTime) {
      const elapsed = Date.now() - parseInt(deployStartTime);

      console.log(
        "배포 진행 중 감지, 경과 시간:",
        Math.round(elapsed / 1000) + "초"
      );

      if (elapsed < 45000) {
        setShowDeployLoader(true);
        const remainingTime = 45000 - elapsed;

        console.log(
          "로더 카드 표시 중,",
          Math.round(remainingTime / 1000) + "초 후 폴링 시작"
        );

        setTimeout(() => {
          console.log("🔄 45초 경과, 프로젝트 개별 폴링 시작");
          startProjectPolling();
        }, remainingTime);
      } else {
        console.log("🔄 45초 이미 경과, 즉시 프로젝트 개별 폴링 시작");
        setShowDeployLoader(true);
        startProjectPolling();
      }
    } else {
      // 배포 중이 아니면 일반 Dashboard 로드
      fetchDashboard();
    }
  }, []);

  // 프로젝트 개별 폴링 함수
  const startProjectPolling = () => {
    if (deployPollingActive) return; // 중복 방지

    setDeployPollingActive(true);
    const deployingProjectId = localStorage.getItem("deploying_project_id");
    console.log("📊 프로젝트 개별 폴링 시작:", deployingProjectId);

    const interval = setInterval(async () => {
      try {
        const response = await client.get(`/dashboard/${deployingProjectId}`);
        const projectData = response.data;

        console.log("프로젝트 상태:", projectData);

        // domain이 null이 아닐 때까지 계속 폴링
        if (
          projectData.domain !== null &&
          projectData.domain !== undefined &&
          projectData.domain !== ""
        ) {
          console.log("🎉 프로젝트 배포 완료:", projectData.domain);
          clearInterval(interval);
          setShowDeployLoader(false);
          setDeployPollingActive(false);
          localStorage.removeItem("deploying");
          localStorage.removeItem("deploy_started_at");
          localStorage.removeItem("deploying_project_id");
          localStorage.removeItem("current_deployment_id");

          // 전체 Dashboard 새로고침
          fetchDashboard();
        } else {
          console.log("프로젝트 domain null 상태");
        }
      } catch (error) {
        console.error("프로젝트 폴링 에러:", error);

        if (error.response?.status === 404) {
          console.log("프로젝트 아직 생성 중...");
        }
      }
    }, 5000);

    // Deploy 실패 감지
    startFailurePolling(interval);

    // 타임아웃 설정 (10분)
    setTimeout(() => {
      clearInterval(interval);
      setDeployPollingActive(false);
      console.log("⏰ 프로젝트 폴링 타임아웃 (10분)");
      if (showDeployLoader) {
        setShowDeployLoader(false);
        localStorage.removeItem("deploying");
        localStorage.removeItem("deploy_started_at");
        localStorage.removeItem("deploying_project_id");
        localStorage.removeItem("current_deployment_id");
        fetchDashboard();
      }
    }, 600000);
  };

  // Deploy 실패 감지 폴링
  const startFailurePolling = (dashboardInterval) => {
    const deploymentId = localStorage.getItem("current_deployment_id");
    if (!deploymentId) return;

    const failureInterval = setInterval(async () => {
      try {
        const response = await client.get(
          `/deploy/poll?deployment_id=${deploymentId}`
        );
        const status = response.data.status;

        if (status === "Failed") {
          console.log("❌ 배포 실패 감지, 로더 카드 제거");
          clearInterval(failureInterval);
          clearInterval(dashboardInterval);

          setShowDeployLoader(false);
          setDeployPollingActive(false);
          // localStorage.removeItem("deploying");
          // localStorage.removeItem("deploy_started_at");
          // localStorage.removeItem("deploying_project_id");
          // localStorage.removeItem("current_deployment_id");

          // 실패 후 일반 Dashboard 로드
          fetchDashboard();
        }
      } catch (error) {
        console.error("❌ Deploy 실패 감지 폴링 에러:", error);
      }
    }, 5000);

    // 15분 후 정리
    setTimeout(() => {
      clearInterval(failureInterval);
    }, 900000);
  };

  // 유저 API 호출
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setUserLoading(true);
        const response = await client.get("/user");

        if (response.status === 200) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("❌ 유저 API 에러:", error);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, []);

  // 일반 Dashboard 로드 함수
  const fetchDashboard = async () => {
    try {
      setProjectsLoading(true);
      const response = await client.get("/dashboard");

      if (response.status === 200) {
        setProjects(response.data.projects);
      }
    } catch (error) {
      console.error("❌ 대시보드 API 에러:", error);
    } finally {
      setProjectsLoading(false);
    }
  };

  // 로딩 메시지 변경용 useEffect
  useEffect(() => {
    if (userLoading) {
      setLoadingMessage("사용자 정보 로딩 중...");

      const timer = setTimeout(() => {
        setLoadingMessage("프로젝트 카드 구성 중...");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [userLoading]);

  const handleProjectClick = (project) => {
    navigate(`/project/${project.project_id}`);
  };

  // 로딩 체크
  if (userLoading) {
    return (
      <section className="dashboard-section">
        <div className="wrap">
          <Loader text={loadingMessage} />
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
  const formatStorage = (mb) => {
    // 1000MB 이상이면 GB로 표시
    if (mb >= 1000) {
      const gb = mb / 1000;
      // 소수점이 .0이면 정수로 표시
      return gb % 1 === 0 ? `${gb} GB` : `${gb.toFixed(1)} GB`;
    }

    return `${Math.round(mb)} MB`;
  };

  const calculateUsagePercentage = (used, total) => {
    if (!used || !total) return 0;
    return Math.min((used / total) * 100, 100);
  };

  const calculateTotalUsage = (usageType) => {
    if (!projects || projects.length === 0) return 0;

    return projects.reduce((total, project) => {
      const projectUsage = project.usage?.[usageType] || 0;
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

  // 계산 값들
  const totalProjects = projects?.length || 0;
  const activeProjects = projects?.filter((p) => p.status === true).length || 0;
  const inactiveProjects = totalProjects - activeProjects;

  const maxProjects = user?.project_limit || 0;
  const canAddMore = totalProjects < maxProjects;

  // 사용량 계산
  const totalStorageUsed = calculateTotalUsage("storage_used");
  const totalTrafficUsed = calculateTotalUsage("traffic_used");

  // 제한량
  const storageLimit = user?.storage_limit * user?.project_limit;
  const trafficLimit = user?.traffic_limit;

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
            </h3>
            <p>
              <span className="tab-block">
                배포한 프로젝트는 {totalProjects}개이며,{" "}
              </span>
              <span className="tab-block">
                현재 활성화 프로젝트는 {activeProjects}개,{" "}
              </span>
              <span className="tab-block">
                비활성화 프로젝트는 {inactiveProjects}개입니다.
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
                  <span className="used">
                    {formatStorage(totalStorageUsed)}
                  </span>
                  /<span className="total">{formatStorage(storageLimit)}</span>
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
                  <span className="used">
                    {formatStorage(totalTrafficUsed)}
                  </span>
                  /
                  <span className="total">
                    {formatStorage(user?.traffic_limit)}
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
            {/* 배포 중 로더 카드 */}
            {showDeployLoader && (
              <div className="project-box loader-card">
                <div className="loader-content">
                  <div className="spinner"></div>
                  <p className="loader-title">프로젝트 배포 중</p>
                  <p className="loader-subtitle">잠시만 기다려주세요...</p>
                </div>
              </div>
            )}

            {/* 프로젝트 로딩 */}
            {projectsLoading && !showDeployLoader && (
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
                  <p className="project-title ellipsis-1">
                    {project.repo_name}
                  </p>

                  {/* URL 부분만 별도 처리 */}
                  <a
                    className="project-url ellipsis-1"
                    href={
                      project.domain
                        ? `https://${project.domain}.qw1k.cloud`
                        : "#"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!project.domain) {
                        e.preventDefault();
                      }
                    }}
                  >
                    {project.domain
                      ? `${project.domain}.qw1k.cloud`
                      : "배포 중..."}
                  </a>

                  <p
                    className="version"
                    data-full-text={formatCommitMessage(project.commit_message)}
                  >
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
