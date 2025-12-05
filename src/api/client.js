import axios from "axios";

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("🔍 인터셉터 실행!");
  console.log("🔑 토큰:", token);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("✅ Authorization 헤더 추가됨");
  } else {
    console.log("❌ 토큰이 없음");
  }
  
  console.log("📤 최종 헤더:", config.headers);
  return config;
});

export default client;
