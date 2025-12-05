// client/src/api/axiosConfig.js (수정 완료)

// 공통 axios 인스턴스 설정 (기본 URL, withCredentials 등)
import axios from "axios";

const api = axios.create({
 // 💡 수정! baseURL을 상대 경로인 '/api'로 설정하여
 // 💡 package.json의 Proxy(http://localhost:5000) 설정을 따르도록 합니다.
 baseURL: '/api', 
 // withCredentials: true, // 세션 방식 사용 시
 headers: {
 "Content-Type": "application/json",
 },
});

// 요청 인터셉터: 토큰 자동 첨부 (localStorage JWT 사용 예)
api.interceptors.request.use((config) => {
 const token = localStorage.getItem("token");
 if (token) config.headers.Authorization = `Bearer ${token}`;
 return config;
});

export default api;