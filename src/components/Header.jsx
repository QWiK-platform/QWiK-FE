import "./Header.css";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Header = ({ isLoggedIn, setIsLoggedIn, isMinimal = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Terms 관련 페이지 체크
  const isTermsPage = location.pathname.startsWith("/terms");

  const handleLogin = () => {
    navigate("/login");
  };

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  // width: 600px 이하 메뉴 토글
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Footer 약관 페이지: 로고만
  if (isMinimal) {
    return (
      <header className="minimal-header">
        <div className="header-container">
          <div className="logo-box">
            <Link to="/" className="logo">
              <img src="/logo-qwik.svg" alt="QWIK" />
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // Terms 페이지: 로고 + LOGOUT만
  if (isTermsPage && isLoggedIn) {
    return (
      <header className="terms-header">
        <div className="header-container">
          <div className="logo-box">
            <Link to="/" className="logo">
              <img src="/logo-qwik.svg" alt="QWIK" />
            </Link>
          </div>

          <div className="header-right">
            <button className="logout-btn desk" onClick={handleLogout}>
              LOGOUT
            </button>

            {/* 모바일 햄버거 (로그아웃 전용) */}
            <button
              className="mobile-menu-toggle mob"
              onClick={toggleMobileMenu}
            >
              <span className="hamburger">
                <i className="fa-solid fa-bars-staggered"></i>
              </span>
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 (로그아웃만) */}
        <div
          className={`wrap nav-container ${isMobileMenuOpen ? "mobile-open" : ""}`}
        >
          <nav className="services-nav">
            <button className="close-btn mob" onClick={toggleMobileMenu}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <button className="logout-btn mob" onClick={handleLogout}>
              LOGOUT
            </button>
          </nav>
        </div>
      </header>
    );
  }

  // 일반 페이지: 기존 헤더
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-box">
          <Link to="/" className="logo">
            <img src="/logo-qwik.svg" alt="QWIK" />
          </Link>
        </div>

        <div
          className={`wrap nav-container ${
            isMobileMenuOpen ? "mobile-open" : ""
          }`}
        >
          {isLoggedIn && (
            <nav className="services-nav">
              <button className="close-btn mob" onClick={toggleMobileMenu}>
                <i className="fa-solid fa-xmark"></i>
              </button>
              <Link
                to="/deploy"
                onClick={() => setIsMobileMenuOpen(false)}
                className={location.pathname === "/deploy" ? "active" : ""}
              >
                Deploy
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={location.pathname === "/dashboard" ? "active" : ""}
              >
                Dashboard
              </Link>
              <Link
                to="/pricing"
                onClick={() => setIsMobileMenuOpen(false)}
                className={location.pathname === "/pricing" ? "active" : ""}
              >
                Plan
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className={location.pathname === "/settings" ? "active" : ""}
              >
                MY
              </Link>
              <button className="logout-btn mob" onClick={handleLogout}>
                LOGOUT
              </button>
            </nav>
          )}
        </div>

        <div className="header-right">
          {isLoggedIn ? (
            <>
              <button className="logout-btn desk" onClick={handleLogout}>
                LOGOUT
              </button>
              <button
                className="mobile-menu-toggle mob"
                onClick={toggleMobileMenu}
              >
                <span className="hamburger">
                  <i className="fa-solid fa-bars-staggered"></i>
                </span>
              </button>
            </>
          ) : (
            <button className="login-btn" onClick={handleLogin}>
              LOGIN
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  setIsLoggedIn: PropTypes.func.isRequired,
  isMinimal: PropTypes.bool,
};

export default Header;
