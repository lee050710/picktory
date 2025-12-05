import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 가상 제품 데이터베이스
const productDatabase = [
  { id: 1, name: '비타민C 세럼', brand: '이니스프리', category: '스킨케어', image: '/images/비타민세럼리뷰.jpg' },
  { id: 2, name: '그린티 씨드 세럼', brand: '이니스프리', category: '스킨케어', image: '/images/비타민세럼리뷰.jpg' },
  { id: 3, name: '센시티브 립 밤', brand: '헤라', category: '립메이크업', image: '/images/립스틱리뷰.jpg' },
  { id: 4, name: '퓨어 클렌징 폼', brand: '라네즈', category: '클렌징', image: '/images/클렌징폼리뷰.jpg' },
  { id: 5, name: '워터뱅크 수분크림', brand: '라네즈', category: '스킨케어', image: '/images/cream.png' },
  { id: 6, name: '진정 마스크팩 10매', brand: '메디힐', category: '마스크팩', image: '/images/마스크팩리뷰.jpg' },
  { id: 7, name: '글로우 쿠션', brand: '에뛰드', category: '베이스메이크업', image: '/images/파운데이션리뷰.jpg' },
  { id: 8, name: '벨벳 틴트', brand: '롬앤', category: '립메이크업', image: '/images/립스틱리뷰.jpg' },
];

// SNS 템플릿 옵션
const snsTemplates = [
  { id: 'insta-feed', name: '인스타그램 피드', icon: '📷', ratio: '1:1', maxLength: 2200 },
  { id: 'insta-story', name: '인스타그램 스토리', icon: '📱', ratio: '9:16', maxLength: 500 },
  { id: 'tiktok', name: '틱톡 캡션', icon: '🎵', ratio: '9:16', maxLength: 300 },
  { id: 'youtube', name: '유튜브 설명', icon: '▶️', ratio: '16:9', maxLength: 5000 },
  { id: 'blog', name: '블로그 포스팅', icon: '📝', ratio: 'free', maxLength: 10000 },
];

// 가상 브랜드 콜라보 제안
const collabOffers = [
  { id: 1, brand: '이니스프리', message: '그린티 라인 협찬 제안이 도착했습니다!', budget: '50만원', deadline: 'D-3' },
  { id: 2, brand: '롬앤', message: '신상 틴트 체험단을 모집합니다!', budget: '30만원', deadline: 'D-7' },
];

