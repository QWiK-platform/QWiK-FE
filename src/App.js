import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from './components/Footer';
import Index from "./pages/Index";
import Login from "./pages/Login";
import Deploy from "./pages/Deploy";
import Dashboard from "./pages/Dashboard";
import ProjectDetail from "./pages/ProjectDetail";
import Settings from "./pages/Settings";
import AuthCallback from "./pages/AuthCallback";
import Pricing from "./pages/Pricing";
import Terms from './pages/Terms';
import Term from './components/Term';
import ErrorPage from './pages/ErrorPage'; // ✅ ErrorPage import 추가
import ProtectedRoute from './components/ProtectedRoute';
import "./App.css";

// 헤더/푸터 표시 여부를 결정하는 컴포넌트
function AppContent({ isLoggedIn, setIsLoggedIn }) {
  const location = useLocation();

  // Terms 페이지에서는 로그인 안 된 헤더로 표시
  const isTermsPage = location.pathname === '/terms';
  const isFooterTermsPage = location.pathname.startsWith('/terms/');

  return (
    <div className="App">
      <Header
        isLoggedIn={isFooterTermsPage ? false : isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        isMinimal={isFooterTermsPage}  // 새로운 prop 필요
      />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/auth/callback"
          element={<AuthCallback setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/terms" element={<Terms />} />
        <Route path="/terms/:type" element={<Term />} />

        {/* 🎨 CSS 작업용 테스트 라우트 */}
        <Route path="/test-error" element={<ErrorPage />} />

        {/* 보호된 라우트들 */}
        <Route path="/deploy" element={
          <ProtectedRoute>
            <Deploy />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/project/:projectId" element={
          <ProtectedRoute>
            <ProjectDetail />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/pricing" element={
          <ProtectedRoute>
            <Pricing />
          </ProtectedRoute>
        } />

        {/* 🚨 404 페이지 - 맨 마지막에! */}
        <Route path="*" element={<ErrorPage type="404" />} />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Router>
      <AppContent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </Router>
  );
}

export default App;