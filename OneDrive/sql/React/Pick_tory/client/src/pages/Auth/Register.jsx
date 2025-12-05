// pages/Auth/Register.jsx (수정 완료)

import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function Register() {
const navigate = useNavigate();
const { register } = useContext(AuthContext);
// 🚨 수정! username 대신 name을 사용합니다.
const [name, setName] = useState(''); 
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [password2, setPassword2] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const handleSubmit = async (e) => {
e.preventDefault();
setError(null);
// 🚨 수정! username 대신 name을 사용합니다.
if (!name || !email || !password) return setError('필수 항목을 모두 입력하세요.');
if (password !== password2) return setError('비밀번호가 일치하지 않습니다.');
try {
setLoading(true);
// 🚨 수정! 주석을 제거하고 API 호출을 활성화합니다.
await register({ name, email, password }); 
navigate('/');
} catch (err) {
setError(err.response?.data?.message || err.message || '회원가입 실패');
} finally {
setLoading(false);
}
};

return (
  <div 
    ref={containerRef}
    style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: `
        radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(168,85,247,0.12) 0%, transparent 50%),
        linear-gradient(135deg, #faf5ff 0%, #fff5f7 50%, #f0f9ff 100%)
      `,
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    {/* CSS 애니메이션 */}
    <style>{`
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-15px) rotate(5deg); }
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.7; }
        50% { transform: scale(1.1); opacity: 1; }
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      @keyframes glow {
        0%, 100% { box-shadow: 0 20px 60px rgba(168,85,247,0.2); }
        50% { box-shadow: 0 20px 80px rgba(168,85,247,0.35); }
      }
      .register-input:focus {
        border-color: #a855f7 !important;
        box-shadow: 0 0 0 3px rgba(168,85,247,0.15) !important;
      }
    `}</style>

    {/* 플로팅 장식 */}
    <div style={{ position: 'absolute', top: '10%', left: '8%', fontSize: 36, animation: 'float 6s ease-in-out infinite', opacity: 0.4, pointerEvents: 'none' }}>✨</div>
    <div style={{ position: 'absolute', top: '20%', right: '12%', fontSize: 28, animation: 'float 5s ease-in-out infinite 1s', opacity: 0.35, pointerEvents: 'none' }}>💄</div>
    <div style={{ position: 'absolute', bottom: '25%', left: '10%', fontSize: 24, animation: 'float 7s ease-in-out infinite 2s', opacity: 0.3, pointerEvents: 'none' }}>🌸</div>
    <div style={{ position: 'absolute', bottom: '15%', right: '8%', fontSize: 30, animation: 'float 4s ease-in-out infinite 0.5s', opacity: 0.4, pointerEvents: 'none' }}>💖</div>
    <div style={{ position: 'absolute', top: '50%', left: '5%', fontSize: 20, animation: 'float 5s ease-in-out infinite 1.5s', opacity: 0.25, pointerEvents: 'none' }}>⭐</div>

    <div style={{ 
      maxWidth: 480, 
      width: '100%',
      animation: 'slideUp 0.6s ease-out, glow 3s ease-in-out infinite'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(20px)',
        borderRadius: 32,
        padding: '44px 40px',
        boxShadow: '0 24px 80px rgba(168,85,247,0.15)',
        border: '1px solid rgba(255,255,255,0.5)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 배경 장식 */}
        <div style={{ 
          position: 'absolute', 
          top: -60, 
          right: -60, 
          width: 150, 
          height: 150, 
          background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        <div style={{ 
          position: 'absolute', 
          bottom: -40, 
          left: -40, 
          width: 120, 
          height: 120, 
          background: 'radial-gradient(circle, rgba(255,77,136,0.08) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />

        {/* 로고 */}
        <div style={{ textAlign: 'center', marginBottom: 28, position: 'relative', zIndex: 1 }}>
          <div style={{ 
            fontSize: 48, 
            marginBottom: 12,
            animation: 'pulse 2s ease-in-out infinite'
          }}>🌟</div>
          <h2 style={{ 
            margin: 0,
            fontSize: 26,
            fontWeight: 900,
            background: 'linear-gradient(135deg, #a855f7, #ff4d88)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>새 계정 만들기</h2>
          <p style={{ color: '#888', marginTop: 8, fontSize: 14 }}>Pick-tory와 함께 뷰티 여정을 시작해요! 💖</p>
        </div>

        <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
          <label style={{ display: 'block', marginBottom: 18 }}>
            <div style={{ fontSize: 13, color: '#666', fontWeight: 600, marginBottom: 8 }}>이름</div>
            <input 
              className="register-input"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="닉네임을 입력하세요"
              style={{ 
                width: '100%', 
                padding: '14px 16px', 
                borderRadius: 16, 
                border: '2px solid #eee',
                fontSize: 15,
                outline: 'none',
                transition: 'all 0.3s ease',
                background: 'rgba(255,255,255,0.8)'
              }} 
            />
          </label>

          <label style={{ display: 'block', marginBottom: 18 }}>
            <div style={{ fontSize: 13, color: '#666', fontWeight: 600, marginBottom: 8 }}>이메일</div>
            <input 
              className="register-input"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="example@email.com"
              style={{ 
                width: '100%', 
                padding: '14px 16px', 
                borderRadius: 16, 
                border: '2px solid #eee',
                fontSize: 15,
                outline: 'none',
                transition: 'all 0.3s ease',
                background: 'rgba(255,255,255,0.8)'
              }} 
            />
          </label>

          <label style={{ display: 'block', marginBottom: 18 }}>
            <div style={{ fontSize: 13, color: '#666', fontWeight: 600, marginBottom: 8 }}>비밀번호</div>
            <input 
              className="register-input"
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="비밀번호를 입력하세요"
              style={{ 
                width: '100%', 
                padding: '14px 16px', 
                borderRadius: 16, 
                border: '2px solid #eee',
                fontSize: 15,
                outline: 'none',
                transition: 'all 0.3s ease',
                background: 'rgba(255,255,255,0.8)'
              }} 
            />
          </label>

          <label style={{ display: 'block', marginBottom: 24 }}>
            <div style={{ fontSize: 13, color: '#666', fontWeight: 600, marginBottom: 8 }}>비밀번호 확인</div>
            <input 
              className="register-input"
              type="password" 
              value={password2} 
              onChange={(e) => setPassword2(e.target.value)} 
              placeholder="비밀번호를 다시 입력하세요"
              style={{ 
                width: '100%', 
                padding: '14px 16px', 
                borderRadius: 16, 
                border: '2px solid #eee',
                fontSize: 15,
                outline: 'none',
                transition: 'all 0.3s ease',
                background: 'rgba(255,255,255,0.8)'
              }} 
            />
          </label>

          {error && (
            <div style={{ 
              marginBottom: 20, 
              padding: '12px 16px',
              borderRadius: 12,
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#dc2626',
              fontSize: 14,
              fontWeight: 600
            }}>
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            style={{ 
              width: '100%',
              padding: '16px',
              borderRadius: 16,
              border: 'none',
              background: loading 
                ? 'linear-gradient(135deg, #ccc, #aaa)' 
                : 'linear-gradient(135deg, #a855f7, #8b5cf6, #ff4d88)',
              backgroundSize: '200% auto',
              color: '#fff',
              fontSize: 16,
              fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 12px 32px rgba(168,85,247,0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.backgroundPosition = 'right center';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.backgroundPosition = 'left center';
            }}
          >
            {loading ? '가입 중...' : '🎉 회원가입'}
          </button>

          {/* 로그인 링크 */}
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <span style={{ color: '#888', fontSize: 14 }}>이미 계정이 있으신가요? </span>
            <Link 
              to="/login" 
              style={{ 
                color: '#a855f7', 
                fontWeight: 700, 
                textDecoration: 'none',
                fontSize: 14
              }}
            >
              로그인 →
            </Link>
          </div>
        </form>
      </div>
    </div>
  </div>
);
}

export default Register;