import "./Header.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login"); // 로그인 페이지로 이동
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <img src="/logo-qwik.svg" alt="QWIK" />
        </Link>

        {isLoggedIn ? (
          <nav className="nav">
            <Link to="/deploy">Deploy</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/settings">MY</Link>
          </nav>
        ) : (
          <button className="login-btn" onClick={handleLogin}>
            LOGIN
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
