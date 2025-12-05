import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchReview } from '../api/reviewApi';

// 샘플 리뷰 데이터 (Feed.jsx와 동일)
const sampleReviews = [
  // Hero 배너 주목 리뷰 3개
  { _id: 'hero001', author: { username: '채희' }, brand: '롬앤', product: '쥬시 래스팅 틴트', title: '인기 립 리뷰 - 롬앤 틴트 발색 대박', text: '립덕후들 이거 보세요!!! 롬앤 쥬시래스팅 틴트 진짜 발색 미쳤어요ㅜㅜ 상큼해보이는 컬러라 데일리로 딱이고 지속력도 개좋아요!! 입술에 착 감기는 부드러운 텍스쳐가 진짜 충격적으로 좋아요 💋 안사면 손해임 꼭 사세요!!', images: ['/images/립리뷰.jpg'], createdAt: Date.now() - 1000 * 60 * 60 * 12, likes: 723, comments: 58, tags: ['립틴트', '롬앤', '인기립'], rating: 4.9 },
  { _id: 'hero002', author: { username: '정은' }, brand: '아르마니', product: '마이 웨이 스킨업 에센스', title: '피부 광채 - 아르마니 에센스 사용 후기', text: '아르마니 마이웨이 에센스 진짜 대박입니다!!! 피부가 마치 광채가 나는 것 같은 효과가 있어요✨ 세안 후에 먼저 바르면 피부결이 정돈되면서 아침에 기분좋은 광채피부 완성돼요!! 건성피부분들 필수템이에요 💖', images: ['/images/피부광채.jpg'], createdAt: Date.now() - 1000 * 60 * 60 * 18, likes: 567, comments: 43, tags: ['에센스', '광채피부', '아르마니'], rating: 4.8 },
  { _id: 'hero003', author: { username: '수정' }, brand: '아누아', product: '어성초 진정 토너', title: '진정 케어 - 아누아 어성초 토너 추천', text: '민감피부인 제가 진짜 강추하는 토너!! 아누아 어성초 토너 쓰고 피부 트러블이 진짜 줄었어요🌿 진정효과 오지고 발갈때도 피부가 편해지는 느낌!! 매운 정구리라서 부담없이 쓸 수 있고 피부가 예민할때 사용하면 찍이에요 💚', images: ['/images/진정케어.jpg'], createdAt: Date.now() - 1000 * 60 * 60 * 24, likes: 489, comments: 37, tags: ['진정토너', '어성초', '민감피부'], rating: 4.7 },
  {
    _id: 'r001', author: { username: '수아' }, title: '피부가 환해지는 비타민C 세럼', text: '싸걀!!!! 2주 썼는데 피부톤 ㅈㄴㅈㄴ 밝아졌어ㅜㅜ 흡수력 미쳤고 끈적임 1도 없음 ㄹㅇ 촉촉해서 아침에 바르면 화장이 겁나 잘먹어요ㅜ 완전 인생세럼 등극이야 여러분들도 꼭 사서 써보셈!! 알러빗ㅜㅜ', images: ['/images/비타민세럼리뷰.jpg'], createdAt: Date.now() - 1000 * 60 * 60 * 24, likes: 456, comments: 38, tags: ['세럼', '미백', '비타민C'], rating: 4.8
  },
  { _id: 'r002', author: { username: '민지' }, title: '촉촉함 미친 수분크림 추천', text: '건성인 나한테 인생템 찾음 아침까지 촉촉해서 감동받앗어 ㄹㅇㅜ향도 은은하고 가성비까지 미침ㅋㅋㅋ 용량 넉넉해서 맘껏 덕지덕지 발라도 되고 진짜 이뻐용가리ㅜ 건성분들 이거 무조건 사세용!!', images: ['/images/cream.png'], createdAt: Date.now() - 1000 * 60 * 60 * 48, likes: 289, comments: 22, tags: ['수분크림', '보습', '건성피부'], rating: 4.5 },
  { _id: 'r003', author: { username: '윤서' }, title: '커버력 갑 쿠션 발견했어요', text: '얇게 발리는데 커버력 실화냐고ㅜㅜ 무너짐도 없고 자연광 아래서 ㅈㄴ 예뻐요 광채 미침ㅋㅋㅋ 여름에도 버틸듯!! 데일리 쿠션 찾는분들 이거 강추드려용 진짜 이거 없으면 어캄ㅜ', images: ['/images/파운데이션리뷰.jpg'], createdAt: Date.now() - 1000 * 60 * 60 * 72, likes: 523, comments: 45, tags: ['쿠션', '베이스', '커버력'], rating: 4.7 },
  { _id: 'r004', author: { username: '지우' }, title: '블랙헤드 싹 정리해주는 클렌징', text: '매일 쓰니까 모공이 점점 깨끗해지는게 느껴져ㅜㅜ 거품도 뽀송뽀송하고 세안 후에도 안땅겨서 너무 조아용ㅜ 모공고민 잇으면 이거 무조건 사야해!! 진짜 갓템이야 알러빗ㅜㅜ', images: ['/images/클렌징폼리뷰.jpg'], createdAt: Date.now() - 1000 * 60 * 60 * 5, likes: 367, comments: 29, tags: ['클렌징', '모공케어', '블랙헤드'], rating: 4.6 },
  { _id: 'r005', author: { username: '하은' }, title: '발색 미친 틴트 찾았다', text: '헐 색상 너무 이뻐서 뒤집어짐 발색도 미치고 지속력도 미침 ㄹㅇㅜ 입술 안건조해서 데일리로 딱이야!! 립덕후들 이거 찐이야 제발 사세요ㅜ 안사면 손해임 ㅈㄴ 이뻐용가리!!', images: ['/images/립스틱리뷰.jpg'], createdAt: Date.now() - 1000 * 60 * 60 * 120, likes: 612, comments: 51, tags: ['립스틱', '틴트', '립메이크업'], rating: 4.9 },
  { _id: 'r006', author: { username: '서연' }, title: '진정 갓팩 찾음', text: '피부 예민할때 이거 붙이면 바로 차분해져ㅜㅜ 진정효과 실화냐구ㅜ 매일 써도 가격 부담없어서 미침ㅋㅋ 민감피부분들 이거 강추드림!! 여러분들도 꼭 사서 쓰면 좋겟슨! 알러빗이야ㅜㅜ', images: ['/images/마스크팩리뷰.jpg'], createdAt: Date.now() - 1000 * 60 * 60 * 200, likes: 198, comments: 16, tags: ['마스크팩', '진정', '민감피부'], rating: 4.4 },
  // 탐색 페이지 맞춤 리뷰 데이터
  { _id: 'p001', author: { username: '수아' }, title: '건성 피부를 위한 수분 세럼 추천', text: '겨울철 필수템! 건조함 없이 하루 종일 촉촉해요. 아침 스킨케어 루틴에 필수로 넣고 있어요 ✨ 진짜 이거 안쓰면 손해임!! 건성피부분들 꼭 사세요~', images: ['/images/serum_recommend.jpg'], createdAt: Date.now() - 1000 * 60 * 60 * 24, likes: 523, comments: 42, tags: ['건성피부', '수분세럼', '겨울템'], rating: 4.9 },
  { _id: 'p002', author: { username: '민지' }, title: '20대 추천 데일리 립', text: '자연스러운 MLBB 컬러! 매일 바르고 있어요. 지속력도 좋고 촉촉함이 오래가요 💄 립덕후들 이거 찐이야 제발 사세요ㅜ', images: ['/images/lip_recommend.jpg'], createdAt: Date.now() - 1000 * 60 * 60 * 48, likes: 412, comments: 35, tags: ['립스틱', 'MLBB', '데일리립'], rating: 4.8 },
];

