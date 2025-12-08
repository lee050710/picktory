import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReviewCard from '../components/ReviewCard';

// 이미지 경로 (public 폴더 기준)
const minjiImg = `${process.env.PUBLIC_URL}/images/minji.jpg`;
const suaImg = `${process.env.PUBLIC_URL}/images/sua.jpg`;
const chaeheeImg = `${process.env.PUBLIC_URL}/images/chaehee.jpg`;

// 트렌드 데이터 (실제로는 API에서 가져옴)
const trendCategories = [
  { id: 'beauty', name: '뷰티', icon: '💄', growth: 156, reviews: 2847, color: '#ff6b9d' },
  { id: 'skincare', name: '스킨케어', icon: '✨', growth: 132, reviews: 1923, color: '#a855f7' },
  { id: 'fashion', name: '패션', icon: '👗', growth: 89, reviews: 1456, color: '#3b82f6' },
  { id: 'lifestyle', name: '라이프스타일', icon: '🏠', growth: 67, reviews: 892, color: '#10b981' },
  { id: 'food', name: 'F&B', icon: '🍽️', growth: 45, reviews: 654, color: '#f59e0b' },
];

// 인기 키워드 데이터
const trendingKeywords = [
  { word: '촉촉함', weight: 100 },
  { word: '가성비', weight: 85 },
  { word: '쿨톤', weight: 78 },
  { word: '지속력', weight: 72 },
  { word: '순함', weight: 68 },
  { word: '발색', weight: 65 },
  { word: '광채', weight: 60 },
  { word: '커버력', weight: 55 },
  { word: '보습', weight: 52 },
  { word: '내돈내산', weight: 48 },
  { word: '민감피부', weight: 45 },
  { word: '향기', weight: 42 },
];

// 급상승 리뷰어 데이터
const risingReviewers = [
  { id: 1, name: '뷰티민지', avatar: minjiImg, category: '뷰티', followers: '+324', quote: '진정성 있는 리뷰가 제 원칙이에요' },
  { id: 2, name: '스킨케어수아', avatar: suaImg, category: '스킨케어', followers: '+287', quote: '민감한 피부를 위한 꿀팁 공유해요' },
  { id: 3, name: '인플루언서채희', avatar: chaeheeImg, category: '퍼퓸 & 프래그런스', followers: '+198', quote: '향기는 저에게 맡겨주세요' },
];

// 주간 브랜드 리포트 데이터
const weeklyBrandReport = {
  brand: '이니스프리',
  period: '11.21 - 11.28',
  totalReviews: 847,
  avgRating: 4.6,
  pros: ['자연 유래 성분으로 순함', '가격 대비 용량 넉넉', '은은한 자연 향'],
  cons: ['건성 피부엔 보습력 부족', '일부 제품 품절 잦음', '패키지 리뉴얼 혼란'],
  topProduct: '그린티 씨드 세럼',
};

// 맞춤 리뷰 데이터 - 전문 크리에이터 스타일
const personalizedReviews = [
  { _id: 'p001', author: { username: '수아' }, title: '건성 피부를 위한 수분 세럼 추천', text: '겨울철 필수템! 건조함 없이 하루 종일 촉촉해요. 아침 스킨케어 루틴에 필수로 넣고 있어요 ✨', images: [`${process.env.PUBLIC_URL}/images/serum_recommend.jpg`], likes: 523, tags: ['건성피부', '수분세럼', '겨울템'], rating: 4.9, createdAt: Date.now() - 1000 * 60 * 60 * 24 },
  { _id: 'p002', author: { username: '민지' }, title: '20대 추천 데일리 립', text: '자연스러운 MLBB 컬러! 매일 바르고 있어요. 지속력도 좋고 촉촉함이 오래가요 💄', images: [`${process.env.PUBLIC_URL}/images/lip_recommend.jpg`], likes: 412, tags: ['립스틱', 'MLBB', '데일리립'], rating: 4.8, createdAt: Date.now() - 1000 * 60 * 60 * 48 },
];

// 카테고리별 추천 이미지 (룩북/결과 스타일)
const categoryShowcase = [
  { id: 1, category: '스킨케어', title: 'Before & After', subtitle: '2주 사용 후 피부 변화', image: `${process.env.PUBLIC_URL}/images/파운데이션리뷰.jpg` },
  { id: 2, category: '립메이크업', title: '발색 스와치', subtitle: '피부톤별 컬러 매칭', image: `${process.env.PUBLIC_URL}/images/립스틱리뷰.jpg` },
  { id: 3, category: '클렌징', title: '세안 후 피부결', subtitle: '모공 케어 효과', image: `${process.env.PUBLIC_URL}/images/클렌징폼리뷰.jpg` },
];

