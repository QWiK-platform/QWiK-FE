import React from "react";
import { useNavigate } from "react-router-dom";
import "./ErrorPage.css";

const ErrorPage = ({
  title = "접근할 수 없습니다",
  message = "요청하신 페이지에 접근할 수 없거나 존재하지 않습니다.",
}) => {
  const navigate = useNavigate();

  return (
    <section className="error-page">
      <div className="error-content">
        <div className="error-icon">
          <i className="fa-solid fa-xmark"></i>
        </div>
        <h4>{title}</h4>
        <p>
          <span className="eng">QWiK</span>에서 {message}
        </p>

        <div className="btn-box">
          <button className="accent" onClick={() => navigate("/")}>
            처음 화면으로 이동
          </button>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
