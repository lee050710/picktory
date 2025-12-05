// pages/Auth/Login.jsx

import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) return setError('이메일과 비밀번호를 입력하세요.');
    try {
      setLoading(true);
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || '로그인 실패');
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
          radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,77,136,0.12) 0%, transparent 50%),
          linear-gradient(135deg, #fff5f7 0%, #faf5ff 50%, #f0f9ff 100%)
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
          0%, 100% { box-shadow: 0 20px 60px rgba(255,77,136,0.2); }
          50% { box-shadow: 0 20px 80px rgba(255,77,136,0.35); }
        }
        .login-input:focus {
          border-color: #ff4d88 !important;
          box-shadow: 0 0 0 3px rgba(255,77,136,0.15) !important;
        }
      `}</style>

      {/* 플로팅 장식 */}
      <div style={{ position: 'absolute', top: '15%', left: '10%', fontSize: 36, animation: 'float 6s ease-in-out infinite', opacity: 0.4, pointerEvents: 'none' }}>💄</div>
      <div style={{ position: 'absolute', top: '25%', right: '15%', fontSize: 28, animation: 'float 5s ease-in-out infinite 1s', opacity: 0.35, pointerEvents: 'none' }}>✨</div>
      <div style={{ position: 'absolute', bottom: '20%', left: '12%', fontSize: 24, animation: 'float 7s ease-in-out infinite 2s', opacity: 0.3, pointerEvents: 'none' }}>💖</div>
      <div style={{ position: 'absolute', bottom: '30%', right: '10%', fontSize: 30, animation: 'float 4s ease-in-out infinite 0.5s', opacity: 0.4, pointerEvents: 'none' }}>🌸</div>

      <div style={{ 
        maxWidth: 440, 
        width: '100%',
        animation: 'slideUp 0.6s ease-out, glow 3s ease-in-out infinite'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: 32,
          padding: '48px 40px',
          boxShadow: '0 24px 80px rgba(255,77,136,0.15)',
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
            background: 'radial-gradient(circle, rgba(255,77,136,0.1) 0%, transparent 70%)',
            borderRadius: '50%'
          }} />
          <div style={{ 
            position: 'absolute', 
            bottom: -40, 
            left: -40, 
            width: 120, 
            height: 120, 
            background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
            borderRadius: '50%'
          }} />

          {/* 로고 */}
          <div style={{ textAlign: 'center', marginBottom: 32, position: 'relative', zIndex: 1 }}>
            <div style={{ 
              fontSize: 48, 
              marginBottom: 16,
              animation: 'pulse 2s ease-in-out infinite'
            }}>💄</div>
            <h2 style={{ 
              margin: 0,
              fontSize: 28,
              fontWeight: 900,
              background: 'linear-gradient(135deg, #ff4d88, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>로그인</h2>
            <p style={{ color: '#888', marginTop: 8, fontSize: 14 }}>Pick-tory에 오신 것을 환영해요! ✨</p>
          </div>

          <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
            <label style={{ display: 'block', marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: '#666', fontWeight: 600, marginBottom: 8 }}>이메일</div>
              <input 
                className="login-input"
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

            <label style={{ display: 'block', marginBottom: 20, position: 'relative' }}>
              <div style={{ fontSize: 13, color: '#666', fontWeight: 600, marginBottom: 8 }}>비밀번호</div>
              <input 
                className="login-input"
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="비밀번호를 입력하세요"
                style={{ 
                  width: '100%', 
                  padding: '14px 16px', 
                  paddingRight: 70,
                  borderRadius: 16, 
                  border: '2px solid #eee',
                  fontSize: 15,
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  background: 'rgba(255,255,255,0.8)'
                }} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                style={{ 
                  position: 'absolute', 
                  right: 16, 
                  top: 42, 
                  border: 'none', 
                  background: 'transparent', 
                  cursor: 'pointer',
                  color: '#ff4d88',
                  fontWeight: 600,
                  fontSize: 13
                }} 
                aria-label="toggle-password"
              >
                {showPassword ? '숨기기' : '보기'}
              </button>
            </label>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <label style={{ fontSize: 13, color: '#666', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: '#ff4d88' }} /> 로그인 유지
              </label>
              <Link to="/register" style={{ fontSize: 13, color: '#ff4d88', fontWeight: 600, textDecoration: 'none' }}>회원가입 →</Link>
            </div>

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
                  : 'linear-gradient(135deg, #ff4d88, #ff6b9d, #a855f7)',
                backgroundSize: '200% auto',
                color: '#fff',
                fontSize: 16,
                fontWeight: 800,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 12px 32px rgba(255,77,136,0.4)',
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
              {loading ? '로그인 중...' : '✨ 로그인'}
            </button>
          </form>

          {/* 소셜 로그인 */}
          <div style={{ marginTop: 28, textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: 20,
              color: '#aaa',
              fontSize: 13
            }}>
              <div style={{ flex: 1, height: 1, background: '#eee' }} />
              <span style={{ padding: '0 16px' }}>또는</span>
              <div style={{ flex: 1, height: 1, background: '#eee' }} />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              {['🍎', '🔵', '🟡'].map((icon, idx) => (
                <button 
                  key={idx}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    border: '2px solid #eee',
                    background: '#fff',
                    fontSize: 20,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#ff4d88';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#eee';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
