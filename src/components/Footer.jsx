import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="wrap">
        <ul className="term-container">
          <li>
            <Link to="/terms/service">이용약관</Link>
          </li>
          <li>
            <Link to="/terms/privacy">개인정보처리방침</Link>
          </li>
          <li>
            <Link to="/terms/repository">GitHub Repository 권한</Link>
          </li>
          <li>사업자 정보</li> {/* 나중에 추가 예정 */}
          <li>
            <a href="https://forms.gle/Gv8c9F9fqY2wG7VYA" target="_blank">
              고객센터
            </a>
          </li>
        </ul>
        <ul className="company-info-container">
          <li>(c) 2025 QWiK</li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
