// pages/Feed.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReviewCard from '../components/ReviewCard';
import PostEditor from '../components/PostEditor';
import { fetchReviews, createReview as apiCreateReview, updateReview as apiUpdateReview, deleteReview as apiDeleteReview, addComment as apiAddComment, removeComment as apiRemoveComment } from '../api/reviewApi';
import sampleReviews from '../data/sampleReviews';
              <ReviewCard
                key={r._id}
                id={r._id}
                username={r.author?.username || '익명'}
                brand={r.brand}
                product={r.product}
                title={r.title}
                text={r.text}
                images={r.images}
                createdAt={r.createdAt}
                likes={r.likes}
                comments={r.comments?.length || 0}
                commentsList={r.comments || []}
                tags={r.tags}
                rating={r.rating}
                canEdit={currentUserName && (
                  (r.author && ((r.author.username && r.author.username === currentUserName) || (r.author.name && r.author.name === currentUserName))) ||
                  (typeof r.author === 'string' && r.author === currentUserName)
                )}
                onEdit={(id) => {
                  setEditingId(id);
                  setEditingItem(r);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onDelete={async (id) => {
                  if (!window.confirm('정말 삭제하시겠습니까?')) return;
                  try {
                    await apiDeleteReview(id, currentUserName);
                    setReviews(prev => prev.filter(x => x._id !== id));
                  } catch (e) {
                    console.error(e);
                    alert('삭제 중 오류가 발생했습니다.');
                  }
                }}
                onAddComment={async (reviewId, text) => {
                  try {
                    const res = await apiAddComment(reviewId, text, currentUserName);
                    setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, comments: [...(r.comments || []), res.data] } : r));
                  } catch (e) {
                    alert('댓글 작성 중 오류가 발생했습니다.');
                  }
                }}
                onDeleteComment={async (reviewId, commentId) => {
                  try {
                    await apiRemoveComment(reviewId, commentId, currentUserName);
                    setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, comments: (r.comments || []).filter(c => c._id !== commentId) } : r));
                  } catch (e) {
                    alert('댓글 삭제 중 오류가 발생했습니다.');
                  }
                }}
              />
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #fff 0%, #fff5f7 30%, #faf5ff 100%)' }}>
      {/* CSS 애니메이션 */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,77,136,0.3); }
          50% { box-shadow: 0 0 40px rgba(255,77,136,0.5); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .feed-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 50px rgba(255,77,136,0.2);
        }
      `}</style>

      <div className="container page-enter" style={{ paddingTop: 24, paddingBottom: 40 }}>
        {/* 헤더 - 프리미엄 */}
        <header style={{ marginBottom: 28, position: 'relative' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: 24,
            padding: '24px 32px',
            border: '1px solid rgba(255,255,255,0.5)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
          }}>
            <div>
              <div style={{ 
                fontSize: 28, 
                fontWeight: 900,
                background: 'linear-gradient(135deg, #ff4d88, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}>
                <span style={{ fontSize: 32, animation: 'bounce 2s ease-in-out infinite' }}>💄</span>
                뷰티 리뷰
              </div>
              <div style={{ color: '#666', marginTop: 4, fontSize: 15 }}>솔직한 후기로 나에게 맞는 제품 찾기 ✨</div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button 
              onClick={() => navigate('/promo')}
              style={{ 
                padding: '14px 24px', 
                borderRadius: 16, 
                border: '2px solid rgba(255,77,136,0.2)', 
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                fontWeight: 600,
                color: '#ff4d88',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#ff4d88';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,77,136,0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >🎫 쿠폰센터</button>
              <button 
              onClick={() => navigate('/promo')}
              style={{ 
                padding: '14px 24px', 
                borderRadius: 16,
                background: 'linear-gradient(135deg, #ff4d88, #ff6b9d, #a855f7)',
                backgroundSize: '200% auto',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(255,77,136,0.4)',
                animation: 'glow 3s ease-in-out infinite',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                e.currentTarget.style.backgroundPosition = 'right center';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.backgroundPosition = 'left center';
              }}
              >🎡 룰렛 참여하기</button>
            </div>
          </div>
        </header>

      {/* 게시물 작성기 */}
      <div style={{ marginBottom: 20 }}>
        <PostEditor
          initial={editingItem}
          onCancel={() => { setEditingId(null); setEditingItem(null); }}
          onSubmit={async (payload) => {
            try {
              if (editingId) {
                const res = await apiUpdateReview(editingId, payload);
                setReviews(prev => prev.map(r => r._id === editingId ? res.data : r));
                setEditingId(null);
                setEditingItem(null);
              } else {
                // attach author from current user when available (support name or username)
                if (currentUserName) payload.author = { username: currentUserName };
                const res = await apiCreateReview(payload);
                setReviews(prev => [res.data, ...prev]);
                // update local stored user points if API returned awardedPoints
                if (res.data?.awardedPoints && currentUser) {
                  try {
                    const saved = JSON.parse(localStorage.getItem('user') || 'null');
                    if (saved && saved.username === currentUser.username) {
                      saved.points = (saved.points || 0) + res.data.awardedPoints;
                      localStorage.setItem('user', JSON.stringify(saved));
                    }
                  } catch (e) {}
                }
              }
            } catch (err) {
              console.error(err);
              alert('작성 중 오류가 발생했습니다.');
            }
          }}
        />
      </div>

      {/* Hero banner - 매거진 스타일 */}
      <section style={{ 
        background: 'linear-gradient(135deg, rgba(255,245,247,0.95) 0%, rgba(255,238,244,0.95) 50%, rgba(255,255,255,0.95) 100%)', 
        backdropFilter: 'blur(20px)',
        borderRadius: 32, 
        padding: 0,
        marginBottom: 32,
        overflow: 'hidden',
        boxShadow: '0 24px 80px rgba(255,77,136,0.12)',
        border: '1px solid rgba(255,77,136,0.15)',
        position: 'relative'
      }}>
        {/* 플로팅 장식 */}
        <div style={{ position: 'absolute', top: 20, right: 40, fontSize: 24, animation: 'float 4s ease-in-out infinite', opacity: 0.6 }}>✨</div>
        <div style={{ position: 'absolute', bottom: 30, left: 30, fontSize: 20, animation: 'float 5s ease-in-out infinite 1s', opacity: 0.5 }}>💖</div>
        
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          {/* 텍스트 영역 */}
          <div style={{ flex: 1, padding: '48px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ 
              background: 'linear-gradient(135deg, #ff4d88, #ff8a5c)', 
              color: '#fff', 
              padding: '8px 18px', 
              borderRadius: 25, 
              fontSize: 12, 
              fontWeight: 700,
              width: 'fit-content',
              marginBottom: 20,
              boxShadow: '0 4px 15px rgba(255,77,136,0.3)',
              animation: 'pulse 2s ease-in-out infinite'
            }}>✨ EDITOR'S PICK</span>
            <h2 style={{ margin: '0 0 16px', fontSize: 36, lineHeight: 1.3, fontWeight: 900, animation: 'slideUp 0.8s ease-out' }}>
              오늘의 주목할만한<br/>
              <span style={{ 
                background: 'linear-gradient(135deg, #ff4d88 0%, #ff6b9d 30%, #a855f7 70%, #8b5cf6 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent',
                animation: 'shimmer 3s linear infinite'
              }}>뷰티 리뷰</span>
            </h2>
            <p style={{ color: '#666', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
              전문 크리에이터들의 생생한 사용후기와<br/>
              최신 브랜드 프로모션을 확인해보세요.
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              <button style={{ 
                padding: '16px 32px', 
                borderRadius: 16, 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #ff4d88, #ff6b9d)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(255,77,136,0.4)',
                transition: 'all 0.3s ease'
              }} 
              onClick={() => navigate('/')}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >지금 참여하기</button>
              <button style={{ 
                padding: '16px 32px', 
                borderRadius: 16, 
                border: '2px solid rgba(255,77,136,0.3)', 
                background: 'rgba(255,255,255,0.9)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }} 
              onClick={() => reviewSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#ff4d88';
                e.currentTarget.style.color = '#ff4d88';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,77,136,0.3)';
                e.currentTarget.style.color = '#333';
              }}
              >트렌드 보기</button>
            </div>
            
            {/* 인기 태그 */}
            <div style={{ marginTop: 24, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {['#비타민C세럼', '#수분크림', '#쿠션추천', '#데일리립'].map((tag, idx) => (
                <span key={tag} style={{ 
                  background: 'rgba(255,77,136,0.08)', 
                  color: '#ff4d88', 
                  padding: '8px 16px', 
                  borderRadius: 20, 
                  fontSize: 13, 
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  animation: `slideUp 0.5s ease-out ${idx * 0.1}s both`
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#ff4d88';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255,77,136,0.08)';
                  e.currentTarget.style.color = '#ff4d88';
                }}
                >{tag}</span>
              ))}
            </div>
          </div>
          
          {/* 이미지 그리드 영역 */}
          <div style={{ width: 540, position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: 10 }}>
            {/* 메인 이미지 */}
            <Link to="/review/hero001" style={{ 
              gridColumn: 'span 2', 
              height: 280, 
              position: 'relative', 
              overflow: 'hidden', 
              borderRadius: 20,
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              display: 'block',
              textDecoration: 'none'
            }}>
              <img src={`${process.env.PUBLIC_URL}/images/립리뷰.jpg`} alt="Featured" style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#fff5f7', transition: 'transform 0.5s ease' }} 
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{ position: 'absolute', bottom: 20, left: 20, background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '10px 20px', borderRadius: 14, fontSize: 15, backdropFilter: 'blur(10px)', fontWeight: 600 }}>
                💄 인기 립 리뷰
              </div>
            </Link>
            {/* 서브 이미지들 */}
            <Link to="/review/hero002" style={{ height: 150, overflow: 'hidden', position: 'relative', borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', display: 'block', textDecoration: 'none' }}>
              <img src={`${process.env.PUBLIC_URL}/images/피부광채.jpg`} alt="Skin" style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#fff5f7', transition: 'transform 0.3s ease' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(255,255,255,0.95)', padding: '8px 14px', borderRadius: 12, fontSize: 13, fontWeight: 700 }}>✨ 피부 광채</div>
            </Link>
            <Link to="/review/hero003" style={{ height: 150, overflow: 'hidden', position: 'relative', borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', display: 'block', textDecoration: 'none' }}>
              <img src={`${process.env.PUBLIC_URL}/images/진정케어.jpg`} alt="Mask" style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#fff5f7', transition: 'transform 0.3s ease' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(255,255,255,0.95)', padding: '8px 14px', borderRadius: 12, fontSize: 13, fontWeight: 700 }}>🌿 진정 케어</div>
            </Link>
          </div>
        </div>
      </section>

      {/* 장원영 틴트 광고 배너 */}
      <a 
        href="https://amusemakeup.com/product/%EC%A0%A4%ED%95%8F-%EA%B8%80%EB%A1%9C%EC%8A%A4-7%EC%A2%85-%ED%83%9D1/896/category/1/display/2/?icid=MAIN.product_listmain_1"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block',
          background: 'linear-gradient(135deg, #ffe4ec 0%, #ffd6e7 50%, #ffcce0 100%)',
          borderRadius: 20,
          padding: 0,
          marginBottom: 24,
          overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(255,77,136,0.15)',
          border: '2px solid rgba(255,77,136,0.2)',
          textDecoration: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          position: 'relative'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 20px 50px rgba(255,77,136,0.25)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,77,136,0.15)';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* 장원영 이미지 영역 */}
          <div style={{ width: 200, height: 180, overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #ffe4ec, #ffd6e7)' }}>
            <img 
              src={`${process.env.PUBLIC_URL}/images/장원영.jpg`} 
              alt="장원영" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%', 
                objectFit: 'contain'
              }} 
            />
          </div>
          
          {/* 텍스트 영역 */}
          <div style={{ flex: 1, padding: '24px 32px', position: 'relative' }}>
            {/* AD 태그 */}
            <span style={{ 
              position: 'absolute',
              top: 16,
              right: 24,
              background: 'rgba(255,77,136,0.15)',
              color: '#ff4d88',
              padding: '4px 10px',
              borderRadius: 12,
              fontSize: 10,
              fontWeight: 700
            }}>AD</span>
            
            {/* 메인 카피 */}
            <div style={{ 
              fontSize: 32, 
              fontWeight: 900, 
              color: '#ff4d88',
              lineHeight: 1.2,
              marginBottom: 8
            }}>
              장원영이 쓰는 틴트!!!!?????
            </div>
            <div style={{ 
              fontSize: 16, 
              color: '#d63384',
              fontWeight: 600,
              marginBottom: 16
            }}>
              어뮤즈 젤핏글로스 💄 지금 바로 만나보세요!
            </div>
            
            {/* CTA 버튼 */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'linear-gradient(135deg, #ff4d88, #ff6b9d)',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: 30,
              fontSize: 14,
              fontWeight: 700,
              boxShadow: '0 4px 15px rgba(255,77,136,0.4)'
            }}>
              공식몰 바로가기 
              <span style={{ fontSize: 18 }}>→</span>
            </div>
          </div>
        </div>
      </a>

      {/* 카리나 블러셔 광고 배너 */}
      <a 
        href="https://aoucosmetics.com/product/50-%EB%B3%B4%EB%93%A4-%ED%81%AC%EB%A6%BC-%EB%B8%94%EB%9F%AC%EC%85%94-0205%ED%98%B8/102/category/45/display/1/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block',
          background: 'linear-gradient(135deg, #fce4f3 0%, #f8d7ea 50%, #fad0e4 100%)',
          borderRadius: 20,
          padding: 0,
          marginBottom: 24,
          overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(219,112,147,0.15)',
          border: '2px solid rgba(219,112,147,0.2)',
          textDecoration: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          position: 'relative'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 20px 50px rgba(219,112,147,0.25)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(219,112,147,0.15)';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* 카리나 이미지 영역 */}
          <div style={{ width: 200, height: 180, overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #fce4f3, #f8d7ea)' }}>
            <img 
              src={`${process.env.PUBLIC_URL}/images/카리나.png`} 
              alt="카리나" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%', 
                objectFit: 'contain'
              }} 
            />
          </div>
          
          {/* 텍스트 영역 */}
          <div style={{ flex: 1, padding: '24px 32px', position: 'relative' }}>
            {/* AD 태그 */}
            <span style={{ 
              position: 'absolute',
              top: 16,
              right: 24,
              background: 'rgba(219,112,147,0.15)',
              color: '#db7093',
              padding: '4px 10px',
              borderRadius: 12,
              fontSize: 10,
              fontWeight: 700
            }}>AD</span>
            
            {/* 메인 카피 */}
            <div style={{ 
              fontSize: 32, 
              fontWeight: 900, 
              color: '#db7093',
              lineHeight: 1.2,
              marginBottom: 8
            }}>
              카리나가 쓰는 블러셔!!!!?????
            </div>
            <div style={{ 
              fontSize: 16, 
              color: '#c06080',
              fontWeight: 600,
              marginBottom: 16
            }}>
              AOU 보들 크림 블러셔 🩷 지금 바로 만나보세요!
            </div>
            
            {/* CTA 버튼 */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'linear-gradient(135deg, #db7093, #e890ab)',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: 30,
              fontSize: 14,
              fontWeight: 700,
              boxShadow: '0 4px 15px rgba(219,112,147,0.4)'
            }}>
              공식몰 바로가기 
              <span style={{ fontSize: 18 }}>→</span>
            </div>
          </div>
        </div>
      </a>

      {/* 카테고리 필터 탭 - 프리미엄 */}
      <div style={{ marginBottom: 28 }}>
        {/* 검색창 - 글래스모피즘 */}
        <div style={{ 
          marginBottom: 20,
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '18px 24px',
            borderRadius: 20,
            border: isSearchFocused ? '2px solid #ff4d88' : '2px solid transparent',
            background: isSearchFocused 
              ? 'linear-gradient(#fff, #fff) padding-box, linear-gradient(135deg, #ff4d88, #a855f7) border-box' 
              : 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            boxShadow: isSearchFocused ? '0 12px 40px rgba(255,77,136,0.2)' : '0 4px 20px rgba(0,0,0,0.06)',
            transition: 'all 0.4s ease'
          }}>
            <span style={{ fontSize: 24, animation: 'bounce 2s ease-in-out infinite' }}>🔍</span>
            <input
              type="text"
              placeholder="브랜드, 제품명, 키워드로 검색... (예: 롬앤, 비타민C, 쿠션)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: 16,
                background: 'transparent',
                color: '#333',
                fontWeight: 500
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'linear-gradient(135deg, #ff4d88, #ff6b9d)',
                  border: 'none',
                  borderRadius: 25,
                  padding: '10px 20px',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 4px 15px rgba(255,77,136,0.3)',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                ✕ 초기화
              </button>
            )}
          </div>
          
          {/* 인기 검색어 - 프리미엄 */}
          {!searchQuery && (
            <div style={{ 
              marginTop: 16, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 12, 
              flexWrap: 'wrap',
              animation: 'slideUp 0.5s ease-out'
            }}>
              <span style={{ 
                background: 'linear-gradient(135deg, #ff4d88, #ff6b9d)',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: 12, 
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>🔥 인기 검색</span>
              {['롬앤', '클리오', '이니스프리', '에스쁘아', '비타민C', '수분크림', '틴트'].map((keyword, idx) => (
                <button
                  key={keyword}
                  onClick={() => setSearchQuery(keyword)}
                  style={{
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,77,136,0.2)',
                    borderRadius: 20,
                    padding: '8px 16px',
                    color: '#ff4d88',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    animation: `slideUp 0.4s ease-out ${idx * 0.05}s both`
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #ff4d88, #ff6b9d)';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,77,136,0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                    e.currentTarget.style.color = '#ff4d88';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {keyword}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 카테고리 버튼들 - 프리미엄 */}
        <div style={{ 
          display: 'flex', 
          gap: 12, 
          overflowX: 'auto', 
          paddingBottom: 12,
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: 20,
          padding: '16px 20px'
        }}>
          {[
            { id: 'all', name: '전체', icon: '✨' },
            { id: 'skincare', name: '스킨케어', icon: '💧' },
            { id: 'makeup', name: '메이크업', icon: '💄' },
            { id: 'bodycare', name: '바디케어', icon: '🧴' },
            { id: 'fashion', name: '패션', icon: '👗' },
            { id: 'lifestyle', name: '라이프스타일', icon: '🏠' },
          ].map((cat) => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{ 
                padding: '10px 18px', 
                borderRadius: 20, 
                border: activeCategory === cat.id ? '2px solid #ff4d88' : '1px solid #e6eefb',
                background: activeCategory === cat.id ? 'linear-gradient(135deg, #fff0f5, #fff)' : '#fff',
                color: activeCategory === cat.id ? '#ff4d88' : '#666',
                fontWeight: activeCategory === cat.id ? 600 : 400,
                fontSize: 13,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s ease'
              }}
            >
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews grid - 다양한 카테고리 */}
      <div ref={reviewSectionRef}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 18 }}>🔥 최신 리뷰</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* 사진/글 리뷰 필터 */}
            {[
              { id: 'all', name: '전체', icon: '📋' },
              { id: 'photo', name: '사진리뷰', icon: '📷' },
              { id: 'text', name: '글리뷰', icon: '✏️' },
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setReviewType(type.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 20,
                  border: reviewType === type.id ? '2px solid #ff4d88' : '1px solid #e0e0e0',
                  background: reviewType === type.id ? 'rgba(255,77,136,0.1)' : '#fff',
                  color: reviewType === type.id ? '#ff4d88' : '#666',
                  fontSize: 12,
                  fontWeight: reviewType === type.id ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{type.icon}</span>
                <span>{type.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{ color: '#888', fontSize: 13, marginBottom: 12 }}>
          {(() => {
            let filtered = activeCategory === 'all' ? reviews : reviews.filter(r => r.category === activeCategory);
            if (reviewType === 'photo') filtered = filtered.filter(r => r.images && r.images.length > 0);
            if (reviewType === 'text') filtered = filtered.filter(r => !r.images || r.images.length === 0);
            if (searchQuery.trim()) {
              const query = searchQuery.toLowerCase().trim();
              filtered = filtered.filter(r => 
                r.brand?.toLowerCase().includes(query) ||
                r.product?.toLowerCase().includes(query) ||
                r.title?.toLowerCase().includes(query) ||
                r.text?.toLowerCase().includes(query) ||
                r.tags?.some(tag => tag.toLowerCase().includes(query))
              );
            }
            return `${filtered.length}개의 리뷰`;
          })()}
          {searchQuery && <span style={{ marginLeft: 8, color: '#ff4d88', fontWeight: 600 }}>"{searchQuery}" 검색 결과</span>}
        </div>
        <div className="reviews-grid">
          {(() => {
            let filtered = activeCategory === 'all' ? reviews : reviews.filter(r => r.category === activeCategory);
            if (reviewType === 'photo') filtered = filtered.filter(r => r.images && r.images.length > 0);
            if (reviewType === 'text') filtered = filtered.filter(r => !r.images || r.images.length === 0);
            if (searchQuery.trim()) {
              const query = searchQuery.toLowerCase().trim();
              filtered = filtered.filter(r => 
                r.brand?.toLowerCase().includes(query) ||
                r.product?.toLowerCase().includes(query) ||
                r.title?.toLowerCase().includes(query) ||
                r.text?.toLowerCase().includes(query) ||
                r.tags?.some(tag => tag.toLowerCase().includes(query))
              );
            }
            return filtered.length > 0 ? filtered.map(r => (
              <ReviewCard
                key={r._id}
                id={r._id}
                username={r.author?.username || '익명'}
                brand={r.brand}
                product={r.product}
                title={r.title}
                text={r.text}
                images={r.images}
                createdAt={r.createdAt}
                likes={r.likes}
                comments={r.comments}
                tags={r.tags}
                rating={r.rating}
              />
            )) : (
              <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '60px 20px', background: '#fff5f7', borderRadius: 20 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#333', marginBottom: 8 }}>검색 결과가 없어요</div>
                <div style={{ color: '#888', fontSize: 14 }}>다른 키워드로 검색해보세요!</div>
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    marginTop: 16,
                    background: 'linear-gradient(135deg, #ff4d88, #ff8a5c)',
                    border: 'none',
                    borderRadius: 20,
                    padding: '10px 24px',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  전체 리뷰 보기
                </button>
              </div>
            );
          })()}
        </div>
      </div>
      </div>
    </div>
  );
}

export default Feed;
