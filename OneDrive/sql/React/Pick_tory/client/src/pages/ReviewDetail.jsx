import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchReview } from '../api/reviewApi';
import sampleReviews from '../data/sampleReviews';

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