function ReviewDetail() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      // 먼저 샘플 리뷰에서 찾기
      const sampleReview = sampleReviews.find(r => r._id === id);
      if (sampleReview) {
        setReview(sampleReview);
        setLoading(false);
        return;
      }
      
      // 샘플에 없으면 API에서 가져오기
      try {
        const res = await fetchReview(id);
        setReview(res.data);
      } catch (err) {
        console.error('fetch review', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  if (loading) return <div style={{ padding: 20 }}>로딩중...</div>;
  if (!review) return <div style={{ padding: 20 }}>리뷰를 찾을 수 없습니다.</div>;

  return (
    <div 
      style={{ 
        padding: 20, 
        maxWidth: 900, 
        margin: '0 auto', 
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #fff 0%, #fff5f7 50%, #faf5ff 100%)',
        position: 'relative'
      }}
    >

      <h1>{review.title}</h1>
      <div style={{ color: '#666' }}>작성자: {review.author?.username || '익명'}</div>
      <div style={{ marginTop: 12, lineHeight: 1.7 }}>{review.text}</div>

      {review.images && review.images.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          {review.images.map((src, i) => (
            <img key={i} src={src} alt={`img-${i}`} style={{ width: 240, height: 240, objectFit: 'cover', borderRadius: 8 }} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewDetail;