function Explore() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewedReviews, setViewedReviews] = useState(0);
  const [showRouletteReward, setShowRouletteReward] = useState(false);
  const [showAttendanceReward, setShowAttendanceReward] = useState(false);
  const [userProfile] = useState({ age: '20대', skinType: '건성', tone: '봄웜' });
  const [myPoints, setMyPoints] = useState(0);
  
  // 이전에 완료한 미션인지 확인 (localStorage에서)
  const [missionCompleted, setMissionCompleted] = useState(() => {
    const completedMissions = JSON.parse(localStorage.getItem('completedMissions') || '[]');
    return completedMissions.some(m => m.type === 'review_explore');
  });
  
  // 오늘 출석체크 했는지 확인
  const [attendanceCompleted, setAttendanceCompleted] = useState(() => {
    const lastAttendance = localStorage.getItem('lastAttendanceDate');
    const today = new Date().toDateString();
    return lastAttendance === today;
  });
  
  // 연속 출석 일수
  const [attendanceStreak, setAttendanceStreak] = useState(() => {
    return parseInt(localStorage.getItem('attendanceStreak') || '0', 10);
  });
  
  // 첫 리뷰 작성 완료 여부
  const [firstReviewCompleted, setFirstReviewCompleted] = useState(() => {
    const completedMissions = JSON.parse(localStorage.getItem('completedMissions') || '[]');
    return completedMissions.some(m => m.type === 'first_review');
  });

  // 포인트 로드
  useEffect(() => {
    const points = parseInt(localStorage.getItem('my_points') || '0', 10);
    setMyPoints(points);
  }, []);

  // 리뷰 5개 읽으면 룰렛 보상 표시 + 포인트 적립
  useEffect(() => {
    if (viewedReviews >= 5 && !showRouletteReward && !missionCompleted) {
      // 미션 완료!
      setMissionCompleted(true);
      
      // 실제 포인트 적립 (localStorage) - CouponCenter와 동일한 키 사용
      const currentPoints = parseInt(localStorage.getItem('my_points') || '0', 10);
      const newPoints = currentPoints + 5;
      localStorage.setItem('my_points', newPoints.toString());
      setMyPoints(newPoints);
      
      // 미션 완료 기록
      const completedMissions = JSON.parse(localStorage.getItem('completedMissions') || '[]');
      completedMissions.push({
        type: 'review_explore',
        points: 5,
        completedAt: Date.now(),
        description: '리뷰 5개 탐색 미션 완료'
      });
      localStorage.setItem('completedMissions', JSON.stringify(completedMissions));
      
      // 모달 표시
      setShowRouletteReward(true);
    }
  }, [viewedReviews, showRouletteReward, missionCompleted]);

  const handleReviewClick = (e) => {
    if (!missionCompleted) {
      setViewedReviews(prev => {
        const newCount = prev + 1;
        console.log('리뷰 클릭! 현재:', newCount, '/ 5');
        return newCount;
      });
    }
  };
  
  // 출석체크 핸들러
  const handleAttendance = () => {
    if (attendanceCompleted) return;
    
    const today = new Date().toDateString();
    const lastAttendance = localStorage.getItem('lastAttendanceDate');
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    // 연속 출석 계산
    let newStreak = 1;
    if (lastAttendance === yesterday) {
      newStreak = attendanceStreak + 1;
    }
    
    // 7일 연속이면 보너스 포인트 (+10P 추가)
    const bonusPoints = newStreak >= 7 ? 10 : 0;
    const earnedPoints = 3 + bonusPoints;
    
    // 포인트 적립
    const currentPoints = parseInt(localStorage.getItem('my_points') || '0', 10);
    const newPoints = currentPoints + earnedPoints;
    localStorage.setItem('my_points', newPoints.toString());
    setMyPoints(newPoints);
    
    // 출석 기록 저장
    localStorage.setItem('lastAttendanceDate', today);
    localStorage.setItem('attendanceStreak', newStreak.toString());
    
    // 미션 완료 기록
    const completedMissions = JSON.parse(localStorage.getItem('completedMissions') || '[]');
    completedMissions.push({
      type: 'daily_attendance',
      points: earnedPoints,
      completedAt: Date.now(),
      description: `출석체크 ${newStreak}일차 (${bonusPoints > 0 ? '7일 보너스!' : ''})`
    });
    localStorage.setItem('completedMissions', JSON.stringify(completedMissions));
    
    setAttendanceCompleted(true);
    setAttendanceStreak(newStreak);
    setShowAttendanceReward({ points: earnedPoints, streak: newStreak, bonus: bonusPoints > 0 });
  };

  return (
    <div className="container page-enter" style={{ padding: '20px 20px 40px', background: 'linear-gradient(180deg, #fff 0%, #fff8fa 30%, #f8f5ff 70%, #fff 100%)', minHeight: '100vh' }}>
      
      {/* ✨ 글로벌 CSS 애니메이션 */}
      <style>{`
        @keyframes popIn {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,77,136,0.4); }
          50% { transform: scale(1.02); box-shadow: 0 0 20px 5px rgba(255,77,136,0.2); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 4px 20px rgba(255,77,136,0.2); }
          50% { box-shadow: 0 8px 40px rgba(255,77,136,0.4); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0.3; transform: scale(1) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
        }
        @keyframes rainbow {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        .mission-card:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 40px rgba(255,77,136,0.25) !important;
        }
        .trend-bubble:hover {
          transform: scale(1.15) !important;
          z-index: 10 !important;
        }
      `}</style>

      {/* 🎨 헤더 - 더 화려하게 */}
      <header style={{ marginBottom: 28, position: 'relative' }}>
        <div style={{ position: 'absolute', top: -20, right: 0, fontSize: 60, opacity: 0.15, animation: 'float 3s ease-in-out infinite' }}>✨</div>
        <h1 style={{ 
          margin: 0, 
          fontSize: 32, 
          fontWeight: 800,
          background: 'linear-gradient(135deg, #ff4d88 0%, #ff8fab 25%, #a855f7 50%, #6366f1 75%, #ff4d88 100%)', 
          backgroundSize: '200% auto',
          animation: 'shimmer 3s linear infinite',
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <span style={{ fontSize: 36, animation: 'sparkle 2s ease-in-out infinite' }}>✨</span>
          Pick-tory 탐색
        </h1>
        <p style={{ color: '#666', marginTop: 10, fontSize: 15, lineHeight: 1.6 }}>
          트렌드 인사이트와 맞춤형 매거진으로 나만의 뷰티를 발견하세요 💄
        </p>
      </header>

      {/* 🎯 리워드 미션 센터 - NEW! */}
      <section style={{ 
        marginBottom: 32, 
        background: 'linear-gradient(135deg, #fef3c7 0%, #fff7ed 50%, #fef9c3 100%)', 
        borderRadius: 24, 
        padding: 24,
        border: '2px solid rgba(245,158,11,0.3)',
        position: 'relative',
        overflow: 'hidden',
        animation: 'slideUp 0.6s ease-out'
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 150, height: 150, background: 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -20, left: -20, width: 100, height: 100, background: 'radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)', borderRadius: '50%' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, position: 'relative' }}>
          <span style={{ fontSize: 28, animation: 'float 2s ease-in-out infinite' }}>🎯</span>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#92400e' }}>리워드 미션</h2>
          <span style={{ 
            background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', 
            color: '#fff', 
            padding: '6px 14px', 
            borderRadius: 20, 
            fontSize: 12, 
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(245,158,11,0.3)'
          }}>
            포인트 적립 💰
          </span>
        </div>
        
        <p style={{ color: '#78350f', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
          미션을 완료하고 포인트를 모아 쿠폰센터에서 룰렛을 돌려보세요! 🎰
        </p>

        {/* 미션 카드 그리드 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {/* 미션 1: 리뷰 탐색 */}
          <div className="mission-card" style={{
            background: missionCompleted ? 'linear-gradient(135deg, #d1fae5, #a7f3d0)' : 'linear-gradient(135deg, #fff, #fefce8)',
            borderRadius: 16,
            padding: 20,
            border: missionCompleted ? '2px solid #10b981' : '2px solid rgba(245,158,11,0.2)',
            transition: 'all 0.3s ease',
            cursor: 'default',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {missionCompleted && (
              <div style={{ position: 'absolute', top: 10, right: 10, background: '#10b981', color: '#fff', padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                ✓ 완료
              </div>
            )}
            <div style={{ fontSize: 32, marginBottom: 12 }}>📚</div>
            <div style={{ fontWeight: 700, color: missionCompleted ? '#065f46' : '#92400e', marginBottom: 6, fontSize: 15 }}>리뷰 5개 탐색하기</div>
            <div style={{ fontSize: 13, color: missionCompleted ? '#047857' : '#a16207', marginBottom: 12 }}>
              {missionCompleted ? '미션 완료! +5P 획득 🎉' : `${viewedReviews}/5개 탐색 중...`}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ 
                background: missionCompleted ? '#10b981' : '#fbbf24', 
                color: '#fff', 
                padding: '6px 12px', 
                borderRadius: 10, 
                fontSize: 13, 
                fontWeight: 700 
              }}>
                +5P
              </div>
              {!missionCompleted && (
                <div style={{ background: '#e5e7eb', borderRadius: 10, height: 8, flex: 1, marginLeft: 12, overflow: 'hidden' }}>
                  <div style={{ background: 'linear-gradient(90deg, #fbbf24, #f59e0b)', height: '100%', width: `${(viewedReviews / 5) * 100}%`, transition: 'width 0.3s ease', borderRadius: 10 }} />
                </div>
              )}
            </div>
            {!missionCompleted && (
              <div style={{ marginTop: 12, fontSize: 11, color: '#a16207', background: 'rgba(245,158,11,0.1)', padding: '8px 12px', borderRadius: 8 }}>
                💡 아래 리뷰 카드를 클릭해서 탐색하세요!
              </div>
            )}
          </div>

          {/* 미션 2: 첫 리뷰 작성 */}
          <Link to="/feed" className="mission-card" style={{
            background: firstReviewCompleted ? 'linear-gradient(135deg, #d1fae5, #a7f3d0)' : 'linear-gradient(135deg, #fff, #fef2f2)',
            borderRadius: 16,
            padding: 20,
            border: firstReviewCompleted ? '2px solid #10b981' : '2px solid rgba(239,68,68,0.2)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            textDecoration: 'none',
            color: 'inherit',
            display: 'block',
            position: 'relative'
          }}>
            {firstReviewCompleted && (
              <div style={{ position: 'absolute', top: 10, right: 10, background: '#10b981', color: '#fff', padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                ✓ 완료
              </div>
            )}
            <div style={{ fontSize: 32, marginBottom: 12 }}>✏️</div>
            <div style={{ fontWeight: 700, color: firstReviewCompleted ? '#065f46' : '#991b1b', marginBottom: 6, fontSize: 15 }}>첫 리뷰 작성하기</div>
            <div style={{ fontSize: 13, color: firstReviewCompleted ? '#047857' : '#b91c1c', marginBottom: 12 }}>
              {firstReviewCompleted ? '미션 완료! +20P 획득 🎉' : '나만의 뷰티 경험 공유'}
            </div>
            <div style={{ background: firstReviewCompleted ? '#10b981' : '#ef4444', color: '#fff', padding: '6px 12px', borderRadius: 10, fontSize: 13, fontWeight: 700, display: 'inline-block' }}>
              {firstReviewCompleted ? '완료!' : '작성하러 가기 →'}
            </div>
          </Link>

          {/* 미션 3: 룰렛 참여 */}
          <Link to="/promo" className="mission-card" style={{
            background: 'linear-gradient(135deg, #fff, #f3e8ff)',
            borderRadius: 16,
            padding: 20,
            border: '2px solid rgba(168,85,247,0.2)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            textDecoration: 'none',
            color: 'inherit',
            display: 'block'
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🎰</div>
            <div style={{ fontWeight: 700, color: '#6b21a8', marginBottom: 6, fontSize: 15 }}>럭키 룰렛 돌리기</div>
            <div style={{ fontSize: 13, color: '#7c3aed', marginBottom: 12 }}>쿠폰센터에서 참여</div>
            <div style={{ 
              background: 'linear-gradient(135deg, #a855f7, #8b5cf6)', 
              color: '#fff', 
              padding: '6px 12px', 
              borderRadius: 10, 
              fontSize: 13, 
              fontWeight: 700,
              display: 'inline-block'
            }}>
              참여하기 →
            </div>
          </Link>

          {/* 미션 4: 출석체크 */}
          <div 
            className="mission-card" 
            onClick={handleAttendance}
            style={{
              background: attendanceCompleted ? 'linear-gradient(135deg, #d1fae5, #a7f3d0)' : 'linear-gradient(135deg, #fff, #ecfdf5)',
              borderRadius: 16,
              padding: 20,
              border: attendanceCompleted ? '2px solid #10b981' : '2px solid rgba(16,185,129,0.2)',
              transition: 'all 0.3s ease',
              cursor: attendanceCompleted ? 'default' : 'pointer',
              position: 'relative'
            }}>
            {attendanceCompleted && (
              <div style={{ position: 'absolute', top: 10, right: 10, background: '#10b981', color: '#fff', padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                ✓ 완료
              </div>
            )}
            <div style={{ fontSize: 32, marginBottom: 12 }}>📅</div>
            <div style={{ fontWeight: 700, color: '#065f46', marginBottom: 6, fontSize: 15 }}>매일 출석체크</div>
            <div style={{ fontSize: 13, color: '#047857', marginBottom: 12 }}>
              {attendanceCompleted 
                ? `오늘 출석 완료! (${attendanceStreak}일 연속 🔥)` 
                : `연속 ${attendanceStreak}일째! ${7 - (attendanceStreak % 7)}일 후 보너스`}
            </div>
            <div style={{ 
              background: attendanceCompleted ? '#10b981' : 'linear-gradient(135deg, #10b981, #34d399)', 
              color: '#fff', 
              padding: '8px 16px', 
              borderRadius: 10, 
              fontSize: 13, 
              fontWeight: 700, 
              display: 'inline-block',
              boxShadow: attendanceCompleted ? 'none' : '0 4px 12px rgba(16,185,129,0.3)'
            }}>
              {attendanceCompleted ? '+3P 획득!' : '🎁 출석하기 (+3P)'}
            </div>
          </div>
        </div>

        {/* 현재 포인트 표시 */}
        <div style={{ 
          marginTop: 20, 
          padding: '16px 20px', 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))', 
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>💰</span>
            <div>
              <div style={{ fontSize: 13, color: '#78350f' }}>내 포인트</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#f59e0b' }}>
                {myPoints}P
              </div>
            </div>
          </div>
          <Link to="/promo" style={{
            background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: 12,
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(245,158,11,0.3)',
            transition: 'all 0.3s ease'
          }}>
            🎰 룰렛 돌리기
          </Link>
        </div>
      </section>

      {/* 🌈 섹션 1: 나를 위한 Pick-tory (맞춤 매거진 커버) */}
      <section style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 24, animation: 'float 2.5s ease-in-out infinite' }}>💖</span>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>나를 위한 Pick-tory</h2>
          <span style={{ background: 'linear-gradient(135deg, #ff4d88, #ff8a5c)', color: '#fff', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
            {userProfile.age} · {userProfile.skinType} · {userProfile.tone}
          </span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* 메인 매거진 커버 */}
          <div style={{ 
            gridRow: 'span 2',
            background: 'linear-gradient(135deg, #ffeef4 0%, #fff5f7 100%)', 
            borderRadius: 20, 
            padding: 24,
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(255,77,136,0.1)',
            boxShadow: '0 10px 40px rgba(255,77,136,0.1)'
          }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, background: 'radial-gradient(circle, rgba(255,77,136,0.2) 0%, transparent 70%)', borderRadius: '50%' }} />
            <span style={{ background: '#ff4d88', color: '#fff', padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>EDITOR'S PICK</span>
            <h3 style={{ fontSize: 22, margin: '16px 0 8px', lineHeight: 1.4 }}>{userProfile.age} {userProfile.skinType}을 위한<br />겨울 필수 스킨케어</h3>
            <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6 }}>촉촉함을 오래 유지하는 수분 세럼과 크림 조합으로 건조한 겨울도 두렵지 않아요!</p>
            <div style={{ marginTop: 16 }}>
              <img src={`${process.env.PUBLIC_URL}/images/skincare_recommend.jpg`} alt="추천 제품" style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 12 }} />
            </div>
            <Link to="/feed" className="btn btn-primary" style={{ marginTop: 16, width: '100%', padding: '12px', borderRadius: 12, display: 'block', textAlign: 'center', textDecoration: 'none' }}>맞춤 리뷰 보러가기 →</Link>
          </div>
          
          {/* 서브 매거진 카드들 */}
          {personalizedReviews.map((review, idx) => (
            <Link to={`/review/${review._id}`} key={review._id} onClick={handleReviewClick} style={{ 
              background: '#fff', 
              borderRadius: 16, 
              padding: 16,
              border: '1px solid #f0f0f0',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
              textDecoration: 'none',
              color: 'inherit',
              display: 'block'
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,77,136,0.15)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)'; }}
            >
              <img src={review.images[0]} alt={review.title} style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 10, marginBottom: 12 }} />
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{review.title}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{review.text.slice(0, 30)}...</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                {review.tags.slice(0, 2).map(tag => (
                  <span key={tag} style={{ background: '#fff0f5', color: '#ff4d88', padding: '3px 8px', borderRadius: 10, fontSize: 10 }}>#{tag}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🎉 리뷰 탐색 미션 완료 모달 */}
      {showRouletteReward && (
        <>
          {/* 배경 오버레이 */}
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 99999,
            backdropFilter: 'blur(8px)'
          }} onClick={() => setShowRouletteReward(false)} />
          
          {/* 모달 */}
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 380,
            background: '#fff',
            borderRadius: 28,
            padding: 0,
            boxShadow: '0 30px 100px rgba(0,0,0,0.3)',
            zIndex: 100000,
            textAlign: 'center',
            animation: 'popIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            overflow: 'hidden'
          }}>
            {/* 상단 그라데이션 영역 */}
            <div style={{
              background: 'linear-gradient(135deg, #ff4d88 0%, #ff8fab 50%, #a855f7 100%)',
              padding: '40px 30px 50px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* 반짝이는 배경 효과 */}
              <div style={{ position: 'absolute', top: 15, left: 25, fontSize: 28, opacity: 0.6, animation: 'sparkle 1.5s ease-in-out infinite' }}>✨</div>
              <div style={{ position: 'absolute', top: 50, right: 35, fontSize: 22, opacity: 0.5, animation: 'sparkle 2s ease-in-out infinite 0.3s' }}>⭐</div>
              <div style={{ position: 'absolute', bottom: 70, left: 45, fontSize: 20, opacity: 0.4, animation: 'sparkle 1.8s ease-in-out infinite 0.6s' }}>💫</div>
              <div style={{ position: 'absolute', bottom: 50, right: 50, fontSize: 26, opacity: 0.5, animation: 'sparkle 2.2s ease-in-out infinite 0.9s' }}>✨</div>
              <div style={{ position: 'absolute', top: 30, left: '50%', fontSize: 16, opacity: 0.3, animation: 'sparkle 1.6s ease-in-out infinite 1.2s' }}>🌟</div>
              
              {/* 아이콘 */}
              <div style={{ 
                fontSize: 90, 
                marginBottom: 16,
                filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.2))',
                animation: 'float 2s ease-in-out infinite'
              }}>
                🎉
              </div>
              
              {/* 타이틀 */}
              <div style={{ 
                color: '#fff', 
                fontSize: 38, 
                fontWeight: 900, 
                marginBottom: 10,
                textShadow: '0 4px 20px rgba(0,0,0,0.2)',
                letterSpacing: '-0.5px'
              }}>
                미션 완료!
              </div>
              
              {/* 서브 텍스트 */}
              <div style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: 15,
                fontWeight: 500
              }}>
                리뷰 {viewedReviews}개 탐색 완료 📚
              </div>
            </div>
            
            {/* 하단 포인트 영역 */}
            <div style={{ padding: '30px', background: '#fff' }}>
              {/* 획득 포인트 */}
              <div style={{
                background: 'linear-gradient(135deg, #fdf2f8, #fce7f3)',
                borderRadius: 20,
                padding: '24px',
                marginBottom: 20,
                border: '2px solid rgba(255,77,136,0.2)'
              }}>
                <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>획득 포인트</div>
                <div style={{ 
                  fontSize: 52, 
                  fontWeight: 900, 
                  background: 'linear-gradient(135deg, #ff4d88, #a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8
                }}>
                  <span style={{ animation: 'bounceIn 0.6s ease-out' }}>+5</span>
                  <span style={{ fontSize: 30, WebkitTextFillColor: '#ff4d88' }}>P</span>
                  <span style={{ fontSize: 36, WebkitTextFillColor: 'initial' }}>💰</span>
                </div>
              </div>
              
              {/* 쿠폰센터 안내 */}
              <div style={{ 
                fontSize: 14, 
                color: '#888', 
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}>
                <span>🎰 쿠폰센터에서 룰렛을 돌려보세요!</span>
              </div>
              
              {/* 확인 버튼 */}
              <button 
                onClick={() => setShowRouletteReward(false)}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #ff4d88, #a855f7)',
                  color: '#fff',
                  border: 'none',
                  padding: '18px 40px',
                  borderRadius: 16,
                  fontWeight: 800,
                  fontSize: 18,
                  cursor: 'pointer',
                  boxShadow: '0 8px 30px rgba(255,77,136,0.4)',
                  transition: 'all 0.3s ease'
                }}
              >
                확인 ✓
              </button>
            </div>
          </div>
        </>
      )}

      {/* 📅 출석체크 완료 모달 */}
      {showAttendanceReward && (
        <>
          {/* 배경 오버레이 */}
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 99999,
            backdropFilter: 'blur(8px)'
          }} onClick={() => setShowAttendanceReward(false)} />
          
          {/* 모달 */}
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 380,
            background: '#fff',
            borderRadius: 28,
            padding: 0,
            boxShadow: '0 30px 100px rgba(0,0,0,0.3)',
            zIndex: 100000,
            textAlign: 'center',
            animation: 'popIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            overflow: 'hidden'
          }}>
            {/* 상단 그라데이션 영역 */}
            <div style={{
              background: showAttendanceReward.bonus 
                ? 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #f97316 100%)' 
                : 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #06b6d4 100%)',
              padding: '40px 30px 50px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* 반짝이는 배경 효과 */}
              <div style={{ position: 'absolute', top: 20, left: 30, fontSize: 24, opacity: 0.5, animation: 'sparkle 1.5s ease-in-out infinite' }}>✨</div>
              <div style={{ position: 'absolute', top: 40, right: 40, fontSize: 20, opacity: 0.4, animation: 'sparkle 2s ease-in-out infinite 0.3s' }}>⭐</div>
              <div style={{ position: 'absolute', bottom: 60, left: 50, fontSize: 18, opacity: 0.3, animation: 'sparkle 1.8s ease-in-out infinite 0.6s' }}>✨</div>
              <div style={{ position: 'absolute', bottom: 40, right: 60, fontSize: 22, opacity: 0.4, animation: 'sparkle 2.2s ease-in-out infinite 0.9s' }}>💫</div>
              
              {/* 아이콘 */}
              <div style={{ 
                fontSize: 80, 
                marginBottom: 16,
                filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.2))',
                animation: 'float 2s ease-in-out infinite'
              }}>
                {showAttendanceReward.bonus ? '🎊' : '🎉'}
              </div>
              
              {/* 타이틀 */}
              <div style={{ 
                color: '#fff', 
                fontSize: 36, 
                fontWeight: 900, 
                marginBottom: 8,
                textShadow: '0 4px 20px rgba(0,0,0,0.2)',
                letterSpacing: '-0.5px'
              }}>
                출석 완료!
              </div>
              
              {/* 연속 출석 배지 */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(255,255,255,0.25)',
                backdropFilter: 'blur(10px)',
                padding: '8px 18px',
                borderRadius: 30,
                color: '#fff',
                fontSize: 15,
                fontWeight: 700
              }}>
                🔥 {showAttendanceReward.streak}일 연속 출석!
              </div>
            </div>
            
            {/* 하단 포인트 영역 */}
            <div style={{ padding: '30px', background: '#fff' }}>
              {/* 획득 포인트 */}
              <div style={{
                background: showAttendanceReward.bonus 
                  ? 'linear-gradient(135deg, #fef3c7, #fff7ed)' 
                  : 'linear-gradient(135deg, #d1fae5, #ecfdf5)',
                borderRadius: 20,
                padding: '24px',
                marginBottom: 20,
                border: showAttendanceReward.bonus 
                  ? '2px solid rgba(245,158,11,0.3)'
                  : '2px solid rgba(16,185,129,0.3)'
              }}>
                <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>획득 포인트</div>
                <div style={{ 
                  fontSize: 48, 
                  fontWeight: 900, 
                  color: showAttendanceReward.bonus ? '#f59e0b' : '#10b981',
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8
                }}>
                  <span style={{ animation: 'bounceIn 0.6s ease-out' }}>+{showAttendanceReward.points}</span>
                  <span style={{ fontSize: 28 }}>P</span>
                  <span style={{ fontSize: 32 }}>💰</span>
                </div>
                
                {showAttendanceReward.bonus && (
                  <div style={{
                    marginTop: 12,
                    background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                    color: '#fff',
                    padding: '10px 20px',
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    animation: 'pulse 1.5s ease-in-out infinite'
                  }}>
                    🎁 7일 연속 보너스 +10P 포함!
                  </div>
                )}
              </div>
              
              {/* 다음 보너스까지 */}
              {!showAttendanceReward.bonus && showAttendanceReward.streak < 7 && (
                <div style={{ 
                  fontSize: 13, 
                  color: '#888', 
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}>
                  <span>🎯 7일 보너스까지</span>
                  <span style={{ fontWeight: 700, color: '#f59e0b' }}>{7 - showAttendanceReward.streak}일</span>
                  <span>남았어요!</span>
                </div>
              )}
              
              {/* 확인 버튼 */}
              <button 
                onClick={() => setShowAttendanceReward(false)}
                style={{
                  width: '100%',
                  background: showAttendanceReward.bonus 
                    ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' 
                    : 'linear-gradient(135deg, #10b981, #34d399)',
                  color: '#fff',
                  border: 'none',
                  padding: '18px 40px',
                  borderRadius: 16,
                  fontWeight: 800,
                  fontSize: 18,
                  cursor: 'pointer',
                  boxShadow: showAttendanceReward.bonus 
                    ? '0 8px 30px rgba(245,158,11,0.4)' 
                    : '0 8px 30px rgba(16,185,129,0.4)',
                  transition: 'all 0.3s ease'
                }}
              >
                확인 ✓
              </button>
            </div>
          </div>
        </>
      )}

      {/* 🌈 섹션 2: 트렌드 버블 차트 */}
      <section style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 24 }}>📊</span>
          <h2 style={{ margin: 0, fontSize: 20 }}>실시간 트렌드</h2>
          <span style={{ color: '#888', fontSize: 12 }}>최근 7일 기준</span>
        </div>
        
        {/* 버블 차트 영역 */}
        <div style={{ 
          background: 'linear-gradient(135deg, #f8f9ff 0%, #fff 100%)', 
          borderRadius: 20, 
          padding: 24,
          position: 'relative',
          minHeight: 200,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          border: '1px solid #e6eefb'
        }}>
          {trendCategories.map((cat, idx) => {
            const size = 60 + (cat.growth / 3);
            return (
              <div 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                style={{ 
                  width: size, 
                  height: size, 
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${cat.color}dd, ${cat.color}99)`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedCategory === cat.id ? `0 8px 24px ${cat.color}50` : '0 4px 12px rgba(0,0,0,0.1)',
                  transform: selectedCategory === cat.id ? 'scale(1.15)' : 'scale(1)',
                  border: selectedCategory === cat.id ? '3px solid #fff' : 'none'
                }}
              >
                <span style={{ fontSize: size / 3 }}>{cat.icon}</span>
                <span style={{ color: '#fff', fontSize: 10, fontWeight: 700, marginTop: 2 }}>{cat.name}</span>
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 9 }}>+{cat.growth}%</span>
              </div>
            );
          })}
        </div>

        {/* 선택된 카테고리 상세 */}
        {selectedCategory && (
          <div style={{ 
            marginTop: 16, 
            padding: 16, 
            background: '#fff', 
            borderRadius: 12, 
            border: '1px solid #f0f0f0',
            animation: 'fadeIn 0.3s ease'
          }}>
            {(() => {
              const cat = trendCategories.find(c => c.id === selectedCategory);
              return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{cat.icon} {cat.name} 카테고리</div>
                    <div style={{ color: '#666', fontSize: 13, marginTop: 4 }}>총 {cat.reviews.toLocaleString()}개 리뷰 · 주간 +{cat.growth}% 성장</div>
                  </div>
                  <Link to="/feed" style={{ 
                    background: cat.color, 
                    color: '#fff', 
                    padding: '10px 20px', 
                    borderRadius: 10, 
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: 14
                  }}>
                    리뷰 보기 →
                  </Link>
                </div>
              );
            })()}
          </div>
        )}
      </section>

      {/* 🔤 섹션 3: 키워드 클라우드 */}
      <section style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 24 }}>💬</span>
          <h2 style={{ margin: 0, fontSize: 20 }}>인기 키워드</h2>
          <span style={{ color: '#888', fontSize: 12 }}>사용자들이 가장 많이 언급한</span>
        </div>
        
        <div style={{ 
          background: '#fff', 
          borderRadius: 16, 
          padding: 20,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          justifyContent: 'center',
          border: '1px solid #f0f0f0'
        }}>
          {trendingKeywords.map((kw, idx) => {
            const fontSize = 12 + (kw.weight / 10);
            const opacity = 0.5 + (kw.weight / 200);
            return (
              <span 
                key={kw.word}
                style={{ 
                  fontSize,
                  color: `rgba(255, 77, 136, ${opacity})`,
                  fontWeight: kw.weight > 70 ? 700 : 500,
                  padding: '6px 12px',
                  background: kw.weight > 70 ? 'rgba(255,77,136,0.08)' : 'transparent',
                  borderRadius: 20,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,77,136,0.15)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseOut={e => { e.currentTarget.style.background = kw.weight > 70 ? 'rgba(255,77,136,0.08)' : 'transparent'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                #{kw.word}
              </span>
            );
          })}
        </div>
      </section>

      {/* 🖼️ 섹션 3.5: 카테고리별 룩북/쇼케이스 (전문 크리에이터 스타일) */}
      <section style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 24 }}>🖼️</span>
          <h2 style={{ margin: 0, fontSize: 20 }}>크리에이터 룩북</h2>
          <span style={{ background: '#a855f7', color: '#fff', padding: '3px 8px', borderRadius: 10, fontSize: 11 }}>PRO</span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {categoryShowcase.map(item => (
            <div 
              key={item.id}
              onClick={handleReviewClick}
              style={{ 
                position: 'relative',
                borderRadius: 16,
                overflow: 'hidden',
                aspectRatio: '3/4',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.15)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
            >
              <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {/* 그라데이션 오버레이 */}
              <div style={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                height: '60%',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end'
              }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', color: '#fff', padding: '4px 10px', borderRadius: 12, fontSize: 11, width: 'fit-content', marginBottom: 8 }}>{item.category}</span>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{item.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4 }}>{item.subtitle}</div>
              </div>
              {/* PRO 뱃지 */}
              <div style={{ position: 'absolute', top: 12, right: 12, background: 'linear-gradient(135deg, #ff4d88, #a855f7)', color: '#fff', padding: '4px 8px', borderRadius: 8, fontSize: 10, fontWeight: 700 }}>✨ PRO</div>
            </div>
          ))}
        </div>
      </section>

      {/* 💡 섹션 4: 주간 브랜드 리포트 */}
      <section style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 24 }}>💡</span>
          <h2 style={{ margin: 0, fontSize: 20 }}>주간 브랜드 리포트</h2>
          <span style={{ background: '#10b981', color: '#fff', padding: '3px 8px', borderRadius: 10, fontSize: 11 }}>AI 분석</span>
        </div>
        
        <div style={{ 
          background: 'linear-gradient(135deg, #f0fdf4 0%, #fff 100%)', 
          borderRadius: 20, 
          padding: 24,
          border: '1px solid rgba(16,185,129,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{weeklyBrandReport.brand}</div>
              <div style={{ color: '#666', fontSize: 13 }}>{weeklyBrandReport.period} · 리뷰 {weeklyBrandReport.totalReviews}개 분석</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#10b981' }}>⭐ {weeklyBrandReport.avgRating}</div>
              <div style={{ color: '#666', fontSize: 12 }}>평균 평점</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* 장점 */}
            <div style={{ background: 'rgba(16,185,129,0.08)', borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 700, color: '#10b981', marginBottom: 12, fontSize: 14 }}>👍 장점 TOP 3</div>
              {weeklyBrandReport.pros.map((pro, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ background: '#10b981', color: '#fff', width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{idx + 1}</span>
                  <span style={{ fontSize: 13 }}>{pro}</span>
                </div>
              ))}
            </div>
            
            {/* 단점 */}
            <div style={{ background: 'rgba(239,68,68,0.08)', borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 700, color: '#ef4444', marginBottom: 12, fontSize: 14 }}>👎 개선점 TOP 3</div>
              {weeklyBrandReport.cons.map((con, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ background: '#ef4444', color: '#fff', width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{idx + 1}</span>
                  <span style={{ fontSize: 13 }}>{con}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 16, padding: 12, background: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24 }}>🏆</span>
            <div>
              <div style={{ fontSize: 12, color: '#888' }}>이번 주 인기 제품</div>
              <div style={{ fontWeight: 700 }}>{weeklyBrandReport.topProduct}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 섹션 5: 급상승 리뷰어 */}
      <section style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 24 }}>🚀</span>
          <h2 style={{ margin: 0, fontSize: 20 }}>급상승 리뷰어</h2>
          <span style={{ color: '#888', fontSize: 12 }}>이번 주 주목할 크리에이터</span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {risingReviewers.map((reviewer, idx) => (
            <div key={reviewer.id} style={{ 
              background: '#fff', 
              borderRadius: 16, 
              padding: 20,
              textAlign: 'center',
              border: '1px solid #f0f0f0',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {idx === 0 && <div style={{ position: 'absolute', top: 10, right: 10, background: '#ffd700', color: '#000', padding: '4px 8px', borderRadius: 8, fontSize: 10, fontWeight: 700 }}>🏅 1위</div>}
              <img src={reviewer.avatar} alt={reviewer.name} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <div style={{ fontWeight: 700, marginTop: 12 }}>{reviewer.name}</div>
              <div style={{ color: '#888', fontSize: 12 }}>{reviewer.category} 전문</div>
              <div style={{ color: '#10b981', fontWeight: 700, fontSize: 14, marginTop: 8 }}>팔로워 {reviewer.followers}</div>
              <div style={{ 
                marginTop: 12, 
                padding: 12, 
                background: '#f8f9ff', 
                borderRadius: 10,
                fontSize: 12,
                color: '#666',
                fontStyle: 'italic'
              }}>
                "{reviewer.quote}"
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 기존 카테고리 필터 (하단에 유지) */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 24 }}>🏷️</span>
          <h2 style={{ margin: 0, fontSize: 20 }}>카테고리 필터</h2>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {trendCategories.map(cat => (
            <button 
              key={cat.id}
              className="btn" 
              onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
              style={{ 
                padding: '10px 16px', 
                borderRadius: 12, 
                border: selectedCategory === cat.id ? `2px solid ${cat.color}` : '1px solid #e6eefb',
                background: selectedCategory === cat.id ? `${cat.color}15` : '#fff',
                color: selectedCategory === cat.id ? cat.color : '#333',
                fontWeight: selectedCategory === cat.id ? 700 : 500,
                transition: 'all 0.2s ease'
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </section>

    </div>
  );
}

export default Explore;
