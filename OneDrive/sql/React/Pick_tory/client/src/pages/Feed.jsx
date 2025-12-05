// pages/Feed.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReviewCard from '../components/ReviewCard';
import { fetchReviews } from '../api/reviewApi';

// Feed: updated UI — hero banner, prominent roulette CTA, composer and 3-column grid

  const sampleReviews = [
  // Hero 배너 주목 리뷰 3개
  { _id: 'hero001', author: { username: '채희' }, brand: '롬앤', product: '주시 래스팅 틴트', title: '인기 립 리뷰 - 롬앤 틴트 발색 대박', text: '립덕후들 이거 보세요!!! 롬앤 주시래스팅 틴트 진짜 발색 미쳤어요ㅡㅡ 상큼해보이는 컬러라 데일리로 딱이고 지속력도 개좋아요!! 입술에 착 감기는 부드러운 텍스쳐가 진짜 충격적으로 좋아요 💋 안사면 손해임 꼭 사세요!!', images: ['/images/립리뷰.jpg'], createdAt: Date.now() - 1000 * 60 * 60 * 12, likes: 723, comments: 58, tags: ['립틴트', '롬앤', '인기립'], category: 'makeup', rating: 4.9 },
  { _id: 'hero002', author: { username: '정은' }, brand: '아르마니', product: '마이 웨이 스킨업 에센스', title: '피부 광채 - 아르마니 에센스 사용 후기', text: '아르마니 마이웨이 에센스 진짜 대박입니다!!! 피부가 마치 광채가 나는 것 같은 효과가 있어요✨ 세안 후에 먼저 바르면 피부결이 정돈되면서 아침에 기분좋은 광채피부 완성돼요!! 건성피부분들 필수템이에요 💖', images: ['/images/피부광채.jpg'], createdAt: Date.now() - 1000 * 60 * 60 * 18, likes: 567, comments: 43, tags: ['에센스', '광채피부', '아르마니'], category: 'skincare', rating: 4.8 },
  { _id: 'hero003', author: { username: '수정' }, brand: '아누아', product: '어성초 진정 토너', title: '진정 케어 - 아누아 어성초 토너 추천', text: '민감피부인 제가 진짜 강추하는 토너!! 아누아 어성초 토너 쓰고 피부 트러블이 진짜 줄었어요🌿 진정효과 오지고 발갸때도 피부가 편해지는 느낌!! 매운 정구리라서 부담없이 쓸 수 있고 피부가 예민할때 사용하면 찍이에요 💚', images: ['/images/진정케어.jpg'], createdAt: Date.now() - 1000 * 60 * 60 * 24, likes: 489, comments: 37, tags: ['진정토너', '어성초', '민감피부'], category: 'skincare', rating: 4.7 },

  // 스킨케어
  {
    _id: 'r001', author: { username: '수아' }, brand: '클리오', product: '구달 청귤 비타C 세럼', title: '구달 청귤 비타C 세럼 2주 사용 후기', text: '싸걀!!!! 2주 썼는데 피부톤 ㅈㄴㅈㄴ 밝아졌어ㅜㅜ 흡수력 미쳤고 끈적임 1도 없음 ㄹㅇ 촉촉해서 아침에 바르면 화장이 겁나 잘먹어요ㅜ 완전 인생세럼 등극이야 여러분들도 꼭 사서 써보셈!! 알러빗ㅜㅜ', images: ['/images/비타민세럼리뷰.jpg'], createdAt: Date.now() - 1000 * 60 * 60 * 24, likes: 456, comments: 38, tags: ['세럼', '미백', '비타민C'], category: 'skincare', rating: 4.8
  },
  { _id: 'r002', author: { username: '민지' }, brand: '이니스프리', product: '그린티 씨드 히알루론산 크림', title: '이니스프리 그린티 씨드 크림 건성 추천', text: '건성인 나한테 인생템 찾음 아침까지 촉촉해서 감동받앗어 ㄹㅇㅜ향도 은은하고 가성비까지 개개개객미쳣🤑😍👍 용량 넉넉해서 맘껏 덕지덕지 발라도 되고 진짜 이뻐용가리ㅜ 건성분들 이거 무조건 사세용!!', images: ['/images/cream.png'], createdAt: Date.now() - 1000 * 60 * 60 * 48, likes: 289, comments: 22, tags: ['수분크림', '보습', '건성피부'], category: 'skincare', rating: 4.5 },
  { _id: 'r004', author: { username: '지우' }, brand: '코스알엑스', product: '로우 pH 굿모닝 젤 클렌저', title: '코스알엑스 클렌저 블랙헤드 정리 후기', text: '매일 쓰니까 모공이 점점 깨끗해지는게 느껴져 거품도 뽀송뽀송하고 세안 후에도 안땅겨서 너무 조아용ㅜ✌️😊😋 모공고민 잇으면 이거 무조건 사야해!! 진짜 갓템이야 알러빗ㅜㅜ', images: ['/images/클렌징폼리뷰.jpg'], createdAt: Date.now() - 1000 * 60 * 60 * 5, likes: 367, comments: 29, tags: ['클렌징', '모공케어', '블랙헤드'], category: 'skincare', rating: 4.6 },
  { _id: 'r006', author: { username: '서연' }, brand: '메디힐', product: '티트리 케어 솔루션 마스크', title: '메디힐 티트리 마스크팩 진정효과 후기', text: '피부 예민할때 이거 붙이면 바로 차분해져 진정효과 실화냐구 매일 써도 가격 부담없어서 개좋음 민감피부분들 이거 강추드림!! 여러분들도 꼭 사서 쓰면 좋겟슨! 알러빗이야ㅜㅜ', images: ['/images/마스크팩리뷰.jpg'], createdAt: Date.now() - 1000 * 60 * 60 * 200, likes: 198, comments: 16, tags: ['마스크팩', '진정', '민감피부'], category: 'skincare', rating: 4.4 },
  { _id: 'r007', author: { username: '예린' }, brand: '이니스프리', product: '레티놀 시카 리페어 세럼', title: '이니스프리 레티놀 시카 세럼 입문 후기', text: '레티놀 처음 쓰는데 자극 하나도 없고 피부결이 진짜 달라짐ㅜㅜ 모공도 줄어드는 느낌이고 아침에 세안하면 꿀피부됨 ㄹㅇ 초보자분들 이거로 입문하세요!! 순해서 매일 써도 됨👍', images: [], createdAt: Date.now() - 1000 * 60 * 60 * 30, likes: 342, comments: 28, tags: ['레티놀', '안티에이징', '피부결'], category: 'skincare', rating: 4.7 },
  { _id: 'r008', author: { username: '소민' }, brand: '아비브', product: '어성초 스팟 패드 카밍 터치', title: '아비브 어성초 토너패드 간편 케어 후기', text: '아침에 이거로 닦아내면 피부 정리 끝!! 각질도 정리되고 보습도 되고 일석이조야ㅋㅋ 귀찮을때 세안대신 이거로 대체해도 됨 여행갈때도 필수템이야 강추강추!!🥰', images: [], createdAt: Date.now() - 1000 * 60 * 60 * 55, likes: 278, comments: 19, tags: ['토너패드', '각질케어', '간편케어'], category: 'skincare', rating: 4.5 },
  
  // 메이크업
  { _id: 'r003', author: { username: '윤서' }, brand: '에스쁘아', product: '비 글로우 쿠션 NEW 클래스', title: '에스쁘아 비글로우 쿠션 커버력 후기', text: '얇게 발리는데 커버력 실화냐고 (⸝⸝ʚ̴̶̷̆ ̯ʚ̴̶̷̆⸝⸝) 무너짐도 없고❌🙅‍♀️❌ 자연광 아래서 ㅈㄴ 예뻐요 광채 미침ㅋㅋㅋ 여름에도 버틸듯!! 데일리 쿠션 찾는분들 이거 강추드려용 진짜 이거 없으면 어캄ㅜ', images: ['/images/파운데이션리뷰.jpg'], createdAt: Date.now() - 1000 * 60 * 60 * 72, likes: 523, comments: 45, tags: ['쿠션', '베이스', '커버력'], category: 'makeup', rating: 4.7 },
  { _id: 'r005', author: { username: '하은' }, brand: '롬앤', product: '쥬시 래스팅 틴트 #13 이츠애플', title: '롬앤 쥬시래스팅틴트 이츠애플 발색 후기', text: '헐 색상 너무 이뻐서 뒤집어짐 발색도 미치고 지속력도 미침 ㄹㅇ❤️🚨  입술 안건조해서 데일리로 딱이야(۶•̀ᴗ•́)۶ !! 립덕후들 이거 찐이야 제발 사세요ㅜ 안사면 손해임 ㅈㄴ 이뻐용가리!!', images: ['/images/립스틱리뷰.jpg'], createdAt: Date.now() - 1000 * 60 * 60 * 120, likes: 612, comments: 51, tags: ['립스틱', '틴트', '립메이크업'], category: 'makeup', rating: 4.9 },
  { _id: 'r009', author: { username: '유나' }, brand: '클리오', product: '프로 아이 팔레트 #13 피크닉 바이 더 선셋', title: '클리오 프로아이팔레트 피크닉 발색 후기', text: '색조합 미쳤고 발색 찢었어ㅜㅜ 가루날림 없고 블렌딩도 너무 잘돼!! 이거 하나면 데일리부터 파티룩까지 다 가능함 진짜 갓팔레트야💖 색 다 예뻐서 뭐 바를지 고민됨ㅋㅋ', images: [], createdAt: Date.now() - 1000 * 60 * 60 * 80, likes: 445, comments: 37, tags: ['아이섀도우', '팔레트', '아이메이크업'], category: 'makeup', rating: 4.8 },
  { _id: 'r010', author: { username: '채원' }, brand: '키스미', product: '히로인메이크 롱앤컬 마스카라', title: '키스미 히로인메이크 마스카라 안번짐 후기', text: '속눈썹 올리고 이거 바르면 하루종일 컬 유지됨!! 판다눈 절대 안되고 클렌징도 잘돼 ㅠㅠ 진짜 찾았다 인생마스카라ㅜ 롱래쉬 효과도 있어서 속눈썹 짧은 분들 강추!!👀✨', images: [], createdAt: Date.now() - 1000 * 60 * 60 * 95, likes: 389, comments: 31, tags: ['마스카라', '아이메이크업', '컬지속'], category: 'makeup', rating: 4.6 },
  { _id: 'r011', author: { username: '다현' }, brand: '에뛰드', product: '러블리 쿠키 블러셔 #PK004', title: '에뛰드 쿠키블러셔 복숭아빛 후기', text: '자연스럽게 홍조 올라온거같은 색감이야ㅜㅜ 브러시로 살살 올리면 복숭아처럼 예쁨!! 과하지않고 은은해서 데일리로 딱이야 색 다 모으고싶음ㅋㅋㅋ 존예💕', images: [], createdAt: Date.now() - 1000 * 60 * 60 * 110, likes: 312, comments: 24, tags: ['블러셔', '치크', '메이크업'], category: 'makeup', rating: 4.7 },

  // 바디케어
  { _id: 'r012', author: { username: '지민' }, brand: '일리윤', product: '세라마이드 아토 로션', title: '일리윤 세라마이드 바디로션 향기 후기', text: '바르고 나면 은은하게 향 남아있어서 향수 필요없음ㅜㅜ 보습력도 좋고 끈적임 없이 흡수 빨라!! 샤워 후에 바르면 촉촉함이 아침까지 유지됨 향덕후들 이거 사세요!!🌸', images: [], createdAt: Date.now() - 1000 * 60 * 60 * 40, likes: 267, comments: 21, tags: ['바디로션', '보습', '향기'], category: 'bodycare', rating: 4.5 },
  { _id: 'r013', author: { username: '은지' }, brand: '스크럽랩', product: '슈가 바디 스크럽', title: '스크럽랩 슈가스크럽 각질제거 후기', text: '일주일에 2번 쓰는데 피부가 진짜 매끈해짐!! 팔꿈치 무릎 각질 싹 정리되고 바디로션 흡수도 더 잘돼 ㅎㅎ 바디관리 시작하는분들 이거부터 사세요 필수템임✨', images: [], createdAt: Date.now() - 1000 * 60 * 60 * 65, likes: 198, comments: 15, tags: ['스크럽', '각질케어', '바디케어'], category: 'bodycare', rating: 4.4 },
  { _id: 'r014', author: { username: '나연' }, brand: '록시땅', product: '시어버터 핸드크림', title: '록시땅 시어버터 핸드크림 보습력 후기', text: '손 건조할때 바르면 바로 촉촉해짐!! 향도 은은하고 끈적임 없어서 바로 일해도 됨ㅋㅋ 미니사이즈라 파우치에 쏙 들어가서 휴대하기도 좋아 손 자주 씻는분들 필수!!🙌', images: [], createdAt: Date.now() - 1000 * 60 * 60 * 150, likes: 234, comments: 18, tags: ['핸드크림', '보습', '휴대용'], category: 'bodycare', rating: 4.6 },
  { _id: 'r015', author: { username: '수빈' }, brand: '조말론', product: '잉글리쉬 페어 앤 프리지아 바디미스트', title: '조말론 페어프리지아 바디미스트 향 후기', text: '뿌리면 기분 좋아지는 향이야ㅜㅜ 무겁지않고 가벼워서 데일리로 뿌리기 좋음!! 향 지속력도 괜찮고 여러겹 뿌려도 안부담스러워 향수 대신 이거 쓰는중💜', images: [], createdAt: Date.now() - 1000 * 60 * 60 * 180, likes: 289, comments: 22, tags: ['바디미스트', '향기', '데일리'], category: 'bodycare', rating: 4.5 },

  // 패션
  { _id: 'r016', author: { username: '현아' }, brand: '유니클로', product: '프리미엄 램울 크루넥 스웨터', title: '유니클로 램울 니트 가을겨울 후기', text: '촉감 부드럽고 따뜻해ㅜㅜ 색상도 예쁘고 핏도 너무 좋아!! 이너로 입어도 되고 단독으로 입어도 예쁨 가성비 미쳤고 컬러별로 다 사고싶음ㅋㅋㅋ 완전 강추야💕', images: [], createdAt: Date.now() - 1000 * 60 * 60 * 35, likes: 356, comments: 29, tags: ['니트', '가을패션', 'OOTD'], category: 'fashion', rating: 4.7 },
  { _id: 'r017', author: { username: '혜진' }, brand: '리바이스', product: '501 오리지널 크롭 진', title: '리바이스 501 크롭진 핏 후기', text: '다리 길어보이고 엉덩이 예쁘게 잡아줘ㅜㅜ 신축성도 있어서 편하고 세탁해도 안늘어남!! 데일리로 매일 입을듯 ㅋㅋ 청바지 찾는분들 이거 사세요 핏 보장함👖✨', images: [], createdAt: Date.now() - 1000 * 60 * 60 * 90, likes: 423, comments: 35, tags: ['청바지', '데님', '데일리룩'], category: 'fashion', rating: 4.8 },
  { _id: 'r018', author: { username: '지효' }, brand: '마르지엘라', product: '5AC 미니 버킷백', title: '마르지엘라 5AC 미니백 데일리 후기', text: '디자인 미니멀한데 고급져보여ㅜㅜ 수납력도 좋고 가벼워서 매일 들고다님!! 어디에 매치해도 다 잘어울려 ㅎㅎ 인생가방 찾음 색깔별로 다 사고싶다💼', images: [], createdAt: Date.now() - 1000 * 60 * 60 * 130, likes: 378, comments: 28, tags: ['가방', '미니백', '데일리백'], category: 'fashion', rating: 4.6 },
  { _id: 'r019', author: { username: '소연' }, brand: '자라', product: '오버사이즈 더블 브레스티드 코트', title: '자라 오버사이즈 코트 가성비 후기', text: '이 가격에 이 퀄리티 실화냐고ㅜㅜ 따뜻하고 핏도 예쁘고 색상도 고급스러워!! 겨울 아우터 고민이면 이거 무조건 사세요 후회안함 보장함!!🧥❄️', images: [], createdAt: Date.now() - 1000 * 60 * 60 * 170, likes: 445, comments: 38, tags: ['코트', '겨울패션', '아우터'], category: 'fashion', rating: 4.9 },

  // 라이프스타일
  { _id: 'r020', author: { username: '채연' }, brand: '딥티크', product: '베이즈 리드 디퓨저', title: '딥티크 베이즈 디퓨저 호텔향 후기', text: '방에 놔두니까 집 전체가 호텔같은 향이야ㅜㅜ 은은하게 퍼져서 부담없고 지속력도 좋아!! 친구들 올때마다 어디꺼냐고 물어봄ㅋㅋ 집꾸미기 시작하면 이거부터 사세요🏠✨', images: [], createdAt: Date.now() - 1000 * 60 * 60 * 45, likes: 312, comments: 25, tags: ['디퓨저', '홈프래그런스', '인테리어'], category: 'lifestyle', rating: 4.7 },
  { _id: 'r021', author: { username: '유진' }, brand: '양키캔들', product: '라벤더 바닐라 미디엄 자', title: '양키캔들 라벤더바닐라 힐링 후기', text: '불 켜놓으면 방 분위기가 달라져ㅜㅜ 향도 좋고 연소시간도 길어서 가성비 좋음!! 자기전에 켜놓고 힐링하는중 ㅎㅎ 스트레스 받을때 이거 켜면 마음이 편해져🕯️💕', images: [], createdAt: Date.now() - 1000 * 60 * 60 * 100, likes: 267, comments: 19, tags: ['캔들', '힐링', '홈카페'], category: 'lifestyle', rating: 4.6 },
  { _id: 'r022', author: { username: '수연' }, brand: '스탠리', product: '퀜처 H2.0 텀블러 40oz', title: '스탠리 퀜처 텀블러 보온력 후기', text: '휴대하기 좋고 보온력도 좋아ㅜㅜ 디자인이 심플해서 어디다 들고다녀도 예뻐!! 음료 오래 따뜻하게 유지돼서 카페가기 줄었음ㅋㅋ 환경도 지키고 돈도 아끼고 일석이조☕', images: [], createdAt: Date.now() - 1000 * 60 * 60 * 140, likes: 198, comments: 14, tags: ['텀블러', '에코', '데일리템'], category: 'lifestyle', rating: 4.4 },
  { _id: 'r023', author: { username: '세정' }, brand: '모멘트플래너', product: '2024 위클리 다이어리', title: '모멘트플래너 위클리 다이어리 활용 후기', text: '일정관리가 너무 쉬워졌어ㅜㅜ 디자인도 예쁘고 칸이 넉넉해서 다 적을수있음!! 새해 다이어리로 딱이야 ㅎㅎ 계획 세우는거 좋아하는분들 이거 사세요 후회없음📔✏️', images: [], createdAt: Date.now() - 1000 * 60 * 60 * 200, likes: 234, comments: 17, tags: ['플래너', '다이어리', '문구'], category: 'lifestyle', rating: 4.5 },
];

