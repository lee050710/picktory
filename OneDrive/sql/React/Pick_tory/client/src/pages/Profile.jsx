// pages/Profile.jsx

import React, { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchReviews } from '../api/reviewApi';
import ReviewCard from '../components/ReviewCard';
import { useNavigate } from 'react-router-dom';

// 설정 모달 컴포넌트
function SettingsModal({ isOpen, onClose, onLogout }) {
  if (!isOpen) return null;
  
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: 28,
          padding: '32px',
          width: '90%',
          maxWidth: 400,
          boxShadow: '0 25px 80px rgba(0,0,0,0.2)',
          animation: 'slideUp 0.3s ease-out'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>⚙️</span> 설정
          </h2>
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(0,0,0,0.05)',
              fontSize: 18,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>

        {/* 설정 메뉴 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            style={{
              padding: '16px 20px',
              borderRadius: 16,
              border: '1px solid rgba(0,0,0,0.08)',
              background: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              transition: 'all 0.2s ease'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,77,136,0.05)'}
            onMouseOut={e => e.currentTarget.style.background = '#fff'}
          >
            <span style={{ fontSize: 20 }}>👤</span>
            프로필 수정
          </button>
          
          <button
            style={{
              padding: '16px 20px',
              borderRadius: 16,
              border: '1px solid rgba(0,0,0,0.08)',
              background: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              transition: 'all 0.2s ease'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,77,136,0.05)'}
            onMouseOut={e => e.currentTarget.style.background = '#fff'}
          >
            <span style={{ fontSize: 20 }}>🔔</span>
            알림 설정
          </button>
          
          <button
            style={{
              padding: '16px 20px',
              borderRadius: 16,
              border: '1px solid rgba(0,0,0,0.08)',
              background: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              transition: 'all 0.2s ease'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,77,136,0.05)'}
            onMouseOut={e => e.currentTarget.style.background = '#fff'}
          >
            <span style={{ fontSize: 20 }}>🔒</span>
            비밀번호 변경
          </button>
          
          <button
            style={{
              padding: '16px 20px',
              borderRadius: 16,
              border: '1px solid rgba(0,0,0,0.08)',
              background: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              transition: 'all 0.2s ease'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,77,136,0.05)'}
            onMouseOut={e => e.currentTarget.style.background = '#fff'}
          >
            <span style={{ fontSize: 20 }}>❓</span>
            고객센터
          </button>

          <div style={{ height: 1, background: 'rgba(0,0,0,0.08)', margin: '8px 0' }} />

          <button
            onClick={onLogout}
            style={{
              padding: '16px 20px',
              borderRadius: 16,
              border: 'none',
              background: 'linear-gradient(135deg, #ff4d88, #ff6b9d)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              boxShadow: '0 8px 24px rgba(255,77,136,0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <span style={{ fontSize: 18 }}>🚪</span>
            로그아웃
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// 프로필 페이지 컴포넌트
function Profile() {
  const { user, logout } = useContext(AuthContext);
  const [myReviews, setMyReviews] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [activeTab, setActiveTab] = useState('reviews');
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  // 마우스 추적 (배경 효과용)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogout = () => {
    logout();
    setShowSettings(false);
    navigate('/');
  };

  useEffect(() => {
    const load = async () => {
      try {
        if (!user) return;
        
        // 💡 서버 측 필터링 권장: 
        // fetchReviews({ page: 1, limit: 20, userId: user.id }); 와 같이
        // 특정 유저의 리뷰만 서버에서 가져오도록 API를 개선하는 것이 좋습니다.
        const reviewRes = await fetchReviews({ page: 1, limit: 20 });
        
        // 현재는 클라이언트에서 필터링 (서버 API가 유저 필터를 지원하지 않을 때의 임시 방편)
        setMyReviews(reviewRes.data.filter(r => r.author && String(r.author._id) === String(user.id)));

        // 🔄 룰렛에서 획득한 쿠폰을 localStorage에서 가져오기 (CouponCenter와 동기화)
        const localCoupons = JSON.parse(localStorage.getItem('my_coupons') || '[]');
        setCoupons(localCoupons);
      } catch (err) {
        console.error(err);
      }
    };
    load();
    
    // user가 변경될 때마다 로드
  }, [user]); 

  // 프리미엄 통계 데이터
  const stats = [
    { icon: '📝', label: '작성 리뷰', value: myReviews.length, color: '#ff4d88' },
    { icon: '💖', label: '받은 좋아요', value: myReviews.reduce((sum, r) => sum + (r.likes || 0), 0), color: '#a855f7' },
    { icon: '🎫', label: '보유 쿠폰', value: coupons.length, color: '#f59e0b' },
    { icon: '⭐', label: '평균 평점', value: myReviews.length > 0 ? (myReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / myReviews.length).toFixed(1) : '0.0', color: '#10b981' }
  ];

  return (
    <div 
      ref={containerRef}
      style={{ 
        minHeight: '100vh',
        background: `
          radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,77,136,0.08) 0%, transparent 50%),
          linear-gradient(180deg, #fff 0%, #fff5f7 30%, #faf5ff 70%, #f0f9ff 100%)
        `,
        padding: '24px 20px 60px',
        transition: 'background 0.3s ease'
      }}
    >
      {/* CSS 애니메이션 */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,77,136,0.3); }
          50% { box-shadow: 0 0 40px rgba(255,77,136,0.5); }
        }
        @keyframes borderGlow {
          0%, 100% { border-color: rgba(255,77,136,0.5); }
          50% { border-color: rgba(168,85,247,0.5); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .profile-stat-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 50px rgba(255,77,136,0.2);
        }
        .profile-tab:hover {
          background: linear-gradient(135deg, rgba(255,77,136,0.1), rgba(168,85,247,0.1));
        }
        .coupon-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 15px 40px rgba(255,77,136,0.2);
        }
      `}</style>

      {/* 플로팅 장식 */}
      <div style={{ position: 'fixed', top: 100, left: 50, fontSize: 32, animation: 'float 6s ease-in-out infinite', opacity: 0.4, pointerEvents: 'none' }}>💄</div>
      <div style={{ position: 'fixed', top: 200, right: 80, fontSize: 28, animation: 'float 5s ease-in-out infinite 1s', opacity: 0.3, pointerEvents: 'none' }}>✨</div>
      <div style={{ position: 'fixed', bottom: 150, left: 100, fontSize: 24, animation: 'float 7s ease-in-out infinite 2s', opacity: 0.3, pointerEvents: 'none' }}>💖</div>
      <div style={{ position: 'fixed', bottom: 200, right: 60, fontSize: 26, animation: 'float 4s ease-in-out infinite 0.5s', opacity: 0.35, pointerEvents: 'none' }}>🌸</div>

      <div className="container" style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* 프로필 헤더 - 프리미엄 */}
        <div style={{ 
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: 32,
          padding: '40px',
          marginBottom: 28,
          boxShadow: '0 20px 60px rgba(255,77,136,0.12)',
          border: '1px solid rgba(255,255,255,0.5)',
          position: 'relative',
          overflow: 'hidden',
          animation: 'slideUp 0.6s ease-out'
        }}>
          {/* 배경 장식 */}
          <div style={{ 
            position: 'absolute', 
            top: -50, 
            right: -50, 
            width: 200, 
            height: 200, 
            background: 'radial-gradient(circle, rgba(255,77,136,0.1) 0%, transparent 70%)',
            borderRadius: '50%'
          }} />
          <div style={{ 
            position: 'absolute', 
            bottom: -30, 
            left: -30, 
            width: 150, 
            height: 150, 
            background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
            borderRadius: '50%'
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 32, position: 'relative', zIndex: 1 }}>
            {/* 프로필 이미지 */}
            <div style={{ position: 'relative' }}>
              <div style={{ 
                width: 130, 
                height: 130, 
                borderRadius: '50%', 
                overflow: 'hidden', 
                border: '4px solid transparent',
                background: 'linear-gradient(#fff, #fff) padding-box, linear-gradient(135deg, #ff4d88, #a855f7, #8b5cf6) border-box',
                boxShadow: '0 12px 40px rgba(255,77,136,0.25)',
                animation: 'borderGlow 3s ease-in-out infinite'
              }}>
                <img src="/images/avatar.jpg" alt="프로필" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              {/* 온라인 상태 뱃지 */}
              <div style={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                width: 24,
                height: 24,
                background: 'linear-gradient(135deg, #10b981, #34d399)',
                borderRadius: '50%',
                border: '3px solid #fff',
                boxShadow: '0 4px 12px rgba(16,185,129,0.4)',
                animation: 'pulse 2s ease-in-out infinite'
              }} />
            </div>

            {/* 프로필 정보 */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <h1 style={{ 
                  margin: 0, 
                  fontSize: 32,
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #333 0%, #666 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {user ? user.username : '게스트'}
                </h1>
                {/* VIP 뱃지 */}
                <span style={{
                  background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                  color: '#fff',
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 800,
                  boxShadow: '0 4px 15px rgba(245,158,11,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                  <span>👑</span> VIP
                </span>
              </div>
              <p style={{ 
                color: '#888', 
                marginTop: 4, 
                fontSize: 15,
                marginBottom: 16
              }}>
                나만의 뷰티 리뷰를 공유하고 특별한 혜택을 받아보세요! ✨
              </p>

              {/* 프로필 액션 버튼 */}
              <div style={{ display: 'flex', gap: 12 }}>
                <button style={{
                  padding: '12px 24px',
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #ff4d88, #ff6b9d)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(255,77,136,0.35)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(255,77,136,0.45)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,77,136,0.35)';
                }}
                onClick={() => navigate('/')}
                >
                  <span>✏️</span> 리뷰 작성하기
                </button>
                <button style={{
                  padding: '12px 24px',
                  borderRadius: 16,
                  background: 'rgba(255,255,255,0.9)',
                  color: '#ff4d88',
                  border: '2px solid rgba(255,77,136,0.3)',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#ff4d88';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,77,136,0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onClick={() => setShowSettings(true)}
                >
                  <span>⚙️</span> 설정
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 통계 카드 - 프리미엄 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: 16, 
          marginBottom: 28 
        }}>
          {stats.map((stat, idx) => (
            <div 
              key={stat.label}
              className="profile-stat-card"
              style={{
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(20px)',
                borderRadius: 24,
                padding: '24px',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                border: '1px solid rgba(255,255,255,0.5)',
                transition: 'all 0.4s ease',
                animation: `slideUp 0.5s ease-out ${idx * 0.1}s both`,
                cursor: 'default'
              }}
            >
              <div style={{ 
                fontSize: 36, 
                marginBottom: 12,
                animation: 'bounce 2s ease-in-out infinite',
                animationDelay: `${idx * 0.2}s`
              }}>{stat.icon}</div>
              <div style={{ 
                fontSize: 28, 
                fontWeight: 900, 
                color: stat.color,
                marginBottom: 4
              }}>{stat.value}</div>
              <div style={{ 
                fontSize: 13, 
                color: '#888',
                fontWeight: 600
              }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 탭 네비게이션 - 프리미엄 */}
        <div style={{
          display: 'flex',
          gap: 12,
          marginBottom: 24,
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: 20,
          padding: '8px',
          animation: 'slideUp 0.6s ease-out 0.3s both'
        }}>
          {[
            { id: 'reviews', icon: '📝', label: '내 리뷰' },
            { id: 'coupons', icon: '🎫', label: '내 쿠폰' },
            { id: 'likes', icon: '💖', label: '좋아요' }
          ].map(tab => (
            <button
              key={tab.id}
              className="profile-tab"
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '14px 20px',
                borderRadius: 16,
                border: 'none',
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, #ff4d88, #ff6b9d)' 
                  : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#666',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: activeTab === tab.id ? '0 8px 24px rgba(255,77,136,0.3)' : 'none'
              }}
            >
              <span style={{ fontSize: 18 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* 탭 컨텐츠 */}
        {activeTab === 'reviews' && (
          <div style={{ animation: 'slideUp 0.5s ease-out' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: 20 
            }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: 20, 
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}>
                <span style={{ animation: 'bounce 2s ease-in-out infinite' }}>📝</span>
                내가 작성한 리뷰
              </h3>
              <span style={{
                background: 'rgba(255,77,136,0.1)',
                color: '#ff4d88',
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 700
              }}>
                총 {myReviews.length}개
              </span>
            </div>
            
            {myReviews.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: 24,
                boxShadow: '0 8px 32px rgba(0,0,0,0.04)'
              }}>
                <div style={{ fontSize: 56, marginBottom: 16, animation: 'float 4s ease-in-out infinite' }}>📝</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#333', marginBottom: 8 }}>아직 작성한 리뷰가 없어요</div>
                <div style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>첫 번째 리뷰를 작성하고 포인트를 받아보세요!</div>
                <button
                  onClick={() => navigate('/')}
                  style={{
                    background: 'linear-gradient(135deg, #ff4d88, #ff6b9d)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 16,
                    padding: '14px 28px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(255,77,136,0.35)'
                  }}
                >
                  ✏️ 리뷰 작성하기
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 16 }}>
                {myReviews.map(r => <ReviewCard 
                  key={r._id} 
                  id={r._id} 
                  username={r.author?.username} 
                  title={r.title} 
                  text={r.text} 
                  images={r.images} 
                  createdAt={r.createdAt} 
                  likes={r.likes} 
                />)}
              </div>
            )}
          </div>
        )}

        {activeTab === 'coupons' && (
          <div style={{ animation: 'slideUp 0.5s ease-out' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: 20 
            }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: 20, 
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}>
                <span style={{ animation: 'bounce 2s ease-in-out infinite' }}>🎫</span>
                내 쿠폰함
              </h3>
              <button
                onClick={() => navigate('/couponcenter')}
                style={{
                  background: 'linear-gradient(135deg, #ff4d88, #ff6b9d)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 16,
                  padding: '10px 20px',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(255,77,136,0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                쿠폰센터 가기 →
              </button>
            </div>
            
            {coupons.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: 24,
                boxShadow: '0 8px 32px rgba(0,0,0,0.04)'
              }}>
                <div style={{ fontSize: 56, marginBottom: 16, animation: 'float 4s ease-in-out infinite' }}>🎫</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#333', marginBottom: 8 }}>보유한 쿠폰이 없어요</div>
                <div style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>룰렛을 돌리거나 이벤트에 참여해서 쿠폰을 받아보세요!</div>
                <button
                  onClick={() => navigate('/roulette')}
                  style={{
                    background: 'linear-gradient(135deg, #a855f7, #8b5cf6)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 16,
                    padding: '14px 28px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(168,85,247,0.35)'
                  }}
                >
                  🎡 룰렛 돌리러 가기
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                {coupons.map((c, idx) => (
                  <div 
                    key={c._id} 
                    className="coupon-card"
                    style={{ 
                      padding: '24px', 
                      borderRadius: 20, 
                      background: c.redeemed ? 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)' : 'linear-gradient(135deg, #fff 0%, #fff5f7 100%)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                      border: c.redeemed ? '2px dashed #ccc' : '2px dashed rgba(255,77,136,0.3)',
                      transition: 'all 0.3s ease',
                      animation: `slideUp 0.4s ease-out ${idx * 0.1}s both`,
                      position: 'relative',
                      overflow: 'hidden',
                      opacity: c.redeemed ? 0.7 : 1
                    }}
                  >
                    {/* 쿠폰 장식 */}
                    <div style={{
                      position: 'absolute',
                      top: -20,
                      right: -20,
                      width: 80,
                      height: 80,
                      background: 'radial-gradient(circle, rgba(255,77,136,0.1) 0%, transparent 70%)',
                      borderRadius: '50%'
                    }} />
                    {/* 쿠폰 구멍 장식 */}
                    <div style={{ position: 'absolute', left: -12, top: '50%', transform: 'translateY(-50%)', width: 24, height: 24, background: '#fff5f7', borderRadius: '50%', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1)' }} />
                    <div style={{ position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)', width: 24, height: 24, background: '#fff5f7', borderRadius: '50%', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1)' }} />
                    
                    <div style={{ 
                      fontSize: 13, 
                      fontWeight: 700, 
                      color: c.redeemed ? '#888' : '#ff4d88',
                      marginBottom: 8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}>
                      <span>🏷️</span> {c.brand}
                      {c.redeemed && <span style={{ marginLeft: 'auto', fontSize: 11, background: '#ccc', color: '#fff', padding: '2px 8px', borderRadius: 10 }}>사용완료</span>}
                    </div>
                    <div style={{ 
                      fontSize: 24, 
                      fontWeight: 900, 
                      color: '#333',
                      marginBottom: 8,
                      background: c.redeemed ? 'linear-gradient(135deg, #888, #666)' : 'linear-gradient(135deg, #ff4d88, #a855f7)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      {c.name || `${c.discount} OFF`}
                    </div>
                    <div style={{ 
                      fontSize: 13, 
                      color: '#666',
                      marginBottom: 12,
                      padding: '10px 16px',
                      background: 'rgba(0,0,0,0.03)',
                      borderRadius: 12,
                      fontFamily: 'monospace',
                      fontWeight: 600
                    }}>
                      코드: {c.code}
                    </div>
                    {c.expiresAt && (
                      <div style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>
                        ⏰ {c.expiresAt}까지
                      </div>
                    )}
                    {!c.redeemed ? (
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(c.code);
                          alert(`✅ 쿠폰 코드 복사 완료!\n\n${c.code}`);
                          if (c.url) window.open(c.url, '_blank');
                          // 쿠폰 사용 처리
                          const savedCoupons = JSON.parse(localStorage.getItem('my_coupons') || '[]');
                          const updated = savedCoupons.map(sc => sc._id === c._id ? {...sc, redeemed: true} : sc);
                          localStorage.setItem('my_coupons', JSON.stringify(updated));
                          setCoupons(updated);
                        }} 
                        style={{ 
                          width: '100%',
                          padding: '12px', 
                          borderRadius: 12, 
                          background: 'linear-gradient(135deg, #ff4d88, #ff6b9d)', 
                          color: '#fff', 
                          border: 'none',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 6px 20px rgba(255,77,136,0.3)'
                        }}
                      >
                        🎫 사용하기
                      </button>
                    ) : (
                      <button 
                        disabled
                        style={{ 
                          width: '100%',
                          padding: '12px', 
                          borderRadius: 12, 
                          background: '#e0e0e0', 
                          color: '#888', 
                          border: 'none',
                          fontWeight: 700,
                          cursor: 'not-allowed'
                        }}
                      >
                        ✓ 사용완료
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'likes' && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
            animation: 'slideUp 0.5s ease-out'
          }}>
            <div style={{ fontSize: 56, marginBottom: 16, animation: 'float 4s ease-in-out infinite' }}>💖</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#333', marginBottom: 8 }}>좋아요한 리뷰</div>
            <div style={{ color: '#888', fontSize: 14 }}>곧 업데이트 예정이에요! 조금만 기다려주세요 ✨</div>
          </div>
        )}
      </div>

      {/* 설정 모달 */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        onLogout={handleLogout}
      />
    </div>
  );
}

export default Profile;