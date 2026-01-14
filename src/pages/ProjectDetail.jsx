/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import client from "../api/client";
import "./ProjectDetail.css";

const ProjectDetail = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [domainModalOpen, setDomainModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [isSubmittingDomain, setIsSubmittingDomain] = useState(false);
  const [domainError, setDomainError] = useState("에러메시지 위치");

  // 서브도메인 변경 API 호출
  const handleChangeDomain = async () => {
    if (!newDomain.trim()) {
      setDomainError("서브도메인을 입력해주세요");
      return;
    }

    setIsSubmittingDomain(true);
    setDomainError("");

    try {
      console.log("🔍 도메인 변경 요청:", {
        projectId: projectId,
        newDomain: newDomain,
      });

      const response = await client.patch(`/projects/${projectId}/domain`, {
        new_domain: newDomain, // 백엔드 요구 형식에 맞춰서
      });

      console.log("도메인 변경", response.data);

      // 성공 시 모달 닫기
      setDomainModalOpen(false);
      setNewDomain("");

      // TODO: 성공 메시지 표시 또는 페이지 데이터 새로고침
      alert("서브도메인이 성공적으로 변경되었습니다!");
    } catch (error) {
      console.log("서브도메인 변경 실패:", error.response?.data);

      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "서브도메인 변경에 실패했습니다";
      setDomainError(errorMsg);
    } finally {
      setIsSubmittingDomain(false);
    }
  };

  // project delete api
  useEffect(() => {
    console.log("extracting params from a link", projectId);
    if (!projectId) {
      alert("잘못된 접근입니다.");
      navigate("/dashboard");
    }
  }, [projectId, navigate]);

  const handleDeleteProject = async () => {
    try {
      console.log("project id to delete", projectId);
      const response = await client.delete(`/projects/${projectId}`);
      console.log("deletion complete", response.data);
      navigate("/dashboard");
    } catch (error) {
      console.error("delete error", error);
      console.error("original error", error.response);
      console.error("error data", error.response?.data);
    } finally {
      setDeleteModalOpen(false);
    }
  };

  // 모달 핸들링
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
          <p className="project-address eng">githubId/repository-name</p>
          <div className="title-box pos-rel">
            <p className="title">Project Name</p>
            <div className="toggle-box inactive">
              <span className="toggle"></span>
            </div>
          </div>
          <div className="domain-box">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="project-url eng"
            >
              domain.qw1k.cloud
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
                <span className="used">NNN</span>/
                <span className="total">200MB</span>
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
        <div className="history-container">
          <div className="title-box">
            <p className="title">프로젝트 히스토리</p>
            <button className="project-reload-btn accent">
              프로젝트 Reload <i className="fa-solid fa-arrows-rotate"></i>
            </button>
          </div>
          <div className="history-box">
            <p>
              <span className="eng">yy.mm.dd hh:mm</span> commit message
            </p>
            <p>
              <span className="eng">yy.mm.dd hh:mm</span> 어느길이까지 가능한지
              테스트 작업 말줄임표 나올 때까지 길어지게 입력
            </p>
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
              ></button>
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
