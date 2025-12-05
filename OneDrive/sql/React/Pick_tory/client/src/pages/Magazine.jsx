import React, { useEffect, useState } from 'react';
import { fetchReviews } from '../api/reviewApi';
import axios from '../api/axiosConfig';

function Magazine() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const reviewsRes = await fetchReviews({ page: 1, limit: 8 });
        const texts = reviewsRes.data.map(r => r.text);
        const resp = await axios.post('/ai/summarize', { texts });
        setSummary(resp.data.summary);
      } catch (err) {
        console.error('magazine load failed', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div 
      style={{ 
        padding: 20, 
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #fff 0%, #fff5f7 50%, #faf5ff 100%)'
      }}
    >
      <h1>📰 AI 리뷰 매거진</h1>
      <p style={{ color: '#666' }}>AI가 여러 리뷰를 뽑아 트렌드와 핵심을 정리해드립니다.</p>

      {loading && <p>요약 생성 중...</p>}

      {summary && (
        <div style={{ marginTop: 16, padding: 16, background: '#fff', borderRadius: 8, boxShadow: '0 8px 20px rgba(0,0,0,0.04)' }}>
          <div dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br/>') }} />
        </div>
      )}
    </div>
  );
}

export default Magazine;