function Studio() {
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [productName, setProductName] = useState('');
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [budget, setBudget] = useState('');
  const [brief, setBrief] = useState('');
  const [categories, setCategories] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(snsTemplates[0]);
  const [adTagAd, setAdTagAd] = useState(false);
  const [adTagSponsored, setAdTagSponsored] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [savedToPortfolio, setSavedToPortfolio] = useState(false);
  const [showCollabModal, setShowCollabModal] = useState(false);
  const fileRef = useRef();

  // 스마트 예측 함수 (로컬에서 계산 - API 불필요)
  const getSmartPrediction = () => {
    let score = 0;
    const strengths = [];
    const improvements = [];
    const hashtags = new Set(['뷰티', '화장품']);

    // 제목 분석
    if (title) {
      score += 15;
      strengths.push('캠페인 제목이 설정되었습니다.');
      if (title.includes('겨울') || title.includes('여름') || title.includes('봄') || title.includes('가을')) {
        score += 5;
        hashtags.add('시즌케어');
      }
      if (title.includes('보습') || title.includes('수분')) {
        hashtags.add('보습케어');
      }
    } else {
      improvements.push('캠페인 제목을 입력하세요');
    }

    // 브랜드 분석
    if (brand) {
      score += 15;
      strengths.push(`${brand} 브랜드 협찬 콘텐츠입니다.`);
      hashtags.add(brand.replace(/\s/g, ''));
    } else {
      improvements.push('브랜드명을 입력하세요');
    }

    // 브리프 분석
    if (brief) {
      if (brief.length >= 100) {
        score += 25;
        strengths.push('상세한 브리프 작성으로 협찬 성공률이 높아집니다.');
      } else if (brief.length >= 50) {
        score += 15;
      } else {
        score += 5;
        improvements.push('브리프를 50자 이상 작성하면 더 좋은 결과를 얻어요');
      }
      // 키워드 추출
      const keywords = ['촉촉', '지속력', '발색', '커버력', '순함', '자연스러운'];
      keywords.forEach(kw => {
        if (brief.includes(kw)) hashtags.add(kw);
      });
    } else {
      improvements.push('콘텐츠 브리프를 작성해주세요');
    }

    // 이미지 분석
    if (files.length >= 4) {
      score += 25;
      strengths.push('충분한 이미지로 풍부한 콘텐츠를 제작할 수 있어요!');
    } else if (files.length >= 2) {
      score += 15;
      strengths.push('이미지가 업로드되었습니다.');
    } else if (files.length === 1) {
      score += 8;
      improvements.push('이미지를 2개 이상 추가하면 효과가 올라갑니다');
    } else {
      improvements.push('제품 이미지를 업로드해주세요');
    }

    // 카테고리 분석
    if (categories.length > 0) {
      score += 10;
      categories.forEach(cat => hashtags.add(cat.replace(/\s/g, '')));
    }

    // 광고 태그 분석
    if (adTagAd || adTagSponsored) {
      score += 5;
      strengths.push('광고 표기 규정을 준수합니다. 👍');
    } else {
      improvements.push('광고 문구 태그를 활성화하세요 (규정 준수)');
    }

    // 템플릿별 가중치
    const templateBonus = {
      'insta-feed': 1.2,
      'insta-story': 1.1,
      'tiktok': 1.15,
      'youtube': 1.0,
      'blog': 0.95
    };
    const multiplier = templateBonus[selectedTemplate.id] || 1;

    // 최종 점수 (최대 100)
    score = Math.min(Math.round(score * multiplier), 100);

    // 예상 지표 계산 (점수 기반 + 랜덤 변동)
    const baseReach = 800 + (score * 180) + Math.floor(Math.random() * 500);
    const baseLikes = 40 + (score * 10) + Math.floor(Math.random() * 50);
    const baseConversion = (score * 0.035) + (Math.random() * 0.5);

    // 최적 게시 시간 추천
    const postTimes = [
      '오전 7-9시 (출근길 확인 시간대)',
      '점심 12-1시 (점심 시간 인스타 타임)',
      '저녁 6-8시 (퇴근 후 여유 시간)',
      '밤 9-11시 (잠들기 전 SNS 피크 타임)'
    ];
    const bestTime = postTimes[Math.floor(score / 30)] || postTimes[3];

    return {
      reach: Math.floor(baseReach),
      likes: Math.floor(baseLikes),
      conversion: parseFloat(baseConversion.toFixed(1)),
      qualityScore: score,
      strengths: strengths.length > 0 ? strengths : ['정보를 입력해주세요'],
      improvements: improvements.length > 0 ? improvements : ['완벽해요! 🎉'],
      hashtags: Array.from(hashtags).slice(0, 8),
      bestPostTime: bestTime
    };
  };

  // 예측 결과 (입력값 변경시 자동 업데이트)
  const [prediction, setPrediction] = useState(null);
  
  useEffect(() => {
    setPrediction(getSmartPrediction());
  }, [title, brand, brief, files.length, categories.length, adTagAd, adTagSponsored, selectedTemplate]);

  // 제품명 자동완성
  useEffect(() => {
    if (productName.length >= 1) {
      const matches = productDatabase.filter(p => 
        p.name.toLowerCase().includes(productName.toLowerCase()) ||
        p.brand.toLowerCase().includes(productName.toLowerCase())
      );
      setProductSuggestions(matches.slice(0, 5));
    } else {
      setProductSuggestions([]);
    }
  }, [productName]);

  const selectProduct = (product) => {
    setSelectedProduct(product);
    setProductName(product.name);
    setBrand(product.brand);
    setCategories([product.category]);
    setProductSuggestions([]);
  };

  const toggleCategory = (cat) => {
    setCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const onFilesChange = (e) => {
    const list = Array.from(e.target.files || []);
    handleFileList(list);
  };

  const handleFileList = (list) => {
    if (files.length + list.length > 5) {
      alert('최대 5개까지 업로드할 수 있습니다.');
      list = list.slice(0, 5 - files.length);
    }
    const mapped = list.map(f => ({ file: f, url: URL.createObjectURL(f) }));
    setFiles(prev => [...prev, ...mapped].slice(0, 5));
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      handleFileList(Array.from(e.dataTransfer.files));
    }
  };

  const removeFile = (idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  // 콘텐츠 품질 점수 계산
  const calculateQualityScore = () => {
    let score = 0;
    if (title) score += 15;
    if (brand) score += 15;
    if (brief && brief.length > 50) score += 20;
    if (files.length > 0) score += 20;
    if (files.length >= 3) score += 10;
    if (categories.length > 0) score += 10;
    if (adTagAd || adTagSponsored) score += 10;
    return Math.min(score, 100);
  };

  // 예상 지표 계산 (품질 점수 기반)
  const getEstimatedMetrics = () => {
    const score = calculateQualityScore();
    return {
      reach: Math.floor(1000 + (score * 150)),
      likes: Math.floor(50 + (score * 8)),
      conversion: (score * 0.03).toFixed(1),
    };
  };

  // 품질 개선 제안
  const getQualitySuggestions = () => {
    const suggestions = [];
    if (!title) suggestions.push('캠페인 제목을 입력하세요');
    if (!brand) suggestions.push('브랜드/제품명을 입력하세요');
    if (brief.length < 50) suggestions.push('브리프를 50자 이상 작성하면 더 높은 점수를 받아요');
    if (files.length === 0) suggestions.push('이미지를 업로드하면 예상 도달률이 올라갑니다');
    if (files.length < 3) suggestions.push('3개 이상의 이미지를 추가해보세요');
    if (!adTagAd && !adTagSponsored) suggestions.push('광고 문구 태그를 활성화하세요 (규정 준수)');
    return suggestions;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !brand) return alert('캠페인 제목과 브랜드를 입력해주세요');
    const payload = { 
      title, brand, budget, brief, categories, 
      files: files.map(f=>f.file.name),
      template: selectedTemplate.id,
      adTags: { ad: adTagAd, sponsored: adTagSponsored }
    };
    console.log('협찬 제안서 제출', payload);
    alert('협찬 제안서가 생성되었습니다!');
  };

  const saveToPortfolio = () => {
    // 포트폴리오에 저장 (로컬스토리지 시뮬레이션)
    const portfolioItem = {
      id: Date.now(),
      title,
      brand,
      template: selectedTemplate.name,
      createdAt: new Date().toISOString(),
      thumbnail: files[0]?.url || selectedProduct?.image || null
    };
    const existing = JSON.parse(localStorage.getItem('portfolio') || '[]');
    localStorage.setItem('portfolio', JSON.stringify([portfolioItem, ...existing]));
    setSavedToPortfolio(true);
    setTimeout(() => setSavedToPortfolio(false), 3000);
  };

  const qualityScore = calculateQualityScore();
  const metrics = getEstimatedMetrics();
  const suggestions = getQualitySuggestions();

  return (
    <div className="container page-enter" style={{ padding: 20 }}>
      
      {/* 브랜드 콜라보 제안 알림 */}
      <div style={{ 
        background: 'linear-gradient(135deg, #fef3c7 0%, #fff 100%)', 
        borderRadius: 16, 
        padding: '16px 20px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid rgba(245,158,11,0.3)',
        cursor: 'pointer'
      }} onClick={() => setShowCollabModal(true)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28 }}>💼</span>
          <div>
            <div style={{ fontWeight: 700, color: '#92400e' }}>새로운 브랜드 콜라보 제안 {collabOffers.length}건</div>
            <div style={{ color: '#b45309', fontSize: 13 }}>{collabOffers[0].brand}에서 "{collabOffers[0].message.slice(0, 25)}..."</div>
          </div>
        </div>
        <span style={{ background: '#f59e0b', color: '#fff', padding: '8px 16px', borderRadius: 10, fontWeight: 600, fontSize: 13 }}>
          확인하기 →
        </span>
      </div>

      {/* 콜라보 모달 */}
      {showCollabModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, width: 480, maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0 }}>💼 브랜드 콜라보 제안함</h2>
              <button onClick={() => setShowCollabModal(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>×</button>
            </div>
            {collabOffers.map(offer => (
              <div key={offer.id} style={{ padding: 16, border: '1px solid #f0f0f0', borderRadius: 12, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{offer.brand}</div>
                    <div style={{ color: '#666', marginTop: 4 }}>{offer.message}</div>
                    <div style={{ marginTop: 8, display: 'flex', gap: 12 }}>
                      <span style={{ color: '#10b981', fontWeight: 600 }}>💰 {offer.budget}</span>
                      <span style={{ color: '#ef4444', fontWeight: 600 }}>⏰ {offer.deadline}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button className="btn btn-primary" style={{ flex: 1, padding: '10px', borderRadius: 8 }}>수락하기</button>
                  <button className="btn" style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #ddd' }}>거절</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h1 style={{ margin: '0 0 8px', background: 'linear-gradient(135deg, #ff4d88, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        📸 협찬 스튜디오
      </h1>
      <p style={{ color: '#555', marginBottom: 20 }}>브랜드 협찬 제안서 생성 및 SNS 콘텐츠 시뮬레이션 도구</p>

      <div style={{ display: 'flex', gap: 24, marginTop: 18 }}>
        {/* 입력 영역 */}
        <form onSubmit={handleSubmit} style={{ flex: 1, minWidth: 400 }}>
          <div style={{ display: 'grid', gap: 16 }}>
            
            {/* 제품 정보 (자동완성) */}
            <div style={{ background: '#fff', padding: 20, borderRadius: 16, border: '1px solid #f0f0f0' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📦</span> 제품 정보
                <span style={{ background: '#10b981', color: '#fff', padding: '3px 8px', borderRadius: 8, fontSize: 10 }}>DB 연동</span>
              </h3>
              
              <div style={{ position: 'relative', marginBottom: 12 }}>
                <label style={{ fontWeight: 600, fontSize: 13, color: '#666', marginBottom: 6, display: 'block' }}>제품명 (자동완성)</label>
                <input 
                  value={productName} 
                  onChange={e => { setProductName(e.target.value); setSelectedProduct(null); }}
                  placeholder="제품명 또는 브랜드 검색..." 
                  style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #e6eefb', fontSize: 14 }} 
                />
                {productSuggestions.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e6eefb', borderRadius: 10, marginTop: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 10 }}>
                    {productSuggestions.map(product => (
                      <div 
                        key={product.id} 
                        onClick={() => selectProduct(product)}
                        style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }}
                        onMouseOver={e => e.currentTarget.style.background = '#f8f9ff'}
                        onMouseOut={e => e.currentTarget.style.background = '#fff'}
                      >
                        <img src={product.image} alt={product.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{product.name}</div>
                          <div style={{ fontSize: 12, color: '#888' }}>{product.brand} · {product.category}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedProduct && (
                <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{selectedProduct.name}</div>
                    <div style={{ fontSize: 12, color: '#10b981' }}>✓ {selectedProduct.brand} · {selectedProduct.category}</div>
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: 13, color: '#666', marginBottom: 6, display: 'block' }}>브랜드</label>
                  <input value={brand} onChange={e=>setBrand(e.target.value)} placeholder="브랜드명" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e6eefb' }} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: 13, color: '#666', marginBottom: 6, display: 'block' }}>예산 (원)</label>
                  <input value={budget} onChange={e=>setBudget(e.target.value)} placeholder="500000" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e6eefb' }} />
                </div>
              </div>
            </div>

            {/* SNS 템플릿 선택 */}
            <div style={{ background: '#fff', padding: 20, borderRadius: 16, border: '1px solid #f0f0f0' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🎨</span> SNS 템플릿
              </h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {snsTemplates.map(tmpl => (
                  <button 
                    key={tmpl.id} 
                    type="button"
                    onClick={() => setSelectedTemplate(tmpl)}
                    style={{ 
                      padding: '10px 14px', 
                      borderRadius: 10, 
                      border: selectedTemplate.id === tmpl.id ? '2px solid #ff4d88' : '1px solid #e6eefb',
                      background: selectedTemplate.id === tmpl.id ? '#fff0f5' : '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 13,
                      fontWeight: selectedTemplate.id === tmpl.id ? 600 : 400
                    }}
                  >
                    <span>{tmpl.icon}</span> {tmpl.name}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 12, padding: 10, background: '#f8f9ff', borderRadius: 8, fontSize: 12, color: '#666' }}>
                📐 비율: {selectedTemplate.ratio} · ✏️ 최대 {selectedTemplate.maxLength.toLocaleString()}자
              </div>
            </div>

            {/* 캠페인 내용 */}
            <div style={{ background: '#fff', padding: 20, borderRadius: 16, border: '1px solid #f0f0f0' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>📝 캠페인 내용</h3>
              
              <label style={{ fontWeight: 600, fontSize: 13, color: '#666', marginBottom: 6, display: 'block' }}>캠페인 제목</label>
              <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="예: 겨울 보습 캠페인" style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #e6eefb', marginBottom: 12 }} />

              <label style={{ fontWeight: 600, fontSize: 13, color: '#666', marginBottom: 6, display: 'block' }}>콘텐츠 브리프</label>
              <textarea 
                value={brief} 
                onChange={e=>setBrief(e.target.value)} 
                placeholder="제작 의도, 전달 포인트, 요구 컷 등을 자세히 작성해주세요..." 
                style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #e6eefb', minHeight: 120, resize: 'vertical' }} 
              />
              <div style={{ textAlign: 'right', fontSize: 12, color: brief.length >= 50 ? '#10b981' : '#888', marginTop: 4 }}>
                {brief.length}자 {brief.length >= 50 && '✓'}
              </div>

              <label style={{ fontWeight: 600, fontSize: 13, color: '#666', marginBottom: 8, marginTop: 12, display: 'block' }}>타깃 카테고리</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['뷰티','스킨케어','립메이크업','패션','F&B','라이프스타일','건강'].map(cat => (
                  <button key={cat} type="button" onClick={() => toggleCategory(cat)} style={{ 
                    padding: '8px 14px', 
                    borderRadius: 20, 
                    background: categories.includes(cat) ? 'linear-gradient(135deg, #ff4d88, #ff8a5c)' : '#f8f9ff', 
                    color: categories.includes(cat) ? '#fff' : '#666', 
                    border: 'none',
                    fontSize: 13,
                    fontWeight: categories.includes(cat) ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}>{cat}</button>
                ))}
              </div>
            </div>

            {/* 필수 광고 문구 토글 */}
            <div style={{ background: '#fff', padding: 20, borderRadius: 16, border: '1px solid #f0f0f0' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>⚖️</span> 필수 광고 문구
                <span style={{ background: '#ef4444', color: '#fff', padding: '3px 8px', borderRadius: 8, fontSize: 10 }}>규정 준수</span>
              </h3>
              
              <div style={{ display: 'flex', gap: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '12px 16px', background: adTagAd ? '#fff0f5' : '#f8f9ff', borderRadius: 10, border: adTagAd ? '2px solid #ff4d88' : '1px solid #e6eefb', flex: 1 }}>
                  <div style={{ 
                    width: 44, height: 24, borderRadius: 12, 
                    background: adTagAd ? 'linear-gradient(135deg, #ff4d88, #ff8a5c)' : '#ddd',
                    position: 'relative', transition: 'all 0.2s ease'
                  }}>
                    <div style={{ 
                      width: 20, height: 20, borderRadius: '50%', background: '#fff', 
                      position: 'absolute', top: 2, left: adTagAd ? 22 : 2,
                      transition: 'all 0.2s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }} />
                  </div>
                  <input type="checkbox" checked={adTagAd} onChange={e => setAdTagAd(e.target.checked)} style={{ display: 'none' }} />
                  <span style={{ fontWeight: 600 }}>#광고포함</span>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '12px 16px', background: adTagSponsored ? '#fff0f5' : '#f8f9ff', borderRadius: 10, border: adTagSponsored ? '2px solid #ff4d88' : '1px solid #e6eefb', flex: 1 }}>
                  <div style={{ 
                    width: 44, height: 24, borderRadius: 12, 
                    background: adTagSponsored ? 'linear-gradient(135deg, #ff4d88, #ff8a5c)' : '#ddd',
                    position: 'relative', transition: 'all 0.2s ease'
                  }}>
                    <div style={{ 
                      width: 20, height: 20, borderRadius: '50%', background: '#fff', 
                      position: 'absolute', top: 2, left: adTagSponsored ? 22 : 2,
                      transition: 'all 0.2s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }} />
                  </div>
                  <input type="checkbox" checked={adTagSponsored} onChange={e => setAdTagSponsored(e.target.checked)} style={{ display: 'none' }} />
                  <span style={{ fontWeight: 600 }}>#협찬</span>
                </label>
              </div>
            </div>

            {/* 이미지/동영상 업로드 (드래그앤드롭) */}
            <div style={{ background: '#fff', padding: 20, borderRadius: 16, border: '1px solid #f0f0f0' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>🖼️ 미디어 업로드</span>
                <span style={{ fontSize: 12, color: '#888', fontWeight: 400 }}>{files.length}/5</span>
              </h3>
              
              <div 
                onDrop={onDrop}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => fileRef.current?.click()}
                style={{ 
                  border: `2px dashed ${dragOver ? '#ff4d88' : '#e6eefb'}`,
                  borderRadius: 12,
                  padding: 24,
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: dragOver ? '#fff0f5' : '#f8f9ff',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
                <div style={{ color: '#666' }}>이미지/동영상을 드래그하거나 클릭하여 업로드</div>
                <div style={{ color: '#888', fontSize: 12, marginTop: 4 }}>최대 5개 · JPG, PNG, MP4</div>
                <input ref={fileRef} type="file" multiple accept="image/*,video/*" onChange={onFilesChange} style={{ display: 'none' }} />
              </div>

              {files.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginTop: 16 }}>
                  {files.map((f, i) => (
                    <div key={i} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', aspectRatio: '1', border: '2px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      <img src={f.url} alt={f.file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        type="button" 
                        onClick={() => removeFile(i)} 
                        style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}
                      >×</button>
                      {i === 0 && <div style={{ position: 'absolute', bottom: 4, left: 4, background: '#ff4d88', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: 10 }}>대표</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 제출 버튼 */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                type="button"
                onClick={saveToPortfolio}
                className="btn" 
                style={{ flex: 1, padding: '14px', borderRadius: 12, border: '1px solid #e6eefb', background: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                📂 포트폴리오에 저장
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '14px', borderRadius: 12, fontWeight: 600 }}>
                ✨ 협찬 제안서 생성
              </button>
            </div>

            {savedToPortfolio && (
              <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 10, color: '#10b981', textAlign: 'center', fontWeight: 600 }}>
                ✓ 포트폴리오에 저장되었습니다! <Link to="/mypage" style={{ color: '#10b981' }}>확인하기 →</Link>
              </div>
            )}
          </div>
        </form>

        {/* 미리보기 영역 */}
        <aside style={{ width: 420 }}>
          {/* SNS 목업 미리보기 */}
          <div style={{ background: '#fff', padding: 20, borderRadius: 16, border: '1px solid #f0f0f0', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>📱 {selectedTemplate.name} 미리보기</h3>
              <span style={{ background: '#f0f0f0', padding: '4px 8px', borderRadius: 8, fontSize: 11 }}>{selectedTemplate.ratio}</span>
            </div>
            
            {/* 스마트폰 목업 */}
            <div style={{ 
              background: '#000', 
              borderRadius: 24, 
              padding: 8,
              maxWidth: selectedTemplate.id.includes('story') || selectedTemplate.id === 'tiktok' ? 220 : 320,
              margin: '0 auto',
              boxShadow: '0 12px 40px rgba(0,0,0,0.2)'
            }}>
              <div style={{ 
                background: '#fff', 
                borderRadius: 18, 
                overflow: 'hidden',
                aspectRatio: selectedTemplate.id.includes('story') || selectedTemplate.id === 'tiktok' ? '9/16' : '1/1',
              }}>
                {/* 앱 헤더 */}
                <div style={{ background: '#fff', padding: '8px 12px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #ff4d88, #a855f7)' }} />
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600 }}>@{brand || 'username'}</div>
                    <div style={{ fontSize: 9, color: '#888' }}>{adTagSponsored ? '협찬' : ''}{adTagAd ? ' · 광고' : ''}</div>
                  </div>
                </div>

                {/* 콘텐츠 영역 */}
                <div style={{ 
                  aspectRatio: selectedTemplate.id.includes('story') || selectedTemplate.id === 'tiktok' ? '9/14' : '1/1',
                  background: files[0]?.url || selectedProduct?.image ? `url(${files[0]?.url || selectedProduct?.image})` : 'linear-gradient(135deg, #f8f9ff, #fff)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'flex-end'
                }}>
                  {selectedTemplate.id.includes('story') || selectedTemplate.id === 'tiktok' ? (
                    <div style={{ padding: 12, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', width: '100%' }}>
                      <div style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}>{title || '캠페인 제목'}</div>
                      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 9, marginTop: 4 }}>{brief?.slice(0, 60) || '브리프 내용...'}</div>
                    </div>
                  ) : null}
                </div>

                {/* 피드형 하단 */}
                {selectedTemplate.id === 'insta-feed' && (
                  <div style={{ padding: 10 }}>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                      <span>❤️</span><span>💬</span><span>📤</span>
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 600 }}>{brand || 'brand'}</div>
                    <div style={{ fontSize: 9, color: '#333', marginTop: 2 }}>{brief?.slice(0, 80) || '콘텐츠 내용...'}</div>
                    <div style={{ fontSize: 9, color: '#3b82f6', marginTop: 4 }}>
                      {categories.map(c => `#${c}`).join(' ')} {adTagAd ? '#광고' : ''} {adTagSponsored ? '#협찬' : ''}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 예상 광고 효율 지표 - 스마트 분석 */}
          <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #fff 100%)', padding: 20, borderRadius: 16, border: '1px solid rgba(16,185,129,0.2)', marginBottom: 16 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              📊 예상 광고 효율
              <span style={{ background: '#10b981', color: '#fff', padding: '3px 8px', borderRadius: 8, fontSize: 10 }}>
                ✨ 스마트 분석
              </span>
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
              <div style={{ textAlign: 'center', padding: 12, background: '#fff', borderRadius: 10 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#3b82f6' }}>{(prediction?.reach || 0).toLocaleString()}</div>
                <div style={{ fontSize: 11, color: '#888' }}>예상 도달</div>
              </div>
              <div style={{ textAlign: 'center', padding: 12, background: '#fff', borderRadius: 10 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#ef4444' }}>{prediction?.likes || 0}</div>
                <div style={{ fontSize: 11, color: '#888' }}>예상 좋아요</div>
              </div>
              <div style={{ textAlign: 'center', padding: 12, background: '#fff', borderRadius: 10 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#10b981' }}>{prediction?.conversion || 0}%</div>
                <div style={{ fontSize: 11, color: '#888' }}>예상 전환율</div>
              </div>
            </div>

            {/* 품질 점수 바 */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>콘텐츠 품질 점수</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: (prediction?.qualityScore || 0) >= 80 ? '#10b981' : (prediction?.qualityScore || 0) >= 50 ? '#f59e0b' : '#ef4444' }}>
                  {prediction?.qualityScore || 0}점
                </span>
              </div>
              <div style={{ background: '#e6eefb', borderRadius: 10, height: 10, overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${prediction?.qualityScore || 0}%`,
                  background: (prediction?.qualityScore || 0) >= 80 ? 'linear-gradient(90deg, #10b981, #34d399)' : (prediction?.qualityScore || 0) >= 50 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #ef4444, #f87171)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>

            {/* 추천 해시태그 */}
            {prediction?.hashtags && prediction.hashtags.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: '#666' }}>🏷️ 추천 해시태그</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {prediction.hashtags.map((tag, i) => (
                    <span key={i} style={{ 
                      background: 'linear-gradient(135deg, #e0f2fe, #dbeafe)', 
                      color: '#3b82f6', 
                      padding: '4px 10px', 
                      borderRadius: 15, 
                      fontSize: 11,
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      navigator.clipboard.writeText(`#${tag}`);
                    }}
                    >#{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* 최적 게시 시간 */}
            {prediction?.bestPostTime && (
              <div style={{ padding: 10, background: '#f0f9ff', borderRadius: 8, fontSize: 12, color: '#0369a1', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>⏰</span> {prediction.bestPostTime}
              </div>
            )}
          </div>

          {/* 강점 분석 */}
          {prediction?.strengths && prediction.strengths.length > 0 && (
            <div style={{ background: '#f0fdf4', padding: 16, borderRadius: 12, border: '1px solid rgba(16,185,129,0.3)', marginBottom: 16 }}>
              <h4 style={{ margin: '0 0 12px', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>💪</span> 강점 분석
              </h4>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {prediction.strengths.map((s, i) => (
                  <li key={i} style={{ fontSize: 12, color: '#166534', marginBottom: 6 }}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 개선 제안 */}
          {prediction?.improvements && prediction.improvements.length > 0 && (
            <div style={{ background: '#fffbeb', padding: 16, borderRadius: 12, border: '1px solid rgba(245,158,11,0.3)' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>💡</span> 개선 제안
              </h4>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {prediction.improvements.map((s, i) => (
                  <li key={i} style={{ fontSize: 12, color: '#92400e', marginBottom: 6 }}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default Studio;
