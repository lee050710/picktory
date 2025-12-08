import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchReviews } from '../api/reviewApi';
// Roulette is shown only on its dedicated page; remove from Home
import PostCard from '../components/PostCard';

// 커뮤니티 샘플 데이터 (화장법, 정보, 잡담 등)
const sampleCommunityPosts = [
  {
    _id: 'c001', 
    author: { username: '뷰티마스터' }, 
    title: '🔥 입문자용 데일리 메이크업 순서 총정리!!', 
    text: '메이크업 처음 시작하는 분들 많이 헷갈리시죠?? 제가 순서 정리해드릴겡ㅋㅋ\n\n1️⃣ 스킨케어 (토너→세럼→크림)\n2️⃣ 선크림 (필수!!!)\n3️⃣ 프라이머\n4️⃣ 파운데이션/쿠션\n5️⃣ 컨실러\n6️⃣ 파우더\n7️⃣ 아이브로우\n8️⃣ 아이섀도우\n9️⃣ 아이라이너\n🔟 마스카라\n\n이 순서로 하면 무너짐 없이 하루종일 유지됨ㅋㅋ 궁금한거 있으면 댓글 ㄱㄱ!!', 
    images: [], 
    createdAt: Date.now() - 1000 * 60 * 60 * 3, 
    likes: 892, 
    comments: 156, 
    tags: ['메이크업순서', '입문자', '꿀팁'],
    category: 'tip'
  },
  {
    _id: 'c002', 
    author: { username: '피부과언니' }, 
    title: '피부 타입별 스킨케어 루틴 공유해요~', 
    text: '안녕하세용 피부과 다니면서 배운거 공유할겡ㅋㅋ\n\n💧건성: 수분크림 두껍게 + 오일 마무리\n🔥지성: 가벼운 수분젤 + 논코메도제닉 제품\n🌡️복합성: T존/U존 다르게 케어\n🌸민감성: 저자극 + 진정 성분 위주\n\n그리고 세안 미온수로!! 뜨거운물 ㄴㄴ 피부장벽 무너져요ㅜㅜ', 
    images: [], 
    createdAt: Date.now() - 1000 * 60 * 60 * 8, 
    likes: 567, 
    comments: 89, 
    tags: ['스킨케어', '피부타입', '루틴'],
    category: 'tip'
  },
  {
    _id: 'c003', 
    author: { username: '립덕후' }, 
    title: '요즘 핫한 립 조합 공유!!!!!', 
    text: '요즘 유행하는 립 조합 정리해봤어용ㅋㅋㅋ\n\n1. 롬앤 베어쥬시 + 페리페라 잉크틴트 = 청순 과즙미 뿜뿜\n2. 에스쁘아 노웨어 + 클리오 킬커버 = 고급진 mlbb\n3. 어뮤즈 듀틴트 + 헤라 센슈얼 = 촉촉 유리알 입술\n\n다들 한번 해봐요 찐 예쁨ㅋㅋㅋ 다른 조합 있으면 댓글로 공유해주세용!!', 
    images: [], 
    createdAt: Date.now() - 1000 * 60 * 60 * 15, 
    likes: 445, 
    comments: 78, 
    tags: ['립조합', '립메이크업', '트렌드'],
    category: 'talk'
  },
  {
    _id: 'c004', 
    author: { username: '올영러버' }, 
    title: '올영세일 뭐 사야되나요ㅠㅠ 추천좀!!', 
    text: '다음주 올영세일인데 뭐 사야할지 모르겟어요ㅜㅜ\n\n예산은 5만원 정도고 스킨케어 위주로 사고싶은데 추천좀요!!\n피부타입은 복합성이고 트러블 좀 있어요ㅠ\n\n선크림이랑 클렌징은 있어서 그거 빼고 추천해주시면 감사합니당!!', 
    images: [], 
    createdAt: Date.now() - 1000 * 60 * 60 * 2, 
    likes: 234, 
    comments: 167, 
    tags: ['올영세일', '추천', '질문'],
    category: 'question'
  },
  {
    _id: 'c005', 
    author: { username: '화장초보' }, 
    title: '아이라인 그리는거 너무 어려워요ㅠㅠ', 
    text: '아이라인 매일 그려보는데 왜이렇게 어렵죠...ㅠㅠ\n\n한쪽은 예쁘게 되는데 다른쪽은 항상 이상해요 진짜 미치겠음ㅋㅋㅋㅋ\n\n고수분들 꿀팁 좀 알려주세요ㅜ 펜라이너 쓰는데 추천 제품도 있으면 알려주세용!!', 
    images: [], 
    createdAt: Date.now() - 1000 * 60 * 60 * 6, 
    likes: 189, 
    comments: 134, 
    tags: ['아이라인', '초보', '질문'],
    category: 'question'
  },
  {
    _id: 'c006', 
    author: { username: '겨울맞이' }, 
    title: '건조한 겨울철 꿀피부 만드는 법 🌨️', 
    text: '겨울되니까 피부 건조해서 미치겠죠ㅜㅜ 제가 쓰는 방법 공유할겡!!\n\n1. 클렌징 후 3초 안에 토너 바르기 (수분 날아가기 전에!!)\n2. 에센스 2-3겹 레이어링\n3. 수분크림 + 페이셜오일 섞어바르기\n4. 일주일에 2번 수분팩\n5. 가습기 필수!!\n\n이거 한달 했더니 피부결 ㄹㅇ 좋아졌어요ㅋㅋ 다들 해봐요!!', 
    images: [], 
    createdAt: Date.now() - 1000 * 60 * 60 * 20, 
    likes: 678, 
    comments: 92, 
    tags: ['겨울스킨케어', '건조피부', '꿀팁'],
    category: 'tip'
  },
  {
    _id: 'c007', 
    author: { username: '글로시퀸' }, 
    title: '오늘의 데일리 메이크업 완성💄✨', 
    text: '오늘 출근 메이크업 공유해용ㅋㅋㅋ\n\n베이스는 촉촉하게 쿠션으로 가볍게 올리고 포인트는 립이에용!! 요즘 핫한 코랄핑크 발라봤는데 얼굴 화사해지는거 실화냐구ㅜㅜ\n\n아이메이크업은 브라운 음영으로 자연스럽게~ 아이라이너 꼬리만 살짝 올려서 눈매 살렸어용\n\n다들 오늘 메이크업 어때요?? 같이 공유해봐요!!🥰', 
    images: [`${process.env.PUBLIC_URL}/images/커뮤니티1.jpg`], 
    createdAt: Date.now() - 1000 * 60 * 60 * 4, 
    likes: 823, 
    comments: 145, 
    tags: ['데일리메이크업', '출근룩', 'OOTD'],
    category: 'talk'
  },
  {
    _id: 'c008', 
    author: { username: '뷰티수집가' }, 
    title: '이번달 뷰티 하울 대공개🛍️💕', 
    text: '월급 들어오자마자 질러버린 뷰티템들ㅋㅋㅋㅋ 통장이 텅장됐지만 후회없음!!!\n\n✨ 구매 목록 ✨\n- 샤넬 루쥬 알뤼르 벨벳 익스트림\n- 디올 백스테이지 아이팔레트\n- 에스티로더 더블웨어 파운데이션\n- 조말론 피오니 앤 블러쉬 스웨이드\n\n다들 이중에 써본거 있어요?? 후기 궁금하면 댓글 달아줘요 리뷰 올려드릴겡ㅋㅋ', 
    images: [`${process.env.PUBLIC_URL}/images/커뮤니티2.jpg`], 
    createdAt: Date.now() - 1000 * 60 * 60 * 12, 
    likes: 567, 
    comments: 98, 
    tags: ['하울', '럭셔리뷰티', '신상'],
    category: 'talk'
  },
  {
    _id: 'c009', 
    author: { username: '스킨케어요정' }, 
    title: '트러블 진정시키는 나만의 루틴 공유💚', 
    text: '피부 뒤집어졌을때 제가 쓰는 비상 루틴이에용!!\n\n🌿 1단계: 저자극 클렌저로 부드럽게 세안\n🌿 2단계: 티트리 토너로 진정\n🌿 3단계: 시카 세럼 듬뿍\n🌿 4단계: 마데카 크림으로 마무리\n🌿 +보너스: 스팟패치 붙이고 자기!!\n\n이거 3일만 하면 진짜 가라앉아요ㅜㅜ 트러블 때문에 고민인 분들 해보세용!! 진짜 효과 봄ㅋㅋㅋ', 
    images: [`${process.env.PUBLIC_URL}/images/커뮤니티3.jpg`], 
    createdAt: Date.now() - 1000 * 60 * 60 * 18, 
    likes: 712, 
    comments: 203, 
    tags: ['트러블케어', '진정루틴', '스킨케어'],
    category: 'tip'
  },
];

