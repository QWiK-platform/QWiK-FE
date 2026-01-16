/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import client from "../api/client";
import "./ProjectDetail.css";

const ProjectDetail = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [domainModalOpen, setDomainModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [isSubmittingDomain, setIsSubmittingDomain] = useState(false);
  const [domainError, setDomainError] = useState("");

  // project detail api
  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId) {
        alert("잘못된 접근입니다.");
        navigate("/dashboard");
        return;
      }

      try {
        setLoading(true);

        const response = await client.get(`/dashboard/${projectId}`);
        setProjectData(response.data);
      } catch (error) {
        console.error("load project error", error);
        setError("프로젝트 데이터를 불러올 수 없습니다.");

        if (error.response?.status === 404) {
          alert("존재하지 않는 프로젝트입니다.");
          navigate("/dashboard");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId, navigate]);

  // change domain api
  const handleChangeDomain = async () => {
    if (!newDomain.trim()) {
      setDomainError("도메인을 입력해주세요");
      return;
    }

    setIsSubmittingDomain(true);
    setDomainError("");

    try {
      const response = await client.patch(`/projects/${projectId}/domain`, {
        new_domain: newDomain,
      });

      // 성공 시 프로젝트 데이터 새로고침
      const updatedProject = await client.get(`/dashboard/${projectId}`);
      setProjectData(updatedProject.data);

      setDomainModalOpen(false);
      setNewDomain("");
      alert("도메인이 성공적으로 변경되었습니다!");
    } catch (error) {
      console.error("change domain error", error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "도메인 변경에 실패했습니다";
      setDomainError(errorMsg);
    } finally {
      setIsSubmittingDomain(false);
    }
  };

  // project delete api
  const handleDeleteProject = async () => {
    try {
      const response = await client.delete(`/projects/${projectId}`);
      navigate("/dashboard");
    } catch (error) {
      console.error("delete error", error);
    } finally {
      setDeleteModalOpen(false);
    }
  };

  // loading
  if (loading) {
    return (
      <section className="project-detail-section">
        <div className="wrap">
          <div className="loading">프로젝트 정보를 불러오는 중...</div>
        </div>
      </section>
    );
  }

  // error
  if (error || !projectData) {
    return (
      <section className="project-detail-section">
        <div className="wrap">
          <div className="error">{error || "프로젝트 데이터가 없습니다."}</div>
          <button onClick={() => navigate("/dashboard")}>
            대시보드로 돌아가기
          </button>
        </div>
      </section>
    );
  }

  // fn formatting date
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

  // handling modal
  const handleOpenDomainModal = () => {
    setDomainModalOpen(true);
    // setNewDomain("");
  };

  const handleCloseDomainModal = () => {
    setDomainModalOpen(false);
  };

  const handleOpenDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  return (
    <section className="project-detail-section">
      <div className="wrap">
        <div className="project-info-container">
          <div className="btn-box">
            <button
              className="project-delete-btn eng"
              onClick={() => setDeleteModalOpen(true)}
            >
              DELETE
            </button>
          </div>
          <p className="project-address eng">
            {projectData.username || "user"}/
            {projectData.repo_name || "repository"}
          </p>

          <div className="title-box pos-rel">
            <p className="title">{projectData.repo_name || "Project Name"}</p>
            <div
              className={`toggle-box ${
                projectData.status ? "active" : "inactive"
              }`}
            >
              <span className="toggle"></span>
            </div>
          </div>

          <div className="domain-box">
            <a
              href={
                projectData.domain
                  ? `https://${projectData.domain}.qw1k.cloud`
                  : "#"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="project-url eng"
              onClick={(e) => {
                if (!projectData.domain) e.preventDefault();
              }}
            >
              {projectData.domain
                ? `${projectData.domain}.qw1k.cloud`
                : "배포 중..."}
            </a>
            <button
              className="change-domain-btn"
              onClick={() => setDomainModalOpen(true)}
            >
              변경하기
            </button>
          </div>
        </div>

        <div className="resource-container">
          <div className="memory-container">
            <div className="text-box">
              <p className="title">메모리 사용량</p>
              <p className="usage eng">
                <span className="used">
                  {projectData.usage?.storage_used || 0}
                </span>
                /<span className="total">200MB</span>
              </p>
            </div>
            <div className="bar-box">
              <div
                className="fill-bar"
                style={{
                  width: `${Math.min(
                    ((projectData.usage?.storage_used || 0) / 200) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
          <div className="traffic-container">
            <div className="text-box">
              <p className="title">트래픽 사용량</p>
              <p className="usage eng">
                <span className="used">
                  {projectData.usage?.traffic_used || 0}
                </span>
                /<span className="total">2GB</span>
              </p>
            </div>
            <div className="bar-box">
              <div
                className="fill-bar"
                style={{
                  width: `${Math.min(
                    ((projectData.usage?.traffic_used || 0) / 2048) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="history-container">
          <div className="title-box">
            <p className="title">프로젝트 히스토리</p>
            <button className="project-reload-btn accent">
              프로젝트 Reload <i className="fa-solid fa-arrows-rotate"></i>
            </button>
          </div>
          <div className="history-box">
            <p>
              <span className="eng">
                {formatDate(projectData.created_at, true)}
              </span>{" "}
              {projectData.commit_message || "초기 배포"}
            </p>
            {projectData.reload_at && (
              <p>
                <span className="eng">
                  {formatDate(projectData.reload_at, true)}
                </span>{" "}
                {projectData.last_commit_message || "재배포"}
              </p>
            )}
          </div>
        </div>
      </div>
      {domainModalOpen && (
        <div className="modal-bg">
          <div className="modal-popup change-domain-modal">
            <div className="title-box">
              <p className="title">변경 전 확인해주세요!</p>
              <div className="notice-box">
                <p>도메인 변경 조건</p>
                <p>
                  변경시, 기존 주소는 사용 불가하며<br></br> 변경 처리로 인해
                  일시적으로 접속이 불가할 수 있습니다.{" "}
                  <span>(약 2분 소요)</span>
                </p>
              </div>
            </div>

            <div className="input-box">
              <input
                type="text"
                className="input-domin"
                value={newDomain}
                placeholder="원하는 서브도메인을 입력해주세요."
                onChange={(e) => setNewDomain(e.target.value)}
                disabled={isSubmittingDomain}
              />
              {domainError && <p className="error-message">{domainError}</p>}
            </div>
            <div className="confirm-btn-box btn-box">
              <button
                className="cancel-btn"
                onClick={handleCloseDomainModal}
                disabled={isSubmittingDomain}
              >
                닫기
              </button>
              <button
                className="change-btn accent"
                onClick={handleChangeDomain}
                disabled={isSubmittingDomain}
              >
                변경
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteModalOpen && (
        <div className="modal-bg">
          <div className="modal-popup delete-project-modal">
            <div className="title-box">
              <p className="title">프로젝트를 삭제하시겠습니까?</p>
              <div className="notice-box">
                <p>프로젝트 삭제를 위해서는 아래 값을 정확하게 입력해주세요.</p>
                <p>삭제 이후에는 해당 프로젝트 내용을 복구할 수 없습니다.</p>
              </div>
            </div>
            <div className="input-box">
              <input
                type="text"
                className="check-repository"
                placeholder="레포지토리 이름을 입력해주세요."
              />
            </div>
            <div className="input-box">
              <input
                type="text"
                className="check-domain"
                placeholder="삭제하는 프로젝트의 주소를 정확하게 입력해주세요."
              />
            </div>
            <div className="btn-box delete-btn-box">
              <button
                className="cancel-btn"
                onClick={() => setDeleteModalOpen(false)}
              >
                취소
              </button>
              <button
                className="delete-btn accent"
                onClick={handleDeleteProject}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectDetail;
