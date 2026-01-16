/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import client from "../api/client";
import "./ProjectDetail.css";
import Loader from "../components/Loader";
import exceptDomainSet from "../data/domain/exceptDomainSet";

const ProjectDetail = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [domainModalOpen, setDomainModalOpen] = useState(false);
  const [domainChangeLoading, setDomainChangeLoading] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [isSubmittingDomain, setIsSubmittingDomain] = useState(false);
  const [domainError, setDomainError] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteRepoName, setDeleteRepoName] = useState("");
  const [deleteDomainName, setDeleteDomainName] = useState("");

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

  // verficate domain
  const validateDomain = (domain) => {
    const normalizedDomain = domain.toLowerCase().trim();

    // 빈 값 체크
    if (!normalizedDomain) {
      return "도메인을 입력해주세요";
    }

    // 예약어 체크
    if (exceptDomainSet.has(normalizedDomain)) {
      return "이미 사용 중이거나 예약된 도메인입니다";
    }

    // 추가 검증 (영문, 숫자, 하이픈만 허용)
    if (!/^[a-zA-Z0-9-]+$/.test(normalizedDomain)) {
      return "영문, 숫자, 하이픈(-)만 사용 가능합니다";
    }

    // 하이픈으로 시작/끝나면 안됨
    if (normalizedDomain.startsWith("-") || normalizedDomain.endsWith("-")) {
      return "하이픈으로 시작하거나 끝날 수 없습니다";
    }

    return null; // 통과
  };

  // change domain api
  const handleChangeDomain = async () => {
    const validationError = validateDomain(newDomain);
    if (validationError) {
      setDomainError(validationError);
      return;
    }

    setIsSubmittingDomain(true);
    setDomainError("");

    try {
      const response = await client.patch(`/projects/${projectId}/domain`, {
        new_domain: newDomain.toLowerCase().trim(),
      });

      // 성공 시 기존 모달 닫고 로딩 모달 열기
      setDomainModalOpen(false);
      setNewDomain("");
      setDomainChangeLoading(true);

      startDomainPolling(newDomain.toLowerCase().trim());
    } catch (error) {
      console.error("change domain error", error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "도메인 변경에 실패했습니다";
      setDomainError(errorMsg);
      setIsSubmittingDomain(false);
    }
  };

  // 도메인 준비 상태 폴링
  const startDomainPolling = (domain) => {
    console.log("🔄 도메인 준비 상태 폴링 시작:", `${domain}.qw1k.cloud`);

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`https://${domain}.qw1k.cloud`, {
          method: "HEAD",
          mode: "cors",
          cache: "no-cache",
        });

        if (response.status === 200) {
          clearInterval(interval);

          setDomainChangeLoading(false);
          setIsSubmittingDomain(false);

          // 프로젝트 데이터 새로고침
          const updatedProject = await client.get(`/dashboard/${projectId}`);
          setProjectData(updatedProject.data);

          alert("도메인이 성공적으로 변경되었습니다!");
        } else {
          console.log(`⏳ 도메인 아직 준비 중... (${response.status})`);
        }
      } catch (error) {
        if (error.message.includes("CORS") || error.name === "TypeError") {
          clearInterval(interval);

          setDomainChangeLoading(false);
          setIsSubmittingDomain(false);

          const updatedProject = await client.get(`/dashboard/${projectId}`);
          setProjectData(updatedProject.data);

          alert("도메인이 성공적으로 변경되었습니다!");
        } else {
          console.log("❌ 네트워크 에러:", error.message);
        }
      }
    }, 5000);

    // 최대 5분 후 타임아웃
    setTimeout(() => {
      clearInterval(interval);
      if (domainChangeLoading) {
        setDomainChangeLoading(false);
        setIsSubmittingDomain(false);
        alert(
          "도메인 변경이 완료되었지만, 아직 접속이 불가할 수 있습니다. 잠시 후 다시 시도해주세요."
        );
      }
    }, 300000);
  };

  // project delete api
  const handleDeleteProject = async () => {
    // 레포지토리 이름 검증
    if (deleteRepoName.trim() !== projectData.repo_name) {
      alert("레포지토리 이름이 일치하지 않습니다.");
      return;
    }

    // 도메인 주소 검증 (qw1k.cloud 포함)
    const fullDomainName = `${projectData.domain}.qw1k.cloud`;
    if (deleteDomainName.trim() !== fullDomainName) {
      alert("프로젝트 주소가 일치하지 않습니다.");
      return;
    }

    try {
      console.log("project id to delete", projectId);
      const response = await client.delete(`/projects/${projectId}`);
      console.log("deletion complete", response.data);
      navigate("/dashboard");
    } catch (error) {
      console.error("delete error", error);
      alert("삭제에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setDeleteModalOpen(false);
      // 상태 초기화
      setDeleteRepoName("");
      setDeleteDomainName("");
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
            <span
              className={`status ${projectData.status ? "active" : "inactive"}`}
            ></span>
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
              <p className="title">스토리지 사용량</p>
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
            {projectData.history
              ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((historyItem, index) => (
                <div key={index} className="history-item">
                  <span className="dated eng">
                    {formatDate(historyItem.created_at)}
                  </span>
                  <span
                    className={`status-bullet eng ${historyItem.build_status}`}
                  >
                    {historyItem.build_status}
                  </span>
                  <span className="commit-message ellipsis-1">
                    {historyItem.commit_message}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
      {domainModalOpen && (
        <div className="modal-bg">
          <div className="modal-popup change-domain-modal">
            <div className="title-box">
              <p className="title">{projectData.domain}을 어떻게 변경할까요?</p>
              <div className="notice-box">
                <p>영소문자와 -만 사용 가능합니다.</p>
                <p>
                  변경시, 기존 주소는 사용이 불가하며<br></br> 변경 처리로 인해
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
              <p className="input-label">
                레포지토리 이름:{" "}
                <span className="required-text">{projectData.repo_name}</span>
              </p>
              <input
                type="text"
                className="check-repository"
                placeholder="레포지토리 이름을 입력해주세요."
                value={deleteRepoName}
                onChange={(e) => setDeleteRepoName(e.target.value)}
              />
            </div>
            <div className="input-box">
              <p className="input-label">
                프로젝트 주소:{" "}
                <span className="required-text">
                  {projectData.domain}.qw1k.cloud
                </span>
              </p>
              <input
                type="text"
                className="check-domain"
                placeholder="삭제하는 프로젝트의 주소를 정확하게 입력해주세요."
                value={deleteDomainName}
                onChange={(e) => setDeleteDomainName(e.target.value)}
              />
            </div>

            <div className="btn-box delete-btn-box">
              <button className="cancel-btn" onClick={handleCloseDeleteModal}>
                취소
              </button>
              <button
                className="delete-btn accent"
                onClick={handleDeleteProject}
                disabled={
                  deleteRepoName.trim() !== projectData.repo_name ||
                  deleteDomainName.trim() !== `${projectData.domain}.qw1k.cloud`
                }
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
      {domainChangeLoading && (
        <div className="modal-bg">
          <div className="modal-popup domain-loading-modal">
            <Loader text="도메인을 변경하고 있습니다." />
            <div className="loading-info">
              <p className="loading-subtitle">최대 2-3분 소요될 수 있습니다.</p>
              <p className="loading-detail">연결까지 잠시만 기다려주세요!</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectDetail;
