import "./Header.css";
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // 이것만 추가!

  const handleLogin = () => {
    navigate("/login");
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
            <Link
              to="/pricing"
              className={`pricing-link ${
                location.pathname === "/pricing" ? "active" : ""
              }`}
            >
              Pricing
            </Link>
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
