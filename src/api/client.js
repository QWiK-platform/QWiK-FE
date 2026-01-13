import axios from "axios";

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },

});

// 요청 인터셉터 - 토큰 자동 첨부
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 토큰 만료/에러 처리
client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 Unauthorized - 토큰 만료/유효하지 않음
    if (error.response?.status === 401) {
      // 토큰 삭제
      localStorage.removeItem("token");

      // 로그인 페이지로 리다이렉트
      window.location.href = "/login";

      return Promise.reject(new Error("인증이 만료되었습니다. 다시 로그인해주세요."));
    }

    // 403 Forbidden - 권한 없음
    if (error.response?.status === 403) {
      return Promise.reject(new Error("접근 권한이 없습니다."));
    }

    // 500 Internal Server Error
    if (error.response?.status === 500) {
      return Promise.reject(new Error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."));
    }

    // 네트워크 에러
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error("요청 시간이 초과되었습니다."));
    }

    // 기타 에러
    return Promise.reject(error);
  }
);

export default client;