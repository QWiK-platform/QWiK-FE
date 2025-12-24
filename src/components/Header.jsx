import "./Header.css";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    navigate("/login");
  };

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false); // 부모 컴포넌트 상태 업데이트
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  // width: 600px 이하 메뉴 토글
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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
                Pricing
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
};

export default Header;