function Home() {
  const [latest, setLatest] = useState([]);
  const [posts, setPosts] = useState([]);
  const [reviews, setReviews] = useState([]); // 리뷰 state 추가
  const [communityPosts, setCommunityPosts] = useState(sampleCommunityPosts);
  const [postType, setPostType] = useState('community'); // 글쓰기 타입 (커뮤니티 기본)
  const [communityCategory, setCommunityCategory] = useState('all'); // 커뮤니티 카테고리 필터
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]); // 다중 파일 지원
  const [dragOver, setDragOver] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [trails, setTrails] = useState([]); // 마우스 트레일 효과
  const [showPostSuccess, setShowPostSuccess] = useState(false); // 게시완료 알림
  const [successMessage, setSuccessMessage] = useState(''); // 성공 메시지
  const fileInputRef = useRef();
  const heroRef = useRef();
  const trailIdRef = useRef(0);

  // 마우스 추적 효과 + 브러쉬 트레일
  useEffect(() => {
    const handleMouseMove = (e) => {
      // mousePos 업데이트 (히어로 섹션용)
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
      
      // 브러쉬 트레일 효과 - 파스텔 노랑
      const newTrail = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 30 + 20,
        color: ['#fffef5', '#fffde7', '#fffacd', '#fff9c4'][Math.floor(Math.random() * 4)],
        opacity: 0.7,
        createdAt: Date.now()
      };
      setTrails(prev => [...prev.slice(-50), newTrail]);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 트레일 페이드아웃
  useEffect(() => {
    if (trails.length === 0) return;
    const timer = setInterval(() => {
      const now = Date.now();
      setTrails(prev => prev.filter(t => now - t.createdAt < 1000).map(t => ({
        ...t,
        opacity: Math.max(0, t.opacity - 0.018),
        size: t.size * 0.985
      })));
    }, 30);
    return () => clearInterval(timer);
  }, [trails.length]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchReviews({ page: 1, limit: 3 });
        setLatest(res.data);
      } catch (err) {
        console.error('fetch reviews failed', err);
      }
    };
    load();
  }, []);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const showReviews = params.get('view') === 'reviews';

  // load posts from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('blog_posts');
      if (raw) setPosts(JSON.parse(raw));
    } catch (e) { setPosts([]); }
  }, []);

  const savePosts = (list) => {
    try { localStorage.setItem('blog_posts', JSON.stringify(list)); } catch (e) {}
  };

  // 파일 읽기 함수
  const readFileAsDataURL = (file) => new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });

  // 파일 처리
  const handleFiles = async (fileList) => {
    const arr = Array.from(fileList).slice(0, 8 - files.length); // 최대 8개
    const processed = await Promise.all(arr.map(async (f) => {
      const dataUrl = await readFileAsDataURL(f);
      const type = f.type.startsWith('video') ? 'video' : 'image';
      return { dataUrl, type, name: f.name };
    }));
    setFiles(prev => [...prev, ...processed]);
  };

  // 드래그앤드롭
  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer && e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onFileChange = (e) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 태그 파싱
  const parseTags = (text) => {
    const tags = new Set();
    const regex = /#([a-zA-Z0-9\u3131-\uD79D_-]+)/g;
    let m;
    while ((m = regex.exec(text))) {
      tags.add(m[1].toLowerCase());
    }
    return Array.from(tags);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const authorName = author.trim() || '익명';
    const content = text.trim();
    if (!content) return alert('내용을 입력해주세요');
    
    const tags = parseTags(content);
    const images = files.map(f => f.dataUrl);
    
    if (postType === 'review') {
      // 리뷰 작성
      const newReview = { 
        _id: 'r' + Date.now(), 
        author: { username: authorName }, 
        title: content.split('\n')[0].slice(0, 30),
        text: content, 
        images, 
        createdAt: Date.now(), 
        likes: 0,
        comments: 0,
        tags,
        rating: 0
      };
      setReviews(prev => [newReview, ...prev]);
      setSuccessMessage('리뷰');
    } else {
      // 커뮤니티 글 작성
      const newPost = { 
        _id: 'c' + Date.now(), 
        author: { username: authorName }, 
        title: content.split('\n')[0].slice(0, 50),
        text: content, 
        images, 
        createdAt: Date.now(), 
        likes: 0,
        comments: 0,
        tags,
        category: 'talk'
      };
      setCommunityPosts(prev => [newPost, ...prev]);
      setSuccessMessage('커뮤니티 글');
    }
    
    // 게시완료 알림 표시
    setShowPostSuccess(true);
    setTimeout(() => setShowPostSuccess(false), 3000);
    
    // reset form
    setAuthor('');
    setText('');
    setFiles([]);
  };

  // 커뮤니티 카테고리 필터링
  const filteredCommunityPosts = communityCategory === 'all' 
    ? communityPosts 
    : communityPosts.filter(p => p.category === communityCategory);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #fff 0%, #fff5f7 50%, #faf5ff 100%)' }}>
      {/* 🎉 게시완료 성공 알림 - 더 화려하게 */}
      {showPostSuccess && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(135deg, #ff4d88 0%, #ff6b9d 50%, #a855f7 100%)',
          borderRadius: 28,
          padding: '44px 60px',
          boxShadow: '0 30px 80px rgba(255,77,136,0.5), 0 0 100px rgba(168,85,247,0.3)',
          zIndex: 100000,
          textAlign: 'center',
          animation: 'popIn 0.4s ease-out',
          border: '3px solid rgba(255,255,255,0.3)'
        }}>
          <div style={{ 
            position: 'absolute', 
            top: -20, 
            left: '50%', 
            transform: 'translateX(-50%)',
            fontSize: 50,
            animation: 'bounce 1s ease-in-out infinite'
          }}>🎊</div>
          <div style={{ fontSize: 80, marginBottom: 16, marginTop: 10, animation: 'bounce 0.8s ease-in-out infinite' }}>🎉</div>
          <div style={{ color: '#fff', fontSize: 34, fontWeight: 900, marginBottom: 10, textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>게시완료!</div>
          <div style={{ color: 'rgba(255,255,255,0.95)', fontSize: 22, fontWeight: 700 }}>아이 잘하네~ 💕</div>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, marginTop: 12 }}>{successMessage}이(가) 성공적으로 등록되었어요!</div>
          <div style={{ 
            marginTop: 16, 
            display: 'flex', 
            gap: 8, 
            justifyContent: 'center'
          }}>
            {['✨', '💖', '🌟', '💕', '✨'].map((emoji, i) => (
              <span key={i} style={{ 
                fontSize: 24, 
                animation: `sparkle ${1 + i * 0.2}s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`
              }}>{emoji}</span>
            ))}
          </div>
        </div>
      )}
      {showPostSuccess && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 99999,
          backdropFilter: 'blur(6px)'
        }} />
      )}

      {/* 🎨 마우스 브러쉬 트레일 효과 - 파스텔 노랑 (최상단) */}
      {trails.map((trail) => (
        <div
          key={trail.id}
          style={{
            position: 'fixed',
            left: trail.x,
            top: trail.y,
            width: trail.size,
            height: trail.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${trail.color} 0%, ${trail.color} 50%, ${trail.color}80 70%, transparent 100%)`,
            opacity: trail.opacity,
            pointerEvents: 'none',
            zIndex: 99999,
            filter: 'blur(12px)',
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 20px ${trail.color}60`
          }}
        />
      ))}

      {/* 글로벌 CSS 애니메이션 */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,77,136,0.3), 0 0 40px rgba(168,85,247,0.2); }
          50% { box-shadow: 0 0 30px rgba(255,77,136,0.5), 0 0 60px rgba(168,85,247,0.3); }
        }
      `}</style>

      {/* ✨ 히어로 섹션 - 프리미엄 매거진 스타일 */}
      <section 
        ref={heroRef}
        style={{ 
          position: 'relative',
          padding: '60px 20px 80px',
          overflow: 'hidden',
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,77,136,0.15) 0%, transparent 50%),
                       radial-gradient(circle at ${100 - mousePos.x}% ${100 - mousePos.y}%, rgba(168,85,247,0.1) 0%, transparent 50%),
                       linear-gradient(135deg, #fff 0%, #fff5f7 50%, #faf5ff 100%)`
        }}
      >
        {/* 플로팅 장식 요소들 */}
        <div style={{ position: 'absolute', top: '10%', left: '5%', fontSize: 40, animation: 'float 6s ease-in-out infinite', opacity: 0.6 }}>💄</div>
        <div style={{ position: 'absolute', top: '20%', right: '8%', fontSize: 35, animation: 'floatReverse 7s ease-in-out infinite', opacity: 0.5 }}>✨</div>
        <div style={{ position: 'absolute', bottom: '25%', left: '10%', fontSize: 30, animation: 'float 8s ease-in-out infinite 1s', opacity: 0.4 }}>💖</div>
        <div style={{ position: 'absolute', bottom: '15%', right: '12%', fontSize: 45, animation: 'floatReverse 5s ease-in-out infinite 0.5s', opacity: 0.5 }}>🌸</div>
        <div style={{ position: 'absolute', top: '40%', left: '2%', fontSize: 25, animation: 'float 9s ease-in-out infinite 2s', opacity: 0.3 }}>⭐</div>
        <div style={{ position: 'absolute', top: '60%', right: '3%', fontSize: 28, animation: 'floatReverse 6s ease-in-out infinite 1.5s', opacity: 0.4 }}>💕</div>
        
        {/* 글래스모피즘 장식 원들 */}
        <div style={{ 
          position: 'absolute', 
          top: -100, 
          right: -100, 
          width: 400, 
          height: 400, 
          borderRadius: '50%', 
          background: 'radial-gradient(circle, rgba(255,77,136,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'pulse 8s ease-in-out infinite'
        }} />
        <div style={{ 
          position: 'absolute', 
          bottom: -150, 
          left: -150, 
          width: 500, 
          height: 500, 
          borderRadius: '50%', 
          background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'pulse 10s ease-in-out infinite 2s'
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* 메인 히어로 콘텐츠 */}
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <div style={{ 
              display: 'inline-block',
              background: 'linear-gradient(135deg, rgba(255,77,136,0.1), rgba(168,85,247,0.1))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,77,136,0.2)',
              padding: '8px 20px',
              borderRadius: 30,
              marginBottom: 20,
              animation: 'slideIn 0.6s ease-out'
            }}>
              <span style={{ 
                background: 'linear-gradient(135deg, #ff4d88, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
                fontSize: 13
              }}>✨ KOREA'S NO.1 BEAUTY COMMUNITY</span>
            </div>
            
            <h1 style={{ 
              fontSize: 56, 
              fontWeight: 900, 
              margin: '0 0 16px',
              lineHeight: 1.2,
              animation: 'slideIn 0.8s ease-out'
            }}>
              <span style={{ 
                background: 'linear-gradient(135deg, #ff4d88 0%, #ff6b9d 25%, #a855f7 50%, #8b5cf6 75%, #ff4d88 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradient 4s linear infinite'
              }}>Review Community</span>
            </h1>
            
            <p style={{ 
              fontSize: 20, 
              color: '#666', 
              maxWidth: 600, 
              margin: '0 auto 30px',
              lineHeight: 1.6,
              animation: 'slideIn 1s ease-out'
            }}>
              진짜 써본 사람들의 솔직한 리뷰 ✨<br/>
              <span style={{ color: '#ff4d88', fontWeight: 600 }}>뷰티 트렌드</span>와 <span style={{ color: '#a855f7', fontWeight: 600 }}>꿀팁</span>을 공유하는 커뮤니티
            </p>

            {/* CTA 버튼들 */}
            <div style={{ 
              display: 'flex', 
              gap: 16, 
              justifyContent: 'center',
              animation: 'slideIn 1.2s ease-out'
            }}>
              <Link to="/feed" style={{ textDecoration: 'none' }}>
                <button style={{ 
                  padding: '16px 36px',
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #ff4d88 0%, #ff6b9d 50%, #a855f7 100%)',
                  backgroundSize: '200% auto',
                  color: '#fff',
                  border: 'none',
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 8px 30px rgba(255,77,136,0.4)',
                  transition: 'all 0.3s ease',
                  animation: 'glow 3s ease-in-out infinite'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                  e.currentTarget.style.backgroundPosition = 'right center';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.backgroundPosition = 'left center';
                }}
                >
                  💄 리뷰 보러가기
                </button>
              </Link>
              <Link to="/coupons" style={{ textDecoration: 'none' }}>
                <button style={{ 
                  padding: '16px 36px',
                  borderRadius: 16,
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(10px)',
                  color: '#ff4d88',
                  border: '2px solid rgba(255,77,136,0.3)',
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = '#ff4d88';
                  e.currentTarget.style.background = '#fff';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255,77,136,0.3)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                }}
                >
                  🎡 룰렛 & 쿠폰
                </button>
              </Link>
            </div>
          </div>

          {/* 통계 카드들 */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: 20,
            animation: 'slideIn 1.4s ease-out'
          }}>
            {[
              { icon: '📝', number: '12,847', label: '리뷰', color: '#ff4d88' },
              { icon: '👥', number: '8,532', label: '회원', color: '#a855f7' },
              { icon: '💬', number: '45,219', label: '댓글', color: '#3b82f6' },
              { icon: '🎁', number: '2,156', label: '쿠폰 발급', color: '#10b981' }
            ].map((stat, idx) => (
              <div 
                key={stat.label}
                style={{
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 20,
                  padding: '24px 20px',
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.5)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                  transition: 'all 0.3s ease',
                  cursor: 'default'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = `0 20px 40px ${stat.color}20`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.06)';
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>{stat.icon}</div>
                <div style={{ 
                  fontSize: 28, 
                  fontWeight: 800, 
                  background: `linear-gradient(135deg, ${stat.color}, ${stat.color}99)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: 4
                }}>{stat.number}</div>
                <div style={{ color: '#888', fontSize: 13, fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ padding: '0 20px 40px', maxWidth: 1200, margin: '0 auto' }}>

      {/* 글쓰기 타입 선택 탭 */}
      <section style={{ marginBottom: 32 }}>
        {/* 프리미엄 글쓰기 카드 */}
        <div style={{ 
          background: 'rgba(255,255,255,0.9)', 
          backdropFilter: 'blur(20px)',
          borderRadius: 24, 
          padding: '12px',
          marginBottom: 20,
          border: '1px solid rgba(255,255,255,0.5)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
          display: 'flex',
          gap: 12
        }}>
          <button
            onClick={() => setPostType('review')}
            style={{
              flex: 1,
              padding: '20px 24px',
              borderRadius: 16,
              border: 'none',
              background: postType === 'review' 
                ? 'linear-gradient(135deg, #ff4d88 0%, #ff6b9d 50%, #ff8a5c 100%)' 
                : 'transparent',
              color: postType === 'review' ? '#fff' : '#666',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              boxShadow: postType === 'review' ? '0 8px 24px rgba(255,77,136,0.3)' : 'none'
            }}
          >
            <span style={{ fontSize: 24 }}>💄</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>리뷰 작성</div>
              <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.9 }}>제품 사용 후기</div>
            </div>
          </button>
          <button
            onClick={() => setPostType('community')}
            style={{
              flex: 1,
              padding: '20px 24px',
              borderRadius: 16,
              border: 'none',
              background: postType === 'community' 
                ? 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%)' 
                : 'transparent',
              color: postType === 'community' ? '#fff' : '#666',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              boxShadow: postType === 'community' ? '0 8px 24px rgba(139,92,246,0.3)' : 'none'
            }}
          >
            <span style={{ fontSize: 24 }}>💬</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>커뮤니티 글</div>
              <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.9 }}>화장법, 정보, 잡담</div>
            </div>
          </button>
        </div>

        {/* 글쓰기 가이드 - 글래스모피즘 */}
        <div style={{ 
          background: postType === 'review' 
            ? 'linear-gradient(135deg, rgba(255,240,245,0.9) 0%, rgba(255,255,255,0.9) 100%)' 
            : 'linear-gradient(135deg, rgba(245,243,255,0.9) 0%, rgba(255,255,255,0.9) 100%)', 
          backdropFilter: 'blur(20px)',
          borderRadius: 20, 
          padding: '20px 24px',
          marginBottom: 20,
          border: postType === 'review' 
            ? '1px solid rgba(255,77,136,0.2)'
            : '1px solid rgba(139,92,246,0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
          display: 'flex',
          alignItems: 'center',
          gap: 20
        }}>
          <div style={{ 
            width: 56, height: 56, 
            background: postType === 'review'
              ? 'linear-gradient(135deg, #ff4d88, #ff8a5c)'
              : 'linear-gradient(135deg, #8b5cf6, #a78bfa)', 
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            boxShadow: postType === 'review' 
              ? '0 8px 20px rgba(255,77,136,0.3)'
              : '0 8px 20px rgba(139,92,246,0.3)'
          }}>{postType === 'review' ? '📷' : '✨'}</div>
          <div style={{ flex: 1 }}>
            {postType === 'review' ? (
              <>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>제품 리뷰를 작성해보세요!</div>
                <div style={{ color: '#666', fontSize: 14 }}>제품 사진, 발색샷, 비포/애프터 등을 함께 올려주세요 💄</div>
              </>
            ) : (
              <>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>뷰티 정보를 공유해보세요!</div>
                <div style={{ color: '#666', fontSize: 14 }}>화장법, 꿀팁, 질문, 수다 뭐든 OK! 자유롭게 떠들어요 💬</div>
              </>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {postType === 'review' ? (
              <>
                <span style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,77,136,0.15)', padding: '8px 14px', borderRadius: 12, fontSize: 12, color: '#ff4d88', fontWeight: 500 }}>📸 제품샷</span>
                <span style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,77,136,0.15)', padding: '8px 14px', borderRadius: 12, fontSize: 12, color: '#ff4d88', fontWeight: 500 }}>💄 발색</span>
              </>
            ) : (
              <>
                <span style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(139,92,246,0.15)', padding: '8px 14px', borderRadius: 12, fontSize: 12, color: '#8b5cf6', fontWeight: 500 }}>💡 꿀팁</span>
                <span style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(139,92,246,0.15)', padding: '8px 14px', borderRadius: 12, fontSize: 12, color: '#8b5cf6', fontWeight: 500 }}>❓ 질문</span>
                <span style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(139,92,246,0.15)', padding: '8px 14px', borderRadius: 12, fontSize: 12, color: '#8b5cf6', fontWeight: 500 }}>💬 수다</span>
              </>
            )}
          </div>
        </div>

        {/* 글쓰기 폼 - 프리미엄 스타일 */}
        <div style={{ 
          background: 'rgba(255,255,255,0.95)', 
          backdropFilter: 'blur(20px)',
          borderRadius: 24, 
          padding: 24,
          border: '1px solid rgba(255,255,255,0.5)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
        }}>
          <form onSubmit={handleCreatePost}>
            {/* 작성자 + 텍스트 영역 (나란히) */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div style={{ 
                flex: '0 0 160px',
                padding: '14px 18px',
                borderRadius: 16,
                border: '2px solid transparent',
                background: 'linear-gradient(#fff, #fff) padding-box, linear-gradient(135deg, rgba(255,77,136,0.2), rgba(168,85,247,0.2)) border-box',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                transition: 'all 0.3s ease'
              }}>
                <span style={{ fontSize: 20 }}>👤</span>
                <input 
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="닉네임" 
                  style={{ 
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    fontSize: 15,
                    outline: 'none',
                    color: '#333',
                    fontWeight: 500
                  }} 
                />
              </div>
              <div style={{
                flex: 1,
                borderRadius: 16,
                border: '2px solid transparent',
                background: 'linear-gradient(#fff, #fff) padding-box, linear-gradient(135deg, rgba(255,77,136,0.15), rgba(168,85,247,0.15)) border-box',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}>
                <textarea 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="✨ 무슨 생각을 하고 계신가요? #태그를 사용해보세요" 
                  style={{ 
                    width: '100%',
                    minHeight: 120, 
                    padding: '16px 20px', 
                    border: 'none',
                    fontSize: 15,
                    lineHeight: 1.7,
                    resize: 'vertical',
                    outline: 'none',
                    background: 'transparent'
                  }} 
                />
              </div>
            </div>

            {/* 드래그앤드롭 업로드 영역 - 프리미엄 */}
            <div 
              onDrop={onDrop} 
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} 
              onDragLeave={() => setDragOver(false)} 
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              style={{ 
                border: `2px dashed ${dragOver ? '#ff4d88' : 'rgba(139,92,246,0.3)'}`, 
                padding: 28, 
                borderRadius: 20, 
                marginBottom: 16, 
                textAlign: 'center', 
                background: dragOver 
                  ? 'linear-gradient(135deg, rgba(255,77,136,0.08), rgba(168,85,247,0.08))' 
                  : 'linear-gradient(135deg, rgba(139,92,246,0.02), rgba(255,77,136,0.02))', 
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.8 }}>📸</div>
              <div style={{ color: '#666', fontSize: 15, fontWeight: 500 }}>
                이미지/동영상을 드래그하거나 클릭하여 업로드
              </div>
              <div style={{ color: '#999', fontSize: 13, marginTop: 6 }}>최대 8개까지 업로드 가능</div>
              <input 
                ref={fileInputRef} 
                type="file" 
                multiple 
                accept="image/*,video/*" 
                onChange={onFileChange} 
                style={{ display: 'none' }} 
              />
            </div>

            {/* 파일 미리보기 - 프리미엄 */}
            {files.length > 0 && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
                gap: 12, 
                marginBottom: 16 
              }}>
                {files.map((f, i) => (
                  <div key={i} style={{ 
                    position: 'relative',
                    borderRadius: 16,
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}>
                    {f.type === 'video' ? (
                      <video src={f.dataUrl} style={{ width: '100%', height: 100, objectFit: 'cover' }} />
                    ) : (
                      <img src={f.dataUrl} alt="" style={{ width: '100%', height: 100, objectFit: 'cover' }} />
                    )}
                    <button 
                      type="button"
                      onClick={() => removeFile(i)}
                      style={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8, 
                        width: 26, 
                        height: 26, 
                        borderRadius: '50%', 
                        border: 'none', 
                        background: 'linear-gradient(135deg, #ff4d88, #ff6b9d)', 
                        color: '#fff', 
                        fontSize: 14, 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(255,77,136,0.4)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >×</button>
                  </div>
                ))}
              </div>
            )}

            {/* 하단 버튼 영역 - 프리미엄 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
              <div style={{ 
                color: '#888', 
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(139,92,246,0.06)',
                padding: '8px 14px',
                borderRadius: 20
              }}>
                <span>📎</span> {files.length}개 파일
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button 
                  type="button" 
                  onClick={() => { setText(''); setFiles([]); setAuthor(''); }}
                  style={{ 
                    padding: '12px 24px', 
                    borderRadius: 14, 
                    border: '2px solid rgba(0,0,0,0.08)', 
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#ff4d88';
                    e.currentTarget.style.color = '#ff4d88';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)';
                    e.currentTarget.style.color = '#333';
                  }}
                >
                  🔄 초기화
                </button>
                <button 
                  type="submit" 
                  style={{ 
                    padding: '12px 32px', 
                    borderRadius: 14, 
                    background: postType === 'review' 
                      ? 'linear-gradient(135deg, #ff4d88 0%, #ff6b9d 50%, #ff8a5c 100%)' 
                      : 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%)', 
                    backgroundSize: '200% auto',
                    color: '#fff', 
                    border: 'none', 
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: 15,
                    boxShadow: postType === 'review' 
                      ? '0 8px 24px rgba(255,77,136,0.4)' 
                      : '0 8px 24px rgba(139,92,246,0.4)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                    e.currentTarget.style.backgroundPosition = 'right center';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.backgroundPosition = 'left center';
                  }}
                >
                  ✨ 게시하기
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* 🔥 인기 태그 섹션 - 프리미엄 */}
      <div style={{ 
        background: 'rgba(255,255,255,0.9)', 
        backdropFilter: 'blur(20px)',
        borderRadius: 24, 
        padding: 28, 
        marginBottom: 32,
        border: '1px solid rgba(255,255,255,0.5)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 배경 장식 */}
        <div style={{ 
          position: 'absolute', 
          top: -30, 
          right: -30, 
          width: 120, 
          height: 120, 
          background: 'radial-gradient(circle, rgba(255,77,136,0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, position: 'relative', zIndex: 1 }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ 
              background: 'linear-gradient(135deg, #ff4d88, #ff6b9d)',
              width: 36,
              height: 36,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18
            }}>🔥</span>
            지금 핫한 태그
          </h3>
          <span style={{ 
            background: 'linear-gradient(135deg, rgba(255,77,136,0.1), rgba(168,85,247,0.1))',
            padding: '6px 14px',
            borderRadius: 20,
            color: '#ff4d88', 
            fontSize: 12,
            fontWeight: 600
          }}>✨ 실시간 인기</span>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          {['겨울스킨케어', '퍼스널컬러', '쉐이딩', '올영세일', '데일리메이크업', '수분크림', '시카크림', '립조합'].map((tag, idx) => (
            <span 
              key={tag} 
              style={{ 
                background: idx < 3 
                  ? 'linear-gradient(135deg, #ff4d88, #ff6b9d, #a855f7)' 
                  : 'rgba(255,255,255,0.9)',
                backgroundSize: '200% auto',
                color: idx < 3 ? '#fff' : '#666',
                padding: '10px 20px', 
                borderRadius: 25, 
                fontSize: 14,
                fontWeight: idx < 3 ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: idx < 3 ? 'none' : '1px solid rgba(0,0,0,0.08)',
                boxShadow: idx < 3 ? '0 4px 15px rgba(255,77,136,0.3)' : '0 2px 8px rgba(0,0,0,0.04)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                if (idx >= 3) {
                  e.currentTarget.style.borderColor = '#ff4d88';
                  e.currentTarget.style.color = '#ff4d88';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                if (idx >= 3) {
                  e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)';
                  e.currentTarget.style.color = '#666';
                }
              }}
            >
              {idx < 3 && <span style={{ marginRight: 6 }}>🔥</span>}#{tag}
            </span>
          ))}
        </div>
      </div>

      {/* 💬 커뮤니티 섹션 - 프리미엄 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ 
              background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
              width: 40,
              height: 40,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              boxShadow: '0 4px 15px rgba(139,92,246,0.3)'
            }}>💬</span>
            커뮤니티
          </h3>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { id: 'all', name: '전체', color: '#8b5cf6' },
              { id: 'tip', name: '💡 꿀팁', color: '#16a34a' },
              { id: 'question', name: '❓ 질문', color: '#d97706' },
              { id: 'talk', name: '💬 수다', color: '#8b5cf6' }
            ].map(cat => (
              <button 
                key={cat.id}
                onClick={() => setCommunityCategory(cat.id)}
                style={{ 
                  padding: '10px 20px', 
                  borderRadius: 25, 
                  border: 'none',
                  background: communityCategory === cat.id 
                    ? `linear-gradient(135deg, ${cat.color}, ${cat.color}99)` 
                    : 'rgba(255,255,255,0.9)',
                  color: communityCategory === cat.id ? '#fff' : '#666',
                  fontSize: 13,
                  cursor: 'pointer',
                  fontWeight: communityCategory === cat.id ? 700 : 500,
                  boxShadow: communityCategory === cat.id 
                    ? `0 4px 15px ${cat.color}40` 
                    : '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseOver={(e) => {
                  if (communityCategory !== cat.id) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >{cat.name}</button>
            ))}
          </div>
        </div>
      </div>

      {/* 커뮤니티 글 목록 - 프리미엄 카드 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filteredCommunityPosts.map((post, idx) => (
          <div 
            key={post._id}
            style={{
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: 24,
              padding: '24px 28px',
              border: '1px solid rgba(255,255,255,0.5)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              animation: `slideIn 0.5s ease-out ${idx * 0.1}s both`
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px) scale(1.01)';
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(139,92,246,0.15)';
              e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.04)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
            }}
          >
            {/* 호버 시 보이는 그라데이션 배경 */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(139,92,246,0.02) 0%, rgba(255,77,136,0.02) 100%)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none'
            }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, position: 'relative', zIndex: 1 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ 
                    padding: '6px 14px', 
                    borderRadius: 20, 
                    background: post.category === 'tip' 
                      ? 'linear-gradient(135deg, #dcfce7, #bbf7d0)' 
                      : post.category === 'question' 
                        ? 'linear-gradient(135deg, #fef3c7, #fde68a)' 
                        : 'linear-gradient(135deg, #f3e8ff, #e9d5ff)',
                    color: post.category === 'tip' ? '#16a34a' : post.category === 'question' ? '#d97706' : '#8b5cf6',
                    fontSize: 12,
                    fontWeight: 700,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }}>
                    {post.category === 'tip' ? '💡 꿀팁' : post.category === 'question' ? '❓ 질문' : '💬 수다'}
                  </span>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 8,
                    background: 'rgba(0,0,0,0.02)',
                    padding: '4px 12px',
                    borderRadius: 20
                  }}>
                    <span style={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, #ff4d88, #a855f7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      color: '#fff',
                      fontWeight: 700
                    }}>{post.author?.username?.charAt(0) || '?'}</span>
                    <span style={{ color: '#666', fontSize: 13, fontWeight: 500 }}>@{post.author?.username}</span>
                  </div>
                  <span style={{ color: '#bbb', fontSize: 12 }}>•</span>
                  <span style={{ color: '#999', fontSize: 12 }}>{Math.floor((Date.now() - post.createdAt) / (1000 * 60 * 60))}시간 전</span>
                </div>
                <h4 style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 800, color: '#1a1a1a' }}>{post.title}</h4>
                <p style={{ margin: 0, color: '#555', fontSize: 15, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {post.text.length > 150 ? post.text.slice(0, 150) + '...' : post.text}
                </p>
              </div>
              {/* 커뮤니티 글 이미지 - 프리미엄 */}
              {post.images && post.images.length > 0 && (
                <div style={{ 
                  width: 120, 
                  height: 120, 
                  borderRadius: 20, 
                  overflow: 'hidden', 
                  flexShrink: 0, 
                  marginLeft: 20,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  border: '3px solid #fff'
                }}>
                  <img 
                    src={post.images[0]} 
                    alt="post" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                {post.tags?.slice(0, 3).map(tag => (
                  <span 
                    key={tag} 
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(255,77,136,0.08))', 
                      color: '#8b5cf6', 
                      padding: '6px 14px', 
                      borderRadius: 16, 
                      fontSize: 12,
                      fontWeight: 500,
                      transition: 'all 0.2s ease'
                    }}
                  >#{tag}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 20, color: '#888', fontSize: 14 }}>
                <span style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 20,
                  background: 'rgba(255,77,136,0.06)',
                  color: '#ff4d88',
                  fontWeight: 600
                }}>❤️ {post.likes}</span>
                <span style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 20,
                  background: 'rgba(139,92,246,0.06)',
                  color: '#8b5cf6',
                  fontWeight: 600
                }}>💬 {post.comments}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>

      {/* 기존 최신 리뷰 섹션 (하단으로 이동) - 기본적으로는 숨김, 쿼리 ?view=reviews 로 표시 */}
      {showReviews && (
        <section style={{ marginTop: 28 }}>
          <h2>최신 리뷰</h2>
          {latest.length === 0 ? (
            <p style={{ color: '#999' }}>최신 리뷰가 없습니다.</p>
          ) : (
            latest.map(r => <ReviewCard key={r._id} id={r._id} username={r.author?.username || '익명'} title={r.title} text={r.text} images={r.images} createdAt={r.createdAt} likes={r.likes} />)
          )}
        </section>
      )}

      {/* 룰렛: 전용 페이지에서만 표시됩니다 (Navbar -> 룰렛) */}
    </div>
  );
}

export default Home;
