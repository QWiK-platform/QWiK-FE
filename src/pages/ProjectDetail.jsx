import React, { useState } from "react";
import "./ProjectDetail.css";

const ProjectDetail = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubdomain, setNewSubdomain] = useState("");

  // 모달 핸들링
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setNewSubdomain("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="project-detail-section">
      <div className="wrap">
        <div className="project-info-container">
          <p className="title">Project Name</p>
          <div className="toggle-box inactive">
            <span className="toggle"></span>
          </div>
          <div className="subdomain-box">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="project-url eng"
            >
              subdomain.qwik.com
            </a>
            <button className="change-subdomain-btn" onClick={handleOpenModal}>
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
        <div className="history-container">
          <p className="title">배포 히스토리</p>
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
      {isModalOpen && (
        <div className="modal-bg">
          <div className="modal-popup change-subdomain-modal">
            <div className="text-box">
              <p className="title">변경 전 확인해주세요!</p>
              <div className="notice-box">
                <p>변경 버튼을 눌러야만 변경됩니다.</p>
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
                className="input-subdomin"
                placeholder="원하는 서브도메인을 입력해주세요."
              />
              <button className="check for duplicates">중복확인</button>
            </div>
            <div className="confirm-btn-box btn-box">
              <button className="cancel-btn" onClick={handleCloseModal}>
                닫기
              </button>
              <button className="change-btn impact">변경</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectDetail;
