// components/Navbar.jsx
import { NavLink, Link } from "react-router-dom";
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  return (
    <header className="site-nav">
      <div className="site-brand">
        <Link 
          to="/"
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
          style={{ 
            display: 'inline-block',
            position: 'relative',
            textDecoration: 'none'
          }}
        >
          {/* 배경 글로우 효과 */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isLogoHovered ? 120 : 80,
            height: isLogoHovered ? 60 : 40,
            background: 'radial-gradient(ellipse, rgba(255,77,136,0.4) 0%, rgba(168,85,247,0.3) 40%, transparent 70%)',
            filter: 'blur(12px)',
            opacity: isLogoHovered ? 1 : 0.6,
            transition: 'all 0.4s ease',
            zIndex: 0,
            animation: 'logoPulse 2s ease-in-out infinite'
          }} />
          
          {/* 스파클 효과들 */}
          <div style={{
            position: 'absolute',
            top: -5,
            left: -8,
            fontSize: 12,
            opacity: isLogoHovered ? 1 : 0,
            transform: isLogoHovered ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-180deg)',
            transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            animation: isLogoHovered ? 'sparkle 1s ease-in-out infinite' : 'none'
          }}>✨</div>
          <div style={{
            position: 'absolute',
            top: -8,
            right: -5,
            fontSize: 10,
            opacity: isLogoHovered ? 1 : 0,
            transform: isLogoHovered ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(180deg)',
            transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            transitionDelay: '0.1s',
            animation: isLogoHovered ? 'sparkle 1.2s ease-in-out infinite 0.2s' : 'none'
          }}>💖</div>
          <div style={{
            position: 'absolute',
            bottom: -6,
            right: 0,
            fontSize: 11,
            opacity: isLogoHovered ? 1 : 0,
            transform: isLogoHovered ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-90deg)',
            transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            transitionDelay: '0.15s',
            animation: isLogoHovered ? 'sparkle 0.9s ease-in-out infinite 0.3s' : 'none'
          }}>⭐</div>
          <div style={{
            position: 'absolute',
            bottom: -4,
            left: -5,
            fontSize: 9,
            opacity: isLogoHovered ? 1 : 0,
            transform: isLogoHovered ? 'scale(1)' : 'scale(0)',
            transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            transitionDelay: '0.2s',
            animation: isLogoHovered ? 'sparkle 1.1s ease-in-out infinite 0.1s' : 'none'
          }}>💄</div>
          
          <picture style={{ position: 'relative', zIndex: 1 }}>
            <source srcSet="/images/picktory.png" type="image/png" />
            <img 
              src="/images/picktory.svg" 
              alt="PICKTORY" 
              className="site-logo" 
              style={{
                filter: isLogoHovered 
                  ? 'drop-shadow(0 0 8px rgba(255,77,136,0.6)) drop-shadow(0 0 20px rgba(168,85,247,0.4))' 
                  : 'drop-shadow(0 2px 4px rgba(255,77,136,0.2))',
                transform: isLogoHovered ? 'scale(1.08) rotate(-2deg)' : 'scale(1) rotate(0deg)',
                transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                animation: 'logoFloat 3s ease-in-out infinite'
              }}
            />
          </picture>
          
          {/* 호버 시 나타나는 하트 파티클 */}
          {isLogoHovered && (
            <>
              <span style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                fontSize: 8,
                animation: 'floatUp 1s ease-out forwards',
                pointerEvents: 'none'
              }}>💕</span>
              <span style={{
                position: 'absolute',
                top: '60%',
                left: '30%',
                fontSize: 7,
                animation: 'floatUp 1.2s ease-out forwards 0.2s',
                pointerEvents: 'none',
                opacity: 0
              }}>💗</span>
              <span style={{
                position: 'absolute',
                top: '40%',
                left: '70%',
                fontSize: 9,
                animation: 'floatUp 0.9s ease-out forwards 0.1s',
                pointerEvents: 'none',
                opacity: 0
              }}>💖</span>
            </>
          )}
        </Link>
      </div>
      
      {/* CSS 애니메이션 정의 */}
      <style>{`
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes logoPulse {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.8); }
        }
        @keyframes floatUp {
          0% { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(var(--tx, 10px), -30px) scale(0.5); }
        }
      `}</style>
      
      <nav className="links" aria-label="주요 탐색">
        <NavLink to="/feed" className={({isActive})=> isActive ? 'nav-link active' : 'nav-link'}>
          <span className="nav-icon" aria-hidden>📝</span>
          <span>리뷰 피드</span>
        </NavLink>
        <NavLink to="/explore" className={({isActive})=> isActive ? 'nav-link active' : 'nav-link'}>
          <span className="nav-icon" aria-hidden>🔍</span>
          <span>탐색</span>
        </NavLink>
        <NavLink to="/studio" className={({isActive})=> isActive ? 'nav-link active' : 'nav-link'}>
          <span className="nav-icon" aria-hidden>🎬</span>
          <span>협찬 스튜디오</span>
        </NavLink>
        <NavLink to="/mypage" className={({isActive})=> isActive ? 'nav-link active' : 'nav-link'}>
          <span className="nav-icon" aria-hidden>👤</span>
          <span>마이페이지</span>
        </NavLink>
        <NavLink to="/personal-color" className={({isActive})=> isActive ? 'nav-link active' : 'nav-link'}>
          <span className="nav-icon" aria-hidden>🎨</span>
          <span>퍼스널컬러</span>
        </NavLink>
        {!user && (
          <>
            <NavLink to="/login" className="nav-link" style={{ marginLeft: 8 }}>
              <span className="nav-icon" aria-hidden>🔐</span>
              <span>로그인</span>
            </NavLink>
            <NavLink to="/register" className="nav-link" style={{ marginLeft: 8 }}>
              <span className="nav-icon" aria-hidden>✍️</span>
              <span>회원가입</span>
            </NavLink>
          </>
        )}

        {/* Prominent Promo / Roulette CTA */}
        <Link to="/promo" style={{ marginLeft: 12, textDecoration: 'none' }}>
          <button className="roulette-cta pulse" aria-label="쿠폰 및 룰렛 참여하기">
            <span className="icon-rotate" aria-hidden>🎡</span>
            <span className="label">쿠폰 & 룰렛</span>
          </button>
        </Link>
      </nav>
    </header>
  );
}

export default Navbar;
