import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReviewCard from '../components/ReviewCard';

// 이미지 경로 (public 폴더 기준)
const minjiImg = '/images/minji.jpg';
const suaImg = '/images/avatar.jpg';
const chaeheeImg = '/images/chaehee.jpg';

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
  { id: 3, name: '인플루언서채희', avatar: chaeheeImg, category: '퍼퓸 & 프래그런스', followers: '+198', quote: '데일리룩 추천은 저에게 맡겨주세요' },
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
  { _id: 'p001', author: { username: '수아' }, title: '건성 피부를 위한 수분 세럼 추천', text: '겨울철 필수템! 건조함 없이 하루 종일 촉촉해요. 아침 스킨케어 루틴에 필수로 넣고 있어요 ✨', images: ['/images/serum_recommend.jpg'], likes: 523, tags: ['건성피부', '수분세럼', '겨울템'], rating: 4.9, createdAt: Date.now() - 1000 * 60 * 60 * 24 },
  { _id: 'p002', author: { username: '민지' }, title: '20대 추천 데일리 립', text: '자연스러운 MLBB 컬러! 매일 바르고 있어요. 지속력도 좋고 촉촉함이 오래가요 💄', images: ['/images/lip_recommend.jpg'], likes: 412, tags: ['립스틱', 'MLBB', '데일리립'], rating: 4.8, createdAt: Date.now() - 1000 * 60 * 60 * 48 },
];

// 카테고리별 추천 이미지 (룩북/결과 스타일)
const categoryShowcase = [
  { id: 1, category: '스킨케어', title: 'Before & After', subtitle: '2주 사용 후 피부 변화', image: '/images/파운데이션리뷰.jpg' },
  { id: 2, category: '립메이크업', title: '발색 스와치', subtitle: '피부톤별 컬러 매칭', image: '/images/립스틱리뷰.jpg' },
  { id: 3, category: '클렌징', title: '세안 후 피부결', subtitle: '모공 케어 효과', image: '/images/클렌징폼리뷰.jpg' },
];

function Explore() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewedReviews, setViewedReviews] = useState(0);
  const [showRouletteReward, setShowRouletteReward] = useState(false);
  const [userProfile] = useState({ age: '20대', skinType: '건성', tone: '봄웜' });

  // 리뷰 5개 읽으면 룰렛 보상 표시
  useEffect(() => {
    if (viewedReviews >= 5 && !showRouletteReward) {
      setShowRouletteReward(true);
    }
  }, [viewedReviews, showRouletteReward]);

  const handleReviewClick = () => {
    setViewedReviews(prev => prev + 1);
  };

  return (
    <div className="container page-enter" style={{ padding: '20px 20px 40px' }}>
      
      {/* 헤더 */}
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 28, background: 'linear-gradient(135deg, #ff4d88, #ff8a5c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ✨ Pick-tory 탐색
        </h1>
        <p style={{ color: '#666', marginTop: 8 }}>트렌드 인사이트와 맞춤형 매거진으로 나만의 뷰티를 발견하세요</p>
      </header>

      {/* 🌈 섹션 1: 나를 위한 Pick-tory (맞춤 매거진 커버) */}
      <section style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 24 }}>💖</span>
          <h2 style={{ margin: 0, fontSize: 20 }}>나를 위한 Pick-tory</h2>
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
              <img src="/images/skincare_recommend.jpg" alt="추천 제품" style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 12 }} />
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

      {/* 포인트 보상 미니배너 */}
      {showRouletteReward && (
        <div style={{ 
          background: 'linear-gradient(135deg, #10b981, #34d399)', 
          borderRadius: 16, 
          padding: '16px 20px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          animation: 'pulse 2s infinite',
          boxShadow: '0 8px 24px rgba(16,185,129,0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 32 }}>🎉</span>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>축하해요! +5 포인트 획득!</div>
              <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13 }}>리뷰 {viewedReviews}개를 탐색해서 포인트를 얻었어요 ✨</div>
            </div>
          </div>
          <div style={{ background: '#fff', color: '#10b981', padding: '10px 20px', borderRadius: 12, fontWeight: 700 }}>
            포인트 적립 완료!
          </div>
        </div>
      )}

      {/* 포인트 진행도 배너 */}
      {!showRouletteReward && viewedReviews > 0 && (
        <div style={{ 
          background: 'linear-gradient(135deg, #f0fdf4, #fff)', 
          borderRadius: 12, 
          padding: '12px 16px',
          marginBottom: 20,
          border: '1px solid #d1fae5',
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <span style={{ fontSize: 20 }}>💰</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>리뷰 {viewedReviews}/5개 탐색 중... 5포인트까지 {5 - viewedReviews}개!</div>
            <div style={{ background: '#d1fae5', borderRadius: 10, height: 6, overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(90deg, #10b981, #34d399)', height: '100%', width: `${(viewedReviews / 5) * 100}%`, transition: 'width 0.3s ease' }} />
            </div>
          </div>
        </div>
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
