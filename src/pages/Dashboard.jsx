import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const mockProjects = [
    {
      id: 1,
      name: "test-project",
      userName: "testmock",
      status: "active",
      githubRepo: "test-repo",
      dsecription: "first",
      subdomain: "test-dev",
      createdAt: "2025-11-18T14:30:00",
      updatedAt: "",
    },
    {
      id: 2,
      name: "second-project",
      userName: "testmock",
      status: "inactive",
      githubRepo: "second-repo",
      dsecription: "second merge",
      subdomain: "second-dev",
      createdAt: "2025-11-19T16:54:01",
      updatedAt: "2025-11-19T17:05:04",
    },
  ];

  // 날짜 포맷팅
  const formatDate = (dateString, includeTime = false) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2); // yy
    const month = String(date.getMonth() + 1).padStart(2, "0"); // mm
    const day = String(date.getDate()).padStart(2, "0"); // dd

    if (includeTime) {
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}.${month}.${day} ${hours}:${minutes}`;
    }

    return `${year}.${month}.${day}`;
  };

  // 클릭 핸들러
  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  useEffect(() => {
    const testUserAPI = async () => {
      const token = localStorage.getItem("token");
      console.log("저장된 토큰:", token);

      if (token) {
        try {
          const response = await fetch(
            "https://cmbvknq8pi.execute-api.ap-northeast-2.amazonaws.com/dev/api/user/me",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("User API 응답:", response.status);
          const userData = await response.json();
          console.log("사용자 데이터:", userData);
        } catch (error) {
          console.error("User API 에러:", error);
        }
      }
    };

    testUserAPI();
  }, []);

  return (
    <section className="dashboard-section">
      <div className="wrap">
        <div className="info-text-container">
          <h3 className="title-text">USER NAME 님의 서비스 이용 현황입니다.</h3>
          <p>
            배포한 프로젝트는 N개이며, 현재 활성화 프로젝트는 N개, 비활성화
            프로젝트는 N개입니다.
          </p>
        </div>

        <div className="resource-container">
          <div className="memory-container">
            <div className="text-box">
              <p className="title">메모리 사용량</p>
              <p className="usage eng">
                <span className="used">NNN</span>/
                <span className="total">2GB</span>
              </p>
            </div>
            <div className="bar-box">
              <div className="fill-bar"></div>
            </div>
          </div>
          <div className="traffic-container">
            <div className="text-box">
              <p className="title">트래픽 사용량</p>
              <p className="usage eng">
                <span className="used">NNN</span>/
                <span className="total">2GB</span>
              </p>
            </div>
            <div className="bar-box">
              <div className="fill-bar"></div>
            </div>
          </div>
        </div>
        <div className="project-list-container">
          <p className="project-counter eng">{mockProjects.length} / 3</p>
          <div className="project-list-box">
            {mockProjects.map((project) => (
              <div
                key={project.id}
                className="project-box eng"
                onClick={() => handleProjectClick(project.id)}
                style={{ cursor: "pointer" }}
              >
                <span className="git-repository">
                  {project.userName}/{project.githubRepo}
                </span>
                <span className={`status ${project.status}`}></span>
                <p className="project-title">{project.name}</p>
                <p className="project-url">{project.subdomain}.q-wik.com</p>
                <p className="version">
                  ver.<span>{project.dsecription}</span>
                </p>
                <div className="date-box">
                  <p className="origin">
                    최초 <span>{formatDate(project.createdAt)}</span>
                  </p>

                  {project.updatedAt && (
                    <>
                      <span>/</span>
                      <p className="update">
                        마지막{" "}
                        <span>{formatDate(project.updatedAt, true)}</span>
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
            {/* 조건부 + 버튼 */}
            {mockProjects.length < 3 ? (
              // 여유 있을 때: available
              <div className="project-box available">
                <i className="fas fa-plus"></i>
                <p>프로젝트 배포하러 가기</p>
              </div>
            ) : (
              // 꽉 찼을 때: full
              <div className="project-box full">
                <i className="fas fa-plus"></i>
                <p>프로젝트를 더 배포하고 싶다면?</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