function Feed() {
  const [reviews, setReviews] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [reviewType, setReviewType] = useState('all'); // 'all', 'photo', 'text'
  const [searchQuery, setSearchQuery] = useState(''); // 검색어
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();
  const reviewSectionRef = useRef(null);

  useEffect(() => {
    // 화장품 리뷰 샘플 데이터를 우선 표시
    setReviews(sampleReviews);
    
    // API 데이터는 참고용으로만 로드 (주석 처리)
    /*
    const load = async () => {
      try {
        const res = await fetchReviews({ page: 1, limit: 20 });
        setReviews(res.data && res.data.length ? res.data : sampleReviews);
      } catch (err) {
        console.warn('fetch reviews failed, loading sample data', err);
        setReviews(sampleReviews);
      }
    };
    load();
    */
  }, []);

  return (
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
              <button style={{ 
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
              <button style={{ 
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
              <img src="/images/립리뷰.jpg" alt="Featured" style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#fff5f7', transition: 'transform 0.5s ease' }} 
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{ position: 'absolute', bottom: 20, left: 20, background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '10px 20px', borderRadius: 14, fontSize: 15, backdropFilter: 'blur(10px)', fontWeight: 600 }}>
                💄 인기 립 리뷰
              </div>
            </Link>
            {/* 서브 이미지들 */}
            <Link to="/review/hero002" style={{ height: 150, overflow: 'hidden', position: 'relative', borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', display: 'block', textDecoration: 'none' }}>
              <img src="/images/피부광채.jpg" alt="Skin" style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#fff5f7', transition: 'transform 0.3s ease' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(255,255,255,0.95)', padding: '8px 14px', borderRadius: 12, fontSize: 13, fontWeight: 700 }}>✨ 피부 광채</div>
            </Link>
            <Link to="/review/hero003" style={{ height: 150, overflow: 'hidden', position: 'relative', borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', display: 'block', textDecoration: 'none' }}>
              <img src="/images/진정케어.jpg" alt="Mask" style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#fff5f7', transition: 'transform 0.3s ease' }}
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
              src="/images/장원영.jpg" 
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
              src="/images/카리나.png" 
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
              <ReviewCard key={r._id} id={r._id} username={r.author?.username || '익명'} brand={r.brand} product={r.product} title={r.title} text={r.text} images={r.images} createdAt={r.createdAt} likes={r.likes} comments={r.comments} tags={r.tags} rating={r.rating} />
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
