// App.jsx
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GlobalBGM from "./components/GlobalBGM";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 페이지들
import Home from "./pages/Home";
import Feed from "./pages/Feed";
import ReviewDetail from "./pages/ReviewDetail";
import Magazine from "./pages/Magazine";
import Profile from "./pages/Profile";
import CouponCenter from "./pages/CouponCenter";
import Explore from "./pages/Explore";
import Studio from "./pages/Studio";
import MyPage from "./pages/MyPage";
import PersonalColor from "./pages/PersonalColor";

// 인증 페이지
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

function App() {
  return (
    <Router>
      {/* ✨ 웹 전체 테두리 장식 ✨ */}
      <div className="page-border-decor" aria-hidden="true"></div>
      <div className="sparkle-border" aria-hidden="true"></div>
      
      {/* 코너 장식 */}
      <div style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        fontSize: '24px',
        zIndex: 9999,
        animation: 'sparkle-border 1.5s ease-in-out infinite',
        filter: 'drop-shadow(0 0 8px gold)'
      }}>✨</div>
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        fontSize: '24px',
        zIndex: 9999,
        animation: 'sparkle-border 1.5s ease-in-out infinite 0.3s',
        filter: 'drop-shadow(0 0 8px gold)'
      }}>💎</div>
      <div style={{
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        fontSize: '24px',
        zIndex: 9999,
        animation: 'sparkle-border 1.5s ease-in-out infinite 0.6s',
        filter: 'drop-shadow(0 0 8px gold)'
      }}>🌸</div>
      <div style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        fontSize: '24px',
        zIndex: 9999,
        animation: 'sparkle-border 1.5s ease-in-out infinite 0.9s',
        filter: 'drop-shadow(0 0 8px gold)'
      }}>💖</div>

      {/* Floating decorative blobs */}
      <div className="floating-blob b1" aria-hidden="true"></div>
      <div className="floating-blob b2" aria-hidden="true"></div>

      {/* 공통 네비게이션 */}
      <Navbar />

      <Routes>
        {/* 홈 화면 */}
        <Route path="/" element={<Home />} />

        {/* SNS 피드 */}
        <Route path="/feed" element={<Feed />} />

        {/* 리뷰 상세 */}
        <Route path="/review/:id" element={<ReviewDetail />} />

        {/* AI 매거진 */}
        <Route path="/magazine" element={<Magazine />} />

        {/* 프로필 */}
        <Route path="/profile" element={<Profile />} />

        {/* 쿠폰센터 */}
        <Route path="/coupons" element={<CouponCenter />} />
        {/* /promo will show coupon + roulette combined */}
        <Route path="/promo" element={<CouponCenter />} />

        {/* Newly added placeholders */}
        <Route path="/explore" element={<Explore />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/personal-color" element={<PersonalColor />} />

        {/* 로그인 / 회원가입 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      {/* 푸터 */}
      <Footer />
      
      {/* 전역 BGM 플레이어 */}
      <GlobalBGM />
      
      <ToastContainer />
    </Router>
  );
}

export default App;
