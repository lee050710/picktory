import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function MyPage() {
  const { user: authUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const user = { 
    username: authUser?.username || '연지', 
    avatar: `${process.env.PUBLIC_URL}/images/avatar.jpg`, 
    bio: '뷰티 제품을 주로 리뷰하는 크리에이터입니다. 진솔한 사용후기를 제공합니다.', 
    points: 1240 
  };
  
  // 알림 설정 상태
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [notifications, setNotifications] = useState({
    newReview: true,
    likes: true,
    comments: true,
    sponsorship: true,
    marketing: false
  });

  // 로그아웃 처리
  const handleLogout = () => {
    if (window.confirm('정말 로그아웃 하시겠습니까?')) {
      logout();
      navigate('/');
    }
  };

  const sampleReviews = [
    { id: 'r001', title: '비타민C 세럼 효과 대박!', text: '피부 톤이 한 단계 밝아진 느낌이에요. 끈적임 없이 흡수도 빠르고 아침에 사용하기 좋아요.', image: `${process.env.PUBLIC_URL}/images/비타민세럼리뷰.jpg`, likes: 342 },
    { id: 'r002', title: '수분크림 강추합니다', text: '건성 피부인데 이 크림 바르고 하루 종일 촉촉해요. 화장 전 베이스로도 완벽!', image: `${process.env.PUBLIC_URL}/images/cream.png`, likes: 298 },
    { id: 'r003', title: '쿠션 파운데이션 커버력 굿', text: '얇게 발라도 커버가 잘 되고 광도 예뻐요. 지속력도 괜찮은 편입니다.', image: `${process.env.PUBLIC_URL}/images/파운데이션리뷰.jpg`, likes: 215 },
    { id: 'r004', title: '클렌징폼 순해요', text: '민감한 피부인데도 자극 없이 깨끗하게 세안돼요. 향도 은은하고 좋아요.', image: `${process.env.PUBLIC_URL}/images/클렌징폼리뷰.jpg`, likes: 189 },
    { id: 'r005', title: '틴트 발색 예쁨', text: '자연스러운 색감에 촉촉함도 있어서 데일리용으로 최고! 지속력도 좋습니다.', image: `${process.env.PUBLIC_URL}/images/립스틱리뷰.jpg`, likes: 267 },
    { id: 'r006', title: '마스크팩 진정 효과 좋아요', text: '피부 진정에 정말 좋고 다음날 피부결이 정돈된 느낌이에요. 자주 쓸 예정!', image: `${process.env.PUBLIC_URL}/images/마스크팩리뷰.jpg`, likes: 156 },
  ];

  // localStorage에서 쿠폰 가져오기 (룰렛&쿠폰 페이지와 연동)
  const [myCoupons, setMyCoupons] = useState([]);
  
  useEffect(() => {
    const savedCoupons = JSON.parse(localStorage.getItem('my_coupons') || '[]');
    setMyCoupons(savedCoupons);
  }, []);

  // 쿠폰 사용 핸들러
  const handleUseCoupon = (coupon) => {
    navigator.clipboard.writeText(coupon.code);
    alert(`✅ 쿠폰 코드가 복사되었습니다!\n\n코드: ${coupon.code}\n\n${coupon.brand} 홈페이지로 이동합니다.`);
    if (coupon.url) {
      window.open(coupon.url, '_blank');
    }
  };

  // 협찬 포트폴리오 데이터
  const portfolioItems = [
    { id: 'sp001', title: '겨울 보습 캠페인', brand: '이니스프리', status: 'completed', template: '인스타그램 피드', createdAt: '2024.11.20', thumbnail: `${process.env.PUBLIC_URL}/images/비타민세럼리뷰.jpg` },
    { id: 'sp002', title: '립 신제품 체험단', brand: '롬앤', status: 'in-progress', template: '틱톡 캡션', createdAt: '2024.11.25', thumbnail: `${process.env.PUBLIC_URL}/images/립스틱리뷰.jpg` },
  ];

  // 리워드 배송 정보
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    address: '',
    detailAddress: '',
    zipcode: ''
  });

  // 진행 중인 리워드 배송
  const pendingRewards = [
    { id: 'rw001', brand: 'Innisfree', product: '그린티 씨드 세럼 샘플킷', status: 'shipping', trackingNo: '1234567890', image: `${process.env.PUBLIC_URL}/images/비타민세럼리뷰.jpg` },
  ];

  const [tab, setTab] = useState('profile');

  return (
    <div className="container page-enter" style={{ padding: 20 }}>
      <h1 style={{ background: 'linear-gradient(135deg, #ff4d88, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>👤 마이페이지</h1>

      <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
        <aside style={{ width: 300 }}>
          {/* 프로필 카드 */}
          <div style={{ padding: 20, borderRadius: 16, background: 'linear-gradient(135deg, #fff5f7 0%, #fff 100%)', border: '1px solid rgba(255,77,136,0.1)', boxShadow: '0 8px 24px rgba(255,77,136,0.08)' }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <img src={user.avatar} alt="avatar" style={{ width: 80, height: 80, borderRadius: 16, objectFit: 'cover', border: '3px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 20 }}>{user.username}</div>
                <div style={{ color: '#666', fontSize: 12, marginTop: 4 }}>{user.bio}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
              <div style={{ background: '#fff', padding: 12, borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#ff4d88' }}>{user.points}</div>
                <div style={{ color: '#888', fontSize: 11 }}>포인트</div>
              </div>
              <div style={{ background: '#fff', padding: 12, borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#3b82f6' }}>{sampleReviews.length}</div>
                <div style={{ color: '#888', fontSize: 11 }}>작성 리뷰</div>
              </div>
            </div>

            {/* 크리에이터 뱃지 */}
            <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ background: 'linear-gradient(135deg, #ff4d88, #ff8a5c)', color: '#fff', padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>💄 뷰티 크리에이터</span>
              <span style={{ background: '#10b981', color: '#fff', padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>✓ 인증됨</span>
            </div>
          </div>

          {/* 네비게이션 */}
          <div style={{ marginTop: 16 }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { id: 'profile', icon: '👤', label: '프로필' },
                { id: 'reviews', icon: '📝', label: '내 리뷰' },
                { id: 'sponsorships', icon: '💼', label: '협찬 포트폴리오' },
                { id: 'rewards', icon: '🎁', label: '리워드 배송' },
                { id: 'coupons', icon: '🎫', label: '쿠폰함' },
                { id: 'settings', icon: '⚙️', label: '설정' },
              ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => setTab(item.id)} 
                  style={{ 
                    textAlign: 'left', 
                    padding: '12px 16px', 
                    borderRadius: 12,
                    border: 'none',
                    background: tab === item.id ? 'linear-gradient(135deg, #ff4d88, #ff8a5c)' : '#fff',
                    color: tab === item.id ? '#fff' : '#333',
                    fontWeight: tab === item.id ? 600 : 400,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    transition: 'all 0.2s ease',
                    boxShadow: tab === item.id ? '0 4px 12px rgba(255,77,136,0.3)' : 'none'
                  }}
                >
                  <span>{item.icon}</span> {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <main style={{ flex: 1 }}>
          {tab === 'profile' && (
            <div style={{ 
              padding: 28, 
              border: '1px solid rgba(255,77,136,0.1)', 
              borderRadius: 24, 
              background: 'linear-gradient(135deg, #fff 0%, #fff5f7 50%, #faf5ff 100%)',
              boxShadow: '0 8px 32px rgba(255,77,136,0.08)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* 배경 장식 */}
              <div style={{
                position: 'absolute',
                top: -80,
                right: -80,
                width: 200,
                height: 200,
                background: 'radial-gradient(circle, rgba(255,77,136,0.08) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none'
              }} />
              
              <h2 style={{ 
                marginTop: 0,
                marginBottom: 8,
                fontSize: 24,
                fontWeight: 800,
                background: 'linear-gradient(135deg, #ff4d88, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}>
                <span style={{ fontSize: 28 }}>👤</span> 프로필
              </h2>
              <p style={{ color: '#888', marginBottom: 24 }}>프로필 정보와 활동 통계를 확인하세요.</p>
              
              {/* 프로필 헤더 */}
              <div style={{
                display: 'flex',
                gap: 24,
                padding: 24,
                background: 'rgba(255,255,255,0.9)',
                borderRadius: 20,
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                marginBottom: 24,
                alignItems: 'center'
              }}>
                <div style={{ position: 'relative' }}>
                  <img 
                    src={user.avatar} 
                    alt="프로필" 
                    style={{ 
                      width: 100, 
                      height: 100, 
                      borderRadius: 24, 
                      objectFit: 'cover',
                      border: '4px solid #fff',
                      boxShadow: '0 8px 24px rgba(255,77,136,0.2)'
                    }} 
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: -4,
                    right: -4,
                    width: 32,
                    height: 32,
                    background: 'linear-gradient(135deg, #10b981, #34d399)',
                    borderRadius: '50%',
                    border: '3px solid #fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14
                  }}>✓</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{user.username}</h3>
                    <span style={{
                      background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                      color: '#fff',
                      padding: '4px 12px',
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 700
                    }}>👑 VIP</span>
                  </div>
                  <p style={{ margin: 0, color: '#666', fontSize: 14, lineHeight: 1.6 }}>{user.bio}</p>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <span style={{ 
                      background: 'linear-gradient(135deg, #ff4d88, #ff8a5c)', 
                      color: '#fff', 
                      padding: '4px 10px', 
                      borderRadius: 10, 
                      fontSize: 11, 
                      fontWeight: 600 
                    }}>💄 뷰티 크리에이터</span>
                    <span style={{ 
                      background: '#e0f2fe', 
                      color: '#0369a1', 
                      padding: '4px 10px', 
                      borderRadius: 10, 
                      fontSize: 11, 
                      fontWeight: 600 
                    }}>📝 리뷰어 Lv.3</span>
                  </div>
                </div>
                <button style={{
                  padding: '12px 24px',
                  borderRadius: 14,
                  border: '2px solid rgba(255,77,136,0.3)',
                  background: '#fff',
                  color: '#ff4d88',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = '#ff4d88';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.color = '#ff4d88';
                  }}
                >
                  ✏️ 편집
                </button>
              </div>

              {/* 활동 통계 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 16,
                marginBottom: 24
              }}>
                {[
                  { icon: '📝', label: '작성 리뷰', value: sampleReviews.length, color: '#ff4d88' },
                  { icon: '💖', label: '받은 좋아요', value: sampleReviews.reduce((sum, r) => sum + r.likes, 0), color: '#a855f7' },
                  { icon: '🎫', label: '보유 쿠폰', value: myCoupons.filter(c => !c.redeemed).length, color: '#f59e0b' },
                  { icon: '⭐', label: '포인트', value: user.points, color: '#10b981' }
                ].map((stat, idx) => (
                  <div 
                    key={stat.label}
                    style={{
                      padding: 20,
                      background: 'rgba(255,255,255,0.9)',
                      borderRadius: 16,
                      textAlign: 'center',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                      transition: 'all 0.3s ease',
                      cursor: 'default'
                    }}
                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: stat.color }}>{stat.value.toLocaleString()}</div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* 프로필 상세 정보 */}
              <div style={{
                background: 'rgba(255,255,255,0.9)',
                borderRadius: 20,
                padding: 24,
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
              }}>
                <h4 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>📋</span> 상세 정보
                </h4>
                
                <div style={{ display: 'grid', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#888', fontSize: 12, marginBottom: 8, textTransform: 'uppercase' }}>닉네임</div>
                      <div style={{ 
                        padding: '14px 16px', 
                        background: 'linear-gradient(135deg, #f8f9ff 0%, #fff5f7 100%)', 
                        borderRadius: 12, 
                        fontWeight: 600,
                        border: '1px solid rgba(255,77,136,0.1)'
                      }}>{user.username}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#888', fontSize: 12, marginBottom: 8, textTransform: 'uppercase' }}>가입일</div>
                      <div style={{ 
                        padding: '14px 16px', 
                        background: 'linear-gradient(135deg, #f8f9ff 0%, #fff5f7 100%)', 
                        borderRadius: 12, 
                        fontWeight: 600,
                        border: '1px solid rgba(255,77,136,0.1)'
                      }}>2024.08.15</div>
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ fontWeight: 600, color: '#888', fontSize: 12, marginBottom: 8, textTransform: 'uppercase' }}>자기소개</div>
                    <div style={{ 
                      padding: '14px 16px', 
                      background: 'linear-gradient(135deg, #f8f9ff 0%, #fff5f7 100%)', 
                      borderRadius: 12,
                      lineHeight: 1.6,
                      border: '1px solid rgba(255,77,136,0.1)'
                    }}>{user.bio}</div>
                  </div>
                  
                  <div>
                    <div style={{ fontWeight: 600, color: '#888', fontSize: 12, marginBottom: 8, textTransform: 'uppercase' }}>관심 카테고리</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {['스킨케어', '메이크업', '헤어케어', '향수', '네일'].map(cat => (
                        <span 
                          key={cat}
                          style={{
                            padding: '8px 14px',
                            background: 'linear-gradient(135deg, #fff 0%, #fff5f7 100%)',
                            border: '1px solid rgba(255,77,136,0.15)',
                            borderRadius: 20,
                            fontSize: 13,
                            fontWeight: 500,
                            color: '#ff4d88'
                          }}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ fontWeight: 600, color: '#888', fontSize: 12, marginBottom: 8, textTransform: 'uppercase' }}>연결된 SNS</div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, #E1306C, #F77737)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(225,48,108,0.3)'
                      }}>📷</div>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: '#000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      }}>🎵</div>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: '#FEE500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(254,229,0,0.3)'
                      }}>💬</div>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                        cursor: 'pointer',
                        border: '2px dashed #ccc',
                        color: '#888'
                      }}>+</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 활동 배지 */}
              <div style={{
                marginTop: 24,
                background: 'rgba(255,255,255,0.9)',
                borderRadius: 20,
                padding: 24,
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
              }}>
                <h4 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>🏆</span> 획득한 배지
                </h4>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {[
                    { icon: '🌟', name: '첫 리뷰', desc: '첫 번째 리뷰 작성', unlocked: true },
                    { icon: '🔥', name: '인기 리뷰어', desc: '좋아요 100개 달성', unlocked: true },
                    { icon: '💎', name: '다이아몬드', desc: '리뷰 50개 작성', unlocked: false },
                    { icon: '👑', name: '탑 크리에이터', desc: '팔로워 1000명', unlocked: false },
                    { icon: '🎯', name: '정확한 리뷰어', desc: '도움이 됐어요 50개', unlocked: true }
                  ].map(badge => (
                    <div 
                      key={badge.name}
                      style={{
                        padding: 16,
                        background: badge.unlocked 
                          ? 'linear-gradient(135deg, #fff5f7 0%, #faf5ff 100%)' 
                          : '#f5f5f5',
                        borderRadius: 16,
                        textAlign: 'center',
                        minWidth: 100,
                        opacity: badge.unlocked ? 1 : 0.5,
                        border: badge.unlocked ? '1px solid rgba(255,77,136,0.2)' : '1px solid #e0e0e0',
                        transition: 'all 0.3s ease',
                        cursor: 'default'
                      }}
                      onMouseOver={e => {
                        if (badge.unlocked) e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <div style={{ 
                        fontSize: 32, 
                        marginBottom: 8,
                        filter: badge.unlocked ? 'none' : 'grayscale(1)'
                      }}>{badge.icon}</div>
                      <div style={{ 
                        fontWeight: 700, 
                        fontSize: 13,
                        color: badge.unlocked ? '#333' : '#888'
                      }}>{badge.name}</div>
                      <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>{badge.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'reviews' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>내 리뷰</h2>
                <span style={{ color: '#888', fontSize: 13 }}>{sampleReviews.length}개</span>
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                {sampleReviews.map(r => (
                  <div key={r.id} style={{ padding: 16, border: '1px solid #f0f0f0', borderRadius: 16, background: '#fff', display: 'flex', gap: 16, transition: 'all 0.2s ease' }}
                    onMouseOver={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'}
                    onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
                  >
                    <img src={r.image} alt={r.title} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 12 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{r.title}</div>
                      <div style={{ color: '#666', fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>{r.text}</div>
                      <div style={{ marginTop: 10, display: 'flex', gap: 12, color: '#888', fontSize: 12 }}>
                        <span>❤️ {r.likes}</span>
                        <span>💬 {Math.floor(r.likes / 10)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'sponsorships' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>협찬 포트폴리오</h2>
                <Link to="/studio" style={{ background: 'linear-gradient(135deg, #ff4d88, #ff8a5c)', color: '#fff', padding: '10px 20px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 13 }}>+ 새 제안서</Link>
              </div>
              <p style={{ color: '#888', marginBottom: 16 }}>제안서, 수락된 협찬 내역, 진행 중인 캠페인을 관리합니다.</p>
              
              {portfolioItems.length > 0 ? (
                <div style={{ display: 'grid', gap: 12 }}>
                  {portfolioItems.map(item => (
                    <div key={item.id} style={{ padding: 16, border: '1px solid #f0f0f0', borderRadius: 16, background: '#fff', display: 'flex', gap: 16, alignItems: 'center' }}>
                      <img src={item.thumbnail} alt={item.title} style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700 }}>{item.title}</div>
                        <div style={{ color: '#888', fontSize: 13 }}>{item.brand} · {item.template}</div>
                        <div style={{ marginTop: 8 }}>
                          <span style={{ 
                            background: item.status === 'completed' ? '#10b981' : '#f59e0b', 
                            color: '#fff', 
                            padding: '4px 10px', 
                            borderRadius: 8, 
                            fontSize: 11,
                            fontWeight: 600 
                          }}>
                            {item.status === 'completed' ? '✓ 완료' : '🔄 진행중'}
                          </span>
                        </div>
                      </div>
                      <div style={{ color: '#888', fontSize: 12 }}>{item.createdAt}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: 40, border: '2px dashed #e6eefb', borderRadius: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>💼</div>
                  <div style={{ color: '#888' }}>아직 등록된 포트폴리오가 없습니다.</div>
                  <Link to="/studio" style={{ display: 'inline-block', marginTop: 16, color: '#ff4d88', fontWeight: 600 }}>협찬 스튜디오에서 제안서 만들기 →</Link>
                </div>
              )}
            </div>
          )}

          {tab === 'rewards' && (
            <div>
              <h2 style={{ margin: '0 0 8px' }}>🎁 리워드 배송</h2>
              <p style={{ color: '#888', marginBottom: 20 }}>협찬 리워드(제품 샘플 등)를 받기 위한 배송지 정보를 관리합니다.</p>
              
              {/* 진행 중인 리워드 배송 */}
              {pendingRewards.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, marginBottom: 12 }}>📦 배송 중인 리워드</h3>
                  {pendingRewards.map(reward => (
                    <div key={reward.id} style={{ 
                      padding: 16, 
                      background: 'linear-gradient(135deg, #f0fdf4 0%, #fff 100%)', 
                      borderRadius: 16, 
                      border: '1px solid rgba(16,185,129,0.2)',
                      display: 'flex',
                      gap: 16,
                      alignItems: 'center'
                    }}>
                      <img src={reward.image} alt={reward.product} style={{ width: 70, height: 70, borderRadius: 12, objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700 }}>{reward.brand}</div>
                        <div style={{ color: '#666', fontSize: 13 }}>{reward.product}</div>
                        <div style={{ marginTop: 8 }}>
                          <span style={{ background: '#10b981', color: '#fff', padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600 }}>🚚 배송중</span>
                          <span style={{ color: '#888', fontSize: 12, marginLeft: 10 }}>송장: {reward.trackingNo}</span>
                        </div>
                      </div>
                      <button style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #10b981', background: '#fff', color: '#10b981', fontWeight: 600, cursor: 'pointer' }}>배송조회</button>
                    </div>
                  ))}
                </div>
              )}

              {/* 배송지 정보 입력 폼 */}
              <div style={{ padding: 24, background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #ff4d88, #a855f7)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>📦</div>
                  <div>
                    <div style={{ fontWeight: 700 }}>배송지 정보</div>
                    <div style={{ color: '#888', fontSize: 12 }}>협찬 리워드 발송을 위한 정보입니다</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ fontWeight: 600, fontSize: 13, color: '#666', marginBottom: 6, display: 'block' }}>수령인</label>
                      <input 
                        placeholder="이름" 
                        value={shippingInfo.name}
                        onChange={e => setShippingInfo({...shippingInfo, name: e.target.value})}
                        style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #e6eefb' }} 
                      />
                    </div>
                    <div>
                      <label style={{ fontWeight: 600, fontSize: 13, color: '#666', marginBottom: 6, display: 'block' }}>연락처</label>
                      <input 
                        placeholder="010-0000-0000" 
                        value={shippingInfo.phone}
                        onChange={e => setShippingInfo({...shippingInfo, phone: e.target.value})}
                        style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #e6eefb' }} 
                      />
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12 }}>
                    <div>
                      <label style={{ fontWeight: 600, fontSize: 13, color: '#666', marginBottom: 6, display: 'block' }}>우편번호</label>
                      <input 
                        placeholder="12345" 
                        value={shippingInfo.zipcode}
                        onChange={e => setShippingInfo({...shippingInfo, zipcode: e.target.value})}
                        style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #e6eefb' }} 
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <button style={{ padding: '12px 20px', borderRadius: 10, border: '1px solid #e6eefb', background: '#f8f9ff', cursor: 'pointer' }}>주소 검색</button>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontWeight: 600, fontSize: 13, color: '#666', marginBottom: 6, display: 'block' }}>주소</label>
                    <input 
                      placeholder="기본 주소" 
                      value={shippingInfo.address}
                      onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})}
                      style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #e6eefb', marginBottom: 8 }} 
                    />
                    <input 
                      placeholder="상세 주소" 
                      value={shippingInfo.detailAddress}
                      onChange={e => setShippingInfo({...shippingInfo, detailAddress: e.target.value})}
                      style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #e6eefb' }} 
                    />
                  </div>

                  <button className="btn btn-primary" style={{ padding: '14px', borderRadius: 12, fontWeight: 600, marginTop: 8 }}>배송지 저장</button>
                </div>

                {/* 안내 문구 */}
                <div style={{ marginTop: 20, padding: 16, background: '#fffbeb', borderRadius: 12, border: '1px solid rgba(245,158,11,0.2)' }}>
                  <div style={{ fontWeight: 600, color: '#92400e', marginBottom: 6 }}>📌 안내사항</div>
                  <ul style={{ margin: 0, paddingLeft: 20, color: '#b45309', fontSize: 13, lineHeight: 1.6 }}>
                    <li>협찬 리워드(제품 샘플, 선물 등) 배송에만 사용됩니다.</li>
                    <li>정확한 정보 입력을 부탁드립니다.</li>
                    <li>세금 처리가 필요한 경우 별도 안내됩니다.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {tab === 'coupons' && (
            <div>
              <h2 style={{ margin: '0 0 16px' }}>쿠폰함</h2>
              {myCoupons.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🎫</div>
                  <div>보유한 쿠폰이 없습니다</div>
                  <Link to="/promo" style={{ 
                    display: 'inline-block', 
                    marginTop: 16, 
                    padding: '12px 24px', 
                    background: 'linear-gradient(135deg, #ff4d88, #a855f7)', 
                    color: '#fff', 
                    borderRadius: 20, 
                    textDecoration: 'none',
                    fontWeight: 700
                  }}>룰렛 돌리러 가기 →</Link>
                </div>
              ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                {myCoupons.map(c => (
                  <div key={c._id} style={{ 
                    padding: 16, 
                    border: '1px solid #f0f0f0', 
                    borderRadius: 16, 
                    background: c.redeemed ? '#f8f9ff' : '#fff', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    opacity: c.redeemed ? 0.6 : 1
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ 
                        width: 56, height: 56, 
                        background: 'linear-gradient(135deg, #ff4d88, #ff8a5c)', 
                        borderRadius: 12, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: 18
                      }}>{c.discount}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{c.brand}</div>
                        <div style={{ fontSize: 13, color: '#666' }}>{c.name}</div>
                        <div style={{ color: '#888', fontSize: 12, fontFamily: 'monospace', marginTop: 4 }}>코드: <strong>{c.code}</strong></div>
                      </div>
                    </div>
                    <div>
                      {!c.redeemed ? (
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(c.code);
                            alert(`✅ 쿠폰 코드가 복사되었습니다!\n\n코드: ${c.code}\n\n${c.brand} 홈페이지로 이동합니다.`);
                            if (c.url) window.open(c.url, '_blank');
                            // 쿠폰 사용 처리
                            const savedCoupons = JSON.parse(localStorage.getItem('my_coupons') || '[]');
                            const updated = savedCoupons.map(sc => sc._id === c._id ? {...sc, redeemed: true} : sc);
                            localStorage.setItem('my_coupons', JSON.stringify(updated));
                            setMyCoupons(updated);
                          }}
                          style={{ 
                            padding: '12px 20px', 
                            borderRadius: 12,
                            background: 'linear-gradient(135deg, #ff4d88, #ff6b9d)',
                            color: '#fff',
                            border: 'none',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(255,77,136,0.3)',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                          사용하기
                        </button>
                      ) : (
                        <span style={{ color: '#10b981', fontWeight: 600 }}>✓ 사용됨</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>
          )}

          {tab === 'settings' && (
            <div style={{ 
              padding: 28, 
              border: '1px solid rgba(255,77,136,0.1)', 
              borderRadius: 24, 
              background: 'linear-gradient(135deg, #fff 0%, #fff5f7 50%, #faf5ff 100%)',
              boxShadow: '0 8px 32px rgba(255,77,136,0.08)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* 배경 장식 */}
              <div style={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 150,
                height: 150,
                background: 'radial-gradient(circle, rgba(255,77,136,0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 100,
                height: 100,
                background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none'
              }} />
              
              <h2 style={{ 
                marginTop: 0, 
                marginBottom: 24,
                fontSize: 24,
                fontWeight: 800,
                background: 'linear-gradient(135deg, #ff4d88, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}>
                <span style={{ fontSize: 28 }}>⚙️</span> 설정
              </h2>
              
              <div style={{ display: 'grid', gap: 14 }}>
                {/* 알림 설정 버튼 */}
                <button 
                  onClick={() => setShowNotificationModal(true)}
                  style={{ 
                    padding: '18px 20px', 
                    borderRadius: 16, 
                    border: 'none', 
                    background: 'rgba(255,255,255,0.9)', 
                    backdropFilter: 'blur(10px)',
                    textAlign: 'left', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateX(8px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,77,136,0.15)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, #fff 0%, #fff0f5 100%)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 22,
                      boxShadow: '0 4px 12px rgba(245,158,11,0.3)'
                    }}>🔔</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#333' }}>알림 설정</div>
                      <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>푸시 알림을 관리해요</div>
                    </div>
                  </div>
                  <span style={{ 
                    color: '#ff4d88', 
                    fontSize: 20,
                    transition: 'transform 0.3s ease'
                  }}>›</span>
                </button>
                
                {/* 비밀번호 변경 버튼 */}
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  style={{ 
                    padding: '18px 20px', 
                    borderRadius: 16, 
                    border: 'none', 
                    background: 'rgba(255,255,255,0.9)', 
                    backdropFilter: 'blur(10px)',
                    textAlign: 'left', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateX(8px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,77,136,0.15)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, #fff 0%, #fff0f5 100%)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, #10b981, #34d399)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 22,
                      boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
                    }}>🔐</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#333' }}>비밀번호 변경</div>
                      <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>계정 보안을 강화해요</div>
                    </div>
                  </div>
                  <span style={{ 
                    color: '#ff4d88', 
                    fontSize: 20,
                    transition: 'transform 0.3s ease'
                  }}>›</span>
                </button>
                
                {/* 계정 연결 버튼 */}
                <button 
                  onClick={() => setShowAccountModal(true)}
                  style={{ 
                    padding: '18px 20px', 
                    borderRadius: 16, 
                    border: 'none', 
                    background: 'rgba(255,255,255,0.9)', 
                    backdropFilter: 'blur(10px)',
                    textAlign: 'left', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateX(8px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,77,136,0.15)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, #fff 0%, #fff0f5 100%)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 22,
                      boxShadow: '0 4px 12px rgba(59,130,246,0.3)'
                    }}>🔗</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#333' }}>계정 연결</div>
                      <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>SNS 계정을 연동해요</div>
                    </div>
                  </div>
                  <span style={{ 
                    color: '#ff4d88', 
                    fontSize: 20,
                    transition: 'transform 0.3s ease'
                  }}>›</span>
                </button>
                
                {/* 구분선 */}
                <div style={{ 
                  height: 2, 
                  background: 'linear-gradient(90deg, transparent, rgba(255,77,136,0.2), transparent)', 
                  margin: '10px 0',
                  borderRadius: 1
                }} />
                
                {/* 로그아웃 버튼 */}
                <button 
                  onClick={handleLogout}
                  style={{ 
                    padding: '18px 20px', 
                    borderRadius: 16, 
                    border: 'none', 
                    background: 'rgba(255,255,255,0.9)', 
                    backdropFilter: 'blur(10px)',
                    textAlign: 'left', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateX(8px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,77,136,0.2)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, #fff0f5 0%, #ffe4ec 100%)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, #ff4d88, #ff6b9d)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 22,
                      boxShadow: '0 4px 12px rgba(255,77,136,0.3)'
                    }}>🚪</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#ff4d88' }}>로그아웃</div>
                      <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>다음에 또 만나요!</div>
                    </div>
                  </div>
                  <span style={{ 
                    color: '#ff4d88', 
                    fontSize: 20,
                    transition: 'transform 0.3s ease'
                  }}>›</span>
                </button>
              </div>
              
              {/* 하단 안내 문구 */}
              <div style={{
                marginTop: 24,
                padding: '16px 20px',
                background: 'rgba(255,77,136,0.05)',
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}>
                <span style={{ fontSize: 24 }}>💡</span>
                <div style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>
                  <strong style={{ color: '#ff4d88' }}>Tip!</strong> 알림을 켜두면 새로운 협찬 제안을 놓치지 않아요
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 알림 설정 모달 */}
      {showNotificationModal && (
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
          onClick={() => setShowNotificationModal(false)}
        >
          <div 
            style={{
              background: '#fff',
              borderRadius: 24,
              padding: 28,
              width: '90%',
              maxWidth: 400,
              boxShadow: '0 25px 80px rgba(0,0,0,0.2)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>🔔 알림 설정</h3>
              <button 
                onClick={() => setShowNotificationModal(false)}
                style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#f0f0f0', cursor: 'pointer', fontSize: 16 }}
              >✕</button>
            </div>
            
            <div style={{ display: 'grid', gap: 16 }}>
              {[
                { key: 'newReview', label: '새 리뷰 알림', desc: '새로운 리뷰가 등록되면 알려드려요' },
                { key: 'likes', label: '좋아요 알림', desc: '내 리뷰에 좋아요가 달리면 알려드려요' },
                { key: 'comments', label: '댓글 알림', desc: '내 리뷰에 댓글이 달리면 알려드려요' },
                { key: 'sponsorship', label: '협찬 알림', desc: '새로운 협찬 제안이 오면 알려드려요' },
                { key: 'marketing', label: '마케팅 알림', desc: '이벤트 및 프로모션 소식을 알려드려요' }
              ].map(item => (
                <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{item.desc}</div>
                  </div>
                  <label style={{ position: 'relative', width: 50, height: 28 }}>
                    <input 
                      type="checkbox" 
                      checked={notifications[item.key]}
                      onChange={e => setNotifications({...notifications, [item.key]: e.target.checked})}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: notifications[item.key] ? 'linear-gradient(135deg, #ff4d88, #ff6b9d)' : '#ccc',
                      borderRadius: 14,
                      transition: '0.3s'
                    }}>
                      <span style={{
                        position: 'absolute',
                        height: 22,
                        width: 22,
                        left: notifications[item.key] ? 24 : 3,
                        bottom: 3,
                        background: '#fff',
                        borderRadius: '50%',
                        transition: '0.3s',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                      }} />
                    </span>
                  </label>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => {
                setShowNotificationModal(false);
                alert('알림 설정이 저장되었습니다!');
              }}
              style={{
                width: '100%',
                marginTop: 20,
                padding: 14,
                borderRadius: 12,
                border: 'none',
                background: 'linear-gradient(135deg, #ff4d88, #ff6b9d)',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(255,77,136,0.3)'
              }}
            >저장하기</button>
          </div>
        </div>
      )}

      {/* 비밀번호 변경 모달 */}
      {showPasswordModal && (
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
            zIndex: 10000
          }}
          onClick={() => setShowPasswordModal(false)}
        >
          <div 
            style={{
              background: '#fff',
              borderRadius: 24,
              padding: 28,
              width: '90%',
              maxWidth: 400,
              boxShadow: '0 25px 80px rgba(0,0,0,0.2)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>🔐 비밀번호 변경</h3>
              <button 
                onClick={() => setShowPasswordModal(false)}
                style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#f0f0f0', cursor: 'pointer', fontSize: 16 }}
              >✕</button>
            </div>
            
            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ fontWeight: 600, fontSize: 13, color: '#666', marginBottom: 6, display: 'block' }}>현재 비밀번호</label>
                <input type="password" placeholder="현재 비밀번호 입력" style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #e6eefb', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: 13, color: '#666', marginBottom: 6, display: 'block' }}>새 비밀번호</label>
                <input type="password" placeholder="새 비밀번호 입력" style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #e6eefb', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: 13, color: '#666', marginBottom: 6, display: 'block' }}>새 비밀번호 확인</label>
                <input type="password" placeholder="새 비밀번호 다시 입력" style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #e6eefb', boxSizing: 'border-box' }} />
              </div>
            </div>
            
            <button 
              onClick={() => {
                setShowPasswordModal(false);
                alert('비밀번호가 변경되었습니다!');
              }}
              style={{
                width: '100%',
                marginTop: 20,
                padding: 14,
                borderRadius: 12,
                border: 'none',
                background: 'linear-gradient(135deg, #ff4d88, #ff6b9d)',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(255,77,136,0.3)'
              }}
            >변경하기</button>
          </div>
        </div>
      )}

      {/* 계정 연결 모달 */}
      {showAccountModal && (
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
            zIndex: 10000
          }}
          onClick={() => setShowAccountModal(false)}
        >
          <div 
            style={{
              background: '#fff',
              borderRadius: 24,
              padding: 28,
              width: '90%',
              maxWidth: 400,
              boxShadow: '0 25px 80px rgba(0,0,0,0.2)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>🔗 계정 연결</h3>
              <button 
                onClick={() => setShowAccountModal(false)}
                style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#f0f0f0', cursor: 'pointer', fontSize: 16 }}
              >✕</button>
            </div>
            
            <p style={{ color: '#666', fontSize: 14, marginBottom: 20 }}>SNS 계정을 연결하여 더 쉽게 로그인하세요</p>
            
            <div style={{ display: 'grid', gap: 12 }}>
              <button style={{
                padding: 14,
                borderRadius: 12,
                border: '1px solid #e6eefb',
                background: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
                onMouseOver={e => e.currentTarget.style.background = '#f8f9ff'}
                onMouseOut={e => e.currentTarget.style.background = '#fff'}
              >
                <span style={{ fontSize: 24 }}>📷</span>
                <span>Instagram 연결하기</span>
                <span style={{ marginLeft: 'auto', color: '#888', fontSize: 12 }}>미연결</span>
              </button>
              
              <button style={{
                padding: 14,
                borderRadius: 12,
                border: '1px solid #e6eefb',
                background: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
                onMouseOver={e => e.currentTarget.style.background = '#f8f9ff'}
                onMouseOut={e => e.currentTarget.style.background = '#fff'}
              >
                <span style={{ fontSize: 24 }}>🎵</span>
                <span>TikTok 연결하기</span>
                <span style={{ marginLeft: 'auto', color: '#888', fontSize: 12 }}>미연결</span>
              </button>
              
              <button style={{
                padding: 14,
                borderRadius: 12,
                border: '1px solid rgba(16,185,129,0.3)',
                background: 'rgba(16,185,129,0.05)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontWeight: 600
              }}>
                <span style={{ fontSize: 24 }}>💬</span>
                <span>카카오 연결됨</span>
                <span style={{ marginLeft: 'auto', color: '#10b981', fontSize: 12, fontWeight: 700 }}>✓ 연결됨</span>
              </button>
            </div>
            
            <div style={{ marginTop: 20, padding: 14, background: '#f8f9ff', borderRadius: 12 }}>
              <div style={{ fontSize: 12, color: '#666' }}>💡 SNS 계정을 연결하면 협찬 제안을 받을 때 더 빠르게 진행할 수 있어요!</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPage;
