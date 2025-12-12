import "./Header.css";
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  // Props로 받기
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
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-box">
          <Link to="/" className="logo">
            <img src="/logo-qwik.svg" alt="QWIK" />
          </Link>
        </div>

        <div className="nav-container">
          {isLoggedIn && (
            <nav className="services-nav">
              <Link
                to="/deploy"
                className={location.pathname === "/deploy" ? "active" : ""}
              >
                Deploy
              </Link>
              <Link
                to="/dashboard"
                className={location.pathname === "/dashboard" ? "active" : ""}
              >
                Dashboard
              </Link>
              <Link
                to="/pricing"
                className={location.pathname === "/pricing" ? "active" : ""}
              >
                Pricing
              </Link>
              <Link
                to="/settings"
                className={location.pathname === "/settings" ? "active" : ""}
              >
                MY
              </Link>
            </nav>
          )}
        </div>

        <div className="header-right">
          {isLoggedIn ? (
            <button className="logout-btn" onClick={handleLogout}>
              LOGOUT
            </button>
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

export default Header;
